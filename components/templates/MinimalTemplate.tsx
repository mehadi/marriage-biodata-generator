/**
 * Minimal Template Component
 * Ultra-clean modern design: monochrome, generous whitespace, subtle typography
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
  hasExpectations,
} from '@/lib/sectionValidation';

export const MinimalTemplate: React.FC<TemplateProps> = ({ bioData, className }) => {
  const t = useLanguage().t;
  const { personalInfo, religiousInfo, education, professionalInfo, familyInfo, contactInfo, partnerExpectations, photo } = bioData;

  return (
    <div className={cn('mx-auto w-[210mm] bg-white p-12 print:shadow-none', className)}>
      <header className="mb-12 border-b border-slate-200 pb-10">
        <div className="flex items-start justify-between gap-8">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-light tracking-tight text-slate-900">
              {renderField(personalInfo.fullName, t)}
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              {t('template.marriageBioData')}
            </p>
          </div>
          {photo && (
            <div className="shrink-0 overflow-hidden rounded-sm border border-slate-200" style={getPhotoSizeStyle(112, bioData)}>
              <img src={photo} alt={t('common.profile')} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </header>

      <div className="space-y-10">
        {hasPersonalInfo(bioData) && (
          <MinimalSection title={t('template.personalInfo')}>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {personalInfo.fullName && <Row label={t('template.fullName')} value={personalInfo.fullName} />}
              {personalInfo.dateOfBirth && <Row label={t('template.age')} value={getAge(personalInfo.dateOfBirth, t)} />}
              {personalInfo.dateOfBirth && <Row label={t('template.dateOfBirth')} value={personalInfo.dateOfBirth} />}
              {personalInfo.height && <Row label={t('template.height')} value={personalInfo.height} />}
              {personalInfo.complexion && <Row label={t('template.complexion')} value={personalInfo.complexion} />}
              {personalInfo.bloodGroup && <Row label={t('template.bloodGroup')} value={personalInfo.bloodGroup} />}
              {personalInfo.maritalStatus && <Row label={t('template.maritalStatus')} value={personalInfo.maritalStatus} />}
              {personalInfo.nationality && <Row label={t('template.nationality')} value={personalInfo.nationality} />}
              {personalInfo.placeOfBirth && <Row label={t('template.placeOfBirth')} value={personalInfo.placeOfBirth} />}
            </div>
          </MinimalSection>
        )}

        {hasReligiousInfo(bioData) && (
          <MinimalSection title={t('template.religiousInfo')}>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {religiousInfo.prayerPractice && religiousInfo.prayerPractice !== 'None' && <Row label={t('template.prayerPractice')} value={religiousInfo.prayerPractice} />}
              {religiousInfo.quranRecitation && religiousInfo.quranRecitation !== 'None' && <Row label={t('template.quranRecitation')} value={religiousInfo.quranRecitation} />}
              {religiousInfo.islamicKnowledge && religiousInfo.islamicKnowledge !== 'None' && <Row label={t('template.islamicKnowledge')} value={religiousInfo.islamicKnowledge} />}
              {religiousInfo.hijabOrBeard && religiousInfo.hijabOrBeard !== 'None' && <Row label={t('template.hijabBeard')} value={religiousInfo.hijabOrBeard} />}
              {religiousInfo.sect && religiousInfo.sect !== 'None' && <Row label={t('template.sect')} value={religiousInfo.sect} />}
              {religiousInfo.madhab && <Row label={t('template.madhab')} value={religiousInfo.madhab} />}
            </div>
            {religiousInfo.otherReligiousInfo && <p className="mt-4 text-sm text-slate-500">{religiousInfo.otherReligiousInfo}</p>}
          </MinimalSection>
        )}

        {hasEducation(bioData) && (
          <MinimalSection title={t('template.educationalBackground')}>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {education.highestQualification && <Row label={t('template.qualification')} value={education.highestQualification} />}
              {education.institution && <Row label={t('template.institution')} value={education.institution} />}
              {education.fieldOfStudy && <Row label={t('template.fieldOfStudy')} value={education.fieldOfStudy} />}
              {education.yearOfCompletion && <Row label={t('template.yearOfCompletion')} value={education.yearOfCompletion} />}
            </div>
            {education.additionalQualifications && <p className="mt-4 text-sm text-slate-500">{education.additionalQualifications}</p>}
          </MinimalSection>
        )}

        {hasProfessionalInfo(bioData) && (
          <MinimalSection title={t('template.professionalInfo')}>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {professionalInfo.occupation && <Row label={t('template.occupation')} value={professionalInfo.occupation} />}
              {professionalInfo.company && <Row label={t('template.company')} value={professionalInfo.company} />}
              {professionalInfo.designation && <Row label={t('template.designation')} value={professionalInfo.designation} />}
              {professionalInfo.incomeRange && <Row label={t('template.annualIncome')} value={professionalInfo.incomeRange} />}
              {professionalInfo.workLocation && <Row label={t('template.workLocation')} value={professionalInfo.workLocation} />}
            </div>
          </MinimalSection>
        )}

        {hasFamilyInfo(bioData) && (
          <MinimalSection title={t('template.familyBackground')}>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {familyInfo.fatherName && <Row label={t('template.fatherName')} value={familyInfo.fatherName} />}
              {familyInfo.fatherOccupation && <Row label={t('template.fatherOccupation')} value={familyInfo.fatherOccupation} />}
              {familyInfo.motherName && <Row label={t('template.motherName')} value={familyInfo.motherName} />}
              {familyInfo.motherOccupation && <Row label={t('template.motherOccupation')} value={familyInfo.motherOccupation} />}
              {familyInfo.siblings && familyInfo.siblings.length > 0 && <Row label={t('template.siblings')} value={formatSiblings(familyInfo.siblings, t)} />}
              {familyInfo.familyType && <Row label={t('template.familyType')} value={familyInfo.familyType} />}
              {familyInfo.economicStatus && <Row label={t('template.economicStatus')} value={familyInfo.economicStatus} />}
            </div>
            {familyInfo.familyValues && <p className="mt-4 text-sm text-slate-500">{familyInfo.familyValues}</p>}
          </MinimalSection>
        )}

        {hasExpectations(bioData) && (
          <MinimalSection title={t('template.partnerExpectations')}>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {partnerExpectations.ageRange && <Row label={t('template.ageRange')} value={partnerExpectations.ageRange} />}
              {partnerExpectations.heightRange && <Row label={t('template.heightRange')} value={partnerExpectations.heightRange} />}
              {partnerExpectations.educationExpectation && <Row label={t('template.educationLabel')} value={partnerExpectations.educationExpectation} />}
              {partnerExpectations.occupationExpectation && <Row label={t('template.occupation')} value={partnerExpectations.occupationExpectation} />}
            </div>
            {partnerExpectations.religiousExpectation && <p className="mt-4 text-sm text-slate-500">{partnerExpectations.religiousExpectation}</p>}
            {partnerExpectations.otherExpectations && <p className="mt-2 text-sm text-slate-500">{partnerExpectations.otherExpectations}</p>}
          </MinimalSection>
        )}

        {hasContactInfo(bioData) && (
          <MinimalSection title={t('template.contactInfo')}>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {contactInfo.email && <Row label={t('template.email')} value={contactInfo.email} />}
              {contactInfo.phone && <Row label={t('template.phone')} value={contactInfo.phone} />}
              {contactInfo.whatsapp && <Row label={t('template.whatsapp')} value={contactInfo.whatsapp} />}
              {contactInfo.guardianContact && <Row label={t('template.guardianContact')} value={contactInfo.guardianContact} />}
            </div>
            {contactInfo.permanentAddress && <p className="mt-4 text-sm text-slate-600">{t('template.address')}: {contactInfo.permanentAddress}</p>}
            {contactInfo.currentAddress && <p className="mt-2 text-sm text-slate-600">{t('template.currentAddress')}: {contactInfo.currentAddress}</p>}
          </MinimalSection>
        )}
      </div>
    </div>
  );
};

const MinimalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h2 className="mb-5 text-xs font-medium uppercase tracking-widest text-slate-400">{title}</h2>
    <div className="border-l border-slate-200 pl-6">{children}</div>
  </section>
);

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex gap-4">
    <span className="w-32 shrink-0 text-sm text-slate-400">{label}</span>
    <span className="text-sm text-slate-800">{value}</span>
  </div>
);
