from enum import Enum

class GradeLabel(str, Enum):
    EXCELLENT = "Excellent"
    GOOD = "Good"
    AVERAGE = "Average"
    POOR = "Poor"
    NA = "N/A"

    @classmethod
    def all_grades(cls):
        return [cls.EXCELLENT, cls.GOOD, cls.AVERAGE, cls.POOR]
