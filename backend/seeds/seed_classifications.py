# ruff: noqa
from app.database.db import SessionLocal
from app.classifications.models import Classification

# Classification Data in Sequence: question_type, exam_level, subject
CLASSIFICATIONS = [
    # 1. Question Types
    {
        "type": "question_type",
        "name": "Multiple Choice Question",
        "code": "MULTIPLE_CHOICE",
        "metadata": {
            "description": "Standard professional recruitment questions with 4 distinct options (A, B, C, D). Focus on clear, unambiguous questions with one definitively correct answer and plausible distractors."
        }
    },
    {
        "type": "question_type",
        "name": "Image Multiple Choice",
        "code": "IMAGE_MULTIPLE_CHOICE",
        "metadata": {
            "description": "Visual-centric MCQ. The question MUST directly reference the visual elements (charts, diagrams, or scenarios) described in the 'image_prompt'. Focus on observational and data-reading skills."
        }
    },
    {
        "type": "question_type", 
        "name": "Subjective Question", 
        "code": "SUBJECTIVE",
        "metadata": {
            "description": "Open-ended questions assessing critical thinking and domain expertise. Require the candidate to provide a detailed written explanation of 2-3 sentences."
        }
    },
    {"type": "question_type", "name": "Image Subjective", "code": "IMAGE_SUBJECTIVE", "metadata": {"description": "Analytic questions based on a visual scenario. Candidate must observe the 'image_prompt' content and provide a descriptive technical or strategic answer."}},
    {
        "type": "question_type", 
        "name": "Passage Content", 
        "code": "PASSAGE_CONTENT",
        "metadata": {
            "description": "Reading comprehension. First, provide a professional 150-200 word passage in the 'passage' field, then create a question based on it with 4 MCQ options."
        }
    },
    {"type": "question_type", "name": "Typing Test", "code": "TYPING_TEST", "metadata": {"description": "Paragraph-based assessment. Generate a structured text block (200-300 words) with professional content to test candidate's typing speed and accuracy."}},
    {"type": "question_type", "name": "Lead Generation", "code": "LEAD_GENERATION", "metadata": {"description": "Business development assessment. Focus on identifying potential leads, extracting professional contact info, and analyzing market opportunities."}},
    {"type": "question_type", "name": "Contact Details", "code": "CONTACT_DETAILS", "metadata": {"description": "Data entry and accuracy assessment. Questions focused on correctly capturing and formatting professional contact information like emails and addresses."}},
    # 2. Exam Levels
    # 2. Exam Levels
    {
        "type": "exam_level", 
        "name": "Fresher", 
        "code": "FRESHER",
        "metadata": {
            "description": "Fundamental concepts and basic theoretical questions for entry-level candidates. Focus on clarity and core academic principles."
        }
    },
    {
        "type": "exam_level", 
        "name": "Quality Assurance", 
        "code": "QA",
        "metadata": {
            "description": "Questions focused on testing lifecycles, bug reporting standards, automation vs manual testing, and high-level quality metrics."
        }
    },
    {
        "type": "exam_level", 
        "name": "Team Lead", 
        "code": "TEAMLEAD",
        "metadata": {
            "description": "Leadership and strategy scenarios. Focus on team conflict resolution, project planning, resource optimization, and mentoring."
        }
    },
    # 3. Subjects
    {
        "type": "subject",
        "name": "Aptitude",
        "code": "APTITUDE",
        "metadata": {
            "is_exclusive": False,
            "description": "Logical reasoning, quantitative aptitude, and problem-solving. Focus on number series, probability, time-speed-distance, and logical deductions."
        },
    },
    {
        "type": "subject",
        "name": "Brand Awareness",
        "code": "BRAND_AWARENESS",
        "metadata": {
            "is_exclusive": False,
            "description": "Knowledge about brand identity, market positioning, target audience analysis, and corporate communication values."
        },
    },
    {
        "type": "subject",
        "name": "Company Contact Details",
        "code": "COMPANY_CONTACT_DETAILS",
        "metadata": {
            "is_exclusive": True,
            "description": "Knowledge regarding organizational contact structures, hierarchy, and professional data handling/formatting."
        },
    },
    {
        "type": "subject",
        "name": "Comprehension",
        "code": "COMPREHENSION",
        "metadata": {
            "is_exclusive": False,
            "description": "Ability to understand written passages."
        },
    },
    {
        "type": "subject",
        "name": "Data Interpretation & Analytics",
        "code": "DATA_INTERPRETATION_ANALYTICS",
        "metadata": {
            "is_exclusive": False,
            "description": "Analyze complex data sets."
        },
    },
    {
        "type": "subject",
        "name": "English",
        "code": "ENGLISH",
        "metadata": {
            "is_exclusive": False,
            "description": "Professional English proficiency assessment including grammar, vocabulary, sentence structuring, and business communication."
        },
    },
    {
        "type": "subject",
        "name": "Food Industry",
        "code": "FOOD_INDUSTRY",
        "metadata": {
            "is_exclusive": False,
            "description": "Food safety and culinary trends."
        },
    },
    {
        "type": "subject",
        "name": "Grammar",
        "code": "GRAMMAR",
        "metadata": {
            "is_exclusive": False,
            "description": "Testing of grammatical rules."
        },
    },
    {
        "type": "subject",
        "name": "Industry Awareness",
        "code": "INDUSTRY_AWARENESS",
        "metadata": {
            "is_exclusive": False,
            "description": "General awareness concerning current global industry trends, market shifts, and emerging business technologies."
        },
    },
    {
        "type": "subject",
        "name": "Lead Generation",
        "code": "LEAD_GENERATION",
        "metadata": {
            "is_exclusive": True,
            "description": "B2B prospecting and business development strategies. Focus on cold outreach and qualifying potential clients."
        },
    },
    {
        "type": "subject",
        "name": "Real Estate",
        "code": "REAL_ESTATE",
        "metadata": {
            "is_exclusive": False,
            "description": "Knowledge of property markets."
        },
    },
    {
        "type": "subject",
        "name": "Typing Test",
        "code": "TYPING_TEST",
        "metadata": {
            "is_exclusive": True,
            "description": "Assessment of typing speed, accuracy, and endurance. Provide professional paragraphs with a mix of alphanumeric characters."
        },
    },
    {
        "type": "subject",
        "name": "Written",
        "code": "WRITTEN",
        "metadata": {
            "is_exclusive": False,
            "description": "Assessment of professional business writing skills. Focus on email drafting, report writing, and formal corporate communication."
        },
    },
    {
        "type": "subject",
        "name": "e-Commerce & Online Shopping",
        "code": "E_COMMERCE_ONLINE_SHOPPING",
        "metadata": {
            "is_exclusive": False,
            "description": "Online retail operations."
        },
    },
    # 4. Interview Results
    {
        "type": "interview_result",
        "name": "Must Hire",
        "code": "MUST_HIRE",
        "metadata": {"description": "Top tier candidate, highly recommended."},
    },
    {
        "type": "interview_result",
        "name": "Good to Go",
        "code": "GOOD_TO_GO",
        "metadata": {"description": "Strong candidate, meets all primary requirements."},
    },
    {
        "type": "interview_result",
        "name": "Fit for Process",
        "code": "FIT_FOR_PROCESS",
        "metadata": {"description": "Meets basic criteria to continue in the process."},
    },
    {
        "type": "interview_result",
        "name": "Can be Given a Chance",
        "code": "GIVEN_CHANCE",
        "metadata": {"description": "Borderline candidate with potential."},
    },
    {
        "type": "interview_result",
        "name": "Not Fit - Try Other Task",
        "code": "NOT_FIT_OTHER",
        "metadata": {
            "description": "Not suitable for this role but could fit elsewhere."
        },
    },
    {
        "type": "interview_result",
        "name": "Not at all fit",
        "code": "NOT_FIT",
        "metadata": {"description": "Does not meet requirements."},
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
            existing.is_active = item.get("is_active", True)
            print(f"✅ Updated [Classification]: [{type_}] {name}")
        else:
            try:
                new_cl = Classification(
                    type=type_,
                    name=name,
                    code=code,
                    extra_metadata=metadata,
                    sort_order=i,
                    is_active=item.get("is_active", True),
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

    # ── Hard DELETE stale entries not in the allowed list ──────────────────
    # This permanently removes old migration-seeded codes that are no longer
    # part of the official classification list (e.g. COMPANY_CONTACT_DETAILS_TEST,
    # COMPANY_DETAILS) so they don't appear as disabled ghost rows.
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
                f"  🗑️  Deleted [{record.type}] {record.code} — \"{record.name}\"")

        if not stale_records:
            print(f"  ✅ No stale records for type: {type_}")

    db.commit()
    print("\n✨ Database successfully synced with the final authorized list.")
    db.close()


if __name__ == "__main__":
    seed()
