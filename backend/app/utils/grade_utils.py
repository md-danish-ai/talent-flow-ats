from enum import Enum


class GradeLabel(str, Enum):
    EXCELLENT = "Excellent"
    GOOD = "Good"
    ABOVE_AVERAGE = "Above Average"
    AVERAGE = "Average"
    BELOW_AVERAGE = "Below Average"
    POOR = "Poor"
    NA = "N/A"

    @classmethod
    def all_grades(cls):
        return [
            cls.EXCELLENT,
            cls.GOOD,
            cls.ABOVE_AVERAGE,
            cls.AVERAGE,
            cls.BELOW_AVERAGE,
            cls.POOR,
        ]
