/**
 * Modern Template Component
 * Clean, minimalist design with accent colors
 */

'use client';

import React from 'react';
import { TemplateProps, renderField, getAge, formatSiblings, getPhotoSizeStyle } from './BaseTemplate';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { 
  hasPersonalInfo, 
  hasReligiousInfo, 
  hasEducation, 
  hasProfessionalInfo, 
  hasFamilyInfo, 
  hasContactInfo, 
  hasExpectations 
} from '@/lib/sectionValidation';

export const ModernTemplate: React.FC<TemplateProps> = ({ bioData, className }) => {
  const t = useLanguage().t;
  const { personalInfo, religiousInfo, education, professionalInfo, familyInfo, contactInfo, partnerExpectations, photo } = bioData;

  return (
    <div className={cn('mx-auto w-[210mm] bg-white p-8 shadow-lg print:shadow-none', className)}>
      <div className="mb-8 border-b-4 border-emerald-600 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-4xl font-bold text-slate-900">{renderField(personalInfo.fullName, t)}</h1>
            <p className="text-lg text-emerald-600">{t('template.marriageBioData')}</p>
          </div>
          {photo && (
            <div className="ml-4 shrink-0 overflow-hidden rounded-lg border-4 border-emerald-600" style={getPhotoSizeStyle(128, bioData)}>
              <img src={photo} alt={t('common.profile')} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {hasPersonalInfo(bioData) && (
        <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-emerald-600">{t('template.personalInfo')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {personalInfo.fullName && <InfoRow label={t('template.fullName')} value={personalInfo.fullName} />}
            {personalInfo.dateOfBirth && <InfoRow label={t('template.age')} value={getAge(personalInfo.dateOfBirth, t)} />}
            {personalInfo.dateOfBirth && <InfoRow label={t('template.dateOfBirth')} value={personalInfo.dateOfBirth} />}
            {personalInfo.height && <InfoRow label={t('template.height')} value={personalInfo.height} />}
            {personalInfo.complexion && <InfoRow label={t('template.complexion')} value={personalInfo.complexion} />}
            {personalInfo.bloodGroup && <InfoRow label={t('template.bloodGroup')} value={personalInfo.bloodGroup} />}
            {personalInfo.maritalStatus && <InfoRow label={t('template.maritalStatus')} value={personalInfo.maritalStatus} />}
            {personalInfo.nationality && <InfoRow label={t('template.nationality')} value={personalInfo.nationality} />}
            {personalInfo.placeOfBirth && <InfoRow label={t('template.placeOfBirth')} value={personalInfo.placeOfBirth} />}
          </div>
        </section>
      )}

      {hasReligiousInfo(bioData) && (
        <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-emerald-600">{t('template.religiousInfo')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {religiousInfo.prayerPractice && religiousInfo.prayerPractice !== 'None' && <InfoRow label={t('template.prayerPractice')} value={religiousInfo.prayerPractice} />}
            {religiousInfo.quranRecitation && religiousInfo.quranRecitation !== 'None' && <InfoRow label={t('template.quranRecitation')} value={religiousInfo.quranRecitation} />}
            {religiousInfo.islamicKnowledge && religiousInfo.islamicKnowledge !== 'None' && <InfoRow label={t('template.islamicKnowledge')} value={religiousInfo.islamicKnowledge} />}
            {religiousInfo.hijabOrBeard && religiousInfo.hijabOrBeard !== 'None' && <InfoRow label={t('template.hijabBeard')} value={religiousInfo.hijabOrBeard} />}
            {religiousInfo.sect && religiousInfo.sect !== 'None' && <InfoRow label={t('template.sect')} value={religiousInfo.sect} />}
            {religiousInfo.madhab && <InfoRow label={t('template.madhab')} value={religiousInfo.madhab} />}
          </div>
          {religiousInfo.otherReligiousInfo && (
            <div className="mt-3">
              <p className="text-sm text-slate-600">{religiousInfo.otherReligiousInfo}</p>
            </div>
          )}
        </section>
      )}

      {hasEducation(bioData) && (
        <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-emerald-600">{t('template.educationalBackground')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {education.highestQualification && <InfoRow label={t('template.qualification')} value={education.highestQualification} />}
            {education.institution && <InfoRow label={t('template.institution')} value={education.institution} />}
            {education.fieldOfStudy && <InfoRow label={t('template.fieldOfStudy')} value={education.fieldOfStudy} />}
            {education.yearOfCompletion && <InfoRow label={t('template.yearOfCompletion')} value={education.yearOfCompletion} />}
          </div>
          {education.additionalQualifications && (
            <div className="mt-3">
              <p className="text-sm font-medium text-slate-700">{t('template.additionalQualifications')}:</p>
              <p className="text-sm text-slate-600">{education.additionalQualifications}</p>
            </div>
          )}
        </section>
      )}

      {hasProfessionalInfo(bioData) && (
        <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-emerald-600">{t('template.professionalInfo')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {professionalInfo.occupation && <InfoRow label={t('template.occupation')} value={professionalInfo.occupation} />}
            {professionalInfo.company && <InfoRow label={t('template.company')} value={professionalInfo.company} />}
            {professionalInfo.designation && <InfoRow label={t('template.designation')} value={professionalInfo.designation} />}
            {professionalInfo.incomeRange && <InfoRow label={t('template.annualIncome')} value={professionalInfo.incomeRange} />}
            {professionalInfo.workLocation && <InfoRow label={t('template.workLocation')} value={professionalInfo.workLocation} />}
          </div>
        </section>
      )}

      {hasFamilyInfo(bioData) && (
        <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-emerald-600">{t('template.familyBackground')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {familyInfo.fatherName && <InfoRow label={t('template.fatherName')} value={familyInfo.fatherName} />}
            {familyInfo.fatherOccupation && <InfoRow label={t('template.fatherOccupation')} value={familyInfo.fatherOccupation} />}
            {familyInfo.motherName && <InfoRow label={t('template.motherName')} value={familyInfo.motherName} />}
            {familyInfo.motherOccupation && <InfoRow label={t('template.motherOccupation')} value={familyInfo.motherOccupation} />}
            {familyInfo.siblings && familyInfo.siblings.length > 0 && <InfoRow label={t('template.siblings')} value={formatSiblings(familyInfo.siblings, t)} />}
            {familyInfo.familyType && <InfoRow label={t('template.familyType')} value={familyInfo.familyType} />}
            {familyInfo.economicStatus && <InfoRow label={t('template.economicStatus')} value={familyInfo.economicStatus} />}
          </div>
          {familyInfo.familyValues && (
            <div className="mt-3">
              <p className="text-sm font-medium text-slate-700">{t('template.familyValues')}:</p>
              <p className="text-sm text-slate-600">{familyInfo.familyValues}</p>
            </div>
          )}
        </section>
      )}

      {hasExpectations(bioData) && (
        <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-emerald-600">{t('template.partnerExpectations')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {partnerExpectations.ageRange && <InfoRow label={t('template.ageRange')} value={partnerExpectations.ageRange} />}
            {partnerExpectations.heightRange && <InfoRow label={t('template.heightRange')} value={partnerExpectations.heightRange} />}
            {partnerExpectations.educationExpectation && <InfoRow label={t('template.educationLabel')} value={partnerExpectations.educationExpectation} />}
            {partnerExpectations.occupationExpectation && <InfoRow label={t('template.occupation')} value={partnerExpectations.occupationExpectation} />}
          </div>
          {partnerExpectations.religiousExpectation && (
            <div className="mt-3">
              <p className="text-sm font-medium text-slate-700">{t('template.religiousExpectation')}:</p>
              <p className="text-sm text-slate-600">{partnerExpectations.religiousExpectation}</p>
            </div>
          )}
          {partnerExpectations.otherExpectations && (
            <div className="mt-3">
              <p className="text-sm font-medium text-slate-700">{t('template.otherExpectations')}:</p>
              <p className="text-sm text-slate-600">{partnerExpectations.otherExpectations}</p>
            </div>
          )}
        </section>
      )}

      {hasContactInfo(bioData) && (
        <section className="rounded-lg bg-emerald-50 p-4">
          <h2 className="mb-4 text-xl font-semibold text-emerald-600">{t('template.contactInfo')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {contactInfo.email && <InfoRow label={t('template.email')} value={contactInfo.email} />}
            {contactInfo.phone && <InfoRow label={t('template.phone')} value={contactInfo.phone} />}
            {contactInfo.whatsapp && <InfoRow label={t('template.whatsapp')} value={contactInfo.whatsapp} />}
            {contactInfo.guardianContact && <InfoRow label={t('template.guardianContact')} value={contactInfo.guardianContact} />}
          </div>
          {contactInfo.permanentAddress && (
            <div className="mt-3">
              <p className="text-sm font-medium text-slate-700">{t('template.address')}:</p>
              <p className="text-sm text-slate-600">{contactInfo.permanentAddress}</p>
            </div>
          )}
          {contactInfo.currentAddress && (
            <div className="mt-2">
              <p className="text-sm font-medium text-slate-700">{t('template.currentAddress')}:</p>
              <p className="text-sm text-slate-600">{contactInfo.currentAddress}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <span className="text-sm font-medium text-slate-700">{label}:</span>
    <span className="ml-2 text-sm text-slate-600">{value}</span>
  </div>
);
