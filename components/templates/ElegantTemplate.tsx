/**
 * Elegant Template Component
 * Sophisticated with Islamic geometric patterns
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
  hasExpectations 
} from '@/lib/sectionValidation';

export const ElegantTemplate: React.FC<TemplateProps> = ({ bioData, className }) => {
  const t = useLanguage().t;
  const { personalInfo, religiousInfo, education, professionalInfo, familyInfo, contactInfo, partnerExpectations, photo } = bioData;

  return (
    <div className={cn('mx-auto w-[210mm] bg-gradient-to-br from-slate-50 to-blue-50 p-8 shadow-lg print:shadow-none', className)}>
      <div className="rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            {photo && (
              <div className="mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full border-4 border-blue-600 shadow-lg ring-4 ring-blue-100">
                <img src={photo} alt={t('common.profile')} className="h-full w-full object-cover" />
              </div>
            )}
          </div>
          <h1 className="mb-2 text-5xl font-light tracking-wide text-slate-900">{renderField(personalInfo.fullName, t)}</h1>
          <div className="mx-auto h-1 w-24 rounded bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <p className="mt-3 text-sm uppercase tracking-widest text-slate-600">{t('template.marriageBioData')}</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            {hasPersonalInfo(bioData) && (
              <ElegantSection title={t('template.personalDetails')}>
                {personalInfo.fullName && <ElegantField label={t('template.fullName')} value={personalInfo.fullName} />}
                {personalInfo.dateOfBirth && <ElegantField label={t('template.age')} value={getAge(personalInfo.dateOfBirth, t)} />}
                {personalInfo.dateOfBirth && <ElegantField label={t('template.dateOfBirth')} value={personalInfo.dateOfBirth} />}
                {personalInfo.height && <ElegantField label={t('template.height')} value={personalInfo.height} />}
                {personalInfo.complexion && <ElegantField label={t('template.complexion')} value={personalInfo.complexion} />}
                {personalInfo.bloodGroup && <ElegantField label={t('template.bloodGroup')} value={personalInfo.bloodGroup} />}
                {personalInfo.maritalStatus && <ElegantField label={t('template.maritalStatus')} value={personalInfo.maritalStatus} />}
                {personalInfo.nationality && <ElegantField label={t('template.nationality')} value={personalInfo.nationality} />}
                {personalInfo.placeOfBirth && <ElegantField label={t('template.placeOfBirth')} value={personalInfo.placeOfBirth} />}
              </ElegantSection>
            )}

            {hasReligiousInfo(bioData) && (
              <ElegantSection title={t('template.religiousProfile')}>
                {religiousInfo.prayerPractice && religiousInfo.prayerPractice !== 'None' && <ElegantField label={t('template.prayerPractice')} value={religiousInfo.prayerPractice} />}
                {religiousInfo.quranRecitation && religiousInfo.quranRecitation !== 'None' && <ElegantField label={t('template.quranRecitation')} value={religiousInfo.quranRecitation} />}
                {religiousInfo.islamicKnowledge && religiousInfo.islamicKnowledge !== 'None' && <ElegantField label={t('template.islamicKnowledge')} value={religiousInfo.islamicKnowledge} />}
                {religiousInfo.hijabOrBeard && religiousInfo.hijabOrBeard !== 'None' && <ElegantField label={t('template.hijabBeard')} value={religiousInfo.hijabOrBeard} />}
                {religiousInfo.sect && religiousInfo.sect !== 'None' && <ElegantField label={t('template.sect')} value={religiousInfo.sect} />}
                {religiousInfo.madhab && <ElegantField label={t('template.madhab')} value={religiousInfo.madhab} />}
                {religiousInfo.otherReligiousInfo && (
                  <div className="mt-2 rounded bg-blue-50 p-2">
                    <p className="text-xs italic text-slate-600">{religiousInfo.otherReligiousInfo}</p>
                  </div>
                )}
              </ElegantSection>
            )}

            {hasEducation(bioData) && (
              <ElegantSection title={t('template.education')}>
                {education.highestQualification && <ElegantField label={t('template.qualification')} value={education.highestQualification} />}
                {education.institution && <ElegantField label={t('template.institution')} value={education.institution} />}
                {education.fieldOfStudy && <ElegantField label={t('template.fieldOfStudy')} value={education.fieldOfStudy} />}
                {education.yearOfCompletion && <ElegantField label={t('template.yearOfCompletion')} value={education.yearOfCompletion} />}
                {education.additionalQualifications && (
                  <div className="mt-2 rounded bg-blue-50 p-2">
                    <p className="text-xs text-slate-600">{education.additionalQualifications}</p>
                  </div>
                )}
              </ElegantSection>
            )}
          </div>

          <div className="space-y-6">
            {hasProfessionalInfo(bioData) && (
              <ElegantSection title={t('template.professionalInfo')}>
                {professionalInfo.occupation && <ElegantField label={t('template.occupation')} value={professionalInfo.occupation} />}
                {professionalInfo.company && <ElegantField label={t('template.company')} value={professionalInfo.company} />}
                {professionalInfo.designation && <ElegantField label={t('template.designation')} value={professionalInfo.designation} />}
                {professionalInfo.incomeRange && <ElegantField label={t('template.annualIncome')} value={professionalInfo.incomeRange} />}
                {professionalInfo.workLocation && <ElegantField label={t('template.workLocation')} value={professionalInfo.workLocation} />}
              </ElegantSection>
            )}

            {hasFamilyInfo(bioData) && (
              <ElegantSection title={t('template.familyBackground')}>
                {familyInfo.fatherName && <ElegantField label={t('template.fatherName')} value={familyInfo.fatherName} />}
                {familyInfo.fatherOccupation && <ElegantField label={t('template.fatherOccupation')} value={familyInfo.fatherOccupation} />}
                {familyInfo.motherName && <ElegantField label={t('template.motherName')} value={familyInfo.motherName} />}
                {familyInfo.motherOccupation && <ElegantField label={t('template.motherOccupation')} value={familyInfo.motherOccupation} />}
                {familyInfo.siblings && familyInfo.siblings.length > 0 && <ElegantField label={t('template.siblings')} value={formatSiblings(familyInfo.siblings, t)} />}
                {familyInfo.familyType && <ElegantField label={t('template.familyType')} value={familyInfo.familyType} />}
                {familyInfo.economicStatus && <ElegantField label={t('template.economicStatus')} value={familyInfo.economicStatus} />}
                {familyInfo.familyValues && (
                  <div className="mt-2 rounded bg-blue-50 p-2">
                    <p className="text-xs text-slate-600">{familyInfo.familyValues}</p>
                  </div>
                )}
              </ElegantSection>
            )}

            {hasExpectations(bioData) && (
              <ElegantSection title={t('template.partnerExpectations')}>
                {partnerExpectations.ageRange && <ElegantField label={t('template.ageRange')} value={partnerExpectations.ageRange} />}
                {partnerExpectations.heightRange && <ElegantField label={t('template.heightRange')} value={partnerExpectations.heightRange} />}
                {partnerExpectations.educationExpectation && <ElegantField label={t('template.educationLabel')} value={partnerExpectations.educationExpectation} />}
                {partnerExpectations.occupationExpectation && <ElegantField label={t('template.occupation')} value={partnerExpectations.occupationExpectation} />}
                {partnerExpectations.religiousExpectation && (
                  <div className="mt-2 rounded bg-blue-50 p-2">
                    <p className="mb-1 text-xs font-semibold text-blue-800">{t('template.religiousExpectation')}:</p>
                    <p className="text-xs text-slate-600">{partnerExpectations.religiousExpectation}</p>
                  </div>
                )}
                {partnerExpectations.otherExpectations && (
                  <div className="mt-2 rounded bg-blue-50 p-2">
                    <p className="mb-1 text-xs font-semibold text-blue-800">{t('template.otherExpectations')}:</p>
                    <p className="text-xs text-slate-600">{partnerExpectations.otherExpectations}</p>
                  </div>
                )}
              </ElegantSection>
            )}
          </div>
        </div>

        {hasContactInfo(bioData) && (
          <div className="mt-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <h3 className="mb-4 text-center text-xl font-light tracking-wide">{t('template.contactInfo')}</h3>
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.email && <ContactField label={t('template.email')} value={contactInfo.email} />}
              {contactInfo.phone && <ContactField label={t('template.phone')} value={contactInfo.phone} />}
              {contactInfo.whatsapp && <ContactField label={t('template.whatsapp')} value={contactInfo.whatsapp} />}
              {contactInfo.guardianContact && <ContactField label={t('template.guardianContact')} value={contactInfo.guardianContact} />}
            </div>
            {contactInfo.permanentAddress && (
              <div className="mt-4 border-t border-blue-400 pt-4">
                <p className="mb-1 text-sm font-semibold">{t('template.address')}:</p>
                <p className="text-sm opacity-90">{contactInfo.permanentAddress}</p>
              </div>
            )}
            {contactInfo.currentAddress && (
              <div className="mt-2">
                <p className="mb-1 text-sm font-semibold">{t('template.currentAddress')}:</p>
                <p className="text-sm opacity-90">{contactInfo.currentAddress}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ElegantSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 p-4 shadow-sm">
    <h3 className="mb-3 border-b-2 border-blue-600 pb-2 text-sm font-semibold uppercase tracking-wide text-blue-800">
      {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const ElegantField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-baseline justify-between">
    <span className="text-xs font-medium text-slate-500">{label}:</span>
    <span className="text-right text-sm text-slate-700">{value}</span>
  </div>
);

const ContactField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold opacity-80">{label}:</p>
    <p className="text-sm">{value}</p>
  </div>
);
