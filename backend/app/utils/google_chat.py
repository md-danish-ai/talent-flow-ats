import os
import logging
from datetime import datetime, timezone, timedelta
from dotenv import dotenv_values
import requests
from app.core.config import settings

logger = logging.getLogger(__name__)


def _get_webhook_url() -> str | None:
    """
    Dynamically fetches the webhook URL from disk (.env) on runtime.
    This allows updating the URL in .env without needing a Docker restart.
    """
    possible_paths = [
        "/backend/.env",
        os.path.join(settings.BASE_DIR, ".env"),
        os.path.join(os.path.dirname(settings.BASE_DIR), ".env"),
        ".env",
    ]
    for path in possible_paths:
        if os.path.exists(path):
            try:
                env_dict = dotenv_values(path)
                val = env_dict.get("GOOGLE_CHAT_WEBHOOK_URL")
                if val and val.strip():
                    return val.strip()
            except Exception:
                pass

    # Fallback to in-memory environment variable
    val = os.getenv("GOOGLE_CHAT_WEBHOOK_URL") or settings.GOOGLE_CHAT_WEBHOOK_URL
    if val and val.strip():
        return val.strip()
    return None


def send_evaluation_to_google_chat(
    candidate_name: str,
    candidate_mobile: str | None = None,
    candidate_email: str | None = None,
    department_name: str | None = None,
    lead_name: str | None = None,
    overall_grade: str | None = None,
    final_result_name: str | None = None,
    evaluation_data: dict | None = None,
    comments: str | None = None,
) -> bool:
    """
    Sends an automated notification to Google Chat via incoming webhook
    when a Project Lead submits an interview evaluation.

    Fail-safe:
    - If GOOGLE_CHAT_WEBHOOK_URL is not configured, it returns False silently.
    - All network/payload errors are caught and logged without raising exceptions.
    """
    webhook_url = _get_webhook_url()
    if not webhook_url or not webhook_url.strip():
        logger.debug("Google Chat Webhook URL not configured. Skipping notification.")
        return False

    try:
        ist_tz = timezone(timedelta(hours=5, minutes=30))
        now_ist = datetime.now(ist_tz).strftime("%d-%b-%Y %I:%M %p IST")

        dept_str = f" ({department_name})" if department_name else ""
        candidate_line = f"*Candidate:* {candidate_name}{dept_str}"

        # Contact line
        contact_parts = []
        if candidate_mobile:
            contact_parts.append(candidate_mobile)
        if candidate_email:
            contact_parts.append(candidate_email)
        contact_str = "  |  ".join(contact_parts) if contact_parts else "N/A"

        lead_display = lead_name or "Project Lead"
        grade_display = overall_grade or "N/A"
        result_display = final_result_name or "N/A"
        comments_display = comments.strip() if comments else "N/A"

        # Evaluation metrics in exact 2-column format from form
        eval_data = evaluation_data or {}
        comm = eval_data.get("Communication", "N/A")
        domain = eval_data.get("Domain Knowledge", "N/A")
        crit = eval_data.get("Critical Thinking", "N/A")
        prof = eval_data.get("Professionalism", "N/A")
        cult = eval_data.get("Cultural Fit", "N/A")
        learn = eval_data.get("Learning Ability", "N/A")

        # Construct Plain Text Google Chat Message
        message_text = (
            "*F2F Interview Evaluation Submitted*\n\n"
            f"{candidate_line}\n"
            f"*Mobile:* {contact_str}\n"
            f"*Evaluated By:* {lead_display}\n\n"
            f"*Communication:* {comm}  |  *Domain Knowledge:* {domain}\n"
            f"*Critical Thinking:* {crit}  |  *Professionalism:* {prof}\n"
            f"*Cultural Fit:* {cult}  |  *Learning Ability:* {learn}\n\n"
            f"*Overall Grade:* {grade_display}\n"
            f"*Final Result:* {result_display}\n\n"
            f'*Comments & Feedback:* "{comments_display}"\n'
            f"_{now_ist}_"
        )

        payload = {"text": message_text}

        # Send with timeout to avoid blocking
        response = requests.post(webhook_url, json=payload, timeout=5)
        if response.status_code >= 400:
            logger.warning(
                f"Google Chat webhook returned status {response.status_code}: {response.text}"
            )
            return False

        logger.info(
            f"Google Chat evaluation notification sent successfully for {candidate_name}"
        )
        return True

    except requests.exceptions.RequestException as req_err:
        logger.warning(f"Failed to send Google Chat notification (network): {req_err}")
        return False
    except Exception as e:
        logger.warning(
            f"Unexpected error sending Google Chat notification: {e}", exc_info=True
        )
        return False
