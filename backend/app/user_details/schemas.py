from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict

class PersonalDetailsSchema(BaseModel):
    firstName: str
    lastName: str
    gender: str
    dob: str
    primaryMobile: str
    alternateMobile: Optional[str] = ""
    email: EmailStr
    presentAddressLine1: str
    presentAddressLine2: Optional[str] = ""
    presentState: str
    presentDistrict: str
    presentCity: str
    presentPincode: str
    permanentAddressLine1: str
    permanentAddressLine2: Optional[str] = ""
    permanentState: str
    permanentDistrict: str
    permanentCity: str
    permanentPincode: str
    sameAddress: bool

class FamilyDetailSchema(BaseModel):
    id: int
    relationLabel: str
    relation: str
    name: str
    occupation: str
    dependent: str

class SourceOfInformationSchema(BaseModel):
    interviewedBefore: str
    workedBefore: str
    source: Dict[str, bool]

class EducationDetailSchema(BaseModel):
    id: int
    type: str
    school: str
    board: str
    year: str
    division: str
    percentage: str
    medium: str

class WorkExperienceDetailSchema(BaseModel):
    id: int
    company: str
    designation: str
    joinDate: str
    relieveDate: str
    reason: str
    salary: str

class OtherDetailsSchema(BaseModel):
    serviceCommitment: str
    securityDeposit: str
    shiftTime: str
    expectedJoiningDate: str
    expectedSalary: str

class UserDetailsSchema(BaseModel):
    is_submitted: bool = False
    personalDetails: PersonalDetailsSchema
    familyDetails: List[FamilyDetailSchema]
    sourceOfInformation: SourceOfInformationSchema
    educationDetails: List[EducationDetailSchema]
    workExperienceDetails: List[WorkExperienceDetailSchema]
    otherDetails: OtherDetailsSchema
