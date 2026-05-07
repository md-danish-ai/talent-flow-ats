"""
PDF generation service — converts report data dict into a PDF binary
using xhtml2pdf (pisa). Uses only basic inline CSS (no Flexbox/Grid)
so xhtml2pdf renders it cleanly.
"""

from __future__ import annotations

import io
from typing import Any


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
              <td style="width: 15%;">{_esc(r.get("education", ""))}</td>
              <td style="width: 15%;">{_esc(r.get("details", ""))}</td>
              <td style="width: 20%;">{_esc(r.get("school", ""))}</td>
              <td style="width: 20%;">{_esc(r.get("board", ""))}</td>
              <td style="width: 10%;">{_esc(r.get("medium", ""))}</td>
              <td style="width: 8%;">{_esc(r.get("year", ""))}</td>
              <td style="width: 7%;">{_esc(r.get("division", ""))}</td>
              <td style="width: 5%;">{_esc(r.get("percentage", ""))}</td>
            </tr>"""
            for r in rows
        )
    return """
      <tr><td style="font-weight:bold; width: 15%;">10th Std</td><td style="width: 15%;"></td><td style="width: 20%;"></td><td style="width: 20%;"></td><td style="width: 10%;"></td><td style="width: 8%;"></td><td style="width: 7%;"></td><td style="width: 5%;"></td></tr>
      <tr><td style="font-weight:bold; width: 15%;">12th Std</td><td style="width: 15%;"></td><td style="width: 20%;"></td><td style="width: 20%;"></td><td style="width: 10%;"></td><td style="width: 8%;"></td><td style="width: 7%;"></td><td style="width: 5%;"></td></tr>
      <tr><td style="font-weight:bold; width: 15%;">Graduation</td><td style="width: 15%;"></td><td style="width: 20%;"></td><td style="width: 20%;"></td><td style="width: 10%;"></td><td style="width: 8%;"></td><td style="width: 7%;"></td><td style="width: 5%;"></td></tr>
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
        l = left[i] if i < len(left) else {"name": "", "value": ""}
        r = right[i] if i < len(right) else {"name": "", "value": ""}
        rows_html += f"""<tr>
          <td style="font-weight:bold; width:30%;">{_esc(l["name"])}</td>
          <td style="width:20%;">{_esc(l["value"])}</td>
          <td style="font-weight:bold; width:35%;">{_esc(r["name"])}</td>
          <td style="width:15%;">{_esc(r["value"])}</td>
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


def build_report_html(data: dict) -> str:
    edu_rows = _edu_rows_html(data.get("education_rows", []))
    fam_rows = _family_rows_html(data.get("family_rows", []))
    work_rows = _work_rows_html(data.get("work_exp_rows", []))
    col_rows = _combined_col_rows_html(
        data.get("left_col", []), data.get("right_col", [])
    )
    first_eval = data.get("first_evaluation") or {}
    eval_metrics_rows = _evaluation_rows_html(first_eval.get("evaluation_data") or {})

    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  @page {{
    size: A4 portrait;
    margin: 5mm 7mm;
  }}
  body {{
    font-family: Arial, Helvetica, sans-serif;
    font-size: 7.7pt;
    line-height: 1.11;
    color: #000;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 3.5pt;
    font-size: 7.7pt;
  }}
  td, th {{
    border: 1px solid #000;
    padding: 1.6px 2.6px;
    vertical-align: middle;
    line-height: 1.08;
  }}
  .section-title {{
    font-size: 7.8pt;
    font-weight: bold;
    margin: 4.5pt 0 1.8pt 0;
  }}
  .bold {{ font-weight: bold; }}
</style>
</head>
<body>

<!-- HEADER -->
<table style="border:none; margin-bottom:2pt; width: 100%;">
  <tr>
    <td style="border:none; font-size:12pt; font-weight:bold; width: 70%;">{_esc(data.get("username", ""))}</td>
    <td style="border:none; text-align:right; width: 30%;">
      <span style="font-size:10pt; font-weight:900; letter-spacing:1px;">ARCGATE</span><br/>
      <span style="font-size:7.5pt; font-weight:bold;">Date: {_esc(data.get("today", ""))}</span>
    </td>
  </tr>
</table>

<!-- 1. PERSONAL DETAILS -->
<p class="section-title">1. Personal Details</p>
<table style="border:none; border-collapse:collapse; margin-bottom:2pt; width: 100%;">
  <tbody>
    <tr>
      <td style="border:none; width:25%; padding:1px 0;"><span class="bold">Gender:</span> {_esc(data.get("gender")) or "____"}</td>
      <td style="border:none; width:25%; padding:1px 0;"><span class="bold">Date of Birth:</span> {_esc(data.get("dob")) or "____"}</td>
      <td style="border:none; width:25%; padding:1px 0;"><span class="bold">Mobile:</span> {_esc(data.get("mobile", ""))}</td>
      <td style="border:none; width:25%; padding:1px 0;"><span class="bold">Email:</span> {_esc(data.get("email", ""))}</td>
    </tr>
    <tr>
      <td colspan="4" style="border:none; padding:1px 0;"><span class="bold">Present Address:</span> {_esc(data.get("address")) or "__________________________"}</td>
    </tr>
    <tr>
      <td colspan="4" style="border:none; padding:1px 0;"><span class="bold">Permanent Address:</span> {_esc(data.get("address")) or "__________________________"}</td>
    </tr>
    <tr>
      <td colspan="2" style="border:none; width:50%; padding:1px 0;"><span class="bold">Have you Applied Arcgate before?:</span> No</td>
      <td colspan="2" style="border:none; width:50%; padding:1px 0;"><span class="bold">Have you Worked in Arcgate before?:</span> {_esc(data.get("arcgate")) or "No"}</td>
    </tr>
  </tbody>
</table>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 2pt;">
  <tbody>
    <tr>
      <td class="bold" style="width: 40%;">How did you hear about Arcgate?:</td>
      <td style="width: 60%;">{_esc(data.get("how_did_you_hear", ""))}</td>
    </tr>
  </tbody>
</table>

<!-- 2. EDUCATIONAL QUALIFICATION -->
<p class="section-title">2. Educational Qualification</p>
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 15%; text-align: center;">Education</th>
      <th style="width: 15%; text-align: center;">Education Details</th>
      <th style="width: 20%; text-align: center;">School/College</th>
      <th style="width: 20%; text-align: center;">Board/University</th>
      <th style="width: 10%; text-align: center;">Medium</th>
      <th style="width: 8%; text-align: center;">Passing Year</th>
      <th style="width: 7%; text-align: center;">Division</th>
      <th style="width: 5%; text-align: center;">%</th>
    </tr>
  </thead>
  <tbody>
    {edu_rows}
  </tbody>
</table>

<!-- 3. FAMILY DETAILS -->
<p class="section-title">3. Family Details</p>
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 20%; text-align:left;">Relation</th>
      <th style="width: 35%; text-align:left;">Name</th>
      <th style="width: 30%; text-align:left;">Occupation</th>
      <th style="width: 15%; text-align:left;">Dependent Y/N</th>
    </tr>
  </thead>
  <tbody>
    {fam_rows}
  </tbody>
</table>

<!-- 4. WORK EXPERIENCE -->
<p class="section-title">4. Work Experience</p>
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 25%; text-align:left;">Name of Company</th>
      <th style="width: 20%; text-align:left;">Designation</th>
      <th style="width: 15%; text-align: center;">Joining Date</th>
      <th style="width: 15%; text-align: center;">Date of Leaving</th>
      <th style="width: 15%; text-align:left;">Reason for Leaving</th>
      <th style="width: 10%; text-align: center;">Last Salary Drawn</th>
    </tr>
  </thead>
  <tbody>
    {work_rows}
  </tbody>
</table>

<!-- Q5–Q9 -->
<p style="margin:0.8pt 0;" class="bold">5. Are you willing for 1 Year Service Commitment?
  <span style="font-weight:normal;">&nbsp;{_esc(data.get("commitment")) or "Yes"}</span></p>
<p style="margin:0.8pt 0;" class="bold">6. What is your preferred shift time for work at Arcgate?
  <span style="font-weight:normal;">&nbsp;{_esc(data.get("shift_time")) or "Day"}</span></p>
<p style="margin:0.8pt 0;" class="bold">7. Joining date if selected:
  <span style="font-weight:normal;">&nbsp;{_esc(data.get("joining")) or "________________"}</span></p>
<p style="margin:0.8pt 0;" class="bold">8. Salary Expected:
  <span style="font-weight:normal;">&nbsp;{_esc(data.get("salary")) or "________________"}</span></p>
<p style="margin:0.8pt 0; margin-bottom:1.5pt;" class="bold">9. Do you agree for 1 month salary as security deposit?
  <span style="font-weight:normal;">&nbsp;{_esc(data.get("deposit")) or "Yes"}</span></p>

<!-- ROUND ONE OF SELECTION PROCESS -->
<p class="section-title">10. Round One of Selection Process</p>
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width:30%; text-align:left;">Sub Sections</th>
      <th style="width:20%; text-align:left;">Grade/Score</th>
      <th style="width:35%; text-align:left;">Sub Sections</th>
      <th style="width:15%; text-align:left;">Grade/Score</th>
    </tr>
  </thead>
  <tbody>
    {col_rows}
  </tbody>
</table>

<!-- 11. ROUND TWO / INTERVIEW EVALUATION -->
<p class="section-title">11. Round Two of Selection Process (Interview Evaluation)</p>
<table style="border:none; border-collapse:collapse; margin-bottom:2pt; width: 100%;">
  <tbody>
    <tr>
      <td style="border:none; width:50%; padding:1px 0;"><span class="bold">Project Lead / Evaluator:</span> {_esc(first_eval.get("lead_name", ""))}</td>
      <td style="border:none; width:50%; padding:1px 0;"><span class="bold">Evaluation Date:</span> {_esc(first_eval.get("created_at", ""))}</td>
    </tr>
  </tbody>
</table>

<table style="width: 100%; margin-top: 2pt;">
  <thead>
    <tr>
      <th style="width:30%; text-align:left;">Metric Name</th>
      <th style="width:20%; text-align:left;">Rating</th>
      <th style="width:35%; text-align:left;">Metric Name</th>
      <th style="width:15%; text-align:left;">Rating</th>
    </tr>
  </thead>
  <tbody>
    {eval_metrics_rows}
  </tbody>
</table>

<table style="width: 100%; margin-top: 2pt;">
  <tbody>
    <tr>
      <td class="bold" style="width:25%">Overall Grade</td>
      <td style="width:25%; font-weight:bold;">{_esc(first_eval.get("overall_grade", ""))}</td>
      <td class="bold" style="width:25%">Final Result / Status</td>
      <td style="width:25%; font-weight:bold;">{_esc(first_eval.get("result_name", ""))}</td>
    </tr>
    <tr>
      <td class="bold" style="width:25%">Comments &amp; Feedback</td>
      <td colspan="3" style="width:75%;">{_esc(first_eval.get("comments", ""))}</td>
    </tr>
  </tbody>
</table>

<!-- RESULT OF ROUND ONE -->
<p class="section-title">12. Result of Round One Selection Process of Interview</p>
<table style="width: 100%;">
  <tbody>
    <tr>
      <td class="bold" style="width:25%">Selected</td>
      <td style="width:25%; font-weight:bold;"></td>
      <td class="bold" style="width:25%">Selection Status</td>
      <td style="width:25%; font-weight:bold;"></td>
    </tr>
    <tr>
      <td class="bold" style="width:25%">Joining Date</td>
      <td style="width:25%; font-weight:bold;"></td>
      <td class="bold" style="width:25%">Project Assigned</td>
      <td style="width:25%;"></td>
    </tr>
    <tr>
      <td class="bold" style="width:25%">Salary Offered</td>
      <td style="width:25%; font-weight:bold;"></td>
      <td class="bold" style="width:25%">Candidates Signature<br/>(Agreed &amp; Accepted)</td>
      <td style="width:25%;"></td>
    </tr>
  </tbody>
</table>

</body>
</html>"""


def generate_report_pdf(html: str) -> bytes:
    """Convert HTML string to PDF bytes using xhtml2pdf."""
    from xhtml2pdf import pisa  # type: ignore

    buffer = io.BytesIO()
    result = pisa.CreatePDF(html, dest=buffer)
    if result.err:
        raise RuntimeError(f"xhtml2pdf error: {result.err}")
    return buffer.getvalue()
