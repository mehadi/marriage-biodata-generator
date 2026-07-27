/**
 * Formal Template Component
 * Classic formal document style: serif typography, strict layout, official feel
 */

'use client';

import React from 'react';
import { TemplateProps, renderField, getAge, formatSiblings, getPhotoSizeStyle, getCustomFieldsForSection, translateValue } from './BaseTemplate';
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

export const FormalTemplate: React.FC<TemplateProps> = ({ bioData, className }) => {
  const { t, getOptionLabel } = useLanguage();
  const { personalInfo, religiousInfo, education, professionalInfo, familyInfo, contactInfo, partnerExpectations, photo } = bioData;
  const tv = (value: string | undefined | null, key: string) => translateValue(value, key, getOptionLabel);

  return (
    <div className={cn('mx-auto w-[210mm] bg-white p-8 font-serif shadow-lg print:shadow-none', className)}>
      <div className="border-2 border-slate-800 p-6">
        <header className="mb-8 border-b-2 border-slate-800 pb-6 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-slate-900">
            {renderField(personalInfo.fullName, t)}
          </h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-slate-600">
            {t('template.marriageBioData')}
          </p>
          {photo && (
            <div className="mx-auto mt-4 overflow-hidden rounded-sm border-2 border-slate-800" style={getPhotoSizeStyle(144, bioData)}>
              <img src={photo} alt={t('common.profile')} className="h-full w-full object-cover" />
            </div>
          )}
        </header>

        <div className="space-y-6">
          {hasPersonalInfo(bioData) && (
            <FormalSection title={t('template.personalInfo')}>
              {personalInfo.fullName && <FormalRow label={t('template.fullName')} value={personalInfo.fullName} />}
              {personalInfo.dateOfBirth && <FormalRow label={t('template.age')} value={getAge(personalInfo.dateOfBirth, t)} />}
              {personalInfo.dateOfBirth && <FormalRow label={t('template.dateOfBirth')} value={personalInfo.dateOfBirth} />}
              {personalInfo.height && <FormalRow label={t('template.height')} value={personalInfo.height} />}
              {personalInfo.complexion && <FormalRow label={t('template.complexion')} value={tv(personalInfo.complexion, 'complexion')} />}
              {personalInfo.bloodGroup && <FormalRow label={t('template.bloodGroup')} value={tv(personalInfo.bloodGroup, 'bloodGroup')} />}
              {personalInfo.maritalStatus && <FormalRow label={t('template.maritalStatus')} value={tv(personalInfo.maritalStatus, 'maritalStatus')} />}
              {personalInfo.nationality && <FormalRow label={t('template.nationality')} value={personalInfo.nationality} />}
              {personalInfo.placeOfBirth && <FormalRow label={t('template.placeOfBirth')} value={personalInfo.placeOfBirth} />}
              {getCustomFieldsForSection(bioData, 'personal-info').map((f) => (
                <FormalRow key={f.key} label={f.key} value={f.value} />
              ))}
            </FormalSection>
          )}

          {hasReligiousInfo(bioData) && (
            <FormalSection title={t('template.religiousInfo')}>
              {religiousInfo.prayerPractice && religiousInfo.prayerPractice !== 'None' && <FormalRow label={t('template.prayerPractice')} value={tv(religiousInfo.prayerPractice, 'prayer')} />}
              {religiousInfo.quranRecitation && religiousInfo.quranRecitation !== 'None' && <FormalRow label={t('template.quranRecitation')} value={tv(religiousInfo.quranRecitation, 'quran')} />}
              {religiousInfo.islamicKnowledge && religiousInfo.islamicKnowledge !== 'None' && <FormalRow label={t('template.islamicKnowledge')} value={tv(religiousInfo.islamicKnowledge, 'islamicKnowledge')} />}
              {religiousInfo.hijabOrBeard && religiousInfo.hijabOrBeard !== 'None' && <FormalRow label={t('template.hijabBeard')} value={tv(religiousInfo.hijabOrBeard, 'hijabBeard')} />}
              {religiousInfo.sect && religiousInfo.sect !== 'None' && <FormalRow label={t('template.sect')} value={tv(religiousInfo.sect, 'sect')} />}
              {religiousInfo.madhab && <FormalRow label={t('template.madhab')} value={religiousInfo.madhab} />}
              {getCustomFieldsForSection(bioData, 'religious-info').map((f) => (
                <FormalRow key={f.key} label={f.key} value={f.value} />
              ))}
              {religiousInfo.otherReligiousInfo && <p className="mt-3 border-l-2 border-slate-800 pl-3 text-sm text-slate-600">{religiousInfo.otherReligiousInfo}</p>}
            </FormalSection>
          )}

          {hasEducation(bioData) && (
            <FormalSection title={t('template.educationalBackground')}>
              {education.highestQualification && <FormalRow label={t('template.qualification')} value={education.highestQualification} />}
              {education.institution && <FormalRow label={t('template.institution')} value={education.institution} />}
              {education.fieldOfStudy && <FormalRow label={t('template.fieldOfStudy')} value={education.fieldOfStudy} />}
              {education.yearOfCompletion && <FormalRow label={t('template.yearOfCompletion')} value={education.yearOfCompletion} />}
              {getCustomFieldsForSection(bioData, 'education').map((f) => (
                <FormalRow key={f.key} label={f.key} value={f.value} />
              ))}
              {education.additionalQualifications && <p className="mt-3 border-l-2 border-slate-800 pl-3 text-sm text-slate-600">{education.additionalQualifications}</p>}
            </FormalSection>
          )}

          {hasProfessionalInfo(bioData) && (
            <FormalSection title={t('template.professionalInfo')}>
              {professionalInfo.occupation && <FormalRow label={t('template.occupation')} value={professionalInfo.occupation} />}
              {professionalInfo.company && <FormalRow label={t('template.company')} value={professionalInfo.company} />}
              {professionalInfo.designation && <FormalRow label={t('template.designation')} value={professionalInfo.designation} />}
              {professionalInfo.incomeRange && <FormalRow label={t('template.annualIncome')} value={tv(professionalInfo.incomeRange, 'income')} />}
              {professionalInfo.workLocation && <FormalRow label={t('template.workLocation')} value={professionalInfo.workLocation} />}
              {getCustomFieldsForSection(bioData, 'professional').map((f) => (
                <FormalRow key={f.key} label={f.key} value={f.value} />
              ))}
            </FormalSection>
          )}

          {hasFamilyInfo(bioData) && (
            <FormalSection title={t('template.familyBackground')}>
              {familyInfo.fatherName && <FormalRow label={t('template.fatherName')} value={familyInfo.fatherName} />}
              {familyInfo.fatherOccupation && <FormalRow label={t('template.fatherOccupation')} value={familyInfo.fatherOccupation} />}
              {familyInfo.motherName && <FormalRow label={t('template.motherName')} value={familyInfo.motherName} />}
              {familyInfo.motherOccupation && <FormalRow label={t('template.motherOccupation')} value={familyInfo.motherOccupation} />}
              {familyInfo.siblings && familyInfo.siblings.length > 0 && <FormalRow label={t('template.siblings')} value={formatSiblings(familyInfo.siblings, t)} />}
              {familyInfo.familyType && <FormalRow label={t('template.familyType')} value={tv(familyInfo.familyType, 'familyType')} />}
              {familyInfo.economicStatus && <FormalRow label={t('template.economicStatus')} value={tv(familyInfo.economicStatus, 'economicStatus')} />}
              {getCustomFieldsForSection(bioData, 'family').map((f) => (
                <FormalRow key={f.key} label={f.key} value={f.value} />
              ))}
              {familyInfo.familyValues && <p className="mt-3 border-l-2 border-slate-800 pl-3 text-sm text-slate-600">{familyInfo.familyValues}</p>}
            </FormalSection>
          )}

          {hasExpectations(bioData) && (
            <FormalSection title={t('template.partnerExpectations')}>
              {partnerExpectations.ageRange && <FormalRow label={t('template.ageRange')} value={partnerExpectations.ageRange} />}
              {partnerExpectations.heightRange && <FormalRow label={t('template.heightRange')} value={partnerExpectations.heightRange} />}
              {partnerExpectations.educationExpectation && <FormalRow label={t('template.educationLabel')} value={partnerExpectations.educationExpectation} />}
              {partnerExpectations.occupationExpectation && <FormalRow label={t('template.occupation')} value={partnerExpectations.occupationExpectation} />}
              {getCustomFieldsForSection(bioData, 'expectations').map((f) => (
                <FormalRow key={f.key} label={f.key} value={f.value} />
              ))}
              {partnerExpectations.religiousExpectation && <p className="mt-3 border-l-2 border-slate-800 pl-3 text-sm text-slate-600">{partnerExpectations.religiousExpectation}</p>}
              {partnerExpectations.otherExpectations && <p className="mt-2 border-l-2 border-slate-800 pl-3 text-sm text-slate-600">{partnerExpectations.otherExpectations}</p>}
            </FormalSection>
          )}

          {hasContactInfo(bioData) && (
            <FormalSection title={t('template.contactInfo')}>
              <div className="rounded border-2 border-slate-800 bg-slate-50 p-4">
                {contactInfo.email && <FormalRow label={t('template.email')} value={contactInfo.email} />}
                {contactInfo.phone && <FormalRow label={t('template.phone')} value={contactInfo.phone} />}
                {contactInfo.whatsapp && <FormalRow label={t('template.whatsapp')} value={contactInfo.whatsapp} />}
                {contactInfo.guardianContact && <FormalRow label={t('template.guardianContact')} value={contactInfo.guardianContact} />}
                {getCustomFieldsForSection(bioData, 'contact').map((f) => (
                  <FormalRow key={f.key} label={f.key} value={f.value} />
                ))}
                {contactInfo.permanentAddress && <p className="mt-3 text-sm font-semibold text-slate-800">{t('template.address')}: <span className="font-normal text-slate-700">{contactInfo.permanentAddress}</span></p>}
                {contactInfo.currentAddress && <p className="mt-2 text-sm font-semibold text-slate-800">{t('template.currentAddress')}: <span className="font-normal text-slate-700">{contactInfo.currentAddress}</span></p>}
              </div>
            </FormalSection>
          )}
        </div>
      </div>
    </div>
  );
};

const FormalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-l-4 border-slate-800 pl-4">
    <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-slate-900">{title}</h2>
    <div className="space-y-1">{children}</div>
  </div>
);

const FormalRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex border-b border-slate-300 py-1.5">
    <span className="w-40 shrink-0 text-sm font-semibold text-slate-800">{label}:</span>
    <span className="text-sm text-slate-700">{value}</span>
  </div>
);
