# ruff: noqa
import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set default env vars for DB
os.environ.setdefault("DB_HOST", "localhost")
os.environ.setdefault("DB_PORT", "5435")
os.environ.setdefault("DB_NAME", "talent_flow_ats")
os.environ.setdefault("DB_USER", "postgres")
os.environ.setdefault("DB_PASSWORD", "Pass2020NothingSpecial")

from app.users.models import User
from app.answer.models import QuestionAnswer
from app.questions.models import Question
from app.classifications.models import Classification
from app.departments.models import Department
from app.database.db import SessionLocal

LEADS = [
    {
        "email": "dconley@calgoncarbon.com",
        "phone": "",
        "address": "",
        "website": "calgoncarbon.com",
        "designation": "Marketing Manager- Municipal",
        "company_name": "Calgon Carbon Corporation",
        "contact_name": "Doug Conley",
        "linkedin_url": "",
        "marks": 5,
    },
    {
        "email": "tedt@atfco.com",
        "phone": "",
        "address": "",
        "website": "atfco.com",
        "designation": "General Manager",
        "company_name": "American Tank & Fabricating Company",
        "contact_name": "Ted Thorbjornsen",
        "linkedin_url": "",
        "marks": 5,
    },
    {
        "email": "tsadowski@americanexcelsior.com",
        "phone": "",
        "address": "",
        "website": "americanexcelsior.com",
        "designation": "President",
        "company_name": "American Excelsior Company",
        "contact_name": "Terry Sadowski",
        "linkedin_url": "",
        "marks": 5,
    },
    {
        "email": "trent@beracahhomes.com",
        "phone": "",
        "address": "",
        "website": "beracahhomes.com",
        "designation": "Contractor Sales",
        "company_name": "Beracah Homes, Inc.",
        "contact_name": "Trent Collins",
        "linkedin_url": "",
        "marks": 10,
    },
    {
        "email": "blake@blakejarrett.ca",
        "phone": "",
        "address": "",
        "website": "blakejarrett.ca",
        "designation": "CEO",
        "company_name": "Blake Jarrett & Co",
        "contact_name": "Blake Jarrett",
        "linkedin_url": "",
        "marks": 10,
    },
]

CONTACTS = [
    {
        "city": "Moon Township",
        "state": "PA",
        "zipCode": 15108,
        "websiteUrl": "http://calgoncarbon.com",
        "companyName": "Calgon Carbon Corporation",
        "facebookPage": "https://www.facebook.com/calgoncarbon/",
        "generalEmail": "info@calgoncarbon.com",
        "streetAddress": "3000 GSK Drive",
        "companyPhoneNumber": "412-787-6700",
        "marks": 5,
    },
    {
        "city": "Toronto",
        "state": "ON",
        "zipCode": "M2H 3R1",
        "websiteUrl": "http://cclind.com",
        "companyName": "CCL Industries Inc",
        "facebookPage": "https://www.facebook.com/pages/CCL-Industries-Inc/215880722133999",
        "generalEmail": "ccl@cclind.com",
        "streetAddress": "105 Gordon Baker Road Suite 801",
        "companyPhoneNumber": 4167568500,
        "marks": 5,
    },
    {
        "city": "Cerritos",
        "state": "CA",
        "zipCode": 90703,
        "websiteUrl": "http://calnetix.com",
        "companyName": "Calnetix Technologies, LLC",
        "facebookPage": "https://www.facebook.com/calnetix/",
        "generalEmail": "info@calnetix.com",
        "streetAddress": "16323 Shoemaker Ave.",
        "companyPhoneNumber": "1-562-293-1660",
        "marks": 5,
    },
    {
        "city": "Atlanta",
        "state": "GA",
        "zipCode": "30339",
        "websiteUrl": "http://beltpower.com",
        "companyName": "Belt Power, LLC",
        "facebookPage": "https://www.facebook.com/BeltPower/",
        "generalEmail": "sales@beltpower.com",
        "streetAddress": "2355 Church Road SE",
        "companyPhoneNumber": "800-886-2358",
        "marks": 20,
    },
    {
        "city": "Calgary",
        "state": "AB",
        "zipCode": "T2J 6A5",
        "websiteUrl": "http://ceda.com/",
        "companyName": "CEDA International",
        "facebookPage": "https://www.facebook.com/CEDA.International",
        "generalEmail": "info@cedagroup.com",
        "streetAddress": "Suite 625, 11012 Macleod Trail SE",
        "companyPhoneNumber": "1-403-253-3233",
        "marks": 20,
    },
    {
        "city": "Irving",
        "state": "TX",
        "zipCode": "75039",
        "websiteUrl": "http://celanese.com",
        "companyName": "Celanese Corporation",
        "facebookPage": "https://www.facebook.com/Celanese/",
        "generalEmail": "questions@celanese.com",
        "streetAddress": "222 W. Las Colinas Blvd.",
        "companyPhoneNumber": "+1 972-443-4000",
        "marks": 20,
    },
]

TYPING_TESTS = [
    {
        "title": "Quality Policy",
        "paragraph": "ArcGate Quality Policy.ArcGate is committed to a global quality system focused on customer satisfaction. We achieve this through superior services, rapid customer support, technical expertise and industry leadership.Our quality and business objectives are designed to challenge the organisation through continual improvement, innovation and passion for results.Assisted 75+ world-class startups in rapidly bringing cost-effective solutions to market.",
        "marks": 10,
    }
]


def seed_special_questions():
    db = SessionLocal()
    try:
        admin_user = db.query(User).first()
        user_id = admin_user.id if admin_user else 1
        print(f"Using User ID: {user_id} for 'created_by'")

        total_seeded = 0
        total_updated = 0

        # ─── 1. Lead Generation ──────────────────────────────────────────
        print("\n🚀 Seeding Lead Generation questions...")
        for lead in LEADS:
            c_name = lead.get("company_name", "")
            marks = lead.get("marks", 5)
            lead_opts = {k: v for k, v in lead.items() if k != "marks"}

            existing = None
            all_leads = (
                db.query(Question)
                .filter(
                    Question.question_type == "LEAD_GENERATION",
                    Question.subject_type == "LEAD_GENERATION",
                )
                .all()
            )

            for q in all_leads:
                if (
                    q.options
                    and isinstance(q.options, dict)
                    and q.options.get("company_name") == c_name
                ) or q.question_text == c_name:
                    existing = q
                    break

            if existing:
                existing.options = lead_opts
                existing.marks = marks
                print(f"  🔄 Updated lead: {c_name}")
                total_updated += 1
            else:
                new_q = Question(
                    question_type="LEAD_GENERATION",
                    subject_type="LEAD_GENERATION",
                    exam_level="FRESHER",
                    question_text="",
                    marks=marks,
                    is_active=True,
                    options=lead_opts,
                    created_by=user_id,
                )
                db.add(new_q)
                db.flush()
                db.add(
                    QuestionAnswer(
                        question_id=new_q.id,
                        answer_text="",
                        explanation="",
                        created_by=user_id,
                    )
                )
                total_seeded += 1
                print(f"  ✅ Added lead: {c_name}")

        db.commit()

        # ─── 2. Company Contact Details ───────────────────────────────────
        print("\n🚀 Seeding Company Contact Details questions...")
        for contact in CONTACTS:
            q_text = contact["websiteUrl"]
            marks = contact.get("marks", 5)
            contact_opts = {k: v for k, v in contact.items() if k != "marks"}

            existing = (
                db.query(Question)
                .filter(
                    Question.question_type == "CONTACT_DETAILS",
                    Question.subject_type == "COMPANY_CONTACT_DETAILS",
                    Question.question_text == q_text,
                )
                .first()
            )

            if existing:
                existing.options = contact_opts
                existing.marks = marks
                print(f"  🔄 Updated contact: {contact.get('companyName', q_text)}")
                total_updated += 1
            else:
                new_q = Question(
                    question_type="CONTACT_DETAILS",
                    subject_type="COMPANY_CONTACT_DETAILS",
                    exam_level="FRESHER",
                    question_text=q_text,
                    marks=marks,
                    is_active=True,
                    options=contact_opts,
                    created_by=user_id,
                )
                db.add(new_q)
                db.flush()
                db.add(
                    QuestionAnswer(
                        question_id=new_q.id,
                        answer_text="",
                        explanation="",
                        created_by=user_id,
                    )
                )
                total_seeded += 1
                print(f"  ✅ Added contact: {contact.get('companyName', q_text)}")

        db.commit()

        # ─── 3. Typing Test ───────────────────────────────────────────────
        print("\n🚀 Seeding Typing Test questions...")
        for typing in TYPING_TESTS:
            q_text = typing["title"]
            marks = typing.get("marks", 10)
            existing = (
                db.query(Question)
                .filter(
                    Question.question_type == "TYPING_TEST",
                    Question.subject_type == "TYPING_TEST",
                    Question.question_text == q_text,
                )
                .first()
            )

            if existing:
                existing.passage = typing["paragraph"]
                existing.marks = marks
                print(f"  🔄 Updated typing test: {q_text}")
                total_updated += 1
            else:
                new_q = Question(
                    question_type="TYPING_TEST",
                    subject_type="TYPING_TEST",
                    exam_level="FRESHER",
                    question_text=q_text,
                    passage=typing["paragraph"],
                    marks=marks,
                    is_active=True,
                    options=[],
                    created_by=user_id,
                )
                db.add(new_q)
                db.flush()
                db.add(
                    QuestionAnswer(
                        question_id=new_q.id,
                        answer_text="",
                        explanation="",
                        created_by=user_id,
                    )
                )
                total_seeded += 1
                print(f"  ✅ Added typing test: {q_text}")

        db.commit()

        print(f"\n✨ Special questions seeding complete!")
        print(f"   Questions added  : {total_seeded}")
        print(f"   Questions updated: {total_updated}")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding special questions: {str(e)}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_special_questions()
