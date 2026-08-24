"""
Paper PDF generation service — converts paper and question data into a PDF binary
using xhtml2pdf (pisa).
"""

from __future__ import annotations

import io
import base64
import os
from typing import Any
from sqlalchemy.orm import Session
from xhtml2pdf import pisa  # type: ignore

from app.papers import repository as paper_repo
from app.questions import repository as question_repo
from app.classifications.models import Classification
from app.core.config import settings


def _sanitize(s: str) -> str:
    """Remove characters that xhtml2pdf (latin-1) cannot encode."""
    if not s:
        return ""
    return "".join(ch for ch in str(s) if ord(ch) < 256)


def _esc(val: Any) -> str:
    """HTML-escape a value safely, stripping non-latin-1 characters."""
    s = _sanitize(str(val or ""))
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def _format_marks(val: Any) -> str:
    """Format marks as (2 Marks) or (1 Mark) or (2.5 Marks)."""
    try:
        m = float(val or 1)
        m_str = str(int(m)) if m.is_integer() else f"{m:.1f}"
        unit = "Mark" if m == 1 else "Marks"
        return f"({m_str} {unit})"
    except Exception:
        return "(1 Mark)"


def _format_number(val: Any) -> str:
    """Format integer/float cleanly without trailing zeroes."""
    try:
        m = float(val or 0)
        return str(int(m)) if m.is_integer() else f"{m:.2f}"
    except Exception:
        return "0"


def _get_image_base64(image_url: str | None) -> str | None:
    """Read local uploaded question image and convert to base64 for PDF embedding."""
    if not image_url:
        return None

    filename = os.path.basename(image_url)
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        try:
            with open(file_path, "rb") as f:
                encoded = base64.b64encode(f.read()).decode("utf-8")
                ext = os.path.splitext(filename)[1].lower().replace(".", "")
                mime = (
                    f"image/{ext}"
                    if ext in ["png", "jpeg", "jpg", "gif", "webp"]
                    else "image/png"
                )
                return f"data:{mime};base64,{encoded}"
        except Exception:
            return None
    return None


PAPER_HTML_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  @page {
    size: A4 portrait;
    margin: 10mm 14mm;
    margin-bottom: 20mm;
    @frame footer {
      -pdf-frame-content: footerFrame;
      bottom: 6mm;
      left: 14mm;
      right: 14mm;
      height: 10mm;
    }
  }
  body {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 8.5pt;
    line-height: 1.25;
    color: #111111;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 4pt;
    font-size: 8.5pt;
  }
  td, th {
    padding: 3px 4px;
    vertical-align: top;
  }
  .no-border, .no-border td, .no-border th {
    border: none !important;
  }
  .header-table {
    width: 100%;
    border-bottom: 1.2pt solid #000000;
    margin-bottom: 8pt;
    padding-bottom: 4pt;
  }
  .candidate-box {
    width: 100%;
    border: 0.8pt solid #000000;
    border-collapse: collapse;
    margin-bottom: 8pt;
    font-size: 8pt;
  }
  .candidate-cell {
    border: 0.8pt solid #000000;
    padding: 5pt 8pt;
    vertical-align: middle;
  }
  .section-table {
    width: 100%;
    background-color: #f1f3f5;
    border-top: 1pt solid #000000;
    border-bottom: 1pt solid #000000;
    margin-top: 8pt;
    margin-bottom: 6pt;
  }
  .section-cell-left {
    text-align: left;
    width: 60%;
    padding: 4pt 6pt;
    vertical-align: middle;
    font-weight: bold;
    font-size: 8.5pt;
    line-height: 1.15;
  }
  .section-cell-right {
    text-align: right;
    width: 40%;
    padding: 4pt 6pt;
    vertical-align: middle;
    font-weight: bold;
    font-size: 8.5pt;
    line-height: 1.15;
  }
  .question-container {
    border-bottom: 0.5pt solid #cccccc;
    padding-bottom: 6pt;
    margin-bottom: 7pt;
  }
  .question-header {
    font-weight: bold;
    font-size: 9pt;
    margin-bottom: 3pt;
  }
  .marks-badge {
    font-size: 8.5pt;
    font-weight: bold;
    color: #111111;
  }
  .passage-box {
    background-color: #f8f9fa;
    border: 0.5pt solid #cccccc;
    padding: 4pt 6pt;
    margin: 4pt 0;
    font-size: 8pt;
    font-style: italic;
  }
  .option-table td {
    padding: 2.5px 5px;
    border: 0.4pt solid #e0e0e0;
    font-size: 8pt;
  }
  .option-correct {
    background-color: #e9ecef;
    font-weight: bold;
    border: 0.8pt solid #666666 !important;
  }
  .answer-key-box {
    margin-top: 3pt;
    padding-top: 3pt;
    border-top: 0.4pt solid #e0e0e0;
    font-size: 8pt;
    color: #111111;
  }
  .answer-line {
    border-bottom: 0.5pt dotted #888888;
    height: 14pt;
    margin-top: 2pt;
  }
</style>
</head>
<body>

<div id="footerFrame" style="font-size: 7.5pt; color: #777777; border-top: 0.5pt solid #cccccc; padding-top: 3px;">
  <table class="no-border" style="width: 100%; margin: 0;">
    <tr>
      <td style="text-align: right; width: 100%; padding: 0;">
        Page <pdf:pagenumber> of <pdf:pagecount>
      </td>
    </tr>
  </table>
</div>

<!-- Header (Single clean line for all meta details) -->
<table class="header-table no-border" style="margin-bottom: 8pt;">
  <tr>
    <td style="text-align: center; border: none; padding: 0;">
      <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; margin-bottom: 3pt;">{{PAPER_NAME}}</div>
      <div style="font-size: 7.8pt; font-weight: bold; color: #222222; text-transform: uppercase;">
        {{META_DEPT}} &bull; {{META_LEVEL}} &bull; Duration: {{META_DURATION}} &bull; Total Marks: {{META_MARKS}} Marks &bull; {{BANNER_TEXT}}
      </div>
    </td>
  </tr>
</table>

<!-- Candidate Details Box (Only for candidate question paper) -->
{{CANDIDATE_BOX_HTML}}

<!-- Sections & Questions -->
{{SECTIONS_HTML}}

<!-- End of Paper -->
<div style="text-align: center; font-size: 8pt; color: #777777; margin-top: 14pt; padding-top: 6pt; border-top: 0.5pt solid #cccccc;">
  --- End of Assessment Paper ---
</div>

</body>
</html>
"""


def _render_candidate_box() -> str:
    return """
    <table class="candidate-box">
      <tr>
        <td class="candidate-cell" style="width: 50%;"><strong>Candidate Name:</strong> ___________________________________</td>
        <td class="candidate-cell" style="width: 50%;"><strong>Roll Number / ID:</strong> _____________________________</td>
      </tr>
      <tr>
        <td class="candidate-cell" style="width: 50%;"><strong>Exam Date:</strong> ________________________________________</td>
        <td class="candidate-cell" style="width: 50%;"><strong>Invigilator Signature:</strong> ________________________</td>
      </tr>
    </table>
    """


def _render_question_options(
    options: list | dict, show_answers: bool, q_type: str, q_text: str = ""
) -> str:
    if isinstance(options, dict):
        # Lead Generation or Contact Details
        if q_type == "LEAD_GENERATION":
            comp = _esc(
                options.get("company_name") or options.get("companyName") or ""
            ) or _esc(q_text or "Target Company")
            name = (
                _esc(
                    options.get("contact_name")
                    or options.get("name")
                    or options.get("person_name")
                    or ""
                )
                if show_answers
                else "____________________"
            )
            desig = (
                _esc(options.get("designation") or options.get("title") or "")
                if show_answers
                else "____________________"
            )
            web = (
                _esc(
                    options.get("website")
                    or options.get("website_url")
                    or options.get("websiteUrl")
                    or ""
                )
                if show_answers
                else "____________________"
            )
            email = (
                _esc(
                    options.get("email")
                    or options.get("email_address")
                    or options.get("emailAddress")
                    or ""
                )
                if show_answers
                else "____________________"
            )
            return f"""
            <table style="width: 100%; border: 0.6pt solid #999; margin: 4pt 0; font-size: 7.5pt;">
              <tr style="background-color: #f1f3f5;"><td colspan="2" style="border: 0.6pt solid #999; padding: 4pt 6pt;"><strong>Target Company:</strong> {comp}</td></tr>
              <tr>
                <td style="width: 50%; border: 0.6pt solid #999; padding: 4pt 6pt;"><strong>Person Name:</strong> {name}</td>
                <td style="width: 50%; border: 0.6pt solid #999; padding: 4pt 6pt;"><strong>Designation:</strong> {desig}</td>
              </tr>
              <tr>
                <td style="width: 50%; border: 0.6pt solid #999; padding: 4pt 6pt;"><strong>Website URL:</strong> {web}</td>
                <td style="width: 50%; border: 0.6pt solid #999; padding: 4pt 6pt;"><strong>Email Address:</strong> {email}</td>
              </tr>
            </table>
            """
        elif q_type == "CONTACT_DETAILS":
            url = _esc(
                options.get("websiteUrl")
                or options.get("website_url")
                or options.get("website")
                or q_text
                or "N/A"
            )
            comp = (
                _esc(options.get("companyName") or options.get("company_name") or "")
                if show_answers
                else "_________"
            )
            phone = (
                _esc(
                    options.get("companyPhoneNumber")
                    or options.get("phone")
                    or options.get("company_phone")
                    or ""
                )
                if show_answers
                else "_________"
            )
            email = (
                _esc(options.get("generalEmail") or options.get("email") or "")
                if show_answers
                else "_________"
            )
            fb = (
                _esc(options.get("facebookPage") or options.get("facebook") or "")
                if show_answers
                else "_________"
            )
            street = (
                _esc(options.get("streetAddress") or options.get("street") or "")
                if show_answers
                else "_________"
            )
            city = _esc(options.get("city") or "") if show_answers else "_________"
            state = _esc(options.get("state") or "") if show_answers else "_________"
            zip_c = (
                _esc(options.get("zipCode") or options.get("zip") or "")
                if show_answers
                else "_________"
            )
            return f"""
            <table style="width: 100%; border: 0.6pt solid #999; margin: 4pt 0; font-size: 7.5pt;">
              <tr style="background-color: #f1f3f5;"><td colspan="4" style="border: 0.6pt solid #999; padding: 4pt 6pt;"><strong>Source URL:</strong> {url}</td></tr>
              <tr>
                <td style="border: 0.6pt solid #999; padding: 3pt 4pt;"><strong>Company:</strong> {comp}</td>
                <td style="border: 0.6pt solid #999; padding: 3pt 4pt;"><strong>Phone:</strong> {phone}</td>
                <td style="border: 0.6pt solid #999; padding: 3pt 4pt;"><strong>Email:</strong> {email}</td>
                <td style="border: 0.6pt solid #999; padding: 3pt 4pt;"><strong>Facebook:</strong> {fb}</td>
              </tr>
              <tr>
                <td style="border: 0.6pt solid #999; padding: 3pt 4pt;"><strong>Street:</strong> {street}</td>
                <td style="border: 0.6pt solid #999; padding: 3pt 4pt;"><strong>City:</strong> {city}</td>
                <td style="border: 0.6pt solid #999; padding: 3pt 4pt;"><strong>State:</strong> {state}</td>
                <td style="border: 0.6pt solid #999; padding: 3pt 4pt;"><strong>Zip:</strong> {zip_c}</td>
              </tr>
            </table>
            """
        return ""

    if not isinstance(options, list) or len(options) == 0:
        return ""

    # MCQ options table (2-column layout)
    rows_html = []
    for i in range(0, len(options), 2):
        opt1 = options[i]
        opt2 = options[i + 1] if i + 1 < len(options) else None

        label1 = _esc(opt1.get("option_label", chr(65 + i)))
        text1 = _esc(opt1.get("option_text", ""))
        is_corr1 = bool(opt1.get("is_correct", False))

        cls1 = 'class="option-correct"' if (show_answers and is_corr1) else ""
        correct_tag1 = (
            " <strong>[CORRECT]</strong>" if (show_answers and is_corr1) else ""
        )

        cell1 = f'<td style="width: 50%; padding: 3pt 6pt;" {cls1}><strong>({label1})</strong> {text1}{correct_tag1}</td>'

        if opt2:
            label2 = _esc(opt2.get("option_label", chr(65 + i + 1)))
            text2 = _esc(opt2.get("option_text", ""))
            is_corr2 = bool(opt2.get("is_correct", False))
            cls2 = 'class="option-correct"' if (show_answers and is_corr2) else ""
            correct_tag2 = (
                " <strong>[CORRECT]</strong>" if (show_answers and is_corr2) else ""
            )
            cell2 = f'<td style="width: 50%; padding: 3pt 6pt;" {cls2}><strong>({label2})</strong> {text2}{correct_tag2}</td>'
        else:
            cell2 = '<td style="width: 50%; border: none; padding: 3pt 6pt;"></td>'

        rows_html.append(f"<tr>{cell1}{cell2}</tr>")

    table_content = "\n".join(rows_html)
    return f'<table class="option-table" style="width: 100%; margin: 3pt 0;">{table_content}</table>'


def build_paper_html(
    paper_data: dict,
    ordered_subjects: list[dict],
    questions_by_subject: dict[int, list[dict]],
    subject_info_map: dict[int, dict],
    show_answers: bool = True,
) -> str:
    paper_name = _esc(paper_data.get("paper_name", "Assessment Paper"))
    banner_text = (
        "OFFICIAL ANSWER KEY &amp; EVALUATION SHEET"
        if show_answers
        else "CANDIDATE QUESTION PAPER"
    )
    candidate_box_html = "" if show_answers else _render_candidate_box()

    meta_dept = f"Dept: {_esc(paper_data.get('department_name', 'All'))}"
    meta_level = f"Level: {_esc(paper_data.get('test_level_name', 'General'))}"
    meta_duration = _esc(paper_data.get("total_time", "N/A"))
    meta_marks = _format_number(paper_data.get("total_marks") or 0)

    sections_html_parts = []
    cumulative_q_index = 0

    for s_idx, subject_config in enumerate(ordered_subjects):
        s_id = subject_config.get("subject_id")
        s_info = subject_info_map.get(s_id, {"name": f"Subject {s_id}", "code": ""})
        s_name = _esc(s_info["name"])
        s_code = f" [{_esc(s_info['code'])}]" if s_info.get("code") else ""
        s_questions = questions_by_subject.get(s_id, [])
        s_time = subject_config.get("time_minutes", 0)
        s_marks_str = _format_number(subject_config.get("total_marks") or 0)

        time_str = f"Time: {s_time} Mins | " if s_time > 0 else ""
        section_bar_html = f"""
        <table class="section-table">
          <tr>
            <td class="section-cell-left">
              SECTION {s_idx + 1}: {s_name}{s_code}
            </td>
            <td class="section-cell-right">
              {time_str}{len(s_questions)} Questions | {s_marks_str} Marks
            </td>
          </tr>
        </table>
        """

        questions_html_parts = []
        if not s_questions:
            questions_html_parts.append(
                '<div style="font-size: 8pt; font-style: italic; color: #777; padding: 4pt 0;">No questions assigned in this section.</div>'
            )
        else:
            for q in s_questions:
                cumulative_q_index += 1
                q_num = cumulative_q_index
                q_text = _esc(q.get("question_text", ""))
                marks_label = _format_marks(q.get("marks"))

                # Type code
                qt_val = q.get("question_type")
                type_code = (
                    qt_val.get("code")
                    if isinstance(qt_val, dict)
                    else str(qt_val or "")
                )

                # Passage
                passage_html = ""
                if q.get("passage"):
                    passage_html = f"""
                    <div class="passage-box">
                      <strong>Passage Context:</strong><br/>
                      {_esc(q.get("passage"))}
                    </div>
                    """

                # Image
                image_html = ""
                img_b64 = _get_image_base64(q.get("image_url"))
                if img_b64:
                    image_html = f'<div style="margin: 4pt 0;"><img src="{img_b64}" style="max-height: 120pt; max-width: 250pt;"/></div>'

                # Options / Fields
                options_data = q.get("options")
                options_html = _render_question_options(
                    options_data, show_answers, type_code, q_text
                )

                # Answer block
                answer_block_html = ""
                if show_answers:
                    ans_data = q.get("answer") or {}
                    ans_text = _esc(ans_data.get("answer_text", ""))
                    explanation = _esc(ans_data.get("explanation", ""))

                    if type_code in ["LEAD_GENERATION", "CONTACT_DETAILS"]:
                        if explanation:
                            answer_block_html = f"""
                            <div class="answer-key-box">
                              <em>Explanation: {explanation}</em>
                            </div>
                            """
                        else:
                            answer_block_html = ""
                    elif type_code in [
                        "MULTIPLE_CHOICE",
                        "IMAGE_MULTIPLE_CHOICE",
                        "PASSAGE_CONTENT",
                    ] and isinstance(options_data, list):
                        correct_opts = [
                            opt
                            for opt in options_data
                            if isinstance(opt, dict) and opt.get("is_correct")
                        ]
                        labels = ", ".join(
                            [_esc(o.get("option_label", "")) for o in correct_opts]
                        )
                        texts = "; ".join(
                            [
                                _esc(o.get("option_text", ""))
                                for o in correct_opts
                                if o.get("option_text")
                            ]
                        )
                        ans_detail = f"Option {labels}" + (
                            f" ({texts})" if texts else ""
                        )
                        expl_html = (
                            f"<br/><em>Explanation: {explanation}</em>"
                            if explanation
                            else ""
                        )
                        answer_block_html = f"""
                        <div class="answer-key-box">
                          <strong>Correct Answer:</strong> {ans_detail}{expl_html}
                        </div>
                        """
                    else:
                        ans_detail = ans_text or "Refer to model answer"
                        expl_html = (
                            f"<br/><em>Explanation: {explanation}</em>"
                            if explanation
                            else ""
                        )
                        answer_block_html = f"""
                        <div class="answer-key-box">
                          <strong>Correct Answer:</strong> {ans_detail}{expl_html}
                        </div>
                        """
                else:
                    if type_code in ["SUBJECTIVE", "IMAGE_SUBJECTIVE"]:
                        answer_block_html = """
                        <div style="margin-top: 4pt;">
                          <div style="font-size: 8.5pt; font-weight: bold; margin-bottom: 2pt;">Answer:</div>
                          <div class="answer-line"></div>
                          <div class="answer-line"></div>
                          <div class="answer-line"></div>
                        </div>
                        """
                    elif type_code in [
                        "MULTIPLE_CHOICE",
                        "IMAGE_MULTIPLE_CHOICE",
                        "PASSAGE_CONTENT",
                    ]:
                        answer_block_html = """
                        <div style="margin-top: 4pt; font-size: 8.5pt; font-weight: bold;">
                          Answer: ______________________________
                        </div>
                        """

                q_block = f"""
                <div class="question-container">
                  <table class="no-border" style="width: 100%; margin-bottom: 2pt;">
                    <tr>
                      <td style="text-align: left; width: 85%; padding: 0;">
                        <span class="question-header">Q{q_num}. {q_text}</span>
                      </td>
                      <td style="text-align: right; width: 15%; padding: 0;">
                        <span class="marks-badge">{marks_label}</span>
                      </td>
                    </tr>
                  </table>
                  {passage_html}
                  {image_html}
                  {options_html}
                  {answer_block_html}
                </div>
                """
                questions_html_parts.append(q_block)

        section_content = f"{section_bar_html}\n" + "\n".join(questions_html_parts)
        sections_html_parts.append(section_content)

    sections_html = "\n".join(sections_html_parts)

    replacements = {
        "{{PAPER_NAME}}": paper_name,
        "{{BANNER_TEXT}}": banner_text,
        "{{META_DEPT}}": meta_dept,
        "{{META_LEVEL}}": meta_level,
        "{{META_DURATION}}": meta_duration,
        "{{META_MARKS}}": meta_marks,
        "{{CANDIDATE_BOX_HTML}}": candidate_box_html,
        "{{SECTIONS_HTML}}": sections_html,
    }

    html = PAPER_HTML_TEMPLATE
    for key, val in replacements.items():
        html = html.replace(key, val)
    return html


def generate_paper_pdf_file(
    db: Session,
    paper_id: int,
    show_answers: bool = True,
) -> tuple[bytes, str]:
    """Generate paper PDF binary and formatted download filename."""
    db_paper = paper_repo.get_paper(db, paper_id=paper_id)
    if not db_paper:
        raise ValueError(f"Paper with ID {paper_id} not found")

    paper_dict = {
        "id": db_paper.id,
        "paper_name": db_paper.paper_name,
        "department_name": getattr(db_paper, "department_name", None),
        "test_level_name": getattr(db_paper, "test_level_name", None),
        "total_time": db_paper.total_time,
        "total_marks": db_paper.total_marks,
        "subject_ids_data": db_paper.subject_ids_data or [],
        "question_id": db_paper.question_id or [],
    }

    # Fetch active subjects
    subjects = (
        db.query(Classification)
        .filter(
            Classification.type == "subject",
            Classification.is_active == True,
        )
        .all()
    )
    subject_info_map = {s.id: {"name": s.name, "code": s.code} for s in subjects}

    # Filter and sort subjects
    configured_subjects = [
        s
        for s in paper_dict["subject_ids_data"]
        if s.get("subject_id") in subject_info_map
    ]
    ordered_subjects = sorted(configured_subjects, key=lambda x: x.get("order", 0))

    # Fetch questions
    assigned_q_ids = paper_dict["question_id"]
    if isinstance(assigned_q_ids, list) and len(assigned_q_ids) > 0:
        raw_questions = question_repo.get_questions_by_ids(assigned_q_ids)
    else:
        raw_questions = []

    # Group questions by subject
    questions_by_subject: dict[int, list[dict]] = {}
    for q in raw_questions:
        s_obj = q.get("subject")
        s_id = s_obj.get("id") if isinstance(s_obj, dict) else None
        if s_id:
            if s_id not in questions_by_subject:
                questions_by_subject[s_id] = []
            questions_by_subject[s_id].append(q)

    # Build HTML
    html_content = build_paper_html(
        paper_data=paper_dict,
        ordered_subjects=ordered_subjects,
        questions_by_subject=questions_by_subject,
        subject_info_map=subject_info_map,
        show_answers=show_answers,
    )

    # Convert to PDF
    safe_html = _sanitize(html_content)
    buffer = io.BytesIO()
    result = pisa.CreatePDF(safe_html, dest=buffer)
    if result.err:
        raise RuntimeError(f"xhtml2pdf error: {result.err}")

    pdf_bytes = buffer.getvalue()

    # Filename
    safe_name = "".join(
        c if c.isalnum() or c in ("-", "_") else "_" for c in paper_dict["paper_name"]
    )
    tag = "With_Answers" if show_answers else "Question_Paper"
    filename = f"{safe_name}_{tag}.pdf"

    return pdf_bytes, filename
