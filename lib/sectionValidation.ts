/**
 * Section Validation Utilities
 * Check if sections have minimum required data to be displayed
 */

import { BioData } from '@/types/biodata';

/**
 * Check if personal info section has sufficient data
 * Shows section if ANY field is filled
 */
export function hasPersonalInfo(data: Partial<BioData>): boolean {
  const info = data.personalInfo;
  if (!info) return false;
  
  return !!(
    info.fullName ||
    info.dateOfBirth ||
    info.height ||
    info.complexion ||
    info.bloodGroup ||
    info.maritalStatus ||
    info.nationality ||
    info.placeOfBirth
  );
}

/**
 * Check if religious info section has sufficient data
 */
export function hasReligiousInfo(data: Partial<BioData>): boolean {
  const info = data.religiousInfo;
  if (!info) return false;
  
  // At least one field should be filled (excluding empty strings and 'None')
  return !!(
    (info.prayerPractice && info.prayerPractice !== 'None' && info.prayerPractice !== '') ||
    (info.quranRecitation && info.quranRecitation !== 'None' && info.quranRecitation !== '') ||
    (info.islamicKnowledge && info.islamicKnowledge !== 'None' && info.islamicKnowledge !== '') ||
    (info.hijabOrBeard && info.hijabOrBeard !== 'None' && info.hijabOrBeard !== '') ||
    (info.sect && info.sect !== 'None' && info.sect !== '') ||
    (info.madhab && info.madhab.trim() !== '') ||
    (info.otherReligiousInfo && info.otherReligiousInfo.trim() !== '')
  );
}

/**
 * Check if education section has sufficient data
 * Shows section if ANY field is filled
 */
export function hasEducation(data: Partial<BioData>): boolean {
  const info = data.education;
  if (!info) return false;
  
  return !!(
    (info.highestQualification && info.highestQualification.trim() !== '') ||
    (info.institution && info.institution.trim() !== '') ||
    (info.fieldOfStudy && info.fieldOfStudy.trim() !== '') ||
    (info.yearOfCompletion && info.yearOfCompletion.trim() !== '') ||
    (info.additionalQualifications && info.additionalQualifications.trim() !== '')
  );
}

/**
 * Check if professional section has sufficient data
 * Shows section if ANY field is filled
 */
export function hasProfessionalInfo(data: Partial<BioData>): boolean {
  const info = data.professionalInfo;
  if (!info) return false;
  
  return !!(
    (info.occupation && info.occupation.trim() !== '') ||
    (info.company && info.company.trim() !== '') ||
    (info.designation && info.designation.trim() !== '') ||
    (info.incomeRange && info.incomeRange.trim() !== '') ||
    (info.workLocation && info.workLocation.trim() !== '')
  );
}

/**
 * Check if family section has sufficient data
 * Shows section if ANY field is filled
 */
export function hasFamilyInfo(data: Partial<BioData>): boolean {
  const info = data.familyInfo;
  if (!info) return false;
  
  return !!(
    (info.fatherName && info.fatherName.trim() !== '') ||
    (info.fatherOccupation && info.fatherOccupation.trim() !== '') ||
    (info.motherName && info.motherName.trim() !== '') ||
    (info.motherOccupation && info.motherOccupation.trim() !== '') ||
    info.economicStatus ||
    info.familyType ||
    (info.siblings && info.siblings.length > 0) ||
    (info.familyValues && info.familyValues.trim() !== '')
  );
}

/**
 * Check if contact section has sufficient data
 * Shows section if ANY field is filled
 */
export function hasContactInfo(data: Partial<BioData>): boolean {
  const info = data.contactInfo;
  if (!info) return false;
  
  return !!(
    (info.email && info.email.trim() !== '') ||
    (info.phone && info.phone.trim() !== '') ||
    (info.whatsapp && info.whatsapp.trim() !== '') ||
    (info.permanentAddress && info.permanentAddress.trim() !== '') ||
    (info.currentAddress && info.currentAddress.trim() !== '') ||
    (info.guardianContact && info.guardianContact.trim() !== '')
  );
}

/**
 * Check if expectations section has sufficient data
 * Shows section if ANY field is filled
 */
export function hasExpectations(data: Partial<BioData>): boolean {
  const info = data.partnerExpectations;
  if (!info) return false;
  
  return !!(
    (info.ageRange && info.ageRange.trim() !== '') ||
    (info.heightRange && info.heightRange.trim() !== '') ||
    (info.educationExpectation && info.educationExpectation.trim() !== '') ||
    (info.occupationExpectation && info.occupationExpectation.trim() !== '') ||
    (info.religiousExpectation && info.religiousExpectation.trim() !== '') ||
    (info.otherExpectations && info.otherExpectations.trim() !== '')
  );
}
