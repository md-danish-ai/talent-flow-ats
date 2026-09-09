import { api } from "./base";
import { ENDPOINTS } from "./endpoints";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SyncJobStatus {
  job_id: string;
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
  trigger_type: "MANUAL" | "CRON";
  total_records: number;
  completed_records: number;
  success_count: number;
  failed_count: number;
  progress_pct: number;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────────────────────────────────────

/** Start a batch sync for selected user IDs. Returns job_id immediately. */
export async function startBatchSync(
  userIds: number[],
): Promise<{ job_id: string; total_records: number; status: string }> {
  return api.post<{ job_id: string; total_records: number; status: string }>(
    ENDPOINTS.SYNC.START_BATCH,
    { user_ids: userIds },
    { silentSuccess: true },
  );
}

/** Start sync for all unsynced (is_synced=false) candidates. */
export async function startAllPendingSync(): Promise<{
  job_id: string;
  total_records: number;
  status: string;
}> {
  return api.post<{ job_id: string; total_records: number; status: string }>(
    ENDPOINTS.SYNC.START_ALL_PENDING,
    undefined,
    { silentSuccess: true },
  );
}

/** Poll this to get real-time progress of a running job. */
export async function getSyncJobStatus(
  jobId: string,
): Promise<SyncJobStatus | null> {
  return api
    .get<SyncJobStatus>(ENDPOINTS.SYNC.JOB_STATUS(jobId), { silentError: true })
    .catch(() => null);
}

/** Check on page load if any sync job is already in progress (page-refresh immunity). */
export async function getActiveSyncJob(): Promise<SyncJobStatus | null> {
  return api
    .get<SyncJobStatus>(ENDPOINTS.SYNC.ACTIVE_JOB, { silentError: true })
    .catch(() => null);
}

/** Get count of candidates pending sync (for "Sync All Pending (45)" button badge). */
export async function getUnsyncedCount(): Promise<number> {
  const res = await api
    .get<{ unsynced_count: number }>(ENDPOINTS.SYNC.UNSYNCED_COUNT, {
      silentError: true,
    })
    .catch(() => null);
  return res?.unsynced_count ?? 0;
}
