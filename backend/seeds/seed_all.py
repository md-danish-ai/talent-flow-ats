# ruff: noqa
# Auto-generated master seed runner on 2026-08-07 10:01:39
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from seeds.seed_departments import seed_departments
from seeds.seed_classifications import seed_classifications
from seeds.seed_users import seed_users
from seeds.seed_questions import seed_questions
# from seeds.seed_papers import seed_papers
# from seeds.seed_auto_rules import seed_auto_rules


def seed_all():
    print("==================================================")
    print("🌱 STARTING FULL DATABASE SEEDING PROCESS")
    print("==================================================")

    seed_departments()
    seed_classifications()
    seed_users()
    seed_questions()
    # seed_papers()
    # seed_auto_rules()

    print("==================================================")
    print("🎉 ALL SEEDS COMPLETED SUCCESSFULLY!")
    print("==================================================")


if __name__ == "__main__":
    seed_all()
