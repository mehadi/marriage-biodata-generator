/**
 * Validation Service
 * Single Responsibility: Handle all form validation logic
 * Centralized validation rules for consistency
 */

import { z } from 'zod';
import { BioData, ValidationError } from '@/types/biodata';
import { isValidEmail, isValidPhone } from '@/lib/utils';

// Zod schemas for validation (messages are i18n keys, translated in UI)
export const PersonalInfoSchema = z.object({
  fullName: z.string().min(2, 'validation.fullNameMin').max(100),
  dateOfBirth: z.string().min(1, 'validation.dateOfBirthRequired'),
  height: z.string().min(1, 'validation.heightRequired'),
  complexion: z.string().min(1, 'validation.complexionRequired'),
  bloodGroup: z.string().min(1, 'validation.bloodGroupRequired'),
  maritalStatus: z.enum(['Never Married', 'Divorced', 'Widowed']),
  nationality: z.string().min(1, 'validation.nationalityRequired'),
  placeOfBirth: z.string().min(1, 'validation.placeOfBirthRequired'),
});

export const ReligiousInfoSchema = z.object({
  prayerPractice: z.enum(['Regular 5 times', 'Mostly regular', 'Sometimes', 'Learning', 'None', '']).optional(),
  quranRecitation: z.enum(['Fluent', 'Learning', 'Basic', 'None', '']).optional(),
  islamicKnowledge: z.enum(['Advanced', 'Intermediate', 'Basic', 'Learning', 'None', '']).optional(),
  hijabOrBeard: z.enum(['Yes', 'No', 'Sometimes', 'Planning to', 'None', '']).optional(),
  sect: z.enum(['Sunni', 'Shia', 'Other', 'Prefer not to say', 'None', '']).optional(),
  madhab: z.string().optional(),
  otherReligiousInfo: z.string().optional(),
});

export const EducationSchema = z.object({
  highestQualification: z.string().min(1, 'validation.highestQualificationRequired'),
  institution: z.string().min(1, 'validation.institutionRequired'),
  fieldOfStudy: z.string().min(1, 'validation.fieldOfStudyRequired'),
  yearOfCompletion: z.string().min(4, 'validation.yearRequired'),
  additionalQualifications: z.string().optional(),
});

export const ProfessionalInfoSchema = z.object({
  occupation: z.string().min(1, 'validation.occupationRequired'),
  company: z.string().optional(),
  designation: z.string().optional(),
  incomeRange: z.string().min(1, 'validation.incomeRangeRequired'),
  workLocation: z.string().optional(),
});

export const SiblingSchema = z.object({
  relation: z.enum(['Brother', 'Sister']),
  name: z.string().optional(),
  occupation: z.string().optional(),
  maritalStatus: z.enum(['Married', 'Unmarried']).optional(),
});

export const FamilyInfoSchema = z.object({
  fatherName: z.string().min(2, 'validation.fatherNameRequired'),
  fatherOccupation: z.string().min(1, 'validation.fatherOccupationRequired'),
  motherName: z.string().min(2, 'validation.motherNameRequired'),
  motherOccupation: z.string().min(1, 'validation.motherOccupationRequired'),
  siblings: z.array(SiblingSchema),
  familyValues: z.string().optional(),
  economicStatus: z.enum(['Upper class', 'Upper middle class', 'Middle class', 'Lower middle class']),
  familyType: z.enum(['Nuclear', 'Joint']),
});

export const ContactInfoSchema = z.object({
  email: z.string().email('validation.invalidEmail'),
  phone: z.string().min(10, 'validation.phoneMin'),
  whatsapp: z.string().optional(),
  permanentAddress: z.string().min(10, 'validation.permanentAddressRequired'),
  currentAddress: z.string().optional(),
  guardianContact: z.string().optional(),
});

export const PartnerExpectationsSchema = z.object({
  ageRange: z.string().min(1, 'validation.ageRangeRequired'),
  heightRange: z.string().min(1, 'validation.heightRangeRequired'),
  educationExpectation: z.string().min(1, 'validation.educationExpectationRequired'),
  occupationExpectation: z.string().min(1, 'validation.occupationExpectationRequired'),
  religiousExpectation: z.string().min(1, 'validation.religiousExpectationRequired'),
  otherExpectations: z.string().optional(),
});

export const BioDataSchema = z.object({
  id: z.string().optional(),
  personalInfo: PersonalInfoSchema,
  religiousInfo: ReligiousInfoSchema,
  education: EducationSchema,
  professionalInfo: ProfessionalInfoSchema,
  familyInfo: FamilyInfoSchema,
  contactInfo: ContactInfoSchema,
  partnerExpectations: PartnerExpectationsSchema,
  photo: z.string().optional(),
  additionalInfo: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export class ValidationService {
  /**
   * Validate entire bio data
   */
  static validateBioData(bioData: Partial<BioData>): {
    isValid: boolean;
    errors: ValidationError[];
  } {
    try {
      BioDataSchema.parse(bioData);
      return { isValid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return { isValid: false, errors };
      }
      return { isValid: false, errors: [{ field: 'unknown', message: 'validation.validationFailed' }] };
    }
  }

  /**
   * Validate personal info section
   */
  static validatePersonalInfo(data: any): { isValid: boolean; errors: ValidationError[] } {
    try {
      PersonalInfoSchema.parse(data);
      return { isValid: true, errors: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return { isValid: false, errors };
      }
      return { isValid: false, errors: [] };
    }
  }

  /**
   * Validate email field
   */
  static validateEmail(email: string): boolean {
    return isValidEmail(email);
  }

  /**
   * Validate phone field
   */
  static validatePhone(phone: string): boolean {
    return isValidPhone(phone);
  }

  /**
   * Check if required fields are filled
   */
  static checkRequiredFields(bioData: Partial<BioData>): string[] {
    const missingFields: string[] = [];

    if (!bioData.personalInfo?.fullName) missingFields.push('Full Name');
    if (!bioData.personalInfo?.dateOfBirth) missingFields.push('Date of Birth');
    if (!bioData.contactInfo?.email) missingFields.push('Email');
    if (!bioData.contactInfo?.phone) missingFields.push('Phone');

    return missingFields;
  }

  /**
   * Calculate form completion percentage
   */
  static calculateCompletionPercentage(bioData: Partial<BioData>): number {
    let totalFields = 0;
    let filledFields = 0;

    const checkObject = (obj: any) => {
      if (!obj) return;
      
      Object.values(obj).forEach((value) => {
        totalFields++;
        if (value && value !== '' && (!Array.isArray(value) || value.length > 0)) {
          filledFields++;
        }
      });
    };

    checkObject(bioData.personalInfo);
    checkObject(bioData.religiousInfo);
    checkObject(bioData.education);
    checkObject(bioData.professionalInfo);
    checkObject(bioData.familyInfo);
    checkObject(bioData.contactInfo);
    checkObject(bioData.partnerExpectations);

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  }
}
