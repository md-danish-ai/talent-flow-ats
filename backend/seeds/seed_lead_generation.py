from app.database.db import SessionLocal
from app.questions.models import Question
from app.answer.models import QuestionAnswer
from app.users.models import User

LEADS = [
    {
        "companyName": "Blake Jarrett & Co",
        "website": "blakejarrett.ca",
        "name": "Blake Jarrett",
        "title": "CEO",
        "email": "blake@blakejarrett.ca"
    },
    {
        "companyName": "Beracal Homes, Inc.",
        "website": "beracalhomes.com",
        "name": "Trent Collins",
        "title": "Contractor Sales",
        "email": "trent@beracalhomes.com"
    },
    {
        "companyName": "American Excelsior Company",
        "website": "americanexcelsior.com",
        "name": "Terry Sadowski",
        "title": "President",
        "email": "tsadowski@americanexcelsior.com"
    },
    {
        "companyName": "Calgon Carbon Corporation",
        "website": "calgoncarbon.com",
        "name": "Doug Conley",
        "title": "Marketing Manager- Municipal",
        "email": "dconley@calgoncarbon.com"
    },
    {
        "companyName": "American Tank & Fabricating Company",
        "website": "atfco.com",
        "name": "Ted Thorbjornsen",
        "title": "General Manager",
        "email": "tedt@atfco.com"
    },
    {
        "companyName": "Paul Evans",
        "website": "paulevansny.com",
        "name": "Evan Fript",
        "title": "CEO",
        "email": "evan@paulevansny.com"
    }
]

def seed_leads():
    db = SessionLocal()
    try:
        print("🚀 Seeding Lead Generation questions...")
        for lead in LEADS:
            # Check if exists
            existing = db.query(Question).filter(
                Question.question_type == "LEAD_GENERATION",
                Question.question_text == lead["companyName"]
            ).first()
            
            if not existing:
                new_q = Question(
                    question_type="LEAD_GENERATION",
                    subject_type="LEAD_GENERATION",
                    exam_level="FRESHER",
                    question_text=lead["companyName"],
                    marks=1,
                    is_active=True,
                    options={
                        "companyName": lead["companyName"],
                        "website": lead["website"],
                        "name": lead["name"],
                        "title": lead["title"],
                        "email": lead["email"]
                    },
                    created_by=1 # Assuming ID 1 exists
                )
                db.add(new_q)
                db.flush()
                
                # Add dummy answer
                new_ans = QuestionAnswer(
                    question_id=new_q.id,
                    answer_text="",
                    explanation="",
                    created_by=1
                )
                db.add(new_ans)
                print(f"✅ Added lead: {lead['companyName']}")
            else:
                print(f"⏭️ Skipping (already exists): {lead['companyName']}")
        
        db.commit()
        print("✨ Seeding complete!")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding leads: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_leads()
