import re


def compute_division_and_grade(percentage_str: str, default_division: str = "") -> str:
    """
    Computes Division / Grade label based on Percentage or CGPA string according to Govt standards.
    Rules:
    - Percentage (%):
        >= 60%       -> "First"
        48% - 59.99% -> "Second"
        36% - 47.99% -> "Third"
        < 36%        -> "Fail"
    - CGPA:
        10.0         -> "First (O)"
        9.0 - 9.99   -> "First (A+)"
        8.0 - 8.99   -> "First (A)"
        7.0 - 7.99   -> "First (B+)"
        6.0 - 6.99   -> "First (B)"
        5.0 - 5.99   -> "Second (C)"
        4.0 - 4.99   -> "Third (P)"
        < 4.0        -> "Fail (F)"
    """
    if not percentage_str:
        return default_division or ""

    raw_str = str(percentage_str).strip()
    upper_str = raw_str.upper()

    is_cgpa = "CGPA" in upper_str

    match = re.search(r"[-+]?\d*\.\d+|\d+", raw_str)
    if not match:
        return default_division or raw_str

    try:
        val = float(match.group())
    except ValueError:
        return default_division or raw_str

    # Auto-detect if value <= 10.0 (treat as CGPA unless explicit % sign is present or val > 10)
    if is_cgpa or (val <= 10.0 and "%" not in raw_str):
        cgpa = val
        if cgpa >= 10.0:
            return "First (O)"
        elif cgpa >= 9.0:
            return "First (A+)"
        elif cgpa >= 8.0:
            return "First (A)"
        elif cgpa >= 7.0:
            return "First (B+)"
        elif cgpa >= 6.0:
            return "First (B)"
        elif cgpa >= 5.0:
            return "Second (C)"
        elif cgpa >= 4.0:
            return "Third (P)"
        else:
            return "Fail (F)"
    else:
        pct = val
        if pct >= 60.0:
            return "First"
        elif pct >= 48.0:
            return "Second"
        elif pct >= 36.0:
            return "Third"
        else:
            return "Fail"


def format_percentage_or_cgpa(percentage_str: str) -> str:
    """
    Appends '%' if value is a percentage (e.g. 87 -> 87%),
    or returns as-is if it's CGPA (e.g. 9 -> 9) or already has '%'.
    """
    if not percentage_str:
        return ""

    raw_str = str(percentage_str).strip()
    if "%" in raw_str:
        return raw_str

    upper_str = raw_str.upper()
    if "CGPA" in upper_str:
        return raw_str

    match = re.search(r"[-+]?\d*\.\d+|\d+", raw_str)
    if not match:
        return raw_str

    try:
        val = float(match.group())
        if val > 10.0:
            return f"{raw_str}%"
    except ValueError:
        pass

    return raw_str
