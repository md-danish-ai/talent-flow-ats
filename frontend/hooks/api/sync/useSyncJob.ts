"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  getSyncJobStatus,
  getActiveSyncJob,
  SyncJobStatus,
} from "@lib/api/sync";

const POLL_INTERVAL_MS = 2000; // Poll every 2 seconds
const LOCAL_STORAGE_KEY = "active_sync_job_id";

/**
 * useSyncJob — custom hook for real-time sync job progress tracking.
 *
 * Features:
 * - Polls backend every 2s for job progress while status is IN_PROGRESS.
 * - Persists active job_id to localStorage so page refresh resumes the modal.
 * - On mount, checks backend for any already-running job (page-refresh immunity).
 * - Stops polling automatically when job reaches COMPLETED or FAILED.
 */
export function useSyncJob() {
  const [jobStatus, setJobStatus] = useState<SyncJobStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Start polling for a given job_id ──────────────────────────────────────

  const startPolling = useCallback((jobId: string) => {
    // Save to localStorage for page-refresh immunity
    localStorage.setItem(LOCAL_STORAGE_KEY, jobId);
    setIsPolling(true);

    // Clear any existing interval
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      const status = await getSyncJobStatus(jobId);
      if (!status) return;

      setJobStatus(status);

      // Stop polling when job is done
      if (status.status === "COMPLETED" || status.status === "FAILED") {
        clearInterval(pollRef.current!);
        setIsPolling(false);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }, POLL_INTERVAL_MS);
  }, []);

  // ── Stop polling manually (e.g. user closes modal) ───────────────────────

  const stopPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    setIsPolling(false);
  }, []);

  // ── Reset job state (clear modal) ─────────────────────────────────────────

  const clearJob = useCallback(() => {
    stopPolling();
    setJobStatus(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, [stopPolling]);

  // ── Trigger a new sync job ─────────────────────────────────────────────────

  const beginSync = useCallback(
    (jobId: string, total: number) => {
      // Optimistically set initial state before first poll
      setJobStatus({
        job_id: jobId,
        status: "IN_PROGRESS",
        trigger_type: "MANUAL",
        total_records: total,
        completed_records: 0,
        success_count: 0,
        failed_count: 0,
        progress_pct: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      startPolling(jobId);
    },
    [startPolling],
  );

  // ── On mount: check localStorage + backend for active job ─────────────────

  useEffect(() => {
    const storedJobId = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedJobId) {
      // Also check backend in case another tab/session started it
      getActiveSyncJob().then((activeJob) => {
        if (activeJob) {
          setJobStatus(activeJob);
          if (activeJob.status === "IN_PROGRESS") {
            startPolling(activeJob.job_id);
          }
        }
      });
      return;
    }

    // Resume polling for stored job
    getSyncJobStatus(storedJobId).then((status) => {
      if (!status) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return;
      }
      setJobStatus(status);
      if (status.status === "IN_PROGRESS") {
        startPolling(storedJobId);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    });

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    jobStatus,
    isPolling,
    beginSync,
    clearJob,
    stopPolling,
  };
}
