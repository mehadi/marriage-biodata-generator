/**
 * Type definitions for Marriage Bio Data
 * Following SOLID principles with clear interface segregation
 */

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  age?: number;
  gender?: 'male' | 'female';
  height: string;
  complexion: string;
  bloodGroup: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed';
  nationality: string;
  placeOfBirth: string;
}

export interface ReligiousInfo {
  prayerPractice?: 'Regular 5 times' | 'Mostly regular' | 'Sometimes' | 'Learning' | 'None' | '';
  quranRecitation?: 'Fluent' | 'Learning' | 'Basic' | 'None' | '';
  islamicKnowledge?: 'Advanced' | 'Intermediate' | 'Basic' | 'Learning' | 'None' | '';
  hijabOrBeard?: 'Yes' | 'No' | 'Sometimes' | 'Planning to' | 'None' | '';
  sect?: 'Sunni' | 'Shia' | 'Other' | 'Prefer not to say' | 'None' | '';
  madhab?: string;
  otherReligiousInfo?: string;
}

export interface Education {
  highestQualification: string;
  institution: string;
  fieldOfStudy: string;
  yearOfCompletion: string;
  additionalQualifications?: string;
}

export interface ProfessionalInfo {
  occupation: string;
  company?: string;
  designation?: string;
  incomeRange: string;
  workLocation?: string;
}

export interface FamilyMember {
  name: string;
  occupation: string;
  age?: string;
}

export interface Sibling {
  relation: 'Brother' | 'Sister';
  name?: string;
  occupation?: string;
  maritalStatus?: 'Married' | 'Unmarried';
}

export interface FamilyInfo {
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: Sibling[];
  familyValues?: string;
  economicStatus: 'Upper class' | 'Upper middle class' | 'Middle class' | 'Lower middle class';
  familyType: 'Nuclear' | 'Joint';
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp?: string;
  permanentAddress: string;
  currentAddress?: string;
  guardianContact?: string;
}

export interface PartnerExpectations {
  ageRange: string;
  heightRange: string;
  educationExpectation: string;
  occupationExpectation: string;
  religiousExpectation: string;
  otherExpectations?: string;
}

/** Custom key-value pair for dynamic fields within a section */
export interface CustomFieldEntry {
  key: string;
  value: string;
}

/** Section IDs for custom fields - matches form card IDs */
export type CustomFieldsSectionId =
  | 'personal-info'
  | 'religious-info'
  | 'education'
  | 'professional'
  | 'family'
  | 'contact'
  | 'expectations';

export interface BioData {
  id?: string;
  personalInfo: PersonalInfo;
  religiousInfo: ReligiousInfo;
  education: Education;
  professionalInfo: ProfessionalInfo;
  familyInfo: FamilyInfo;
  contactInfo: ContactInfo;
  partnerExpectations: PartnerExpectations;
  photo?: string; // base64 encoded image
  /** Photo display size in preview/export (50–200%). Default 100. */
  photoSizePercent?: number;
  /** Dynamic key-value pairs per section for user-defined fields beyond standard structure */
  customFields?: Partial<Record<CustomFieldsSectionId, CustomFieldEntry[]>>;
  /** User-defined section display order (array of section IDs) */
  sectionOrder?: string[];
  additionalInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedDraft {
  id: string;
  bioData: BioData;
  timestamp: string;
  name: string;
}

export interface TemplateProps {
  bioData: BioData;
  className?: string;
}

export type TemplateType =
  | 'modern'
  | 'traditional'
  | 'elegant'
  | 'minimal'
  | 'gradient'
  | 'card'
  | 'formal'
  | 'heritage';

export type ExportFormat = 'pdf' | 'image' | 'print';

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormSection {
  id: string;
  title: string;
  isComplete: boolean;
  isValid: boolean;
}

// Dropdown options for consistent data
export const COMPLEXION_OPTIONS = [
  'Very Fair',
  'Fair',
  'Wheatish',
  'Medium',
  'Dark'
] as const;

export const BLOOD_GROUP_OPTIONS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
  'Unknown'
] as const;

export const HEIGHT_OPTIONS = Array.from({ length: 46 }, (_, i) => {
  const feet = Math.floor((i + 48) / 12);
  const inches = (i + 48) % 12;
  return `${feet}' ${inches}"`;
});

export const INCOME_RANGES = [
  'Below 2 Lakhs',
  '2-5 Lakhs',
  '5-10 Lakhs',
  '10-15 Lakhs',
  '15-20 Lakhs',
  '20-30 Lakhs',
  '30-50 Lakhs',
  'Above 50 Lakhs',
  'Prefer not to say'
] as const;
