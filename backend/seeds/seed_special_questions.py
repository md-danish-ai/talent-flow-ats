# ruff: noqa
from app.users.models import User
from app.answer.models import QuestionAnswer
from app.questions.models import Question
from app.database.db import SessionLocal
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


# --- DATA ---

LEADS = [
    {"companyName": "Blake Jarrett & Co", "website": "blakejarrett.ca",
        "name": "Blake Jarrett", "title": "CEO", "email": "blake@blakejarrett.ca"},
    {"companyName": "Beracal Homes, Inc.", "website": "beracalhomes.com",
        "name": "Trent Collins", "title": "Contractor Sales", "email": "trent@beracalhomes.com"},
    {"companyName": "American Excelsior Company", "website": "americanexcelsior.com",
        "name": "Terry Sadowski", "title": "President", "email": "tsadowski@americanexcelsior.com"},
    {"companyName": "Calgon Carbon Corporation", "website": "calgoncarbon.com", "name": "Doug Conley",
        "title": "Marketing Manager- Municipal", "email": "dconley@calgoncarbon.com"},
    {"companyName": "American Tank & Fabricating Company", "website": "atfco.com",
        "name": "Ted Thorbjornsen", "title": "General Manager", "email": "tedt@atfco.com"},
    {"companyName": "Paul Evans", "website": "paulevansny.com",
        "name": "Evan Fript", "title": "CEO", "email": "evan@paulevansny.com"},
]

CONTACTS = [
    {"websiteUrl": "http://celanese.com", "companyName": "Celanese Corporation", "streetAddress": "222 W. Las Colinas Blvd.", "city": "Irving", "state": "TX",
        "zipCode": "75039", "companyPhoneNumber": "+1 972-443-4000", "generalEmail": "questions@celanese.com", "facebookPage": "https://www.facebook.com/Celanese/"},
    {"websiteUrl": "http://calgoncarbon.com", "companyName": "Calgon Carbon Corporation", "streetAddress": "3000 GSK Drive", "city": "Moon Township", "state": "PA",
        "zipCode": "15108", "companyPhoneNumber": "412-787-6700", "generalEmail": "info@calgoncarbon.com", "facebookPage": "https://www.facebook.com/calgoncarbon/"},
    {"websiteUrl": "http://beltpower.com", "companyName": "Belt Power, LLC", "streetAddress": "2355 Church Road SE Suite 625", "city": "Atlanta", "state": "GA",
        "zipCode": "30339", "companyPhoneNumber": "800-886-2358", "generalEmail": "sales@beltpower.com", "facebookPage": "https://www.facebook.com/BeltPower/"},
]

TYPING_TESTS = [
    {
        "title": "Sustainability Commitment",
        "paragraph": "Sustainability is at the heart of our operations. We strive to minimize our environmental footprint through efficient resource management and innovative solutions. Our commitment extends for our supply chain, ensuring that all partners adhere to the highest ethical and environmental standards. We believe that a sustainable future is not just a goal, but a responsibility that we all share."
    },
    {
        "title": "Quality Assurance Policy",
        "paragraph": "Our quality assurance policy is designed to ensure that every product we deliver meets the highest standards of excellence. We implement rigorous testing protocols at every stage of the development process. Our dedicated QA team works tirelessly to identify and resolve potential issues before they reach our customers. We are committed to continuous improvement and innovation in all our processes."
    },
    {
        "title": "Professional Communication",
        "paragraph": "Effective professional communication is essential for the success of any organization. It involves the clear and concise exchange of information between team members, clients, and stakeholders. Good communication fosters collaboration, reduces misunderstandings, and builds strong professional relationships. We encourage our employees to use appropriate channels and maintain a high level of professionalism in all their interactions."
    }
]


def seed_special_questions():
    db = SessionLocal()
    try:
        admin_user = db.query(User).first()
        user_id = admin_user.id if admin_user else 1
        print(f"Using User ID: {user_id} for 'created_by'")

        # 1. Seed Lead Generation
        print("🚀 Seeding Lead Generation questions...")
        for lead in LEADS:
            existing = db.query(Question).filter(
                Question.question_type == "LEAD_GENERATION", Question.question_text == lead["companyName"]).first()
            if not existing:
                new_q = Question(
                    question_type="LEAD_GENERATION", subject_type="LEAD_GENERATION", exam_level="FRESHER",
                    question_text=lead["companyName"], marks=5, is_active=True,
                    options=lead, created_by=user_id
                )
                db.add(new_q)
                db.flush()
                db.add(QuestionAnswer(question_id=new_q.id,
                       answer_text="", explanation="", created_by=user_id))
                print(f"✅ Added lead: {lead['companyName']}")

        # 2. Seed Contact Details
        print("🚀 Seeding Company Contact Details questions...")
        for contact in CONTACTS:
            existing = db.query(Question).filter(
                Question.question_type == "CONTACT_DETAILS", Question.question_text == contact["websiteUrl"]).first()
            if not existing:
                new_q = Question(
                    question_type="CONTACT_DETAILS", subject_type="COMPANY_CONTACT_DETAILS", exam_level="FRESHER",
                    question_text=contact["websiteUrl"], marks=5, is_active=True,
                    options=contact, created_by=user_id
                )
                db.add(new_q)
                db.flush()
                db.add(QuestionAnswer(question_id=new_q.id,
                       answer_text="", explanation="", created_by=user_id))
                print(f"✅ Added contact: {contact['companyName']}")

        # 3. Seed Typing Tests
        print("🚀 Seeding Typing Test questions...")
        for typing in TYPING_TESTS:
            existing = db.query(Question).filter(
                Question.question_type == "TYPING_TEST", Question.question_text == typing["title"]).first()
            if not existing:
                new_q = Question(
                    question_type="TYPING_TEST", subject_type="TYPING_TEST", exam_level="FRESHER",
                    question_text=typing["title"], passage=typing["paragraph"], marks=5, is_active=True,
                    options=[], created_by=user_id
                )
                db.add(new_q)
                db.flush()
                db.add(QuestionAnswer(question_id=new_q.id,
                       answer_text="", explanation="", created_by=user_id))
                print(f"✅ Added typing test: {typing['title']}")

        db.commit()
        print("✨ Special questions seeding complete!")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding special questions: {str(e)}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_special_questions()
