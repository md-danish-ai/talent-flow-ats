from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional, Dict


class PersonalDetailsSchema(BaseModel):
    firstName: str
    lastName: str
    gender: str
    dob: str
    primaryMobile: str
    alternateMobile: Optional[str] = ""
    email: Optional[EmailStr] = None

    @validator("email", pre=True)
    def empty_email_to_none(cls, v):
        if v == "" or v is None:
            return None
        return v

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


class AdditionalPersonalDetailsSchema(BaseModel):
    bloodGroup: Optional[str] = ""
    aadhaarNo: str
    nameAsPerAadhaar: str
    panNo: str
    nameAsPerPan: str
    religion: str
    category: str
    maritalStatus: str
    anniversaryDate: Optional[str] = ""


class FamilyDetailSchema(BaseModel):
    id: int
    relationLabel: str
    relation: str
    name: str
    occupation: str
    dependent: str
    contactNo: Optional[str] = ""


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
    details: Optional[str] = ""


class WorkExperienceDetailSchema(BaseModel):
    id: int
    company: str
    employmentType: str
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
    is_interview_submitted: bool = False
    personalDetails: PersonalDetailsSchema
    additionalPersonalDetails: Optional[AdditionalPersonalDetailsSchema] = None
    familyDetails: List[FamilyDetailSchema]
    sourceOfInformation: SourceOfInformationSchema
    educationDetails: List[EducationDetailSchema]
    workExperienceDetails: List[WorkExperienceDetailSchema]
    otherDetails: OtherDetailsSchema
    emergency_contact_relation: Optional[str] = None
    assigned_emergency_relation: Optional[str] = None


class AssignEmergencyRelationPayload(BaseModel):
    user_id: int
    relation_code: str
