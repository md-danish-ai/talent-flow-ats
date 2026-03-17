from app.database.db import SessionLocal
from app.classifications.models import Classification

# Classification Data in Sequence: question_type, exam_level, subject
CLASSIFICATIONS = [
    # 1. Question Types
    {
        "type": "question_type",
        "name": "Multiple Choice Question",
        "code": "MULTIPLE_CHOICE",
    },
    {
        "type": "question_type",
        "name": "Image Multiple Choice",
        "code": "IMAGE_MULTIPLE_CHOICE",
    },
    {"type": "question_type", "name": "Subjective Question", "code": "SUBJECTIVE"},
    {"type": "question_type", "name": "Image Subjective", "code": "IMAGE_SUBJECTIVE"},
    {"type": "question_type", "name": "Passage Content", "code": "PASSAGE_CONTENT"},
    {"type": "question_type", "name": "Typing Test", "code": "TYPING_TEST"},
    {"type": "question_type", "name": "Lead Generation", "code": "LEAD_GENERATION"},
    {"type": "question_type", "name": "Contact Details", "code": "CONTACT_DETAILS"},
    # 2. Exam Levels
    {"type": "exam_level", "name": "Fresher", "code": "FRESHER"},
    {"type": "exam_level", "name": "Quality Assurance", "code": "QA"},
    {"type": "exam_level", "name": "Team Lead", "code": "TEAMLEAD"},
    # 3. Subjects
    {
        "type": "subject",
        "name": "Aptitude",
        "code": "APTITUDE",
        "metadata": {"description": "Logical reasoning and problem-solving."},
    },
    {
        "type": "subject",
        "name": "Brand Awareness",
        "code": "BRAND_AWARENESS",
        "metadata": {"description": "Knowledge about brand positioning."},
    },
    {
        "type": "subject",
        "name": "Company Contact Details Test",
        "code": "COMPANY_CONTACT_DETAILS_TEST",
        "metadata": {"description": "Testing accuracy in finding contact information."},
    },
    {
        "type": "subject",
        "name": "Company Details",
        "code": "COMPANY_DETAILS",
        "metadata": {
            "description": "Knowledge regarding company structure and history."
        },
    },
    {
        "type": "subject",
        "name": "Comprehension",
        "code": "COMPREHENSION",
        "metadata": {"description": "Ability to understand written passages."},
    },
    {
        "type": "subject",
        "name": "Data Interpretation & Analytics",
        "code": "DATA_INTERPRETATION_ANALYTICS",
        "metadata": {"description": "Analyze complex data sets."},
    },
    {
        "type": "subject",
        "name": "English",
        "code": "ENGLISH",
        "metadata": {
            "description": "Comprehensive assessment of English language proficiency."
        },
    },
    {
        "type": "subject",
        "name": "Excel",
        "code": "EXCEL",
        "metadata": {
            "description": "Proficient use of Microsoft Excel for data analysis."
        },
    },
    {
        "type": "subject",
        "name": "Food Industry",
        "code": "FOOD_INDUSTRY",
        "metadata": {"description": "Food safety and culinary trends."},
    },
    {
        "type": "subject",
        "name": "Grammar",
        "code": "GRAMMAR",
        "metadata": {"description": "Testing of grammatical rules."},
    },
    {
        "type": "subject",
        "name": "Industry Awareness",
        "code": "INDUSTRY_AWARENESS",
        "metadata": {"description": "Knowledge concerning current trends."},
    },
    {
        "type": "subject",
        "name": "Lead Generation",
        "code": "LEAD_GENERATION",
        "metadata": {"description": "Testing skills in identifying potential clients."},
    },
    {
        "type": "subject",
        "name": "Real Estate",
        "code": "REAL_ESTATE",
        "metadata": {"description": "Knowledge of property markets."},
    },
    {
        "type": "subject",
        "name": "Typing Test",
        "code": "TYPING_TEST",
        "metadata": {"description": "Assessment of typing speed and accuracy."},
    },
    {
        "type": "subject",
        "name": "Written",
        "code": "WRITTEN",
        "metadata": {"description": "Assessment of professional writing skills."},
    },
    {
        "type": "subject",
        "name": "e-Commerce & Online Shopping",
        "code": "E_COMMERCE_ONLINE_SHOPPING",
        "metadata": {"description": "Online retail operations."},
    },
]

# 4. Departments
DEPARTMENTS = [
    {"name": "KPO"},
    {"name": "BPO"},
    {"name": "QA"},
]


def seed():
    db = SessionLocal()
    from app.departments.models import Department

    print("🚀 Starting master data sync in sequence...")

    # Track codes to keep active
    current_key_codes = set()

    # 1-3. Sync Classifications
    for i, item in enumerate(CLASSIFICATIONS):
        code = item["code"]
        type_ = item["type"]
        name = item["name"]
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
            existing.sort_order = i
            existing.is_active = True
            print(f"✅ Updated [Classification]: [{type_}] {name}")
        else:
            try:
                new_cl = Classification(
                    type=type_,
                    name=name,
                    code=code,
                    extra_metadata=metadata,
                    sort_order=i,
                    is_active=True,
                )
                db.add(new_cl)
                print(f"➕ Added [Classification]: [{type_}] {name}")
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

    # Disable all other classifications for these types NOT in the allowed list
    print("\n🔒 Disabling unauthorized records...")
    for type_ in set(i["type"] for i in CLASSIFICATIONS):
        allowed_codes_for_type = [
            i["code"] for i in CLASSIFICATIONS if i["type"] == type_
        ]
        disabled_count = (
            db.query(Classification)
            .filter(
                Classification.type == type_,
                ~Classification.code.in_(allowed_codes_for_type),
            )
            .update({"is_active": False}, synchronize_session=False)
        )
        print(f"🚫 Disabled {disabled_count} other records for type: {type_}")

    db.commit()
    print("\n✨ Database successfully synced with the final authorized list.")
    db.close()


if __name__ == "__main__":
    seed()
