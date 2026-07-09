"""
PDF generation service — converts report data dict into a PDF binary
using xhtml2pdf (pisa). Uses only basic inline CSS (no Flexbox/Grid)
so xhtml2pdf renders it cleanly.
"""

from __future__ import annotations

import io
import base64
import os
from typing import Any
from app.reports.html_template import REPORT_HTML_TEMPLATE


def _esc(val: Any) -> str:
    """HTML-escape a value safely."""
    s = str(val or "")
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def _edu_rows_html(rows: list[dict]) -> str:
    if rows:
        return "".join(
            f"""<tr>
              <td style="width: 13%;">{_esc(r.get("education", ""))}</td>
              <td style="width: 15%;">{_esc(r.get("details", ""))}</td>
              <td style="width: 18%;">{_esc(r.get("school", ""))}</td>
              <td style="width: 15%; text-align: center;">{_esc(r.get("board", ""))}</td>
              <td style="width: 10%; text-align: center;">{_esc(r.get("medium", ""))}</td>
              <td style="width: 15%; text-align: center;">{_esc(str(r.get("year", "")).replace(" ", "").replace("-", " - "))}</td>
              <td style="width: 8%; text-align: center;">{_esc(r.get("division", ""))}</td>
              <td style="width: 6%; text-align: center;">{_esc(r.get("percentage", ""))}</td>
            </tr>"""
            for r in rows
        )
    return """
      <tr><td style="font-weight:bold; width: 13%;">10th Std</td><td style="width: 15%;"></td><td style="width: 18%;"></td><td style="width: 15%; text-align: center;"></td><td style="width: 10%; text-align: center;"></td><td style="width: 15%; text-align: center;"></td><td style="width: 8%; text-align: center;"></td><td style="width: 6%; text-align: center;"></td></tr>
      <tr><td style="font-weight:bold; width: 13%;">12th Std</td><td style="width: 15%;"></td><td style="width: 18%;"></td><td style="width: 15%; text-align: center;"></td><td style="width: 10%; text-align: center;"></td><td style="width: 15%; text-align: center;"></td><td style="width: 8%; text-align: center;"></td><td style="width: 6%; text-align: center;"></td></tr>
      <tr><td style="font-weight:bold; width: 13%;">Graduation</td><td style="width: 15%;"></td><td style="width: 18%;"></td><td style="width: 15%; text-align: center;"></td><td style="width: 10%; text-align: center;"></td><td style="width: 15%; text-align: center;"></td><td style="width: 8%; text-align: center;"></td><td style="width: 6%; text-align: center;"></td></tr>
    """


def _family_rows_html(rows: list[dict]) -> str:
    if rows:
        return "".join(
            f"""<tr>
              <td style="font-weight:bold; width: 20%;">{_esc(r.get("relation", ""))}</td>
              <td style="width: 35%;">{_esc(r.get("name", ""))}</td>
              <td style="width: 30%;">{_esc(r.get("occupation", ""))}</td>
              <td style="width: 15%;">{_esc(r.get("dependent", ""))}</td>
            </tr>"""
            for r in rows
        )
    return """
      <tr><td style="font-weight:bold; width: 20%;">Father</td><td style="width: 35%;"></td><td style="width: 30%;"></td><td style="width: 15%;"></td></tr>
      <tr><td style="font-weight:bold; width: 20%;">Mother</td><td style="width: 35%;"></td><td style="width: 30%;"></td><td style="width: 15%;"></td></tr>
      <tr><td style="font-weight:bold; width: 20%;">Sister</td><td style="width: 35%;"></td><td style="width: 30%;"></td><td style="width: 15%;"></td></tr>
      <tr><td style="font-weight:bold; width: 20%;">Brother</td><td style="width: 35%;"></td><td style="width: 30%;"></td><td style="width: 15%;"></td></tr>
    """


def _work_rows_html(rows: list[dict]) -> str:
    if rows:
        return "".join(
            f"""<tr>
              <td style="width: 25%;">{_esc(r.get("company", ""))}</td>
              <td style="width: 20%;">{_esc(r.get("designation", ""))}</td>
              <td style="width: 15%;">{_esc(r.get("joinDate", ""))}</td>
              <td style="width: 15%;">{_esc(r.get("leaveDate", ""))}</td>
              <td style="width: 15%;">{_esc(r.get("reason", ""))}</td>
              <td style="width: 10%;">{_esc(r.get("salary", ""))}</td>
            </tr>"""
            for r in rows
        )
    return """<tr>
      <td style="width: 25%;">&nbsp;</td><td style="width: 20%;"></td><td style="width: 15%;"></td><td style="width: 15%;"></td><td style="width: 15%;"></td><td style="width: 10%;"></td>
    </tr>"""


def _combined_col_rows_html(left: list[dict], right: list[dict]) -> str:
    max_len = max(len(left), len(right))
    rows_html = ""
    for i in range(max_len):
        left_val = left[i] if i < len(left) else {"name": "", "value": ""}
        right_val = right[i] if i < len(right) else {"name": "", "value": ""}
        rows_html += f"""<tr>
          <td style="font-weight:bold; width:30%;">{_esc(left_val["name"])}</td>
          <td style="width:20%;">{_esc(left_val["value"])}</td>
          <td style="font-weight:bold; width:35%;">{_esc(right_val["name"])}</td>
          <td style="width:15%;">{_esc(right_val["value"])}</td>
        </tr>"""
    return rows_html


def _evaluation_rows_html(eval_data: dict) -> str:
    metrics = [
        "Communication",
        "Domain Knowledge",
        "Critical Thinking",
        "Professionalism",
        "Cultural Fit",
        "Learning Ability",
    ]
    left = metrics[:3]
    right = metrics[3:]

    rows_html = ""
    for l_met, r_met in zip(left, right):
        l_val = eval_data.get(l_met, "")
        r_val = eval_data.get(r_met, "")
        rows_html += f"""<tr>
          <td style="font-weight:bold; width:30%;">{_esc(l_met)}</td>
          <td style="width:20%;">{_esc(l_val)}</td>
          <td style="font-weight:bold; width:35%;">{_esc(r_met)}</td>
          <td style="width:15%;">{_esc(r_val)}</td>
        </tr>"""
    return rows_html


# Cache the logo base64 string at module load time to avoid disk I/O on every PDF generation
LOGO_BASE64 = ""
try:
    _current_dir = os.path.dirname(os.path.abspath(__file__))
    _logo_path = os.path.join(_current_dir, "arcgate-orange.png")
    if os.path.exists(_logo_path):
        with open(_logo_path, "rb") as _f:
            _encoded_str = base64.b64encode(_f.read()).decode("utf-8")
            LOGO_BASE64 = f"data:image/png;base64,{_encoded_str}"
except Exception:
    pass


def build_report_html(data: dict) -> str:
    """Format and interpolate the report HTML template with candidate data."""
    logo_html = ""
    if LOGO_BASE64:
        logo_html = f'<img src="{LOGO_BASE64}" style="height: 21px; width: auto; margin-bottom: 0.5px;" />'
    else:
        logo_html = '<span style="font-size:10pt; font-weight:900; letter-spacing:1px;">ARCGATE</span>'

    first_eval = data.get("first_evaluation") or {}

    replacements = {
        "{{USERNAME}}": _esc(data.get("username", "")),
        "{{MOBILE}}": _esc(data.get("mobile", "")),
        "{{EMAIL}}": _esc(data.get("email", "")),
        "{{GENDER}}": _esc(data.get("gender")) or "____",
        "{{DOB}}": _esc(data.get("dob")) or "____",
        "{{ADDRESS}}": _esc(data.get("address")) or "__________________________",
        "{{ARCGATE}}": _esc(data.get("arcgate")) or "No",
        "{{HOW_DID_YOU_HEAR}}": _esc(data.get("how_did_you_hear", "")),
        "{{COMMITMENT}}": _esc(data.get("commitment")) or "Yes",
        "{{SHIFT_TIME}}": _esc(data.get("shift_time")) or "Day",
        "{{JOINING}}": _esc(data.get("joining")) or "________________",
        "{{SALARY}}": _esc(data.get("salary")) or "________________",
        "{{DEPOSIT}}": _esc(data.get("deposit")) or "Yes",
        "{{EDU_ROWS}}": _edu_rows_html(data.get("education_rows", [])),
        "{{FAM_ROWS}}": _family_rows_html(data.get("family_rows", [])),
        "{{WORK_ROWS}}": _work_rows_html(data.get("work_exp_rows", [])),
        "{{COL_ROWS}}": _combined_col_rows_html(
            data.get("left_col", []), data.get("right_col", [])
        ),
        "{{LEAD_NAME}}": _esc(first_eval.get("lead_name", "")),
        "{{CREATED_AT}}": _esc(first_eval.get("created_at", "")),
        "{{EVAL_METRICS_ROWS}}": _evaluation_rows_html(
            first_eval.get("evaluation_data") or {}
        ),
        "{{OVERALL_GRADE}}": _esc(first_eval.get("overall_grade", "")),
        "{{RESULT_NAME}}": _esc(first_eval.get("result_name", "")),
        "{{COMMENTS}}": _esc(first_eval.get("comments", "")),
        "{{LOGO_HTML}}": logo_html,
        "{{TODAY}}": _esc(data.get("today", "")),
    }

    html = REPORT_HTML_TEMPLATE
    for placeholder, val in replacements.items():
        html = html.replace(placeholder, val)
    return html


def generate_report_pdf(html: str) -> bytes:
    """Convert HTML string to PDF bytes using xhtml2pdf."""
    from xhtml2pdf import pisa  # type: ignore

    buffer = io.BytesIO()
    result = pisa.CreatePDF(html, dest=buffer)
    if result.err:
        raise RuntimeError(f"xhtml2pdf error: {result.err}")
    return buffer.getvalue()
