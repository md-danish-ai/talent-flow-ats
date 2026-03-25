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
from app.database.db import SessionLocal


# ─────────────────────────────────────────────────────────────────────────────
# LEAD GENERATION DATA
# question_type = "LEAD_GENERATION" | subject_type = "LEAD_GENERATION"
# question_text = companyName  |  options = full lead dict
# ─────────────────────────────────────────────────────────────────────────────
LEADS = [
    {
        "companyName": "Blake Jarrett & Co",
        "website": "blakejarrett.ca",
        "name": "Blake Jarrett",
        "title": "CEO",
        "email": "blake@blakejarrett.ca",
    },
    {
        "companyName": "Beracal Homes, Inc.",
        "website": "beracalhomes.com",
        "name": "Trent Collins",
        "title": "Contractor Sales",
        "email": "trent@beracalhomes.com",
    },
    {
        "companyName": "American Excelsior Company",
        "website": "americanexcelsior.com",
        "name": "Terry Sadowski",
        "title": "President",
        "email": "tsadowski@americanexcelsior.com",
    },
    {
        "companyName": "Calgon Carbon Corporation",
        "website": "calgoncarbon.com",
        "name": "Doug Conley",
        "title": "Marketing Manager - Municipal",
        "email": "dconley@calgoncarbon.com",
    },
    {
        "companyName": "American Tank & Fabricating Company",
        "website": "atfco.com",
        "name": "Ted Thorbjornsen",
        "title": "General Manager",
        "email": "tedt@atfco.com",
    },
    {
        "companyName": "Paul Evans",
        "website": "paulevansny.com",
        "name": "Evan Fript",
        "title": "CEO",
        "email": "evan@paulevansny.com",
    },
    {
        "companyName": "Horizon Tech Solutions",
        "website": "horizontech.io",
        "name": "Sarah Mitchell",
        "title": "VP of Sales",
        "email": "sarah.mitchell@horizontech.io",
    },
    {
        "companyName": "Global Foods Inc.",
        "website": "globalfoods.com",
        "name": "Raj Mehta",
        "title": "Head of Procurement",
        "email": "raj.mehta@globalfoods.com",
    },
    {
        "companyName": "Sterling Capital Group",
        "website": "sterlingcapital.com",
        "name": "James O'Brien",
        "title": "Managing Director",
        "email": "jobrien@sterlingcapital.com",
    },
    {
        "companyName": "EcoBuilders LLC",
        "website": "ecobuilders.net",
        "name": "Nina Patel",
        "title": "Operations Manager",
        "email": "nina@ecobuilders.net",
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# COMPANY CONTACT DETAILS DATA
# question_type = "CONTACT_DETAILS" | subject_type = "COMPANY_CONTACT_DETAILS"
# question_text = websiteUrl  |  options = full contact dict
# ─────────────────────────────────────────────────────────────────────────────
CONTACTS = [
    {
        "websiteUrl": "http://celanese.com",
        "companyName": "Celanese Corporation",
        "streetAddress": "222 W. Las Colinas Blvd.",
        "city": "Irving",
        "state": "TX",
        "zipCode": "75039",
        "companyPhoneNumber": "+1 972-443-4000",
        "generalEmail": "questions@celanese.com",
        "facebookPage": "https://www.facebook.com/Celanese/",
    },
    {
        "websiteUrl": "http://calgoncarbon.com",
        "companyName": "Calgon Carbon Corporation",
        "streetAddress": "3000 GSK Drive",
        "city": "Moon Township",
        "state": "PA",
        "zipCode": "15108",
        "companyPhoneNumber": "412-787-6700",
        "generalEmail": "info@calgoncarbon.com",
        "facebookPage": "https://www.facebook.com/calgoncarbon/",
    },
    {
        "websiteUrl": "http://beltpower.com",
        "companyName": "Belt Power, LLC",
        "streetAddress": "2355 Church Road SE Suite 625",
        "city": "Atlanta",
        "state": "GA",
        "zipCode": "30339",
        "companyPhoneNumber": "800-886-2358",
        "generalEmail": "sales@beltpower.com",
        "facebookPage": "https://www.facebook.com/BeltPower/",
    },
    {
        "websiteUrl": "http://horizontech.io",
        "companyName": "Horizon Tech Solutions",
        "streetAddress": "500 Silicon Ave, Suite 200",
        "city": "San Jose",
        "state": "CA",
        "zipCode": "95110",
        "companyPhoneNumber": "+1 408-555-0100",
        "generalEmail": "hello@horizontech.io",
        "facebookPage": "https://www.facebook.com/HorizonTechSolutions/",
    },
    {
        "websiteUrl": "http://globalfoods.com",
        "companyName": "Global Foods Inc.",
        "streetAddress": "1 Food Park Drive",
        "city": "Chicago",
        "state": "IL",
        "zipCode": "60601",
        "companyPhoneNumber": "+1 312-555-0200",
        "generalEmail": "contact@globalfoods.com",
        "facebookPage": "https://www.facebook.com/GlobalFoodsInc/",
    },
    {
        "websiteUrl": "http://sterlingcapital.com",
        "companyName": "Sterling Capital Group",
        "streetAddress": "10 Wall Street, Floor 20",
        "city": "New York",
        "state": "NY",
        "zipCode": "10005",
        "companyPhoneNumber": "+1 212-555-0300",
        "generalEmail": "info@sterlingcapital.com",
        "facebookPage": "https://www.facebook.com/SterlingCapitalGroup/",
    },
    {
        "websiteUrl": "http://ecobuilders.net",
        "companyName": "EcoBuilders LLC",
        "streetAddress": "88 Green Street",
        "city": "Portland",
        "state": "OR",
        "zipCode": "97201",
        "companyPhoneNumber": "+1 503-555-0400",
        "generalEmail": "info@ecobuilders.net",
        "facebookPage": "https://www.facebook.com/EcoBuildersLLC/",
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# TYPING TEST DATA
# question_type = "TYPING_TEST" | subject_type = "TYPING_TEST"
# question_text = title  |  passage = paragraph to type
# ─────────────────────────────────────────────────────────────────────────────
TYPING_TESTS = [
    {
        "title": "Sustainability Commitment",
        "paragraph": "Sustainability is at the heart of our operations. We strive to minimize our environmental footprint through efficient resource management and innovative solutions. Our commitment extends to our supply chain, ensuring that all partners adhere to the highest ethical and environmental standards. We believe that a sustainable future is not just a goal, but a responsibility that we all share.",
    },
    {
        "title": "Quality Assurance Policy",
        "paragraph": "Our quality assurance policy is designed to ensure that every product we deliver meets the highest standards of excellence. We implement rigorous testing protocols at every stage of the development process. Our dedicated QA team works tirelessly to identify and resolve potential issues before they reach our customers. We are committed to continuous improvement and innovation in all our processes.",
    },
    {
        "title": "Professional Communication",
        "paragraph": "Effective professional communication is essential for the success of any organization. It involves the clear and concise exchange of information between team members, clients, and stakeholders. Good communication fosters collaboration, reduces misunderstandings, and builds strong professional relationships. We encourage our employees to maintain a high level of professionalism in all their interactions.",
    },
    {
        "title": "Customer Service Excellence",
        "paragraph": "Delivering exceptional customer service is one of our core values. Every interaction with a customer is an opportunity to build trust and loyalty. Our team is trained to listen carefully, respond promptly, and resolve issues efficiently. We measure our success not only by the quality of our products but also by the satisfaction and loyalty of our customers.",
    },
    {
        "title": "Digital Transformation",
        "paragraph": "Digital transformation is reshaping the way businesses operate in the modern world. Companies that embrace technology and adapt their processes are better positioned to thrive in a competitive environment. From cloud computing and artificial intelligence to data analytics and automation, the tools available today offer unprecedented opportunities for growth and efficiency.",
    },
    {
        "title": "Workplace Safety Standards",
        "paragraph": "Maintaining a safe workplace is a fundamental responsibility of every organization. We follow strict safety protocols to protect our employees and visitors from potential hazards. Regular safety audits, employee training programs, and incident reporting systems are integral parts of our safety management framework. A safe workplace leads to higher productivity and employee satisfaction.",
    },
    {
        "title": "Innovation and Research",
        "paragraph": "Innovation is the driving force behind our company's long-term success. Our research and development teams are constantly exploring new ideas and technologies to solve complex problems. By investing in innovation, we not only improve our products and services but also contribute to the advancement of our industry. We believe that curiosity, creativity, and collaboration are the keys to breakthrough discoveries.",
    },
]


def seed_special_questions():
    db = SessionLocal()
    try:
        admin_user = db.query(User).first()
        user_id = admin_user.id if admin_user else 1
        print(f"Using User ID: {user_id} for 'created_by'")

        total_seeded = 0
        total_skipped = 0

        # ─── 1. Lead Generation ──────────────────────────────────────────
        # question_type = LEAD_GENERATION | subject_type = LEAD_GENERATION
        print("\n🚀 Seeding Lead Generation questions...")
        for lead in LEADS:
            q_text = lead["companyName"]
            existing = db.query(Question).filter(
                Question.question_type == "LEAD_GENERATION",
                Question.subject_type == "LEAD_GENERATION",
                Question.question_text == q_text,
            ).first()
            if existing:
                total_skipped += 1
                print(f"  ⏭ Skipped (exists): {q_text}")
                continue

            new_q = Question(
                question_type="LEAD_GENERATION",
                subject_type="LEAD_GENERATION",
                exam_level="FRESHER",
                question_text=q_text,
                marks=5,
                is_active=True,
                options=lead,
                created_by=user_id,
            )
            db.add(new_q)
            db.flush()
            db.add(QuestionAnswer(
                question_id=new_q.id,
                answer_text="",
                explanation="",
                created_by=user_id,
            ))
            total_seeded += 1
            print(f"  ✅ Added lead: {q_text}")

        db.commit()

        # ─── 2. Company Contact Details ───────────────────────────────────
        # question_type = CONTACT_DETAILS | subject_type = COMPANY_CONTACT_DETAILS
        print("\n🚀 Seeding Company Contact Details questions...")
        for contact in CONTACTS:
            q_text = contact["websiteUrl"]
            existing = db.query(Question).filter(
                Question.question_type == "CONTACT_DETAILS",
                Question.subject_type == "COMPANY_CONTACT_DETAILS",
                Question.question_text == q_text,
            ).first()
            if existing:
                total_skipped += 1
                print(f"  ⏭ Skipped (exists): {q_text}")
                continue

            new_q = Question(
                question_type="CONTACT_DETAILS",
                subject_type="COMPANY_CONTACT_DETAILS",
                exam_level="FRESHER",
                question_text=q_text,
                marks=5,
                is_active=True,
                options=contact,
                created_by=user_id,
            )
            db.add(new_q)
            db.flush()
            db.add(QuestionAnswer(
                question_id=new_q.id,
                answer_text="",
                explanation="",
                created_by=user_id,
            ))
            total_seeded += 1
            print(f"  ✅ Added contact: {contact['companyName']}")

        db.commit()

        # ─── 3. Typing Test ───────────────────────────────────────────────
        # question_type = TYPING_TEST | subject_type = TYPING_TEST
        print("\n🚀 Seeding Typing Test questions...")
        for typing in TYPING_TESTS:
            q_text = typing["title"]
            existing = db.query(Question).filter(
                Question.question_type == "TYPING_TEST",
                Question.subject_type == "TYPING_TEST",
                Question.question_text == q_text,
            ).first()
            if existing:
                total_skipped += 1
                print(f"  ⏭ Skipped (exists): {q_text}")
                continue

            new_q = Question(
                question_type="TYPING_TEST",
                subject_type="TYPING_TEST",
                exam_level="FRESHER",
                question_text=q_text,
                passage=typing["paragraph"],
                marks=5,
                is_active=True,
                options=[],
                created_by=user_id,
            )
            db.add(new_q)
            db.flush()
            db.add(QuestionAnswer(
                question_id=new_q.id,
                answer_text="",
                explanation="",
                created_by=user_id,
            ))
            total_seeded += 1
            print(f"  ✅ Added typing test: {q_text}")

        db.commit()

        print(f"\n✨ Special questions seeding complete!")
        print(f"   Questions added  : {total_seeded}")
        print(f"   Questions skipped: {total_skipped}")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding special questions: {str(e)}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_special_questions()
