# ruff: noqa
# Auto-generated seed file from database on 2026-08-06 18:15:08
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

true = True
false = False
null = None

from app.database.db import SessionLocal
from app.questions.models import Question
from app.answer.models import QuestionAnswer
from sqlalchemy.orm.attributes import flag_modified

QUESTIONS_DATA = [
    {
        "id": 1,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "The sum of the ages of a mother and her daughter is 50 years. Five years ago, the mother's age was four times the daughter's age. What will be the daughter's age after 5 years?",
        "image_url": null,
        "passage": null,
        "marks": 1,
        "options": [
            {
                "is_correct": false,
                "option_text": "15 years",
                "option_label": "A"
            },
            {
                "is_correct": true,
                "option_text": "18 years",
                "option_label": "B"
            },
            {
                "is_correct": false,
                "option_text": "20 years",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "23 years",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 2,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "A museum has an average of 480 visitors on Wednesdays and 210 on other days. The average number of visitors per day in a month of 30 days beginning with a Wednesday is:",
        "image_url": null,
        "passage": null,
        "marks": 1,
        "options": [
            {
                "is_correct": false,
                "option_text": "230",
                "option_label": "A"
            },
            {
                "is_correct": false,
                "option_text": "245",
                "option_label": "B"
            },
            {
                "is_correct": true,
                "option_text": "255",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "260",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 3,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "A trader buys a bicycle for Rs. 1,800 in cash and sells it for Rs. 2,090 at a credit of 1 year. If the rate of interest is 10% per annum, the trader gains:",
        "image_url": null,
        "passage": null,
        "marks": 1,
        "options": [
            {
                "is_correct": false,
                "option_text": "Rs. 80",
                "option_label": "A"
            },
            {
                "is_correct": true,
                "option_text": "Rs. 100",
                "option_label": "B"
            },
            {
                "is_correct": false,
                "option_text": "Rs. 120",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "Rs. 150",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 4,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "The average weight of 10 persons increases by 3 kg when a new person replaces one of them weighing 60 kg. What is the weight of the new person?",
        "image_url": null,
        "passage": null,
        "marks": 1,
        "options": [
            {
                "is_correct": false,
                "option_text": "85 kg",
                "option_label": "A"
            },
            {
                "is_correct": false,
                "option_text": "88 kg",
                "option_label": "B"
            },
            {
                "is_correct": true,
                "option_text": "90 kg",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "95 kg",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 5,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "Pick the odd one out:",
        "image_url": null,
        "passage": null,
        "marks": 1,
        "options": [
            {
                "is_correct": false,
                "option_text": "Sparrow",
                "option_label": "A"
            },
            {
                "is_correct": false,
                "option_text": "Eagle",
                "option_label": "B"
            },
            {
                "is_correct": true,
                "option_text": "Ostrich",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "Pigeon",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 6,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "Pick the odd one out:",
        "image_url": null,
        "passage": null,
        "marks": 1,
        "options": [
            {
                "is_correct": false,
                "option_text": "BDFH",
                "option_label": "A"
            },
            {
                "is_correct": false,
                "option_text": "CEGI",
                "option_label": "B"
            },
            {
                "is_correct": true,
                "option_text": "ILNP",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "MOQS",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 7,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "Look at this series: 15, 16, 31, 47, 78, ... What number should come next?",
        "image_url": null,
        "passage": null,
        "marks": 1,
        "options": [
            {
                "is_correct": false,
                "option_text": "115",
                "option_label": "A"
            },
            {
                "is_correct": false,
                "option_text": "120",
                "option_label": "B"
            },
            {
                "is_correct": true,
                "option_text": "125",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "130",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 8,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "Q is as much younger than R as he is older than T. If the sum of the ages of R and T is 60 years, what is definitely the difference between R and Q's age?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "1 year",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "2 years",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "30 years",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Data inadequate",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "D",
        "explanation": "nan"
    },
    {
        "id": 9,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "Ravi wants to buy 400 notebooks for his store. He gets the first 250 notebooks for $2,000. The next 150 notebooks cost $5 each. If a 10% discount is applied to the total cost, what is the total cost of the notebooks?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "$2,475",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "$2,500",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "$2,600",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "$2,700",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "A",
        "explanation": "nan"
    },
    {
        "id": 10,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "A is three years older than B, who is twice as old as C. If the total of the ages of A, B and C is 48, how old is B?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "16",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "18",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "20",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "22",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 11,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "Sam purchased 8 dozens of pens at the rate of Rs. 480 per dozen. He sold each one of them at the rate of Rs. 45. What was his percentage profit?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "0.1",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "0.125",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "0.15",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "0.08",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 12,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "Rahul walks 9 km to the north, then turns and walks 12 km to the east. How far is he from his starting point?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "15 km",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "18 km",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "20 km",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "21 km",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "A",
        "explanation": "nan"
    },
    {
        "id": 13,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "P told Q, 'The boy I met yesterday was the only son of the father-in-law of my sister's husband.' How is the boy related to P?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Brother",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Nephew",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Cousin",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Son",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "A",
        "explanation": "nan"
    },
    {
        "id": 14,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "The sum of the digits of a 2-digit number is 11. If we add 45 to the number, the new number obtained is formed by interchanging the digits. What is the number?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "x = 3 and y = 8",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "x = 4 and y = 7",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "x = 5 and y = 6",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "x = 2 and y = 9",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "A",
        "explanation": "nan"
    },
    {
        "id": 15,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "In the first 15 overs of a cricket match, the run rate was only 3.2. What should be the run rate in the remaining 35 overs to reach a target of 272 runs?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "6",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "6.2",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "6.4",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "6.6",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 16,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "APTITUDE",
        "exam_level": "FRESHER",
        "question_text": "A mother is three times as old as her son. If 15 years ago the age of the mother was six times the age of the son, what is the present age of the mother?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "70 years",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "72 years",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "75 years",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "78 years",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 17,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "A credit card is used for:",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Withdrawing money directly from a savings account",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Borrowing money from the bank up to a set limit",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Transferring money instantly between two banks free of cost",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "None of the above",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 18,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "Which of the following is not an online food delivery platform?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Zomato",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Swiggy",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "DoorDash",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "None of these",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "D",
        "explanation": "nan"
    },
    {
        "id": 19,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "Pick the odd one out:",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Croissant",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Bagel",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Baguette",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Risotto",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "D",
        "explanation": "nan"
    },
    {
        "id": 20,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "A discounted meal deal specially targeted at families is called:",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Kid's Meal",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Family Combo",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Solo Meal",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Executive Meal",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 21,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "An Italian sparkling wine is called:",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Prosecco",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Sake",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Whisky",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Vodka",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "A",
        "explanation": "nan"
    },
    {
        "id": 22,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "The tagline 'I'm Lovin' It' is associated with which brand?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Burger King",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "KFC",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "McDonald's",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Subway",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 23,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "The buying and selling of goods over the internet is called:",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "E-governance",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "E-commerce",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "E-marketing",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "E-procurement",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 24,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "The most cost-effective method of delivering digital goods (like e-books) is:",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Postal delivery",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Electronic/digital delivery",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Courier service",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "None of the above",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 25,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "Retailers can never earn any margin on shipping and handling charges.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "True",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "False",
                "option_label": "B"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 26,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "Which among the following is not an example of e-commerce?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Amazon",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Nykaa",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "BigBasket",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "A railway station ticket counter",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "D",
        "explanation": "nan"
    },
    {
        "id": 27,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "'Early bird' offers in a restaurant typically mean:",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "A discounted price offered before peak hours",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "A time when the restaurant is closed",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "A special menu only for breakfast",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "None of the above",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "A",
        "explanation": "nan"
    },
    {
        "id": 28,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "Hollandaise, B\u00e9chamel and Marinara are types of:",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Sauces",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Breads",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Desserts",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Beverages",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "A",
        "explanation": "nan"
    },
    {
        "id": 29,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "Which country is most associated with Sushi?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "China",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Japan",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Thailand",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Korea",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 30,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "What is a 'fortified wine'?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "A wine with added distilled spirit, increasing its alcohol content",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "A wine stored in a fortified cellar",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "A wine made only from fortified grapes",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "None of the above",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "A",
        "explanation": "nan"
    },
    {
        "id": 31,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "What does 'Cashback' typically mean in retail/e-commerce transactions?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "A percentage of the purchase amount returned to the buyer after the transaction",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "An additional fee charged for using cash",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "A loan given at the time of purchase",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "None of these",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "A",
        "explanation": "nan"
    },
    {
        "id": 32,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "INDUSTRY_AWARENESS",
        "exam_level": "FRESHER",
        "question_text": "The term 'table d'h\u00f4te' refers to:",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "A fixed-price meal with limited choices offered at a set price",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "A meal that must be custom ordered",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "A free meal offered by the host",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "None of the above",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "A",
        "explanation": "nan"
    },
    {
        "id": 33,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "By the time she arrives, we ______ dinner.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "will finish",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "will have finished",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "finish",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "are finishing",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 34,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "He ______ hardly speak when he arrived, he was so exhausted.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "could",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "can",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "would",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "should",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "A",
        "explanation": "nan"
    },
    {
        "id": 35,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "Synonym of 'abundant' is ______.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Scarce",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Plentiful",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Meager",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Sparse",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 36,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "I think my proposal ______ by the committee already.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "rejecting",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "is rejected",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "has been rejected",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Either B or C",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "D",
        "explanation": "nan"
    },
    {
        "id": 37,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "I ______ Sarah last week and she told me she was moving abroad.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "have met",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "had meet",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "met",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "meet",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 38,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "She ______ coffee in the morning these days.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "had never drink",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "has never drink",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "never drinks",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Never she drinks",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 39,
        "question_type": "MULTIPLE_CHOICE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "______ to travel abroad one day?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Have you wish to",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Would you like to",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Do you wish to",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Will you wish to",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 40,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Sincerity",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Sincerity",
        "explanation": "nan"
    },
    {
        "id": 41,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Fortunate",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Fortunate",
        "explanation": "nan"
    },
    {
        "id": 42,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Beyond",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Beyond",
        "explanation": "nan"
    },
    {
        "id": 43,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Incidence",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Incidence",
        "explanation": "nan"
    },
    {
        "id": 44,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Argument",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Argument",
        "explanation": "nan"
    },
    {
        "id": 45,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Historic",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Historic",
        "explanation": "nan"
    },
    {
        "id": 46,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Essential",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Essential",
        "explanation": "nan"
    },
    {
        "id": 47,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Milestone",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Milestone",
        "explanation": "nan"
    },
    {
        "id": 48,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Preferred",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Preferred",
        "explanation": "nan"
    },
    {
        "id": 49,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Empower",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Empower",
        "explanation": "nan"
    },
    {
        "id": 50,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Optimistic",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Optimistic",
        "explanation": "nan"
    },
    {
        "id": 51,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Compute",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Compute",
        "explanation": "nan"
    },
    {
        "id": 52,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Reliable",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Reliable",
        "explanation": "nan"
    },
    {
        "id": 53,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Ahead",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Ahead",
        "explanation": "nan"
    },
    {
        "id": 54,
        "question_type": "SUBJECTIVE",
        "subject_type": "WRITTEN",
        "exam_level": "FRESHER",
        "question_text": "Benchmark",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Benchmark",
        "explanation": "nan"
    },
    {
        "id": 55,
        "question_type": "SUBJECTIVE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "finish? / you / when / will / project / the",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "When will you finish the project?",
        "explanation": "nan"
    },
    {
        "id": 56,
        "question_type": "SUBJECTIVE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "doing / what / are / you / here?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "What are you doing here?",
        "explanation": "nan"
    },
    {
        "id": 57,
        "question_type": "SUBJECTIVE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "essential / is / health / for / exercise / good",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Exercise is essential for good health.",
        "explanation": "nan"
    },
    {
        "id": 58,
        "question_type": "SUBJECTIVE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "delayed / why / been / the flight / has?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Why has the flight been delayed?",
        "explanation": "nan"
    },
    {
        "id": 59,
        "question_type": "SUBJECTIVE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "team? / who / the / led / winning",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Who led the winning team?",
        "explanation": "nan"
    },
    {
        "id": 60,
        "question_type": "SUBJECTIVE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "to / need / do / we / how / long / wait / here?",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "How long do we need to wait here?",
        "explanation": "nan"
    },
    {
        "id": 61,
        "question_type": "SUBJECTIVE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "week. / launch / was / to / next / set / The product",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "The product was set to launch next week.",
        "explanation": "nan"
    },
    {
        "id": 62,
        "question_type": "SUBJECTIVE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "success, / if / up / you / want to / give / don't / achieve",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "If you want to achieve success, don't give up.",
        "explanation": "nan"
    },
    {
        "id": 63,
        "question_type": "SUBJECTIVE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "blue sky / and admired / the stars / the boy / looked up at / the vast",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "The boy looked up at the vast blue sky and admired the stars.",
        "explanation": "nan"
    },
    {
        "id": 64,
        "question_type": "SUBJECTIVE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "quickly. / So / he / treated / his / sprained / ankle",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "So he treated his sprained ankle quickly.",
        "explanation": "nan"
    },
    {
        "id": 65,
        "question_type": "SUBJECTIVE",
        "subject_type": "ENGLISH_GRAMMAR",
        "exam_level": "FRESHER",
        "question_text": "on. / see / to / what / was / rushed / Everyone / going",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "Everyone rushed to see what was going on.",
        "explanation": "nan"
    },
    {
        "id": 66,
        "question_type": "PASSAGE_CONTENT",
        "subject_type": "COMPREHENSION",
        "exam_level": "FRESHER",
        "question_text": "According to the passage, what was the chief contribution of Edison's invention?",
        "image_url": null,
        "passage": "Darkness had ruled the night for centuries until a persistent inventor in Menlo Park decided otherwise. Thomas Alva Edison, born in Ohio in 1847, was a curious child who was often labelled as inattentive by his teachers. His mother, a former schoolteacher, took charge of his education at home, nurturing his love for experimentation. As a young man, Edison worked as a telegraph operator, but his real passion lay in tinkering with machines during his free hours. He believed that persistence, more than genius, was the key to invention. After thousands of failed attempts with different filament materials, Edison finally succeeded in 1879 in creating a carbon filament bulb that could glow for over thirteen hours. This breakthrough transformed daily life, allowing factories, homes and streets to be lit long after sunset. Edison was not only an inventor but also a shrewd businessman; he established the Edison Electric Light Company to bring his invention to ordinary households. He held over a thousand patents by the end of his life and remained devoted to experimentation until his final years. When he passed away in 1931, several cities across the United States dimmed their lights briefly in his honour, a quiet tribute to the man who had once lit up the world.",
        "marks": 2,
        "options": [
            {
                "is_correct": false,
                "option_text": "It allowed telegraph operators to work at night",
                "option_label": "A"
            },
            {
                "is_correct": true,
                "option_text": "It enabled daily life to continue after sunset",
                "option_label": "B"
            },
            {
                "is_correct": false,
                "option_text": "It made Edison a wealthy businessman",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "It helped factories reduce production costs",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 67,
        "question_type": "PASSAGE_CONTENT",
        "subject_type": "COMPREHENSION",
        "exam_level": "FRESHER",
        "question_text": "Which of the following helped Edison succeed in inventing the light bulb?",
        "image_url": null,
        "passage": "Darkness had ruled the night for centuries until a persistent inventor in Menlo Park decided otherwise. Thomas Alva Edison, born in Ohio in 1847, was a curious child who was often labelled as inattentive by his teachers. His mother, a former schoolteacher, took charge of his education at home, nurturing his love for experimentation. As a young man, Edison worked as a telegraph operator, but his real passion lay in tinkering with machines during his free hours. He believed that persistence, more than genius, was the key to invention. After thousands of failed attempts with different filament materials, Edison finally succeeded in 1879 in creating a carbon filament bulb that could glow for over thirteen hours. This breakthrough transformed daily life, allowing factories, homes and streets to be lit long after sunset. Edison was not only an inventor but also a shrewd businessman; he established the Edison Electric Light Company to bring his invention to ordinary households. He held over a thousand patents by the end of his life and remained devoted to experimentation until his final years. When he passed away in 1931, several cities across the United States dimmed their lights briefly in his honour, a quiet tribute to the man who had once lit up the world.",
        "marks": 2,
        "options": [
            {
                "is_correct": false,
                "option_text": "His formal schooling",
                "option_label": "A"
            },
            {
                "is_correct": false,
                "option_text": "His work as a telegraph operator",
                "option_label": "B"
            },
            {
                "is_correct": true,
                "option_text": "His persistence despite repeated failures",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "Support from the government",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 68,
        "question_type": "PASSAGE_CONTENT",
        "subject_type": "COMPREHENSION",
        "exam_level": "FRESHER",
        "question_text": "Edison's approach to invention can be best described as one of ______.",
        "image_url": null,
        "passage": "Darkness had ruled the night for centuries until a persistent inventor in Menlo Park decided otherwise. Thomas Alva Edison, born in Ohio in 1847, was a curious child who was often labelled as inattentive by his teachers. His mother, a former schoolteacher, took charge of his education at home, nurturing his love for experimentation. As a young man, Edison worked as a telegraph operator, but his real passion lay in tinkering with machines during his free hours. He believed that persistence, more than genius, was the key to invention. After thousands of failed attempts with different filament materials, Edison finally succeeded in 1879 in creating a carbon filament bulb that could glow for over thirteen hours. This breakthrough transformed daily life, allowing factories, homes and streets to be lit long after sunset. Edison was not only an inventor but also a shrewd businessman; he established the Edison Electric Light Company to bring his invention to ordinary households. He held over a thousand patents by the end of his life and remained devoted to experimentation until his final years. When he passed away in 1931, several cities across the United States dimmed their lights briefly in his honour, a quiet tribute to the man who had once lit up the world.",
        "marks": 2,
        "options": [
            {
                "is_correct": false,
                "option_text": "Relying purely on natural talent",
                "option_label": "A"
            },
            {
                "is_correct": false,
                "option_text": "Learning solely from his teachers",
                "option_label": "B"
            },
            {
                "is_correct": true,
                "option_text": "Persistent experimentation despite setbacks",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "Following instructions from mentors",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 69,
        "question_type": "PASSAGE_CONTENT",
        "subject_type": "COMPREHENSION",
        "exam_level": "FRESHER",
        "question_text": "Choose the word which is NOT NEARLY THE SAME in meaning as the word printed in bold: 'Persistent'",
        "image_url": null,
        "passage": "Darkness had ruled the night for centuries until a persistent inventor in Menlo Park decided otherwise. Thomas Alva Edison, born in Ohio in 1847, was a curious child who was often labelled as inattentive by his teachers. His mother, a former schoolteacher, took charge of his education at home, nurturing his love for experimentation. As a young man, Edison worked as a telegraph operator, but his real passion lay in tinkering with machines during his free hours. He believed that persistence, more than genius, was the key to invention. After thousands of failed attempts with different filament materials, Edison finally succeeded in 1879 in creating a carbon filament bulb that could glow for over thirteen hours. This breakthrough transformed daily life, allowing factories, homes and streets to be lit long after sunset. Edison was not only an inventor but also a shrewd businessman; he established the Edison Electric Light Company to bring his invention to ordinary households. He held over a thousand patents by the end of his life and remained devoted to experimentation until his final years. When he passed away in 1931, several cities across the United States dimmed their lights briefly in his honour, a quiet tribute to the man who had once lit up the world.",
        "marks": 2,
        "options": [
            {
                "is_correct": false,
                "option_text": "Determined",
                "option_label": "A"
            },
            {
                "is_correct": false,
                "option_text": "Tenacious",
                "option_label": "B"
            },
            {
                "is_correct": false,
                "option_text": "Unwavering",
                "option_label": "C"
            },
            {
                "is_correct": true,
                "option_text": "Fickle",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "D",
        "explanation": "nan"
    },
    {
        "id": 70,
        "question_type": "PASSAGE_CONTENT",
        "subject_type": "COMPREHENSION",
        "exam_level": "FRESHER",
        "question_text": "Choose the word which is MOST OPPOSITE in meaning of the word printed in bold: 'Curious'",
        "image_url": null,
        "passage": "Darkness had ruled the night for centuries until a persistent inventor in Menlo Park decided otherwise. Thomas Alva Edison, born in Ohio in 1847, was a curious child who was often labelled as inattentive by his teachers. His mother, a former schoolteacher, took charge of his education at home, nurturing his love for experimentation. As a young man, Edison worked as a telegraph operator, but his real passion lay in tinkering with machines during his free hours. He believed that persistence, more than genius, was the key to invention. After thousands of failed attempts with different filament materials, Edison finally succeeded in 1879 in creating a carbon filament bulb that could glow for over thirteen hours. This breakthrough transformed daily life, allowing factories, homes and streets to be lit long after sunset. Edison was not only an inventor but also a shrewd businessman; he established the Edison Electric Light Company to bring his invention to ordinary households. He held over a thousand patents by the end of his life and remained devoted to experimentation until his final years. When he passed away in 1931, several cities across the United States dimmed their lights briefly in his honour, a quiet tribute to the man who had once lit up the world.",
        "marks": 2,
        "options": [
            {
                "is_correct": false,
                "option_text": "Inquisitive",
                "option_label": "A"
            },
            {
                "is_correct": true,
                "option_text": "Indifferent",
                "option_label": "B"
            },
            {
                "is_correct": false,
                "option_text": "Eager",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "Attentive",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 71,
        "question_type": "PASSAGE_CONTENT",
        "subject_type": "COMPREHENSION",
        "exam_level": "FRESHER",
        "question_text": "Choose the word which is MOST OPPOSITE in meaning of the word printed in bold: 'Shrewd'",
        "image_url": null,
        "passage": "Darkness had ruled the night for centuries until a persistent inventor in Menlo Park decided otherwise. Thomas Alva Edison, born in Ohio in 1847, was a curious child who was often labelled as inattentive by his teachers. His mother, a former schoolteacher, took charge of his education at home, nurturing his love for experimentation. As a young man, Edison worked as a telegraph operator, but his real passion lay in tinkering with machines during his free hours. He believed that persistence, more than genius, was the key to invention. After thousands of failed attempts with different filament materials, Edison finally succeeded in 1879 in creating a carbon filament bulb that could glow for over thirteen hours. This breakthrough transformed daily life, allowing factories, homes and streets to be lit long after sunset. Edison was not only an inventor but also a shrewd businessman; he established the Edison Electric Light Company to bring his invention to ordinary households. He held over a thousand patents by the end of his life and remained devoted to experimentation until his final years. When he passed away in 1931, several cities across the United States dimmed their lights briefly in his honour, a quiet tribute to the man who had once lit up the world.",
        "marks": 5,
        "options": [
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Cunning",
                "option_label": "A"
            },
            {
                "image_url": null,
                "is_correct": true,
                "option_text": "Naive",
                "option_label": "B"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Sharp",
                "option_label": "C"
            },
            {
                "image_url": null,
                "is_correct": false,
                "option_text": "Clever",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 72,
        "question_type": "PASSAGE_CONTENT",
        "subject_type": "COMPREHENSION",
        "exam_level": "FRESHER",
        "question_text": "Choose the word which is MOST NEARLY THE SAME in meaning as the word printed in bold: 'Transform'",
        "image_url": null,
        "passage": "Darkness had ruled the night for centuries until a persistent inventor in Menlo Park decided otherwise. Thomas Alva Edison, born in Ohio in 1847, was a curious child who was often labelled as inattentive by his teachers. His mother, a former schoolteacher, took charge of his education at home, nurturing his love for experimentation. As a young man, Edison worked as a telegraph operator, but his real passion lay in tinkering with machines during his free hours. He believed that persistence, more than genius, was the key to invention. After thousands of failed attempts with different filament materials, Edison finally succeeded in 1879 in creating a carbon filament bulb that could glow for over thirteen hours. This breakthrough transformed daily life, allowing factories, homes and streets to be lit long after sunset. Edison was not only an inventor but also a shrewd businessman; he established the Edison Electric Light Company to bring his invention to ordinary households. He held over a thousand patents by the end of his life and remained devoted to experimentation until his final years. When he passed away in 1931, several cities across the United States dimmed their lights briefly in his honour, a quiet tribute to the man who had once lit up the world.",
        "marks": 2,
        "options": [
            {
                "is_correct": false,
                "option_text": "Damage severely",
                "option_label": "A"
            },
            {
                "is_correct": true,
                "option_text": "Change completely",
                "option_label": "B"
            },
            {
                "is_correct": false,
                "option_text": "Remain constant",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "Slow down",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "B",
        "explanation": "nan"
    },
    {
        "id": 73,
        "question_type": "PASSAGE_CONTENT",
        "subject_type": "COMPREHENSION",
        "exam_level": "FRESHER",
        "question_text": "The tribute paid by American cities upon Edison's death suggests that he was held in:",
        "image_url": null,
        "passage": "Darkness had ruled the night for centuries until a persistent inventor in Menlo Park decided otherwise. Thomas Alva Edison, born in Ohio in 1847, was a curious child who was often labelled as inattentive by his teachers. His mother, a former schoolteacher, took charge of his education at home, nurturing his love for experimentation. As a young man, Edison worked as a telegraph operator, but his real passion lay in tinkering with machines during his free hours. He believed that persistence, more than genius, was the key to invention. After thousands of failed attempts with different filament materials, Edison finally succeeded in 1879 in creating a carbon filament bulb that could glow for over thirteen hours. This breakthrough transformed daily life, allowing factories, homes and streets to be lit long after sunset. Edison was not only an inventor but also a shrewd businessman; he established the Edison Electric Light Company to bring his invention to ordinary households. He held over a thousand patents by the end of his life and remained devoted to experimentation until his final years. When he passed away in 1931, several cities across the United States dimmed their lights briefly in his honour, a quiet tribute to the man who had once lit up the world.",
        "marks": 2,
        "options": [
            {
                "is_correct": false,
                "option_text": "Contempt",
                "option_label": "A"
            },
            {
                "is_correct": false,
                "option_text": "Suspicion",
                "option_label": "B"
            },
            {
                "is_correct": true,
                "option_text": "High regard",
                "option_label": "C"
            },
            {
                "is_correct": false,
                "option_text": "Fear",
                "option_label": "D"
            }
        ],
        "is_active": true,
        "created_by": 2,
        "answer_text": "C",
        "explanation": "nan"
    },
    {
        "id": 74,
        "question_type": "TYPING_TEST",
        "subject_type": "TYPING_TEST",
        "exam_level": "FRESHER",
        "question_text": "Quality Policy",
        "image_url": null,
        "passage": "ArcGate Quality Policy.ArcGate is committed to a global quality system focused on customer satisfaction. We achieve this through superior services, rapid customer support, technical expertise and industry leadership.Our quality and business objectives are designed to challenge the organisation through continual improvement, innovation and passion for results.Assisted 75+ world-class startups in rapidly bringing cost-effective solutions to market.",
        "marks": 10,
        "options": [],
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 75,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://celanese.com",
        "image_url": null,
        "passage": null,
        "marks": 20,
        "options": {
            "city": "Irving",
            "state": "TX",
            "zipCode": "75039",
            "websiteUrl": "http://celanese.com",
            "companyName": "Celanese Corporation",
            "facebookPage": "https://www.facebook.com/Celanese/",
            "generalEmail": "questions@celanese.com",
            "streetAddress": "222 W. Las Colinas Blvd.",
            "companyPhoneNumber": "+1 972-443-4000"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 76,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://calgoncarbon.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Moon Township",
            "state": "PA",
            "zipCode": 15108,
            "websiteUrl": "http://calgoncarbon.com",
            "companyName": "Calgon Carbon Corporation",
            "facebookPage": "https://www.facebook.com/calgoncarbon/",
            "generalEmail": "info@calgoncarbon.com",
            "streetAddress": "3000 GSK Drive",
            "companyPhoneNumber": "412-787-6700"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 77,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://beltpower.com",
        "image_url": null,
        "passage": null,
        "marks": 20,
        "options": {
            "city": "Atlanta",
            "state": "GA",
            "zipCode": "30339",
            "websiteUrl": "http://beltpower.com",
            "companyName": "Belt Power, LLC",
            "facebookPage": "https://www.facebook.com/BeltPower/",
            "generalEmail": "sales@beltpower.com",
            "streetAddress": "2355 Church Road SE",
            "companyPhoneNumber": "800-886-2358"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 78,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://ceda.com/",
        "image_url": null,
        "passage": null,
        "marks": 20,
        "options": {
            "city": "Calgary",
            "state": "AB",
            "zipCode": "T2J 6A5",
            "websiteUrl": "http://ceda.com/",
            "companyName": "CEDA International",
            "facebookPage": "https://www.facebook.com/CEDA.International",
            "generalEmail": "info@cedagroup.com",
            "streetAddress": "Suite 625, 11012 Macleod Trail SE",
            "companyPhoneNumber": "1-403-253-3233"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 79,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://cclind.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Toronto",
            "state": "ON",
            "zipCode": "M2H 3R1",
            "websiteUrl": "http://cclind.com",
            "companyName": "CCL Industries Inc",
            "facebookPage": "https://www.facebook.com/pages/CCL-Industries-Inc/215880722133999",
            "generalEmail": "ccl@cclind.com",
            "streetAddress": "105 Gordon Baker Road Suite 801",
            "companyPhoneNumber": 4167568500
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 80,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://calnetix.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Cerritos",
            "state": "CA",
            "zipCode": 90703,
            "websiteUrl": "http://calnetix.com",
            "companyName": "Calnetix Technologies, LLC",
            "facebookPage": "https://www.facebook.com/calnetix/",
            "generalEmail": "info@calnetix.com",
            "streetAddress": "16323 Shoemaker Ave.",
            "companyPhoneNumber": "1-562-293-1660"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 81,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Blake Jarrett & Co",
        "image_url": null,
        "passage": null,
        "marks": 10,
        "options": {
            "email": "blake@blakejarrett.ca",
            "website": "blakejarrett.ca",
            "designation": "CEO",
            "contact_name": "Blake Jarrett"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 82,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Beracah Homes, Inc.",
        "image_url": null,
        "passage": null,
        "marks": 10,
        "options": {
            "email": "trent@beracahhomes.com",
            "website": "beracahhomes.com",
            "designation": "Contractor Sales",
            "contact_name": "Trent Collins"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 83,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "American Excelsior Company",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "tsadowski@americanexcelsior.com",
            "website": "americanexcelsior.com",
            "designation": "President",
            "contact_name": "Terry Sadowski"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 84,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Calgon Carbon Corporation",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "dconley@calgoncarbon.com",
            "website": "calgoncarbon.com",
            "designation": "Marketing Manager- Municipal",
            "contact_name": "Doug Conley"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 85,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "American Tank & Fabricating Company",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "tedt@atfco.com",
            "website": "atfco.com",
            "designation": "General Manager",
            "contact_name": "Ted Thorbjornsen"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 86,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://celanese.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Irving",
            "state": "TX",
            "zipCode": 75039,
            "websiteUrl": "http://celanese.com",
            "companyName": "Celanese Corporation",
            "facebookPage": "https://www.facebook.com/Celanese/",
            "generalEmail": "questions@celanese.com",
            "streetAddress": "222 W. Las Colinas Blvd.",
            "companyPhoneNumber": "+1 972-443-4000"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 87,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://calgoncarbon.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Moon Township",
            "state": "PA",
            "zipCode": 15108,
            "websiteUrl": "http://calgoncarbon.com",
            "companyName": "Calgon Carbon Corporation",
            "facebookPage": "https://www.facebook.com/calgoncarbon/",
            "generalEmail": "info@calgoncarbon.com",
            "streetAddress": "3000 GSK Drive",
            "companyPhoneNumber": "412-787-6700"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 88,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://beltpower.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Atlanta",
            "state": "GA",
            "zipCode": 30339,
            "websiteUrl": "http://beltpower.com",
            "companyName": "Belt Power, LLC",
            "facebookPage": "https://www.facebook.com/BeltPower/",
            "generalEmail": "sales@beltpower.com",
            "streetAddress": "2355 Church Road SE",
            "companyPhoneNumber": "800-886-2358"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 89,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://ceda.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Calgary",
            "state": "AB",
            "zipCode": "T2J 6A5",
            "websiteUrl": "http://ceda.com/",
            "companyName": "CEDA International",
            "facebookPage": "https://www.facebook.com/CEDA.International",
            "generalEmail": "info@cedagroup.com",
            "streetAddress": "Suite 625, 11012 Macleod Trail SE",
            "companyPhoneNumber": "1-403-253-3233"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 90,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://cclind.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Toronto",
            "state": "ON",
            "zipCode": "M2H 3R1",
            "websiteUrl": "http://cclind.com",
            "companyName": "CCL Industries Inc",
            "facebookPage": "https://www.facebook.com/pages/CCL-Industries-Inc/215880722133999",
            "generalEmail": "ccl@cclind.com",
            "streetAddress": "105 Gordon Baker Road Suite 801",
            "companyPhoneNumber": 4167568500
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 91,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://calnetix.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Cerritos",
            "state": "CA",
            "zipCode": 90703,
            "websiteUrl": "http://calnetix.com",
            "companyName": "Calnetix Technologies, LLC",
            "facebookPage": "https://www.facebook.com/calnetix/",
            "generalEmail": "info@calnetix.com",
            "streetAddress": "16323 Shoemaker Ave.",
            "companyPhoneNumber": "1-562-293-1660"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 92,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://calmac.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Fair Lawn",
            "state": "NJ",
            "zipCode": 7410,
            "websiteUrl": "http://calmac.com",
            "companyName": "Calmac Corp.",
            "facebookPage": "https://www.facebook.com/CalmacEnergyStorage",
            "generalEmail": "info@calmac.com",
            "streetAddress": "3-00 Banta Place",
            "companyPhoneNumber": "201-797-1511"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 93,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://cmcorporation.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Dayville",
            "state": "CT",
            "zipCode": 6241,
            "websiteUrl": "http://cmcorporation.com",
            "companyName": "C & M Corporation",
            "facebookPage": "https://www.facebook.com/CMCorporation/",
            "generalEmail": "SalesAM@cmcorporation.com",
            "streetAddress": "349 Lake Road",
            "companyPhoneNumber": "(1) 860 774 4812"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 94,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://bwen.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Cicero",
            "state": "IL",
            "zipCode": 60804,
            "websiteUrl": "http://bwen.com/",
            "companyName": "Broadwind Energy, Inc.",
            "facebookPage": "https://www.facebook.com/Broadwind/",
            "generalEmail": "info@bwen.com",
            "streetAddress": "3240 S. Central Ave.",
            "companyPhoneNumber": "708\u00ad.780.4800"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 95,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://bridgewellresources.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "TIGARD",
            "state": "OR",
            "zipCode": 97223,
            "websiteUrl": "http://bridgewellresources.com",
            "companyName": "Bridgewell Resources LLC",
            "facebookPage": "https://www.facebook.com/BridgewellResources",
            "generalEmail": "info@bridgewellres.com",
            "streetAddress": "10200 SW Greenburg Rd Suite# 400",
            "companyPhoneNumber": "503.872.3557"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 96,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://boydcorp.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Pleasanton",
            "state": "CA",
            "zipCode": 94588,
            "websiteUrl": "http://boydcorp.com",
            "companyName": "Boyd Corporation",
            "facebookPage": "https://www.facebook.com/Boyd-Corporation-745405212139622/?ref=hl",
            "generalEmail": "customerservice@boydcorp.com",
            "streetAddress": "5960 Inglewood Dr. Suite 115",
            "companyPhoneNumber": "1(888)244-6931"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 97,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://bucorp.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Elgin",
            "state": "IL",
            "zipCode": 60124,
            "websiteUrl": "http://bucorp.com",
            "companyName": "Bohler-Uddeholm Corporation",
            "facebookPage": "https://www.facebook.com/4buna/",
            "generalEmail": "info@bucorp.com",
            "streetAddress": "2505 Milennium Drive",
            "companyPhoneNumber": "1-800-638-2520"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 98,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://bluecatnetworks.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Toronto",
            "state": "ON",
            "zipCode": "ON M2P 2B5",
            "websiteUrl": "http://bluecatnetworks.com",
            "companyName": "Bluecat Networks Inc",
            "facebookPage": "https://www.facebook.com/BlueCatNetworks/",
            "generalEmail": "support@bluecatnetworks.com",
            "streetAddress": "4101 Yonge St 3rd Floor",
            "companyPhoneNumber": "1.416.646.8400"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 99,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://blockandcompany.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Wheeling",
            "state": "IL",
            "zipCode": "60090-5795",
            "websiteUrl": "http://blockandcompany.com",
            "companyName": "Block and Company, Inc.",
            "facebookPage": "https://www.facebook.com/blockandcompany",
            "generalEmail": "info@blockinc.com",
            "streetAddress": "1111 Wheeling Road",
            "companyPhoneNumber": "800.323.7556"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 100,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://bliley.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Erie",
            "state": "PA",
            "zipCode": 16506,
            "websiteUrl": "http://bliley.com",
            "companyName": "Bliley Technologies, Inc.",
            "facebookPage": "https://www.facebook.com/BlileyTech/",
            "generalEmail": "sales@bliley.com",
            "streetAddress": "2545 W. Grandview",
            "companyPhoneNumber": "(814) 838-3571"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 101,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://blakejarrett.ca/portfolio/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Toronto",
            "state": "ON",
            "zipCode": "M3B 2T5",
            "websiteUrl": "http://blakejarrett.ca/portfolio/",
            "companyName": "Blake Jarrett & Company Inc.",
            "facebookPage": "https://www.facebook.com/BlakeJarrettCo/",
            "generalEmail": "info@blakejarrett.ca",
            "streetAddress": "66 Lesmill Road",
            "companyPhoneNumber": "416.385.1660"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 102,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://bitordertech.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Frisco",
            "state": "TX",
            "zipCode": 75034,
            "websiteUrl": "http://bitordertech.com",
            "companyName": "Bit Order Technologies Inc.",
            "facebookPage": "https://www.facebook.com/BitOrder/",
            "generalEmail": "info@bitordertech.com",
            "streetAddress": "8765, Stockard Drive, Unit 101",
            "companyPhoneNumber": "1 (415) 230 0592"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 103,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://www.beumergroup.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Somerset",
            "state": "NJ",
            "zipCode": 8873,
            "websiteUrl": "http://www.beumergroup.com/",
            "companyName": "BEUMER Corporation",
            "facebookPage": "https://www.facebook.com/BeumerGroup/",
            "generalEmail": "usa@beumergroup.com",
            "streetAddress": "800 Apgar Drive",
            "companyPhoneNumber": "1 732 893 - 2800"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 104,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://beracahhomes.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Greenwood",
            "state": "DE",
            "zipCode": 19950,
            "websiteUrl": "http://beracahhomes.com",
            "companyName": "Beracah Homes, Inc.",
            "facebookPage": "https://www.facebook.com/beracahhomes/",
            "generalEmail": "sales@beracahhomes.com",
            "streetAddress": "9590 Nanticoke Business Park Dr.",
            "companyPhoneNumber": "1 302-349-4561"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 105,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://bepex.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Minneapolis",
            "state": "MN",
            "zipCode": 55413,
            "websiteUrl": "http://bepex.com/",
            "companyName": "Bepex International LLC",
            "facebookPage": "https://www.facebook.com/BepexInternational/",
            "generalEmail": "info@bepex.com",
            "streetAddress": "333 NE Taft Street",
            "companyPhoneNumber": "1 612-260-7462"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 106,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://www.apache-inc.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Cedar Rapids",
            "state": "IA",
            "zipCode": 52404,
            "websiteUrl": "http://www.apache-inc.com",
            "companyName": "Apache Inc.",
            "facebookPage": "https://www.facebook.com/Apache.Inc/",
            "generalEmail": "info@apache-inc.com",
            "streetAddress": "4805 Bowling Street SW",
            "companyPhoneNumber": "(866) 757-7816"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 107,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://americanexcelsior.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Arlington",
            "state": "TX",
            "zipCode": 76011,
            "websiteUrl": "http://americanexcelsior.com",
            "companyName": "American Excelsior Company",
            "facebookPage": "https://www.facebook.com/AmericanExcelsior/",
            "generalEmail": "sales@americanexcelsior.com",
            "streetAddress": "850 Ave H E",
            "companyPhoneNumber": "(800) 777-7645"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 108,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://alignproductionsystems.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Maryland Heights",
            "state": "MO",
            "zipCode": 63043,
            "websiteUrl": "http://alignproductionsystems.com/",
            "companyName": "Align Production Systems",
            "facebookPage": "https://www.facebook.com/AlignProductionSystems/?fref=nf",
            "generalEmail": "sales@alignprod.com",
            "streetAddress": "2055 Craidshire Road, Suite 407",
            "companyPhoneNumber": "(800) 888-0018"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 109,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://afltele.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Duncan",
            "state": "SC",
            "zipCode": 29334,
            "websiteUrl": "http://afltele.com",
            "companyName": "AFL Telecommunications LLC",
            "facebookPage": "https://www.facebook.com/AFLcorp/",
            "generalEmail": "sales@aflglobal.com",
            "streetAddress": "170 Ridgeview Center Drive",
            "companyPhoneNumber": "(800) 235-3423"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 110,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://texaskingindopakrestaurant.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Plano",
            "state": "TX",
            "zipCode": 75023,
            "websiteUrl": "http://texaskingindopakrestaurant.com",
            "companyName": "Texas King Indo Pak Restaurant",
            "facebookPage": "https://www.facebook.com/texaskingrestaurantplano",
            "generalEmail": "contact@texaskingindopakrestaurant.com",
            "streetAddress": "6900 Alma Dr., #100",
            "companyPhoneNumber": "972-517-5151"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 111,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://bentleymills.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "City of Industry",
            "state": "CA",
            "zipCode": 91746,
            "websiteUrl": "http://bentleymills.com",
            "companyName": "Bentley Mills",
            "facebookPage": "https://www.facebook.com/BentleyMillsLA/",
            "generalEmail": "marketing@bentleymills.com",
            "streetAddress": "14641 E. Don Julian Road",
            "companyPhoneNumber": "1 800-423-4709"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 112,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://behlenmfg.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Columbus",
            "state": "NE",
            "zipCode": 68601,
            "websiteUrl": "http://behlenmfg.com",
            "companyName": "Behlen Mfg. Co.",
            "facebookPage": "https://www.facebook.com/behlenmfgco/",
            "generalEmail": "behlen@behlenmfg.com",
            "streetAddress": "4025 E. 23rd Street",
            "companyPhoneNumber": "(402) 564-3111"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 113,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://ballard.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Burnaby",
            "state": "BC",
            "zipCode": "V5J 5J8",
            "websiteUrl": "http://ballard.com/",
            "companyName": "Ballard Power Systems Inc",
            "facebookPage": "https://www.facebook.com/Ballard-Power-Systems-205546066131866/",
            "generalEmail": "marketing@ballard.com",
            "streetAddress": "9000 Glenlyon Parkway",
            "companyPhoneNumber": "1-604-454-900"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 114,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://avure.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Middletown",
            "state": "OH",
            "zipCode": 45044,
            "websiteUrl": "http://avure.com",
            "companyName": "Avure Technologies Inc",
            "facebookPage": "https://www.facebook.com/AvureHPP/",
            "generalEmail": "info@avure.com",
            "streetAddress": "2601 South Verity Parkway Building 13",
            "companyPhoneNumber": "1-513-433-2500"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 115,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://tebos.net",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Gladstone",
            "state": "OR",
            "zipCode": 97027,
            "websiteUrl": "http://tebos.net",
            "companyName": "JC Tebo\u2019s Restaurant",
            "facebookPage": "https://www.facebook.com/TebosRestaurant",
            "generalEmail": "jctebos@tebos.net",
            "streetAddress": "19120 S.E. McLoughlin Blvd.",
            "companyPhoneNumber": "503-655-6333"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 116,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://acmepizzaria.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Cottonwood",
            "state": "AZ",
            "zipCode": 86326,
            "websiteUrl": "http://acmepizzaria.com",
            "companyName": "Acme Pizzaria",
            "facebookPage": "https://www.facebook.com/Acme-Pizzaria-116123298409928/",
            "generalEmail": "acme@acmepizzaria.com",
            "streetAddress": "280 S. Main Street",
            "companyPhoneNumber": "(928) 634-ACME (2263)"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 117,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://antonsgreekrestaurant.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Albany",
            "state": "NY",
            "zipCode": 12208,
            "websiteUrl": "http://antonsgreekrestaurant.com",
            "companyName": "Anton's Greek American Eatery",
            "facebookPage": "https://www.facebook.com/AntonsGreekRestaurant",
            "generalEmail": "ncschultzllc@yahoo.com",
            "streetAddress": "577 New Scotland",
            "companyPhoneNumber": "518-453-9191"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 118,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://barryspizza.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Houston",
            "state": "TX",
            "zipCode": 77057,
            "websiteUrl": "http://barryspizza.com",
            "companyName": "Barry\u2019s Pizza And Italian Diner",
            "facebookPage": "https://www.facebook.com/BarrysPizza/about",
            "generalEmail": "barryspizza@sbcglobal.net",
            "streetAddress": "6003 Richmond",
            "companyPhoneNumber": "713-266-8692"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 119,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://bettermypos.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Las Vegas",
            "state": "NV",
            "zipCode": 89120,
            "websiteUrl": "http://bettermypos.com/",
            "companyName": "Better My POS",
            "facebookPage": "https://www.facebook.com/Bettermypos/",
            "generalEmail": "wendy@bettermypos.com",
            "streetAddress": "6165 Harrison Dr Suite#4",
            "companyPhoneNumber": "(702) 449-9384"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 120,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://bhr-sullivan.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Rock Hill",
            "state": "NY",
            "zipCode": 12775,
            "websiteUrl": "http://bhr-sullivan.com/",
            "companyName": "Bernies Holiday Restaurant",
            "facebookPage": "https://www.facebook.com/BerniesHolidayRestaurant/",
            "generalEmail": "info@bhr-sullivan.com",
            "streetAddress": "277 Rock Hill Dr",
            "companyPhoneNumber": "(845) 796-3333"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 121,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://brettscasualamerican.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Athens",
            "state": "GA",
            "zipCode": 30606,
            "websiteUrl": "http://brettscasualamerican.com/",
            "companyName": "Brett's Casual American",
            "facebookPage": "https://www.facebook.com/diannacatersbretts/",
            "generalEmail": "brettsrestaurant@gmail.com",
            "streetAddress": "3190 Atlanta Hwy #11",
            "companyPhoneNumber": "706-850-1395"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 122,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://brianashville.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Nashville",
            "state": "TN",
            "zipCode": 37221,
            "websiteUrl": "http://brianashville.com/",
            "companyName": "Bria Bistro Italiano",
            "facebookPage": "https://www.facebook.com/BriaBistro/",
            "generalEmail": "bria@infinityhospitality.net",
            "streetAddress": "8128 Highway 100",
            "companyPhoneNumber": "615-646-8274"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 123,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://brix.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Napa",
            "state": "CA",
            "zipCode": 94558,
            "websiteUrl": "http://brix.com/",
            "companyName": "Brix",
            "facebookPage": "https://www.facebook.com/BrixRestaurant/",
            "generalEmail": "info@brix.com",
            "streetAddress": "7377 St. Helena Highway",
            "companyPhoneNumber": "707.944.2749"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 124,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://discoveradams.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "North Port",
            "state": "FL",
            "zipCode": 34289,
            "websiteUrl": "http://discoveradams.com/",
            "companyName": "Adams Group",
            "facebookPage": "https://www.facebook.com/adamsgroup/",
            "generalEmail": "info@discoveradams.com",
            "streetAddress": "2221 Murphy Court",
            "companyPhoneNumber": "941.639.7188"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 125,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://adcomfg.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Sanger",
            "state": "CA",
            "zipCode": 93657,
            "websiteUrl": "http://adcomfg.com",
            "companyName": "ADCO Manufacturing",
            "facebookPage": "https://www.facebook.com/adcomfg/",
            "generalEmail": "info@adcomfg.com",
            "streetAddress": "2170 Academy Avenue",
            "companyPhoneNumber": "(559) 875-5563"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 126,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://afcosystems.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Farmingdale",
            "state": "NY",
            "zipCode": 11735,
            "websiteUrl": "http://afcosystems.com",
            "companyName": "Afco Systems, Inc.",
            "facebookPage": "https://www.facebook.com/AFCO-Systems-Inc-299204250817/",
            "generalEmail": "sales@afcosystems.com",
            "streetAddress": "200 Finn Court",
            "companyPhoneNumber": "(631) 249-9441"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 127,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "https://www.reliasmedia.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Morrisville",
            "state": "NC",
            "zipCode": "27560-5468",
            "websiteUrl": "https://www.reliasmedia.com",
            "companyName": "Relias Media",
            "facebookPage": "https://www.facebook.com/ReliasMedia/",
            "generalEmail": "customerservice@reliasmedia.com",
            "streetAddress": "1010 Sync St, Suite 100",
            "companyPhoneNumber": "1-800-688-2421"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 128,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://almo.com",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Philadelphia",
            "state": "PA",
            "zipCode": 19154,
            "websiteUrl": "http://almo.com",
            "companyName": "Almo Corporation",
            "facebookPage": "https://www.facebook.com/almocorp/",
            "generalEmail": "support@almo.com",
            "streetAddress": "2709 Commerce Way",
            "companyPhoneNumber": "(215) 698-4000"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 129,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://atfco.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Cleveland",
            "state": "OH",
            "zipCode": 44111,
            "websiteUrl": "http://atfco.com/",
            "companyName": "American Tank & Fabricating Company",
            "facebookPage": "https://www.facebook.com/ATF-American-Tank-Fabricating-111290472269064/",
            "generalEmail": "info@atfco.com",
            "streetAddress": "12314 Elmwood Avenue",
            "companyPhoneNumber": "(216) 252-1500"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 130,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://amuneal.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Philadelphia",
            "state": "PA",
            "zipCode": 19124,
            "websiteUrl": "http://amuneal.com/",
            "companyName": "Amuneal Manufacturing Corp.",
            "facebookPage": "https://www.facebook.com/amuneal/",
            "generalEmail": "info@amuneal.com",
            "streetAddress": "4737 Darrah Street",
            "companyPhoneNumber": "(215) 535-3000"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 131,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://www.redyetijeff.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Jeffersonville",
            "state": "Indiana",
            "zipCode": "47130-3340",
            "websiteUrl": "http://www.redyetijeff.com/",
            "companyName": "The Red Yeti",
            "facebookPage": "https://www.facebook.com/RedYetiJeff/",
            "generalEmail": "big_red@redyetibrewing.com",
            "streetAddress": "256 Spring St",
            "companyPhoneNumber": "(812) 288-5788"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 132,
        "question_type": "CONTACT_DETAILS",
        "subject_type": "COMPANY_CONTACT_DETAILS",
        "exam_level": "FRESHER",
        "question_text": "http://simplerootsbrewing.com/",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "city": "Burlington",
            "state": "Vermont",
            "zipCode": "05408-2756",
            "websiteUrl": "http://simplerootsbrewing.com/",
            "companyName": "Simple Roots Brewing Co",
            "facebookPage": "https://www.facebook.com/Simplerootsbrewing/",
            "generalEmail": "simplerootsbrewing@gmail.com",
            "streetAddress": "1127 North Ave Ste 8",
            "companyPhoneNumber": "(802) 399-2658"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 133,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Blake Jarrett & Co",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "blake@blakejarrett.ca",
            "website": "blakejarrett.ca",
            "designation": "CEO",
            "contact_name": "Blake Jarrett"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 134,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Beracah Homes, Inc.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "trent@beracahhomes.com",
            "website": "beracahhomes.com",
            "designation": "Contractor Sales",
            "contact_name": "Trent Collins"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 135,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "American Excelsior Company",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "tsadowski@americanexcelsior.com",
            "website": "americanexcelsior.com",
            "designation": "President",
            "contact_name": "Terry Sadowski"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 136,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Calgon Carbon Corporation",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "dconley@calgoncarbon.com",
            "website": "calgoncarbon.com",
            "designation": "Marketing Manager- Municipal",
            "contact_name": "Doug Conley"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 137,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "American Tank & Fabricating Company",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "tedt@atfco.com",
            "website": "atfco.com",
            "designation": "General Manager",
            "contact_name": "Ted Thorbjornsen"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 138,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Paul Evans",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "evan@paulevansny.com",
            "website": "paulevansny.com",
            "designation": "CEO",
            "contact_name": "Evan Fript"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 139,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "DanceFIT Studio, LLC",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "gina@dancefitstudio.com",
            "website": "dancefitstudio.com",
            "designation": "Founder",
            "contact_name": "Gina Fay"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 140,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Portland Pedal Power LLC",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "Jenn@portlandpedalpower.com",
            "website": "portlandpedalpower.com",
            "designation": "Founder",
            "contact_name": "Jenn Dederich"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 141,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Milan Media Group",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "reva@milanmediagroup.com",
            "website": "milanmediagroup.com",
            "designation": "Chief Executive Officer",
            "contact_name": "Reva Caldwell-Johnson"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 142,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Anitox Corp.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "rphillips@anitox.com",
            "website": "anitox.com",
            "designation": "CEO",
            "contact_name": "Rick Phillips"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 143,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "American Products, L.L.C.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "ssmith@amprod.us",
            "website": "amprod.us",
            "designation": "President",
            "contact_name": "Steven Smith"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 144,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Rent frock Repeat",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "lisa@rentfrockrepeat.com",
            "website": "rentfrockrepeat.com",
            "designation": "Founder",
            "contact_name": "Lisa Delorme"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 145,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Black Box Social Media, LLC",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "tom@blackboxsocialmedia.com",
            "website": "blackboxsocialmedia.com",
            "designation": "CEO",
            "contact_name": "Tom Bukacek"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 146,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Bombardier Recreational Products Inc.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "johanne.denault@brp.com",
            "website": "brp.com",
            "designation": "Manager, Corporate Communications",
            "contact_name": "Johanne Denault"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 147,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Broadwind Energy, Inc.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "brett.hartman@bwen.com",
            "website": "bwen.com",
            "designation": "Sales Engineer",
            "contact_name": "Brett Hartman"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 148,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Bluecat Networks Inc",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "mharris@bluecatnetworks.com",
            "website": "bluecatnetworks.com",
            "designation": "CEO",
            "contact_name": "Michael Harris"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 149,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Block and Company, Inc.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "cbrugioni@blockinc.com",
            "website": "blockandcompany.com",
            "designation": "Creative Services & Marketing Communications",
            "contact_name": "Cindy Brugioni"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 150,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Belt Power, LLC",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "jshelton@beltpower.com",
            "website": "beltpower.com",
            "designation": "President",
            "contact_name": "John Shelton"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 151,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Amuneal Manufacturing Corp.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "adamk@amuneal.com",
            "website": "amuneal.com",
            "designation": "CEO",
            "contact_name": "Adam Kamens"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 152,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Almo Corporation",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "wchaiken@almo.com",
            "website": "almo.com",
            "designation": "Chief Operating Officer",
            "contact_name": "Warren Chaiken"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 153,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Align Production Systems",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "jstoecker@alignprod.com",
            "website": "alignproductionsystems.com",
            "designation": "CEO",
            "contact_name": "Jason Stoecker"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 154,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Active Power, Inc.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "johnpenver@activepower.com",
            "website": "https://www.activepower.com/en-GB",
            "designation": "Chief Financial Officer",
            "contact_name": "John K. Penver"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 155,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Engineering for Kids",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "droberts@engineeringforkids.net",
            "website": "engineeringforkids.com",
            "designation": "CEO",
            "contact_name": "Dori Roberts"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 156,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "BTI Consulting, Inc.",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "bruno@bti-consulting.net",
            "website": "bticonsulting.com",
            "designation": "Chief Executive Officer",
            "contact_name": "Bruno Tateossian"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    },
    {
        "id": 157,
        "question_type": "LEAD_GENERATION",
        "subject_type": "LEAD_GENERATION",
        "exam_level": "FRESHER",
        "question_text": "Photonova Studios",
        "image_url": null,
        "passage": null,
        "marks": 5,
        "options": {
            "email": "Rick@photonovastudios.com",
            "website": "photonovastudios.com",
            "designation": "President",
            "contact_name": "Rick Portanova"
        },
        "is_active": true,
        "created_by": 2,
        "answer_text": "",
        "explanation": ""
    }
]

def seed_questions():
    db = SessionLocal()
    try:
        print("🚀 Seeding questions...")
        total_seeded = 0
        total_updated = 0

        for item in QUESTIONS_DATA:
            existing = db.query(Question).filter(Question.id == item["id"]).first()

            if existing:
                existing.question_type = item["question_type"]
                existing.subject_type = item["subject_type"]
                existing.exam_level = item["exam_level"]
                existing.question_text = item["question_text"]
                existing.image_url = item.get("image_url")
                existing.passage = item.get("passage")
                existing.marks = item.get("marks", 5)
                existing.options = item.get("options")
                flag_modified(existing, "options")
                existing.is_active = item.get("is_active", True)
                
                # Update Answer
                ans = db.query(QuestionAnswer).filter(QuestionAnswer.question_id == existing.id).first()
                if ans:
                    ans.answer_text = item.get("answer_text", "")
                    ans.explanation = item.get("explanation", "")
                else:
                    new_ans = QuestionAnswer(
                        question_id=existing.id,
                        answer_text=item.get("answer_text", ""),
                        explanation=item.get("explanation", ""),
                        created_by=item.get("created_by", 1),
                    )
                    db.add(new_ans)
                total_updated += 1
            else:
                q_obj = Question(
                    id=item["id"],
                    question_type=item["question_type"],
                    subject_type=item["subject_type"],
                    exam_level=item["exam_level"],
                    question_text=item["question_text"],
                    image_url=item.get("image_url"),
                    passage=item.get("passage"),
                    marks=item.get("marks", 5),
                    options=item.get("options"),
                    is_active=item.get("is_active", True),
                    created_by=item.get("created_by", 1),
                )
                db.add(q_obj)
                db.flush()

                new_ans = QuestionAnswer(
                    question_id=q_obj.id,
                    answer_text=item.get("answer_text", ""),
                    explanation=item.get("explanation", ""),
                    created_by=item.get("created_by", 1),
                )
                db.add(new_ans)
                total_seeded += 1

        db.commit()
        print(f"✨ Questions seeding complete! Added: {total_seeded}, Updated: {total_updated}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding questions: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_questions()
