/**
 * Gradient Template Component
 * Modern design with soft gradients and teal/cyan accents
 */

'use client';

import React from 'react';
import { TemplateProps, renderField, getAge, formatSiblings } from './BaseTemplate';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import {
  hasPersonalInfo,
  hasReligiousInfo,
  hasEducation,
  hasProfessionalInfo,
  hasFamilyInfo,
  hasContactInfo,
  hasExpectations,
} from '@/lib/sectionValidation';

export const GradientTemplate: React.FC<TemplateProps> = ({ bioData, className }) => {
  const t = useLanguage().t;
  const { personalInfo, religiousInfo, education, professionalInfo, familyInfo, contactInfo, partnerExpectations, photo } = bioData;

  return (
    <div className={cn('mx-auto w-[210mm] overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 via-cyan-50/80 to-slate-50 p-8 shadow-xl print:shadow-none', className)}>
      <div className="rounded-xl bg-white/90 p-8 shadow-sm backdrop-blur-sm">
        <header className="mb-8 flex items-start justify-between gap-6">
          <div>
            <h1 className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-4xl font-bold text-transparent">
              {renderField(personalInfo.fullName, t)}
            </h1>
            <p className="mt-2 text-sm font-medium text-teal-600">{t('template.marriageBioData')}</p>
          </div>
          {photo && (
            <div className="h-28 w-28 overflow-hidden rounded-2xl border-2 border-teal-200 shadow-md">
              <img src={photo} alt={t('common.profile')} className="h-full w-full object-cover" />
            </div>
          )}
        </header>

        <div className="space-y-6">
          {hasPersonalInfo(bioData) && (
            <GradSection title={t('template.personalInfo')}>
              <div className="grid grid-cols-2 gap-3">
                {personalInfo.fullName && <GradRow label={t('template.fullName')} value={personalInfo.fullName} />}
                {personalInfo.dateOfBirth && <GradRow label={t('template.age')} value={getAge(personalInfo.dateOfBirth, t)} />}
                {personalInfo.dateOfBirth && <GradRow label={t('template.dateOfBirth')} value={personalInfo.dateOfBirth} />}
                {personalInfo.height && <GradRow label={t('template.height')} value={personalInfo.height} />}
                {personalInfo.complexion && <GradRow label={t('template.complexion')} value={personalInfo.complexion} />}
                {personalInfo.bloodGroup && <GradRow label={t('template.bloodGroup')} value={personalInfo.bloodGroup} />}
                {personalInfo.maritalStatus && <GradRow label={t('template.maritalStatus')} value={personalInfo.maritalStatus} />}
                {personalInfo.nationality && <GradRow label={t('template.nationality')} value={personalInfo.nationality} />}
                {personalInfo.placeOfBirth && <GradRow label={t('template.placeOfBirth')} value={personalInfo.placeOfBirth} />}
              </div>
            </GradSection>
          )}

          {hasReligiousInfo(bioData) && (
            <GradSection title={t('template.religiousInfo')}>
              <div className="grid grid-cols-2 gap-3">
                {religiousInfo.prayerPractice && religiousInfo.prayerPractice !== 'None' && <GradRow label={t('template.prayerPractice')} value={religiousInfo.prayerPractice} />}
                {religiousInfo.quranRecitation && religiousInfo.quranRecitation !== 'None' && <GradRow label={t('template.quranRecitation')} value={religiousInfo.quranRecitation} />}
                {religiousInfo.islamicKnowledge && religiousInfo.islamicKnowledge !== 'None' && <GradRow label={t('template.islamicKnowledge')} value={religiousInfo.islamicKnowledge} />}
                {religiousInfo.hijabOrBeard && religiousInfo.hijabOrBeard !== 'None' && <GradRow label={t('template.hijabBeard')} value={religiousInfo.hijabOrBeard} />}
                {religiousInfo.sect && religiousInfo.sect !== 'None' && <GradRow label={t('template.sect')} value={religiousInfo.sect} />}
                {religiousInfo.madhab && <GradRow label={t('template.madhab')} value={religiousInfo.madhab} />}
              </div>
              {religiousInfo.otherReligiousInfo && <p className="mt-3 rounded-lg bg-teal-50/80 p-3 text-sm text-slate-600">{religiousInfo.otherReligiousInfo}</p>}
            </GradSection>
          )}

          {hasEducation(bioData) && (
            <GradSection title={t('template.educationalBackground')}>
              <div className="grid grid-cols-2 gap-3">
                {education.highestQualification && <GradRow label={t('template.qualification')} value={education.highestQualification} />}
                {education.institution && <GradRow label={t('template.institution')} value={education.institution} />}
                {education.fieldOfStudy && <GradRow label={t('template.fieldOfStudy')} value={education.fieldOfStudy} />}
                {education.yearOfCompletion && <GradRow label={t('template.yearOfCompletion')} value={education.yearOfCompletion} />}
              </div>
              {education.additionalQualifications && <p className="mt-3 rounded-lg bg-teal-50/80 p-3 text-sm text-slate-600">{education.additionalQualifications}</p>}
            </GradSection>
          )}

          {hasProfessionalInfo(bioData) && (
            <GradSection title={t('template.professionalInfo')}>
              <div className="grid grid-cols-2 gap-3">
                {professionalInfo.occupation && <GradRow label={t('template.occupation')} value={professionalInfo.occupation} />}
                {professionalInfo.company && <GradRow label={t('template.company')} value={professionalInfo.company} />}
                {professionalInfo.designation && <GradRow label={t('template.designation')} value={professionalInfo.designation} />}
                {professionalInfo.incomeRange && <GradRow label={t('template.annualIncome')} value={professionalInfo.incomeRange} />}
                {professionalInfo.workLocation && <GradRow label={t('template.workLocation')} value={professionalInfo.workLocation} />}
              </div>
            </GradSection>
          )}

          {hasFamilyInfo(bioData) && (
            <GradSection title={t('template.familyBackground')}>
              <div className="grid grid-cols-2 gap-3">
                {familyInfo.fatherName && <GradRow label={t('template.fatherName')} value={familyInfo.fatherName} />}
                {familyInfo.fatherOccupation && <GradRow label={t('template.fatherOccupation')} value={familyInfo.fatherOccupation} />}
                {familyInfo.motherName && <GradRow label={t('template.motherName')} value={familyInfo.motherName} />}
                {familyInfo.motherOccupation && <GradRow label={t('template.motherOccupation')} value={familyInfo.motherOccupation} />}
                {familyInfo.siblings && familyInfo.siblings.length > 0 && <GradRow label={t('template.siblings')} value={formatSiblings(familyInfo.siblings, t)} />}
                {familyInfo.familyType && <GradRow label={t('template.familyType')} value={familyInfo.familyType} />}
                {familyInfo.economicStatus && <GradRow label={t('template.economicStatus')} value={familyInfo.economicStatus} />}
              </div>
              {familyInfo.familyValues && <p className="mt-3 rounded-lg bg-teal-50/80 p-3 text-sm text-slate-600">{familyInfo.familyValues}</p>}
            </GradSection>
          )}

          {hasExpectations(bioData) && (
            <GradSection title={t('template.partnerExpectations')}>
              <div className="grid grid-cols-2 gap-3">
                {partnerExpectations.ageRange && <GradRow label={t('template.ageRange')} value={partnerExpectations.ageRange} />}
                {partnerExpectations.heightRange && <GradRow label={t('template.heightRange')} value={partnerExpectations.heightRange} />}
                {partnerExpectations.educationExpectation && <GradRow label={t('template.educationLabel')} value={partnerExpectations.educationExpectation} />}
                {partnerExpectations.occupationExpectation && <GradRow label={t('template.occupation')} value={partnerExpectations.occupationExpectation} />}
              </div>
              {partnerExpectations.religiousExpectation && <p className="mt-3 rounded-lg bg-teal-50/80 p-3 text-sm text-slate-600">{partnerExpectations.religiousExpectation}</p>}
              {partnerExpectations.otherExpectations && <p className="mt-2 rounded-lg bg-teal-50/80 p-3 text-sm text-slate-600">{partnerExpectations.otherExpectations}</p>}
            </GradSection>
          )}

          {hasContactInfo(bioData) && (
            <div className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 p-6 text-white">
              <h2 className="mb-4 text-lg font-semibold">{t('template.contactInfo')}</h2>
              <div className="grid grid-cols-2 gap-3">
                {contactInfo.email && <GradRowLight label={t('template.email')} value={contactInfo.email} />}
                {contactInfo.phone && <GradRowLight label={t('template.phone')} value={contactInfo.phone} />}
                {contactInfo.whatsapp && <GradRowLight label={t('template.whatsapp')} value={contactInfo.whatsapp} />}
                {contactInfo.guardianContact && <GradRowLight label={t('template.guardianContact')} value={contactInfo.guardianContact} />}
              </div>
              {contactInfo.permanentAddress && <p className="mt-4 text-sm opacity-95">{t('template.address')}: {contactInfo.permanentAddress}</p>}
              {contactInfo.currentAddress && <p className="mt-2 text-sm opacity-95">{t('template.currentAddress')}: {contactInfo.currentAddress}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GradSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-white to-teal-50/30 p-4">
    <h2 className="mb-3 border-b-2 border-teal-200 pb-2 text-base font-semibold text-teal-700">{title}</h2>
    {children}
  </div>
);

const GradRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex gap-2">
    <span className="text-sm font-medium text-teal-700">{label}:</span>
    <span className="text-sm text-slate-700">{value}</span>
  </div>
);

const GradRowLight: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <span className="text-xs font-semibold opacity-90">{label}:</span>
    <span className="ml-2 text-sm">{value}</span>
  </div>
);
