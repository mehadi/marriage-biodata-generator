/**
 * Card Template Component
 * Modern card-based layout with indigo/violet accents and soft shadows
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

export const CardTemplate: React.FC<TemplateProps> = ({ bioData, className }) => {
  const t = useLanguage().t;
  const { personalInfo, religiousInfo, education, professionalInfo, familyInfo, contactInfo, partnerExpectations, photo } = bioData;

  return (
    <div className={cn('mx-auto w-[210mm] bg-slate-100/80 p-6 shadow-lg print:shadow-none', className)}>
      <div className="mb-6 rounded-2xl bg-white p-8 shadow-md">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">{renderField(personalInfo.fullName, t)}</h1>
            <p className="mt-1 text-sm font-medium text-indigo-600">{t('template.marriageBioData')}</p>
          </div>
          {photo && (
            <div className="overflow-hidden rounded-xl border-2 border-indigo-200 shadow" style={getPhotoSizeStyle(96, bioData)}>
              <img src={photo} alt={t('common.profile')} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {hasPersonalInfo(bioData) && (
          <Card title={t('template.personalInfo')}>
            {personalInfo.fullName && <CardRow label={t('template.fullName')} value={personalInfo.fullName} />}
            {personalInfo.dateOfBirth && <CardRow label={t('template.age')} value={getAge(personalInfo.dateOfBirth, t)} />}
            {personalInfo.dateOfBirth && <CardRow label={t('template.dateOfBirth')} value={personalInfo.dateOfBirth} />}
            {personalInfo.height && <CardRow label={t('template.height')} value={personalInfo.height} />}
            {personalInfo.complexion && <CardRow label={t('template.complexion')} value={personalInfo.complexion} />}
            {personalInfo.bloodGroup && <CardRow label={t('template.bloodGroup')} value={personalInfo.bloodGroup} />}
            {personalInfo.maritalStatus && <CardRow label={t('template.maritalStatus')} value={personalInfo.maritalStatus} />}
            {personalInfo.nationality && <CardRow label={t('template.nationality')} value={personalInfo.nationality} />}
            {personalInfo.placeOfBirth && <CardRow label={t('template.placeOfBirth')} value={personalInfo.placeOfBirth} />}
          </Card>
        )}

        {hasReligiousInfo(bioData) && (
          <Card title={t('template.religiousInfo')}>
            {religiousInfo.prayerPractice && religiousInfo.prayerPractice !== 'None' && <CardRow label={t('template.prayerPractice')} value={religiousInfo.prayerPractice} />}
            {religiousInfo.quranRecitation && religiousInfo.quranRecitation !== 'None' && <CardRow label={t('template.quranRecitation')} value={religiousInfo.quranRecitation} />}
            {religiousInfo.islamicKnowledge && religiousInfo.islamicKnowledge !== 'None' && <CardRow label={t('template.islamicKnowledge')} value={religiousInfo.islamicKnowledge} />}
            {religiousInfo.hijabOrBeard && religiousInfo.hijabOrBeard !== 'None' && <CardRow label={t('template.hijabBeard')} value={religiousInfo.hijabOrBeard} />}
            {religiousInfo.sect && religiousInfo.sect !== 'None' && <CardRow label={t('template.sect')} value={religiousInfo.sect} />}
            {religiousInfo.madhab && <CardRow label={t('template.madhab')} value={religiousInfo.madhab} />}
            {religiousInfo.otherReligiousInfo && <p className="mt-3 text-sm text-slate-600">{religiousInfo.otherReligiousInfo}</p>}
          </Card>
        )}

        {hasEducation(bioData) && (
          <Card title={t('template.educationalBackground')}>
            {education.highestQualification && <CardRow label={t('template.qualification')} value={education.highestQualification} />}
            {education.institution && <CardRow label={t('template.institution')} value={education.institution} />}
            {education.fieldOfStudy && <CardRow label={t('template.fieldOfStudy')} value={education.fieldOfStudy} />}
            {education.yearOfCompletion && <CardRow label={t('template.yearOfCompletion')} value={education.yearOfCompletion} />}
            {education.additionalQualifications && <p className="mt-3 text-sm text-slate-600">{education.additionalQualifications}</p>}
          </Card>
        )}

        {hasProfessionalInfo(bioData) && (
          <Card title={t('template.professionalInfo')}>
            {professionalInfo.occupation && <CardRow label={t('template.occupation')} value={professionalInfo.occupation} />}
            {professionalInfo.company && <CardRow label={t('template.company')} value={professionalInfo.company} />}
            {professionalInfo.designation && <CardRow label={t('template.designation')} value={professionalInfo.designation} />}
            {professionalInfo.incomeRange && <CardRow label={t('template.annualIncome')} value={professionalInfo.incomeRange} />}
            {professionalInfo.workLocation && <CardRow label={t('template.workLocation')} value={professionalInfo.workLocation} />}
          </Card>
        )}

        {hasFamilyInfo(bioData) && (
          <Card title={t('template.familyBackground')}>
            {familyInfo.fatherName && <CardRow label={t('template.fatherName')} value={familyInfo.fatherName} />}
            {familyInfo.fatherOccupation && <CardRow label={t('template.fatherOccupation')} value={familyInfo.fatherOccupation} />}
            {familyInfo.motherName && <CardRow label={t('template.motherName')} value={familyInfo.motherName} />}
            {familyInfo.motherOccupation && <CardRow label={t('template.motherOccupation')} value={familyInfo.motherOccupation} />}
            {familyInfo.siblings && familyInfo.siblings.length > 0 && <CardRow label={t('template.siblings')} value={formatSiblings(familyInfo.siblings, t)} />}
            {familyInfo.familyType && <CardRow label={t('template.familyType')} value={familyInfo.familyType} />}
            {familyInfo.economicStatus && <CardRow label={t('template.economicStatus')} value={familyInfo.economicStatus} />}
            {familyInfo.familyValues && <p className="mt-3 text-sm text-slate-600">{familyInfo.familyValues}</p>}
          </Card>
        )}

        {hasExpectations(bioData) && (
          <Card title={t('template.partnerExpectations')}>
            {partnerExpectations.ageRange && <CardRow label={t('template.ageRange')} value={partnerExpectations.ageRange} />}
            {partnerExpectations.heightRange && <CardRow label={t('template.heightRange')} value={partnerExpectations.heightRange} />}
            {partnerExpectations.educationExpectation && <CardRow label={t('template.educationLabel')} value={partnerExpectations.educationExpectation} />}
            {partnerExpectations.occupationExpectation && <CardRow label={t('template.occupation')} value={partnerExpectations.occupationExpectation} />}
            {partnerExpectations.religiousExpectation && <p className="mt-3 text-sm text-slate-600">{partnerExpectations.religiousExpectation}</p>}
            {partnerExpectations.otherExpectations && <p className="mt-2 text-sm text-slate-600">{partnerExpectations.otherExpectations}</p>}
          </Card>
        )}

        {hasContactInfo(bioData) && (
          <Card title={t('template.contactInfo')} className="sm:col-span-2">
            <div className="grid gap-2 sm:grid-cols-2">
              {contactInfo.email && <CardRow label={t('template.email')} value={contactInfo.email} />}
              {contactInfo.phone && <CardRow label={t('template.phone')} value={contactInfo.phone} />}
              {contactInfo.whatsapp && <CardRow label={t('template.whatsapp')} value={contactInfo.whatsapp} />}
              {contactInfo.guardianContact && <CardRow label={t('template.guardianContact')} value={contactInfo.guardianContact} />}
            </div>
            {contactInfo.permanentAddress && <p className="mt-3 text-sm text-slate-600"><span className="font-medium text-indigo-700">{t('template.address')}:</span> {contactInfo.permanentAddress}</p>}
            {contactInfo.currentAddress && <p className="mt-2 text-sm text-slate-600"><span className="font-medium text-indigo-700">{t('template.currentAddress')}:</span> {contactInfo.currentAddress}</p>}
          </Card>
        )}
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={cn('rounded-xl border border-indigo-100 bg-white p-5 shadow-sm', className)}>
    <h2 className="mb-4 border-b-2 border-indigo-200 pb-2 text-base font-semibold text-indigo-800">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const CardRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-0">
    <span className="text-sm font-medium text-slate-600">{label}:</span>
    <span className="text-right text-sm text-slate-800">{value}</span>
  </div>
);
