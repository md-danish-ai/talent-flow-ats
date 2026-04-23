export interface PersonalDetails {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  primaryMobile: string;
  alternateMobile?: string;
  email: string;
  presentAddressLine1: string;
  presentAddressLine2?: string;
  presentState: string;
  presentDistrict: string;
  presentCity: string;
  presentPincode: string;
  permanentAddressLine1: string;
  permanentAddressLine2?: string;
  permanentState: string;
  permanentDistrict: string;
  permanentCity: string;
  permanentPincode: string;
  sameAddress: boolean;
}

export interface FamilyDetail {
  id: number;
  relationLabel: string;
  relation: string;
  name: string;
  occupation: string;
  dependent: string;
}

export interface SourceOfInformation {
  interviewedBefore: string;
  workedBefore: string;
  source: Record<string, boolean>;
}

export interface EducationDetail {
  id: number;
  type: string;
  school: string;
  board: string;
  year: string;
  division: string;
  percentage: string;
  medium: string;
}

export interface WorkExperienceDetail {
  id: number;
  company: string;
  designation: string;
  joinDate: string;
  relieveDate: string;
  reason: string;
  salary: string;
}

export interface OtherDetails {
  serviceCommitment: string;
  securityDeposit: string;
  shiftTime: string;
  expectedJoiningDate: string;
  expectedSalary: string;
}

export interface UserDetails {
  is_submitted: boolean;
  is_interview_submitted: boolean;
  username?: string;
  mobile?: string;
  email?: string;
  test_level_id?: number | string;
  test_level_name?: string;
  department_id?: number | string;
  personalDetails: PersonalDetails;
  familyDetails: FamilyDetail[];
  sourceOfInformation: SourceOfInformation;
  educationDetails: EducationDetail[];
  workExperienceDetails: WorkExperienceDetail[];
  otherDetails: OtherDetails;
}
