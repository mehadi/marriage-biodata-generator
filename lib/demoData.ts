/**
 * Demo Bio Data
 * Single Responsibility: Provide realistic sample data for demo/preview mode
 * Used to pre-fill the form so new users immediately see the product value
 */

import { BioData } from '@/types/biodata';

export const DEMO_BIO_DATA: Partial<BioData> = {
  personalInfo: {
    fullName: 'Mohammad Arif Rahman',
    dateOfBirth: '1997-03-15',
    gender: 'male',
    height: "5' 8\"",
    complexion: 'Wheatish',
    bloodGroup: 'O+',
    maritalStatus: 'Never Married',
    nationality: 'Bangladeshi',
    placeOfBirth: 'Dhaka, Bangladesh',
  },
  religiousInfo: {
    prayerPractice: 'Regular 5 times',
    quranRecitation: 'Fluent',
    islamicKnowledge: 'Intermediate',
    hijabOrBeard: 'Yes',
    sect: 'Sunni',
    madhab: 'Hanafi',
    otherReligiousInfo: 'Actively involved in local mosque activities and Islamic study circles.',
  },
  education: {
    highestQualification: 'B.Sc in Computer Science & Engineering',
    institution: 'Bangladesh University of Engineering and Technology (BUET)',
    fieldOfStudy: 'Computer Science & Engineering',
    yearOfCompletion: '2020',
    additionalQualifications: 'AWS Certified Solutions Architect (2022)',
  },
  professionalInfo: {
    occupation: 'Software Engineer',
    company: 'Dutch-Bangla Bank Limited',
    designation: 'Senior Software Engineer',
    incomeRange: '10-15 Lakhs',
    workLocation: 'Dhaka, Bangladesh',
  },
  familyInfo: {
    fatherName: 'Abdur Rahman',
    fatherOccupation: 'Retired Government Officer',
    motherName: 'Fatema Begum',
    motherOccupation: 'Homemaker',
    siblings: [
      { relation: 'Brother', name: 'Imran Rahman', occupation: 'MBBS Doctor', maritalStatus: 'Married' },
      { relation: 'Sister', name: 'Nasreen Rahman', occupation: 'School Teacher', maritalStatus: 'Married' },
    ],
    familyValues:
      'We are a religious, educated, and close-knit family who deeply values Islamic principles, family bonds, and respect for elders.',
    economicStatus: 'Middle class',
    familyType: 'Nuclear',
  },
  contactInfo: {
    email: 'arif.rahman@example.com',
    phone: '+880 1711-234567',
    whatsapp: '+880 1711-234567',
    permanentAddress: 'House #12, Road #5, Dhanmondi, Dhaka-1205, Bangladesh',
    currentAddress: 'House #12, Road #5, Dhanmondi, Dhaka-1205, Bangladesh',
    guardianContact: '+880 1722-345678',
  },
  partnerExpectations: {
    ageRange: '22-26 years',
    heightRange: "5'2\" - 5'6\"",
    educationExpectation: 'Graduate or above from a reputed institution',
    occupationExpectation: 'Open to all professions',
    religiousExpectation:
      'Practicing Muslim, observes hijab, regular in Salah, has good Islamic character and values.',
    otherExpectations:
      'Kind-hearted, family-oriented, and someone who shares compatible values and life goals.',
  },
  photo: undefined,
  photoSizePercent: 100,
  customFields: {
    'personal-info': [{ key: 'NID Number', value: '19971234567890' }],
    'religious-info': [],
    education: [],
    professional: [],
    family: [],
    contact: [],
    expectations: [],
  },
  additionalInfo: '',
};
