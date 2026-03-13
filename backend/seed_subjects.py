from app.classifications.service import ClassificationService
from app.classifications.schemas import ClassificationCreate

# Comprehensive list of subjects from system and screenshots
subjects = [
    "English",
    "Excel",
    "Excel Test",
    "Company Details",
    "Company Contact Details Test",
    "Lead Generation",
    "Lead Generations Test",
    "Typing Test",
    "Real Estate",
    "Comprehension",
    "Written",
    "Grammar",
    "Aptitude",
    "Industry Awareness",
    "e-Commerce/Online Shopping",
    "Brand Awareness",
    "Food Industry",
    "Data Interpretation/Analytics"
]

service = ClassificationService()

def seed():
    print("Starting seeding subjects...")
    for name in subjects:
        # Generate a safe code: uppercase, replace spaces/special chars with underscores
        code = name.upper().replace(" ", "_").replace("-", "_").replace("/", "_").replace(".", "_").replace("'", "")
        
        try:
            payload = ClassificationCreate(
                type="subject",
                name=name,
                code=code,
                is_active=True
            )
            service.create(payload)
            print(f"✅ Added: {name}")
        except Exception as e:
            if "already exists" in str(e).lower():
                print(f"ℹ️ Skipped (Exists): {name}")
            else:
                print(f"❌ Error adding {name}: {str(e)}")

if __name__ == "__main__":
    seed()
