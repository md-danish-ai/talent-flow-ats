# ruff: noqa
# Auto-generated seed file from database on 2026-08-06 18:15:07
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

true = True
false = False
null = None

from app.database.db import SessionLocal
from app.classifications.models import Classification

CLASSIFICATIONS_DATA = [
    {
        "id": 1,
        "type": "question_type",
        "name": "Multiple Choice Question",
        "code": "MULTIPLE_CHOICE",
        "sort_order": 1,
        "metadata": {
            "description": "Standard professional recruitment questions with 4 distinct options (A, B, C, D). Focus on clear, unambiguous questions with one definitively correct answer and plausible distractors."
        },
        "is_active": true
    },
    {
        "id": 2,
        "type": "question_type",
        "name": "Image Multiple Choice",
        "code": "IMAGE_MULTIPLE_CHOICE",
        "sort_order": 2,
        "metadata": {
            "description": "Visual-centric MCQ. The question MUST directly reference the visual elements (charts, diagrams, or scenarios) described in the 'image_prompt'. Focus on observational and data-reading skills."
        },
        "is_active": true
    },
    {
        "id": 3,
        "type": "question_type",
        "name": "Subjective Question",
        "code": "SUBJECTIVE",
        "sort_order": 3,
        "metadata": {
            "description": "Open-ended questions assessing critical thinking and domain expertise. Require the candidate to provide a detailed written explanation of 2-3 sentences."
        },
        "is_active": true
    },
    {
        "id": 4,
        "type": "question_type",
        "name": "Image Subjective",
        "code": "IMAGE_SUBJECTIVE",
        "sort_order": 4,
        "metadata": {
            "description": "Analytic questions based on a visual scenario. Candidate must observe the 'image_prompt' content and provide a descriptive technical or strategic answer."
        },
        "is_active": true
    },
    {
        "id": 5,
        "type": "question_type",
        "name": "Passage Content",
        "code": "PASSAGE_CONTENT",
        "sort_order": 5,
        "metadata": {
            "description": "Reading comprehension. First, provide a professional 150-200 word passage in the 'passage' field, then create a question based on it with 4 MCQ options."
        },
        "is_active": true
    },
    {
        "id": 6,
        "type": "question_type",
        "name": "Typing Test",
        "code": "TYPING_TEST",
        "sort_order": 6,
        "metadata": {
            "description": "Paragraph-based assessment. Generate a structured text block (200-300 words) with professional content to test candidate's typing speed and accuracy."
        },
        "is_active": true
    },
    {
        "id": 7,
        "type": "question_type",
        "name": "Lead Generation",
        "code": "LEAD_GENERATION",
        "sort_order": 7,
        "metadata": {
            "description": "Business development assessment. Focus on identifying potential leads, extracting professional contact info, and analyzing market opportunities."
        },
        "is_active": true
    },
    {
        "id": 8,
        "type": "question_type",
        "name": "Contact Details",
        "code": "CONTACT_DETAILS",
        "sort_order": 8,
        "metadata": {
            "description": "Data entry and accuracy assessment. Questions focused on correctly capturing and formatting professional contact information like emails and addresses."
        },
        "is_active": true
    },
    {
        "id": 9,
        "type": "exam_level",
        "name": "Fresher",
        "code": "FRESHER",
        "sort_order": 9,
        "metadata": {
            "description": "Fundamental concepts and basic theoretical questions for entry-level candidates. Focus on clarity and core academic principles."
        },
        "is_active": true
    },
    {
        "id": 10,
        "type": "exam_level",
        "name": "Quality Assurance",
        "code": "QA",
        "sort_order": 10,
        "metadata": {
            "description": "Questions focused on testing lifecycles, bug reporting standards, automation vs manual testing, and high-level quality metrics."
        },
        "is_active": true
    },
    {
        "id": 11,
        "type": "exam_level",
        "name": "Team Lead",
        "code": "TEAMLEAD",
        "sort_order": 11,
        "metadata": {
            "description": "Leadership and strategy scenarios. Focus on team conflict resolution, project planning, resource optimization, and mentoring."
        },
        "is_active": true
    },
    {
        "id": 12,
        "type": "subject",
        "name": "Written",
        "code": "WRITTEN",
        "sort_order": 12,
        "metadata": {
            "description": "Assessment of professional business writing skills. Focus on email drafting, report writing, and formal corporate communication.",
            "is_exclusive": false
        },
        "is_active": true
    },
    {
        "id": 13,
        "type": "subject",
        "name": "Comprehension",
        "code": "COMPREHENSION",
        "sort_order": 13,
        "metadata": {
            "description": "Ability to understand written passages.",
            "is_exclusive": false
        },
        "is_active": true
    },
    {
        "id": 14,
        "type": "subject",
        "name": "English Grammar",
        "code": "ENGLISH_GRAMMAR",
        "sort_order": 14,
        "metadata": {
            "description": "Testing of grammatical rules.",
            "is_exclusive": false
        },
        "is_active": true
    },
    {
        "id": 15,
        "type": "subject",
        "name": "Aptitude",
        "code": "APTITUDE",
        "sort_order": 15,
        "metadata": {
            "description": "Logical reasoning, quantitative aptitude, and problem-solving. Focus on number series, probability, time-speed-distance, and logical deductions.",
            "is_exclusive": false
        },
        "is_active": true
    },
    {
        "id": 16,
        "type": "subject",
        "name": "Company Contact Details",
        "code": "COMPANY_CONTACT_DETAILS",
        "sort_order": 17,
        "metadata": {
            "description": "Knowledge regarding organizational contact structures, hierarchy, and professional data handling/formatting.",
            "is_exclusive": true
        },
        "is_active": true
    },
    {
        "id": 17,
        "type": "subject",
        "name": "Industry Awareness",
        "code": "INDUSTRY_AWARENESS",
        "sort_order": 16,
        "metadata": {
            "description": "General awareness concerning current global industry trends, market shifts, and emerging business technologies.",
            "is_exclusive": false
        },
        "is_active": true
    },
    {
        "id": 18,
        "type": "subject",
        "name": "Lead Generation",
        "code": "LEAD_GENERATION",
        "sort_order": 18,
        "metadata": {
            "description": "B2B prospecting and business development strategies. Focus on cold outreach and qualifying potential clients.",
            "is_exclusive": true
        },
        "is_active": true
    },
    {
        "id": 19,
        "type": "subject",
        "name": "Typing Test",
        "code": "TYPING_TEST",
        "sort_order": 19,
        "metadata": {
            "description": "Assessment of typing speed, accuracy, and endurance. Provide professional paragraphs with a mix of alphanumeric characters.",
            "is_exclusive": true
        },
        "is_active": true
    },
    {
        "id": 20,
        "type": "interview_result",
        "name": "Must Hire",
        "code": "MUST_HIRE",
        "sort_order": 20,
        "metadata": {
            "description": "Top tier candidate, highly recommended."
        },
        "is_active": true
    },
    {
        "id": 21,
        "type": "interview_result",
        "name": "Good to Go",
        "code": "GOOD_TO_GO",
        "sort_order": 21,
        "metadata": {
            "description": "Strong candidate, meets all primary requirements."
        },
        "is_active": true
    },
    {
        "id": 22,
        "type": "interview_result",
        "name": "Fit for Process",
        "code": "FIT_FOR_PROCESS",
        "sort_order": 22,
        "metadata": {
            "description": "Meets basic criteria to continue in the process."
        },
        "is_active": true
    },
    {
        "id": 23,
        "type": "interview_result",
        "name": "Can be Given a Chance",
        "code": "GIVEN_CHANCE",
        "sort_order": 23,
        "metadata": {
            "description": "Borderline candidate with potential."
        },
        "is_active": true
    },
    {
        "id": 24,
        "type": "interview_result",
        "name": "Not Fit - Try Other Task",
        "code": "NOT_FIT_OTHER",
        "sort_order": 24,
        "metadata": {
            "description": "Not suitable for this role but could fit elsewhere."
        },
        "is_active": true
    },
    {
        "id": 25,
        "type": "interview_result",
        "name": "Not at all fit",
        "code": "NOT_FIT",
        "sort_order": 25,
        "metadata": {
            "description": "Does not meet requirements."
        },
        "is_active": true
    },
    {
        "id": 26,
        "type": "family_relation",
        "name": "Father",
        "code": "FATHER",
        "sort_order": 32,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 27,
        "type": "family_relation",
        "name": "Mother",
        "code": "MOTHER",
        "sort_order": 33,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 28,
        "type": "family_relation",
        "name": "Husband",
        "code": "HUSBAND",
        "sort_order": 34,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 29,
        "type": "family_relation",
        "name": "Wife",
        "code": "WIFE",
        "sort_order": 35,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 30,
        "type": "family_relation",
        "name": "Son",
        "code": "SON",
        "sort_order": 36,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 31,
        "type": "family_relation",
        "name": "Daughter",
        "code": "DAUGHTER",
        "sort_order": 37,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 32,
        "type": "family_relation",
        "name": "Brother",
        "code": "BROTHER",
        "sort_order": 38,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 33,
        "type": "family_relation",
        "name": "Sister",
        "code": "SISTER",
        "sort_order": 39,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 34,
        "type": "family_relation",
        "name": "Guardian",
        "code": "GUARDIAN",
        "sort_order": 40,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 35,
        "type": "marital_status",
        "name": "Single",
        "code": "SINGLE",
        "sort_order": 41,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 36,
        "type": "marital_status",
        "name": "Married",
        "code": "MARRIED",
        "sort_order": 42,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 37,
        "type": "marital_status",
        "name": "Divorced",
        "code": "DIVORCED",
        "sort_order": 43,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 38,
        "type": "marital_status",
        "name": "Widowed",
        "code": "WIDOWED",
        "sort_order": 44,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 39,
        "type": "marital_status",
        "name": "Separated",
        "code": "SEPARATED",
        "sort_order": 45,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 40,
        "type": "education_category",
        "name": "10th / High School",
        "code": "HIGH_SCHOOL",
        "sort_order": 46,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 41,
        "type": "education_category",
        "name": "12th / Intermediate",
        "code": "INTERMEDIATE",
        "sort_order": 47,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 42,
        "type": "education_category",
        "name": "Diploma",
        "code": "DIPLOMA",
        "sort_order": 48,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 43,
        "type": "education_category",
        "name": "Bachelor's Degree",
        "code": "BACHELORS",
        "sort_order": 49,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 44,
        "type": "education_category",
        "name": "Master's Degree",
        "code": "MASTERS",
        "sort_order": 50,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 45,
        "type": "education_category",
        "name": "Ph.D. / Doctorate",
        "code": "DOCTORATE",
        "sort_order": 51,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 46,
        "type": "language",
        "name": "English",
        "code": "ENGLISH",
        "sort_order": 52,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 47,
        "type": "language",
        "name": "Hindi",
        "code": "HINDI",
        "sort_order": 53,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 48,
        "type": "religion",
        "name": "Hinduism",
        "code": "HINDUISM",
        "sort_order": 54,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 49,
        "type": "religion",
        "name": "Islam",
        "code": "ISLAM",
        "sort_order": 55,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 50,
        "type": "religion",
        "name": "Christianity",
        "code": "CHRISTIANITY",
        "sort_order": 56,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 51,
        "type": "religion",
        "name": "Sikhism",
        "code": "SIKHISM",
        "sort_order": 57,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 52,
        "type": "religion",
        "name": "Buddhism",
        "code": "BUDDHISM",
        "sort_order": 58,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 53,
        "type": "religion",
        "name": "Jainism",
        "code": "JAINISM",
        "sort_order": 59,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 54,
        "type": "religion",
        "name": "Other",
        "code": "OTHER",
        "sort_order": 60,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 55,
        "type": "social_category",
        "name": "General",
        "code": "GENERAL",
        "sort_order": 61,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 56,
        "type": "social_category",
        "name": "OBC",
        "code": "OBC",
        "sort_order": 62,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 57,
        "type": "social_category",
        "name": "SC",
        "code": "SC",
        "sort_order": 63,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 58,
        "type": "social_category",
        "name": "ST",
        "code": "ST",
        "sort_order": 64,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 59,
        "type": "social_category",
        "name": "EWS",
        "code": "EWS",
        "sort_order": 65,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 60,
        "type": "blood_group",
        "name": "A+",
        "code": "A_POSITIVE",
        "sort_order": 66,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 61,
        "type": "blood_group",
        "name": "A-",
        "code": "A_NEGATIVE",
        "sort_order": 67,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 62,
        "type": "blood_group",
        "name": "B+",
        "code": "B_POSITIVE",
        "sort_order": 68,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 63,
        "type": "blood_group",
        "name": "B-",
        "code": "B_NEGATIVE",
        "sort_order": 69,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 64,
        "type": "blood_group",
        "name": "O+",
        "code": "O_POSITIVE",
        "sort_order": 70,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 65,
        "type": "blood_group",
        "name": "O-",
        "code": "O_NEGATIVE",
        "sort_order": 71,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 66,
        "type": "blood_group",
        "name": "AB+",
        "code": "AB_POSITIVE",
        "sort_order": 72,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 67,
        "type": "blood_group",
        "name": "AB-",
        "code": "AB_NEGATIVE",
        "sort_order": 73,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 68,
        "type": "employment_type",
        "name": "Full-time",
        "code": "FULL_TIME",
        "sort_order": 74,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 69,
        "type": "employment_type",
        "name": "Part-time",
        "code": "PART_TIME",
        "sort_order": 75,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 70,
        "type": "employment_type",
        "name": "Contract",
        "code": "CONTRACT",
        "sort_order": 76,
        "metadata": null,
        "is_active": true
    },
    {
        "id": 71,
        "type": "employment_type",
        "name": "Internship",
        "code": "INTERNSHIP",
        "sort_order": 77,
        "metadata": null,
        "is_active": true
    }
]

def seed_classifications():
    db = SessionLocal()
    try:
        print("🚀 Seeding classifications...")
        total_seeded = 0
        total_updated = 0

        for item in CLASSIFICATIONS_DATA:
            existing = db.query(Classification).filter(
                (Classification.type == item["type"]) & (Classification.code == item["code"])
            ).first()

            if existing:
                existing.name = item["name"]
                existing.sort_order = item.get("sort_order", 0)
                existing.extra_metadata = item.get("metadata")
                existing.is_active = item.get("is_active", True)
                total_updated += 1
            else:
                cls_obj = Classification(
                    id=item["id"],
                    type=item["type"],
                    name=item["name"],
                    code=item["code"],
                    sort_order=item.get("sort_order", 0),
                    extra_metadata=item.get("metadata"),
                    is_active=item.get("is_active", True),
                )
                db.add(cls_obj)
                total_seeded += 1

        db.commit()
        print(f"✨ Classifications seeding complete! Added: {total_seeded}, Updated: {total_updated}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding classifications: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_classifications()
