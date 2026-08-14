#!/usr/bin/env python3
# ruff: noqa
"""
Generate both seed files fresh from DB.
Run: python scripts/generate_seeds_from_db.py
"""

import sys
import os
import json
import subprocess
from datetime import datetime

PSQL = "/opt/homebrew/Cellar/postgresql@15/15.18/bin/psql"
PGPASSWORD = "Pass2020NothingSpecial"
HOST = "localhost"
PORT = "9600"
DBNAME = "talent_flow_ats"
USER = "postgres"

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEEDS_DIR = os.path.join(BACKEND_DIR, "seeds")

REGULAR_SUBJECTS = {
    "APTITUDE",
    "INDUSTRY_AWARENESS",
    "ENGLISH_GRAMMAR",
    "WRITTEN",
    "COMPREHENSION",
}

# ─── helpers ──────────────────────────────────────────────────────────────────


def run_sql_json(sql):
    env = os.environ.copy()
    env["PGPASSWORD"] = PGPASSWORD
    json_sql = f"SELECT json_agg(row_to_json(t)) FROM ({sql.strip().rstrip(';')}) t;"
    result = subprocess.run(
        [
            PSQL,
            "-U",
            USER,
            "-h",
            HOST,
            "-p",
            PORT,
            "-d",
            DBNAME,
            "-t",
            "-A",
            "-c",
            json_sql,
        ],
        capture_output=True,
        text=True,
        env=env,
    )
    if result.returncode != 0:
        raise RuntimeError(f"psql error: {result.stderr}")
    raw = result.stdout.strip()
    if not raw or raw == "":
        return []
    return json.loads(raw)


def fetch_all():
    sql = """
SELECT
  q.id, q.question_type, q.subject_type, q.exam_level,
  q.question_text, q.image_url, q.passage, q.marks,
  q.options, q.is_active, q.created_by,
  qa.answer_text, qa.explanation
FROM questions q
LEFT JOIN question_answers qa ON qa.question_id = q.id
ORDER BY q.id
"""
    rows = run_sql_json(sql)
    questions = []
    for r in rows:
        questions.append(
            {
                "id": r["id"],
                "question_type": r["question_type"],
                "subject_type": r["subject_type"],
                "exam_level": r["exam_level"],
                "question_text": r["question_text"] or "",
                "image_url": r.get("image_url"),
                "passage": r.get("passage"),
                "marks": r.get("marks"),
                "options_raw": r.get("options"),  # already parsed as Python dict/list
                "is_active": r.get("is_active", True),
                "created_by": r.get("created_by"),
                "answer_text": r.get("answer_text") or "",
                "explanation": r.get("explanation") or "",
            }
        )
    return questions


def opts_dict(q):
    raw = q["options_raw"]
    if not raw:
        return {}
    if isinstance(raw, dict):
        return raw
    if isinstance(raw, str):
        try:
            return json.loads(raw)
        except Exception:
            return {}
    return {}


def esc(s):
    if not s:
        return ""
    return s.replace("\\", "\\\\").replace('"', '\\"')


# ─── seed_questions.py ────────────────────────────────────────────────────────


def generate_seed_questions(questions):
    regular = [q for q in questions if q["subject_type"] in REGULAR_SUBJECTS]
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines = [
        "# ruff: noqa",
        f"# Auto-generated seed file from database on {now}",
        "import sys",
        "import os",
        "sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))",
        "",
        "true = True",
        "false = False",
        "null = None",
        "",
        "from app.database.db import SessionLocal",
        "from app.users.models import User  # needed for FK resolution",
        "from app.questions.models import Question",
        "from app.answer.models import QuestionAnswer",
        "from app.classifications.models import Classification  # needed for FK resolution",
        "from app.departments.models import Department  # needed for FK resolution",
        "from sqlalchemy.orm.attributes import flag_modified",
        "",
        "QUESTIONS_DATA = [",
    ]

    for q in regular:
        raw_opts = q["options_raw"]
        if raw_opts is None:
            options_str = "null"
        elif isinstance(raw_opts, (list, dict)):
            options_str = json.dumps(raw_opts, ensure_ascii=False)
        elif isinstance(raw_opts, str) and raw_opts:
            options_str = raw_opts
        else:
            options_str = "null"

        passage_line = f"null" if not q["passage"] else f'"{esc(q["passage"])}"'
        img_line = "null" if not q["image_url"] else f'"{esc(q["image_url"])}"'
        exp = esc(str(q["explanation"])) if q["explanation"] else "nan"

        lines += [
            "    {",
            f'        "id": {q["id"]},',
            f'        "question_type": "{q["question_type"]}",',
            f'        "subject_type": "{q["subject_type"]}",',
            f'        "exam_level": "{q["exam_level"]}",',
            f'        "question_text": "{esc(q["question_text"])}",',
            f'        "image_url": {img_line},',
            f'        "passage": {passage_line},',
            f'        "marks": {q["marks"]},',
            f'        "options": {options_str},',
            f'        "is_active": {"true" if q["is_active"] else "false"},',
            f'        "created_by": {q["created_by"]},',
            f'        "answer_text": "{esc(q["answer_text"])}",',
            f'        "explanation": "{exp}"',
            "    },",
        ]

    lines += [
        "]",
        "",
        "",
        "def seed_questions():",
        "    db = SessionLocal()",
        "    total_seeded = 0",
        "    total_updated = 0",
        "    try:",
        "        for item in QUESTIONS_DATA:",
        '            existing = db.query(Question).filter(Question.id == item["id"]).first()',
        "            if existing:",
        '                existing.question_type = item.get("question_type")',
        '                existing.subject_type = item.get("subject_type")',
        '                existing.exam_level = item.get("exam_level")',
        '                existing.question_text = item.get("question_text")',
        '                existing.image_url = item.get("image_url")',
        '                existing.passage = item.get("passage")',
        '                existing.marks = item.get("marks")',
        '                existing.options = item.get("options")',
        '                flag_modified(existing, "options")',
        '                existing.is_active = item.get("is_active", True)',
        "",
        "                ans = db.query(QuestionAnswer).filter(QuestionAnswer.question_id == existing.id).first()",
        "                if ans:",
        '                    ans.answer_text = item.get("answer_text", "")',
        '                    ans.explanation = item.get("explanation", "")',
        "                else:",
        "                    new_ans = QuestionAnswer(",
        "                        question_id=existing.id,",
        '                        answer_text=item.get("answer_text", ""),',
        '                        explanation=item.get("explanation", ""),',
        '                        created_by=item.get("created_by", 1),',
        "                    )",
        "                    db.add(new_ans)",
        "                total_updated += 1",
        "            else:",
        "                q_obj = Question(",
        '                    id=item["id"],',
        '                    question_type=item["question_type"],',
        '                    subject_type=item["subject_type"],',
        '                    exam_level=item["exam_level"],',
        '                    question_text=item["question_text"],',
        '                    image_url=item.get("image_url"),',
        '                    passage=item.get("passage"),',
        '                    marks=item.get("marks", 5),',
        '                    options=item.get("options"),',
        '                    is_active=item.get("is_active", True),',
        '                    created_by=item.get("created_by", 1),',
        "                )",
        "                db.add(q_obj)",
        "                db.flush()",
        "",
        "                new_ans = QuestionAnswer(",
        "                    question_id=q_obj.id,",
        '                    answer_text=item.get("answer_text", ""),',
        '                    explanation=item.get("explanation", ""),',
        '                    created_by=item.get("created_by", 1),',
        "                )",
        "                db.add(new_ans)",
        "                total_seeded += 1",
        "",
        "        db.commit()",
        '        print(f"✨ Questions seeding complete! Added: {total_seeded}, Updated: {total_updated}")',
        "    except Exception as e:",
        "        db.rollback()",
        '        print(f"❌ Error seeding questions: {str(e)}")',
        "    finally:",
        "        db.close()",
        "",
        'if __name__ == "__main__":',
        "    seed_questions()",
    ]

    return "\n".join(lines) + "\n"


# ─── seed_special_questions.py ────────────────────────────────────────────────


def generate_seed_special_questions(questions):
    contacts = [q for q in questions if q["subject_type"] == "COMPANY_CONTACT_DETAILS"]
    leads = [q for q in questions if q["subject_type"] == "LEAD_GENERATION"]
    typing_tests = [q for q in questions if q["subject_type"] == "TYPING_TEST"]
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines = [
        "# ruff: noqa",
        f"# Auto-generated seed file from database on {now}",
        "import sys",
        "import os",
        "",
        "sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))",
        "",
        'os.environ.setdefault("DB_HOST", "localhost")',
        'os.environ.setdefault("DB_PORT", "9600")',
        'os.environ.setdefault("DB_NAME", "talent_flow_ats")',
        'os.environ.setdefault("DB_USER", "postgres")',
        'os.environ.setdefault("DB_PASSWORD", "Pass2020NothingSpecial")',
        "",
        "from app.users.models import User",
        "from app.answer.models import QuestionAnswer",
        "from app.questions.models import Question",
        "from app.classifications.models import Classification",
        "from app.departments.models import Department",
        "from app.database.db import SessionLocal",
        "",
    ]

    # CONTACTS
    lines.append("CONTACTS = [")
    for q in contacts:
        opts = opts_dict(q)
        lines.append("    {")
        lines.append(f'        "id": {q["id"]},')
        lines.append(f'        "question_text": "{esc(q["question_text"])}",')
        lines.append(f'        "marks": {q["marks"]},')
        for k, v in opts.items():
            if isinstance(v, str):
                lines.append(f'        "{k}": "{esc(v)}",')
            elif v is None:
                lines.append(f'        "{k}": None,')
            else:
                lines.append(f'        "{k}": {json.dumps(v)},')
        lines.append("    },")
    lines.append("]")
    lines.append("")

    # LEADS
    lines.append("LEADS = [")
    for q in leads:
        opts = opts_dict(q)
        lines.append("    {")
        lines.append(f'        "id": {q["id"]},')
        lines.append(f'        "question_text": "{esc(q["question_text"])}",')
        lines.append(f'        "marks": {q["marks"]},')
        for k, v in opts.items():
            if isinstance(v, str):
                lines.append(f'        "{k}": "{esc(v)}",')
            elif v is None:
                lines.append(f'        "{k}": None,')
            else:
                lines.append(f'        "{k}": {json.dumps(v)},')
        lines.append("    },")
    lines.append("]")
    lines.append("")

    # TYPING TESTS
    lines.append("TYPING_TESTS = [")
    for q in typing_tests:
        passage_escaped = esc(q["passage"] or "")
        lines.append("    {")
        lines.append(f'        "id": {q["id"]},')
        lines.append(f'        "title": "{esc(q["question_text"])}",')
        lines.append(f'        "paragraph": "{passage_escaped}",')
        lines.append(f'        "marks": {q["marks"]},')
        lines.append("    },")
    lines.append("]")
    lines.append("")

    # seed function
    lines += [
        "",
        "def seed_special_questions():",
        "    db = SessionLocal()",
        "    total_seeded = 0",
        "    total_updated = 0",
        "    processed_lead_ids = set()",
        "    processed_contact_ids = set()",
        "    processed_typing_ids = set()",
        "",
        "    try:",
        "        user = db.query(User).filter(User.id == 2).first()",
        "        user_id = user.id if user else 1",
        "",
        "        # ─── 1. Lead Generation ───────────────────────────────────────────",
        '        print("\\n🚀 Seeding Lead Generation questions...")',
        "        for lead in LEADS:",
        '            q_text = lead["question_text"]',
        '            marks = lead.get("marks", 10)',
        '            lead_opts = {k: v for k, v in lead.items() if k not in ("id", "question_text", "marks")}',
        "",
        "            existing = None",
        '            if lead.get("id"):',
        '                existing = db.query(Question).filter(Question.id == lead["id"]).first()',
        "",
        "            if existing:",
        "                processed_lead_ids.add(existing.id)",
        "                existing.question_text = q_text",
        "                existing.marks = marks",
        "                existing.options = lead_opts",
        "                ans = db.query(QuestionAnswer).filter(QuestionAnswer.question_id == existing.id).first()",
        "                if not ans:",
        '                    db.add(QuestionAnswer(question_id=existing.id, answer_text="", explanation="", created_by=user_id))',
        '                print(f"  🔄 Updated lead: {q_text}")',
        "                total_updated += 1",
        "            else:",
        "                new_q = Question(",
        '                    question_type="LEAD_GENERATION",',
        '                    subject_type="LEAD_GENERATION",',
        '                    exam_level="FRESHER",',
        "                    question_text=q_text,",
        "                    marks=marks,",
        "                    is_active=True,",
        "                    options=lead_opts,",
        "                    created_by=user_id,",
        "                )",
        "                db.add(new_q)",
        "                db.flush()",
        "                processed_lead_ids.add(new_q.id)",
        '                db.add(QuestionAnswer(question_id=new_q.id, answer_text="", explanation="", created_by=user_id))',
        "                total_seeded += 1",
        '                print(f"  ✅ Added lead: {q_text}")',
        "",
        "        db.commit()",
        "",
        "        # ─── 2. Contact Details ────────────────────────────────────────────",
        '        print("\\n🚀 Seeding Contact Details questions...")',
        "        for contact in CONTACTS:",
        '            q_text = contact["question_text"]',
        '            marks = contact.get("marks", 20)',
        '            contact_opts = {k: v for k, v in contact.items() if k not in ("id", "question_text", "marks")}',
        "",
        "            existing = None",
        '            if contact.get("id"):',
        '                existing = db.query(Question).filter(Question.id == contact["id"]).first()',
        "",
        "            if existing:",
        "                processed_contact_ids.add(existing.id)",
        "                existing.question_text = q_text",
        "                existing.marks = marks",
        "                existing.options = contact_opts",
        "                ans = db.query(QuestionAnswer).filter(QuestionAnswer.question_id == existing.id).first()",
        "                if not ans:",
        '                    db.add(QuestionAnswer(question_id=existing.id, answer_text="", explanation="", created_by=user_id))',
        '                print(f"  🔄 Updated contact: {q_text}")',
        "                total_updated += 1",
        "            else:",
        "                new_q = Question(",
        '                    question_type="CONTACT_DETAILS",',
        '                    subject_type="COMPANY_CONTACT_DETAILS",',
        '                    exam_level="FRESHER",',
        "                    question_text=q_text,",
        "                    marks=marks,",
        "                    is_active=True,",
        "                    options=contact_opts,",
        "                    created_by=user_id,",
        "                )",
        "                db.add(new_q)",
        "                db.flush()",
        "                processed_contact_ids.add(new_q.id)",
        '                db.add(QuestionAnswer(question_id=new_q.id, answer_text="", explanation="", created_by=user_id))',
        "                total_seeded += 1",
        '                print(f"  ✅ Added contact: {q_text}")',
        "",
        "        db.commit()",
        "",
        "        # ─── 3. Typing Test ────────────────────────────────────────────────",
        '        print("\\n🚀 Seeding Typing Test questions...")',
        "        for typing in TYPING_TESTS:",
        '            q_text = typing["title"]',
        '            marks = typing.get("marks", 10)',
        "",
        "            existing = None",
        '            if typing.get("id"):',
        '                existing = db.query(Question).filter(Question.id == typing["id"]).first()',
        "",
        "            if existing:",
        "                processed_typing_ids.add(existing.id)",
        '                existing.passage = typing["paragraph"]',
        "                existing.marks = marks",
        '                print(f"  🔄 Updated typing test: {q_text}")',
        "                total_updated += 1",
        "            else:",
        "                new_q = Question(",
        '                    question_type="TYPING_TEST",',
        '                    subject_type="TYPING_TEST",',
        '                    exam_level="FRESHER",',
        "                    question_text=q_text,",
        '                    passage=typing["paragraph"],',
        "                    marks=marks,",
        "                    is_active=True,",
        "                    options=[],",
        "                    created_by=user_id,",
        "                )",
        "                db.add(new_q)",
        "                db.flush()",
        "                processed_typing_ids.add(new_q.id)",
        '                db.add(QuestionAnswer(question_id=new_q.id, answer_text="", explanation="", created_by=user_id))',
        "                total_seeded += 1",
        '                print(f"  ✅ Added typing test: {q_text}")',
        "",
        "        db.commit()",
        "",
        '        print(f"\\n✨ Special questions seeding complete!")',
        '        print(f"   Questions added  : {total_seeded}")',
        '        print(f"   Questions updated: {total_updated}")',
        "",
        "    except Exception as e:",
        "        db.rollback()",
        '        print(f"❌ Error seeding special questions: {str(e)}")',
        "    finally:",
        "        db.close()",
        "",
        "",
        'if __name__ == "__main__":',
        "    seed_special_questions()",
        "",
    ]

    return "\n".join(lines)


# ─── main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("📦 Fetching all questions from DB...")
    questions = fetch_all()
    print(f"   Total fetched: {len(questions)}")

    regular = [q for q in questions if q["subject_type"] in REGULAR_SUBJECTS]
    contacts = [q for q in questions if q["subject_type"] == "COMPANY_CONTACT_DETAILS"]
    leads = [q for q in questions if q["subject_type"] == "LEAD_GENERATION"]
    typing_tests = [q for q in questions if q["subject_type"] == "TYPING_TEST"]

    print(f"   Regular (seed_questions.py): {len(regular)}")
    print(f"   Contacts (seed_special): {len(contacts)}")
    print(f"   Leads (seed_special): {len(leads)}")
    print(f"   Typing Tests (seed_special): {len(typing_tests)}")

    sq_path = os.path.join(SEEDS_DIR, "seed_questions.py")
    sq_content = generate_seed_questions(questions)
    with open(sq_path, "w", encoding="utf-8") as f:
        f.write(sq_content)
    print(f"\n✅ Written: {sq_path}")

    ssq_path = os.path.join(SEEDS_DIR, "seed_special_questions.py")
    ssq_content = generate_seed_special_questions(questions)
    with open(ssq_path, "w", encoding="utf-8") as f:
        f.write(ssq_content)
    print(f"✅ Written: {ssq_path}")

    print("\n🎉 Both seed files regenerated successfully from DB!")
