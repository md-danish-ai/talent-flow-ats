from app.database.db import SessionLocal
from app.questions.models import Question
from app.answer.models import QuestionAnswer

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
]


def seed_contacts():
    db = SessionLocal()
    try:
        print("🚀 Seeding Company Contact Details questions...")
        for contact in CONTACTS:
            # Check if exists
            existing = (
                db.query(Question)
                .filter(
                    Question.question_type == "CONTACT_DETAILS",
                    Question.question_text == contact["websiteUrl"],
                )
                .first()
            )

            if not existing:
                new_q = Question(
                    question_type="CONTACT_DETAILS",
                    subject_type="COMPANY_CONTACT_DETAILS_TEST",
                    exam_level="FRESHER",
                    question_text=contact["websiteUrl"],
                    marks=1,
                    is_active=True,
                    options={
                        "websiteUrl": contact["websiteUrl"],
                        "companyName": contact["companyName"],
                        "streetAddress": contact["streetAddress"],
                        "city": contact["city"],
                        "state": contact["state"],
                        "zipCode": contact["zipCode"],
                        "companyPhoneNumber": contact["companyPhoneNumber"],
                        "generalEmail": contact["generalEmail"],
                        "facebookPage": contact["facebookPage"],
                    },
                    created_by=1,
                )
                db.add(new_q)
                db.flush()

                # Add dummy answer
                new_ans = QuestionAnswer(
                    question_id=new_q.id, answer_text="", explanation="", created_by=1
                )
                db.add(new_ans)
                print(f"✅ Added contact: {contact['companyName']}")
            else:
                print(f"⏭️ Skipping (already exists): {contact['companyName']}")

        db.commit()
        print("✨ Seeding complete!")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding contacts: {str(e)}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_contacts()
