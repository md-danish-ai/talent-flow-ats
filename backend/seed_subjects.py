from app.classifications.service import ClassificationService
from app.classifications.schemas import ClassificationCreate
from app.database.db import SessionLocal
from app.classifications.models import Classification

# Final authorized list of subjects with their proper descriptions
ALLOWED_SUBJECTS = {
    "Aptitude": "Assessment of logical reasoning, problem-solving skills, and mathematical ability.",
    "Brand Awareness": "Evaluation of knowledge about brand positioning, marketing strategies, and consumer perception.",
    "Company Contact Details Test": "Testing accuracy in finding and validating contact information for businesses.",
    "Company Details": "Evaluation of knowledge regarding company structure, history, services, and organizational hierarchy.",
    "Comprehension": "Evaluation of ability to understand, interpret, and draw conclusions from written passages.",
    "Data Interpretation & Analytics": "Assessment of ability to analyze complex data sets and extract actionable insights.",
    "English": "Comprehensive assessment of English language proficiency, including grammar, vocabulary, and reading comprehension.",
    "Excel": "Proficient use of Microsoft Excel for data analysis, reporting, and administrative tasks.",
    "Food Industry": "Testing knowledge of food safety, culinary trends, and hospitality management.",
    "Grammar": "Detailed testing of grammatical rules, sentence structure, and punctuation.",
    "Industry Awareness": "Evaluation of knowledge concerning current trends, key players, and developments in the specific industry.",
    "Lead Generation": "Testing skills in identifying potential clients, gathering contact information, and understanding sales funnels.",
    "Real Estate": "Testing knowledge of property markets, real estate terminology, and industry-specific regulations.",
    "Typing Test": "Assessment of typing speed (WPM) and accuracy to ensure data entry efficiency.",
    "Written": "Assessment of professional writing skills, including clarity, structure, and tone.",
    "e-Commerce & Online Shopping": "Testing understanding of online retail operations, customer journey, and digital marketplaces."
}

def generate_code(name: str):
    """Utility to generate consistent codes."""
    return name.upper().replace(" ", "_").replace("-", "_").replace("/", "_").replace(".", "_").replace("&", "").replace("'", "").replace("__", "_").strip("_")

def seed():
    db = SessionLocal()
    service = ClassificationService()
    
    print("🚀 Syncing subjects and descriptions...")
    
    allowed_codes = []
    
    for name, description in ALLOWED_SUBJECTS.items():
        code = generate_code(name)
        allowed_codes.append(code)
        
        # Check if subject exists
        existing = db.query(Classification).filter(
            Classification.type == 'subject',
            Classification.code == code
        ).first()
        
        if existing:
            # Update existing
            metadata = existing.extra_metadata or {}
            if not isinstance(metadata, dict):
                metadata = {}
            metadata["description"] = description
            existing.extra_metadata = metadata
            existing.is_active = True
            existing.name = name  # Ensure name is exactly as listed
            print(f"✅ Updated & Activated: {name}")
        else:
            # Create new
            try:
                payload = ClassificationCreate(
                    type="subject",
                    name=name,
                    code=code,
                    is_active=True,
                    metadata={"description": description}
                )
                service.create(payload)
                print(f"➕ Added: {name}")
            except Exception as e:
                print(f"❌ Error adding {name}: {str(e)}")
    
    # Disable all other subjects not in the allowed list
    print("\n🔒 Disabling unauthorized subjects...")
    disabled_count = db.query(Classification).filter(
        Classification.type == 'subject',
        ~Classification.code.in_(allowed_codes)
    ).update({"is_active": False}, synchronize_session=False)
    
    db.commit()
    print(f"🚫 Disabled {disabled_count} other subjects.")
    print("\n✨ Database successfully synced with the final authorized list.")
    db.close()

if __name__ == "__main__":
    seed()
