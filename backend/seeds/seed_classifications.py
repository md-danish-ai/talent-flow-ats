# ruff: noqa
from app.database.db import SessionLocal
from app.classifications.models import Classification
from app.departments.models import Department

# Classification Data in Global Sequence (1 to 77)
CLASSIFICATIONS = [
    # 1. Question Types (1 - 8)
    {
        "type": "question_type",
        "name": "Multiple Choice Question",
        "code": "MULTIPLE_CHOICE",
        "sort_order": 1,
        "metadata": {
            "description": "Standard professional recruitment questions with 4 distinct options (A, B, C, D). Focus on clear, unambiguous questions with one definitively correct answer and plausible distractors."
        },
    },
    {
        "type": "question_type",
        "name": "Image Multiple Choice",
        "code": "IMAGE_MULTIPLE_CHOICE",
        "sort_order": 2,
        "metadata": {
            "description": "Visual-centric MCQ. The question MUST directly reference the visual elements (charts, diagrams, or scenarios) described in the 'image_prompt'. Focus on observational and data-reading skills."
        },
    },
    {
        "type": "question_type",
        "name": "Subjective Question",
        "code": "SUBJECTIVE",
        "sort_order": 3,
        "metadata": {
            "description": "Open-ended questions assessing critical thinking and domain expertise. Require the candidate to provide a detailed written explanation of 2-3 sentences."
        },
    },
    {
        "type": "question_type",
        "name": "Image Subjective",
        "code": "IMAGE_SUBJECTIVE",
        "sort_order": 4,
        "metadata": {
            "description": "Analytic questions based on a visual scenario. Candidate must observe the 'image_prompt' content and provide a descriptive technical or strategic answer."
        },
    },
    {
        "type": "question_type",
        "name": "Passage Content",
        "code": "PASSAGE_CONTENT",
        "sort_order": 5,
        "metadata": {
            "description": "Reading comprehension. First, provide a professional 150-200 word passage in the 'passage' field, then create a question based on it with 4 MCQ options."
        },
    },
    {
        "type": "question_type",
        "name": "Typing Test",
        "code": "TYPING_TEST",
        "sort_order": 6,
        "metadata": {
            "description": "Paragraph-based assessment. Generate a structured text block (200-300 words) with professional content to test candidate's typing speed and accuracy."
        },
    },
    {
        "type": "question_type",
        "name": "Lead Generation",
        "code": "LEAD_GENERATION",
        "sort_order": 7,
        "metadata": {
            "description": "Business development assessment. Focus on identifying potential leads, extracting professional contact info, and analyzing market opportunities."
        },
    },
    {
        "type": "question_type",
        "name": "Contact Details",
        "code": "CONTACT_DETAILS",
        "sort_order": 8,
        "metadata": {
            "description": "Data entry and accuracy assessment. Questions focused on correctly capturing and formatting professional contact information like emails and addresses."
        },
    },
    # 2. Exam Levels (9 - 11)
    {
        "type": "exam_level",
        "name": "Fresher",
        "code": "FRESHER",
        "sort_order": 9,
        "metadata": {
            "description": "Fundamental concepts and basic theoretical questions for entry-level candidates. Focus on clarity and core academic principles."
        },
    },
    {
        "type": "exam_level",
        "name": "Quality Assurance",
        "code": "QA",
        "sort_order": 10,
        "metadata": {
            "description": "Questions focused on testing lifecycles, bug reporting standards, automation vs manual testing, and high-level quality metrics."
        },
    },
    {
        "type": "exam_level",
        "name": "Team Lead",
        "code": "TEAMLEAD",
        "sort_order": 11,
        "metadata": {
            "description": "Leadership and strategy scenarios. Focus on team conflict resolution, project planning, resource optimization, and mentoring."
        },
    },
    # 3. Subjects (12 - 25)
    {
        "type": "subject",
        "name": "Written",
        "code": "WRITTEN",
        "sort_order": 12,
        "metadata": {
            "is_exclusive": False,
            "description": "Assessment of professional business writing skills. Focus on email drafting, report writing, and formal corporate communication.",
        },
    },
    {
        "type": "subject",
        "name": "Comprehension",
        "code": "COMPREHENSION",
        "sort_order": 13,
        "metadata": {
            "is_exclusive": False,
            "description": "Ability to understand written passages.",
        },
    },
    {
        "type": "subject",
        "name": "Grammar",
        "code": "GRAMMAR",
        "sort_order": 14,
        "metadata": {
            "is_exclusive": False,
            "description": "Testing of grammatical rules.",
        },
    },
    {
        "type": "subject",
        "name": "Aptitude",
        "code": "APTITUDE",
        "sort_order": 15,
        "metadata": {
            "is_exclusive": False,
            "description": "Logical reasoning, quantitative aptitude, and problem-solving. Focus on number series, probability, time-speed-distance, and logical deductions.",
        },
    },
    {
        "type": "subject",
        "name": "Brand Awareness",
        "code": "BRAND_AWARENESS",
        "sort_order": 16,
        "metadata": {
            "is_exclusive": False,
            "description": "Knowledge about brand identity, market positioning, target audience analysis, and corporate communication values.",
        },
    },
    {
        "type": "subject",
        "name": "Company Contact Details",
        "code": "COMPANY_CONTACT_DETAILS",
        "sort_order": 17,
        "metadata": {
            "is_exclusive": True,
            "description": "Knowledge regarding organizational contact structures, hierarchy, and professional data handling/formatting.",
        },
    },
    {
        "type": "subject",
        "name": "Data Interpretation & Analytics",
        "code": "DATA_INTERPRETATION_ANALYTICS",
        "sort_order": 18,
        "metadata": {
            "is_exclusive": False,
            "description": "Analyze complex data sets.",
        },
    },
    {
        "type": "subject",
        "name": "English",
        "code": "ENGLISH",
        "sort_order": 19,
        "metadata": {
            "is_exclusive": False,
            "description": "Professional English proficiency assessment including grammar, vocabulary, sentence structuring, and business communication.",
        },
    },
    {
        "type": "subject",
        "name": "Food Industry",
        "code": "FOOD_INDUSTRY",
        "sort_order": 20,
        "metadata": {
            "is_exclusive": False,
            "description": "Food safety and culinary trends.",
        },
    },
    {
        "type": "subject",
        "name": "Industry Awareness",
        "code": "INDUSTRY_AWARENESS",
        "sort_order": 21,
        "metadata": {
            "is_exclusive": False,
            "description": "General awareness concerning current global industry trends, market shifts, and emerging business technologies.",
        },
    },
    {
        "type": "subject",
        "name": "Real Estate",
        "code": "REAL_ESTATE",
        "sort_order": 22,
        "metadata": {
            "is_exclusive": False,
            "description": "Knowledge of property markets.",
        },
    },
    {
        "type": "subject",
        "name": "Lead Generation",
        "code": "LEAD_GENERATION",
        "sort_order": 23,
        "metadata": {
            "is_exclusive": True,
            "description": "B2B prospecting and business development strategies. Focus on cold outreach and qualifying potential clients.",
        },
    },
    {
        "type": "subject",
        "name": "Typing Test",
        "code": "TYPING_TEST",
        "sort_order": 24,
        "metadata": {
            "is_exclusive": True,
            "description": "Assessment of typing speed, accuracy, and endurance. Provide professional paragraphs with a mix of alphanumeric characters.",
        },
    },
    {
        "type": "subject",
        "name": "e-Commerce & Online Shopping",
        "code": "E_COMMERCE_ONLINE_SHOPPING",
        "sort_order": 25,
        "metadata": {
            "is_exclusive": False,
            "description": "Online retail operations.",
        },
    },
    # 4. Interview Results (26 - 31)
    {
        "type": "interview_result",
        "name": "Must Hire",
        "code": "MUST_HIRE",
        "sort_order": 26,
        "metadata": {"description": "Top tier candidate, highly recommended."},
    },
    {
        "type": "interview_result",
        "name": "Good to Go",
        "code": "GOOD_TO_GO",
        "sort_order": 27,
        "metadata": {
            "description": "Strong candidate, meets all primary requirements."
        },
    },
    {
        "type": "interview_result",
        "name": "Fit for Process",
        "code": "FIT_FOR_PROCESS",
        "sort_order": 28,
        "metadata": {"description": "Meets basic criteria to continue in the process."},
    },
    {
        "type": "interview_result",
        "name": "Can be Given a Chance",
        "code": "GIVEN_CHANCE",
        "sort_order": 29,
        "metadata": {"description": "Borderline candidate with potential."},
    },
    {
        "type": "interview_result",
        "name": "Not Fit - Try Other Task",
        "code": "NOT_FIT_OTHER",
        "sort_order": 30,
        "metadata": {
            "description": "Not suitable for this role but could fit elsewhere."
        },
    },
    {
        "type": "interview_result",
        "name": "Not at all fit",
        "code": "NOT_FIT",
        "sort_order": 31,
        "metadata": {"description": "Does not meet requirements."},
    },
    # 5. Family Relations (32 - 40)
    {"type": "family_relation", "code": "FATHER",
        "name": "Father", "sort_order": 32},
    {"type": "family_relation", "code": "MOTHER",
        "name": "Mother", "sort_order": 33},
    {"type": "family_relation", "code": "HUSBAND",
        "name": "Husband", "sort_order": 34},
    {"type": "family_relation", "code": "WIFE", "name": "Wife", "sort_order": 35},
    {"type": "family_relation", "code": "SON", "name": "Son", "sort_order": 36},
    {"type": "family_relation", "code": "DAUGHTER",
        "name": "Daughter", "sort_order": 37},
    {"type": "family_relation", "code": "BROTHER",
        "name": "Brother", "sort_order": 38},
    {"type": "family_relation", "code": "SISTER",
        "name": "Sister", "sort_order": 39},
    {"type": "family_relation", "code": "GUARDIAN",
        "name": "Guardian", "sort_order": 40},
    # 6. Marital Status (41 - 45)
    {"type": "marital_status", "code": "SINGLE",
        "name": "Single", "sort_order": 41},
    {"type": "marital_status", "code": "MARRIED",
        "name": "Married", "sort_order": 42},
    {"type": "marital_status", "code": "DIVORCED",
        "name": "Divorced", "sort_order": 43},
    {"type": "marital_status", "code": "WIDOWED",
        "name": "Widowed", "sort_order": 44},
    {"type": "marital_status", "code": "SEPARATED",
        "name": "Separated", "sort_order": 45},
    # 7. Education Category (46 - 51)
    {"type": "education_category", "code": "HIGH_SCHOOL",
        "name": "10th / High School", "sort_order": 46},
    {"type": "education_category", "code": "INTERMEDIATE",
        "name": "12th / Intermediate", "sort_order": 47},
    {"type": "education_category", "code": "DIPLOMA",
        "name": "Diploma", "sort_order": 48},
    {"type": "education_category", "code": "BACHELORS",
        "name": "Bachelor's Degree", "sort_order": 49},
    {"type": "education_category", "code": "MASTERS",
        "name": "Master's Degree", "sort_order": 50},
    {"type": "education_category", "code": "DOCTORATE",
        "name": "Ph.D. / Doctorate", "sort_order": 51},
    # 8. Language (52 - 53)
    {"type": "language", "code": "ENGLISH", "name": "English", "sort_order": 52},
    {"type": "language", "code": "HINDI", "name": "Hindi", "sort_order": 53},
    # 9. Religion (54 - 60)
    {"type": "religion", "code": "HINDUISM", "name": "Hinduism", "sort_order": 54},
    {"type": "religion", "code": "ISLAM", "name": "Islam", "sort_order": 55},
    {"type": "religion", "code": "CHRISTIANITY",
        "name": "Christianity", "sort_order": 56},
    {"type": "religion", "code": "SIKHISM", "name": "Sikhism", "sort_order": 57},
    {"type": "religion", "code": "BUDDHISM", "name": "Buddhism", "sort_order": 58},
    {"type": "religion", "code": "JAINISM", "name": "Jainism", "sort_order": 59},
    {"type": "religion", "code": "OTHER", "name": "Other", "sort_order": 60},
    # 10. Social Category (61 - 65)
    {"type": "social_category", "code": "GENERAL",
        "name": "General", "sort_order": 61},
    {"type": "social_category", "code": "OBC", "name": "OBC", "sort_order": 62},
    {"type": "social_category", "code": "SC", "name": "SC", "sort_order": 63},
    {"type": "social_category", "code": "ST", "name": "ST", "sort_order": 64},
    {"type": "social_category", "code": "EWS", "name": "EWS", "sort_order": 65},
    # 11. Blood Group (66 - 73)
    {"type": "blood_group", "code": "A_POSITIVE", "name": "A+", "sort_order": 66},
    {"type": "blood_group", "code": "A_NEGATIVE", "name": "A-", "sort_order": 67},
    {"type": "blood_group", "code": "B_POSITIVE", "name": "B+", "sort_order": 68},
    {"type": "blood_group", "code": "B_NEGATIVE", "name": "B-", "sort_order": 69},
    {"type": "blood_group", "code": "O_POSITIVE", "name": "O+", "sort_order": 70},
    {"type": "blood_group", "code": "O_NEGATIVE", "name": "O-", "sort_order": 71},
    {"type": "blood_group", "code": "AB_POSITIVE", "name": "AB+", "sort_order": 72},
    {"type": "blood_group", "code": "AB_NEGATIVE", "name": "AB-", "sort_order": 73},
    # 12. Employment Type (74 - 77)
    {"type": "employment_type", "code": "FULL_TIME",
        "name": "Full-time", "sort_order": 74},
    {"type": "employment_type", "code": "PART_TIME",
        "name": "Part-time", "sort_order": 75},
    {"type": "employment_type", "code": "CONTRACT",
        "name": "Contract", "sort_order": 76},
    {"type": "employment_type", "code": "INTERNSHIP",
        "name": "Internship", "sort_order": 77},
]

# Departments
DEPARTMENTS = [
    {"name": "KPO"},
    {"name": "BPO"},
    {"name": "QA"},
    {"name": "Software"},
]


def seed():
    db = SessionLocal()

    print("🚀 Starting master data sync in sequence...")

    # Track codes to keep active
    current_key_codes = set()

    # 1-3. Sync Classifications
    for i, item in enumerate(CLASSIFICATIONS):
        code = item["code"]
        type_ = item["type"]
        name = item["name"]
        sort_order = item.get("sort_order", i + 1)
        metadata = item.get("metadata", {})

        current_key_codes.add((type_, code))

        # Check if exists
        existing = (
            db.query(Classification)
            .filter(Classification.type == type_, Classification.code == code)
            .first()
        )

        if existing:
            existing.name = name
            existing.extra_metadata = metadata
            existing.sort_order = sort_order
            existing.is_active = item.get("is_active", True)
            print(
                f"✅ Updated [Classification]: [{type_}] {name} (sort_order={sort_order})"
            )
        else:
            try:
                new_cl = Classification(
                    type=type_,
                    name=name,
                    code=code,
                    extra_metadata=metadata,
                    sort_order=sort_order,
                    is_active=item.get("is_active", True),
                )
                db.add(new_cl)
                print(
                    f"➕ Added [Classification]: [{type_}] {name} (sort_order={sort_order})"
                )
            except Exception as e:
                print(f"❌ Error adding classification {name}: {str(e)}")

    db.commit()

    # 4. Sync Departments
    print("\n🏢 Syncing departments...")
    allowed_departments = [d["name"] for d in DEPARTMENTS]
    for dept_data in DEPARTMENTS:
        name = dept_data["name"]
        existing = db.query(Department).filter(Department.name == name).first()
        if existing:
            existing.is_active = True
            print(f"✅ Updated [Department]: {name}")
        else:
            new_dept = Department(name=name, is_active=True)
            db.add(new_dept)
            print(f"➕ Added [Department]: {name}")

    # Disable others
    db.query(Department).filter(~Department.name.in_(allowed_departments)).update(
        {"is_active": False}, synchronize_session=False
    )

    db.commit()

    # ── Hard DELETE stale entries not in the allowed list ──────────────────
    print("\n🗑️  Removing stale (unauthorized) classification records...")
    for type_ in set(i["type"] for i in CLASSIFICATIONS):
        allowed_codes_for_type = [
            i["code"] for i in CLASSIFICATIONS if i["type"] == type_
        ]
        stale_records = (
            db.query(Classification)
            .filter(
                Classification.type == type_,
                ~Classification.code.in_(allowed_codes_for_type),
            )
            .all()
        )
        for record in stale_records:
            db.delete(record)
            print(
                f'  🗑️  Deleted [{record.type}] {record.code} — "{record.name}"')

        if not stale_records:
            print(f"  ✅ No stale records for type: {type_}")

    db.commit()
    print("\n✨ Database successfully synced with the final authorized list.")
    db.close()


if __name__ == "__main__":
    seed()
