/**
 * Heritage Template Component
 * Classic antique style: warm sepia/brown tones, ornamental borders, traditional Islamic document feel
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

export const HeritageTemplate: React.FC<TemplateProps> = ({ bioData, className }) => {
  const { t, getOptionLabel } = useLanguage();
  const { personalInfo, religiousInfo, education, professionalInfo, familyInfo, contactInfo, partnerExpectations, photo } = bioData;
  const tv = (value: string | undefined | null, key: string) => translateValue(value, key, getOptionLabel);

  return (
    <div className={cn('mx-auto w-[210mm] bg-amber-50/90 p-8 font-serif shadow-lg print:shadow-none', className)}>
      <div className="rounded-lg border-4 border-amber-800/60 bg-white/95 p-8 shadow-inner" style={{ boxShadow: 'inset 0 0 0 1px rgba(146, 64, 14, 0.2)' }}>
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 h-px w-32 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
          <h1 className="text-4xl font-bold text-amber-900">{renderField(personalInfo.fullName, t)}</h1>
          <p className="mt-2 text-lg italic text-amber-800">{t('template.marriageBioData')}</p>
          {photo && (
            <div className="mx-auto mt-5 overflow-hidden rounded-full border-4 border-amber-700/70 shadow-lg ring-4 ring-amber-200/50" style={getPhotoSizeStyle(144, bioData)}>
              <img src={photo} alt={t('common.profile')} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
        </header>

        <div className="space-y-6">
          {hasPersonalInfo(bioData) && (
            <HeritageSection title={t('template.personalInfo')}>
              {personalInfo.fullName && <HeritageRow label={t('template.fullName')} value={personalInfo.fullName} />}
              {personalInfo.dateOfBirth && <HeritageRow label={t('template.age')} value={getAge(personalInfo.dateOfBirth, t)} />}
              {personalInfo.dateOfBirth && <HeritageRow label={t('template.dateOfBirth')} value={personalInfo.dateOfBirth} />}
              {personalInfo.height && <HeritageRow label={t('template.height')} value={personalInfo.height} />}
              {personalInfo.complexion && <HeritageRow label={t('template.complexion')} value={tv(personalInfo.complexion, 'complexion')} />}
              {personalInfo.bloodGroup && <HeritageRow label={t('template.bloodGroup')} value={tv(personalInfo.bloodGroup, 'bloodGroup')} />}
              {personalInfo.maritalStatus && <HeritageRow label={t('template.maritalStatus')} value={tv(personalInfo.maritalStatus, 'maritalStatus')} />}
              {personalInfo.nationality && <HeritageRow label={t('template.nationality')} value={personalInfo.nationality} />}
              {personalInfo.placeOfBirth && <HeritageRow label={t('template.placeOfBirth')} value={personalInfo.placeOfBirth} />}
              {getCustomFieldsForSection(bioData, 'personal-info').map((f) => (
                <HeritageRow key={f.key} label={f.key} value={f.value} />
              ))}
            </HeritageSection>
          )}

          {hasReligiousInfo(bioData) && (
            <HeritageSection title={t('template.religiousInfo')}>
              {religiousInfo.prayerPractice && religiousInfo.prayerPractice !== 'None' && <HeritageRow label={t('template.prayerPractice')} value={tv(religiousInfo.prayerPractice, 'prayer')} />}
              {religiousInfo.quranRecitation && religiousInfo.quranRecitation !== 'None' && <HeritageRow label={t('template.quranRecitation')} value={tv(religiousInfo.quranRecitation, 'quran')} />}
              {religiousInfo.islamicKnowledge && religiousInfo.islamicKnowledge !== 'None' && <HeritageRow label={t('template.islamicKnowledge')} value={tv(religiousInfo.islamicKnowledge, 'islamicKnowledge')} />}
              {religiousInfo.hijabOrBeard && religiousInfo.hijabOrBeard !== 'None' && <HeritageRow label={t('template.hijabBeard')} value={tv(religiousInfo.hijabOrBeard, 'hijabBeard')} />}
              {religiousInfo.sect && religiousInfo.sect !== 'None' && <HeritageRow label={t('template.sect')} value={tv(religiousInfo.sect, 'sect')} />}
              {religiousInfo.madhab && <HeritageRow label={t('template.madhab')} value={religiousInfo.madhab} />}
              {getCustomFieldsForSection(bioData, 'religious-info').map((f) => (
                <HeritageRow key={f.key} label={f.key} value={f.value} />
              ))}
              {religiousInfo.otherReligiousInfo && <p className="mt-3 border-l-2 border-amber-600 pl-3 text-sm italic text-amber-900/80">{religiousInfo.otherReligiousInfo}</p>}
            </HeritageSection>
          )}

          {hasEducation(bioData) && (
            <HeritageSection title={t('template.educationalBackground')}>
              {education.highestQualification && <HeritageRow label={t('template.qualification')} value={education.highestQualification} />}
              {education.institution && <HeritageRow label={t('template.institution')} value={education.institution} />}
              {education.fieldOfStudy && <HeritageRow label={t('template.fieldOfStudy')} value={education.fieldOfStudy} />}
              {education.yearOfCompletion && <HeritageRow label={t('template.yearOfCompletion')} value={education.yearOfCompletion} />}
              {getCustomFieldsForSection(bioData, 'education').map((f) => (
                <HeritageRow key={f.key} label={f.key} value={f.value} />
              ))}
              {education.additionalQualifications && <p className="mt-3 border-l-2 border-amber-600 pl-3 text-sm text-amber-900/80">{education.additionalQualifications}</p>}
            </HeritageSection>
          )}

          {hasProfessionalInfo(bioData) && (
            <HeritageSection title={t('template.professionalInfo')}>
              {professionalInfo.occupation && <HeritageRow label={t('template.occupation')} value={professionalInfo.occupation} />}
              {professionalInfo.company && <HeritageRow label={t('template.company')} value={professionalInfo.company} />}
              {professionalInfo.designation && <HeritageRow label={t('template.designation')} value={professionalInfo.designation} />}
              {professionalInfo.incomeRange && <HeritageRow label={t('template.annualIncome')} value={tv(professionalInfo.incomeRange, 'income')} />}
              {professionalInfo.workLocation && <HeritageRow label={t('template.workLocation')} value={professionalInfo.workLocation} />}
              {getCustomFieldsForSection(bioData, 'professional').map((f) => (
                <HeritageRow key={f.key} label={f.key} value={f.value} />
              ))}
            </HeritageSection>
          )}

          {hasFamilyInfo(bioData) && (
            <HeritageSection title={t('template.familyBackground')}>
              {familyInfo.fatherName && <HeritageRow label={t('template.fatherName')} value={familyInfo.fatherName} />}
              {familyInfo.fatherOccupation && <HeritageRow label={t('template.fatherOccupation')} value={familyInfo.fatherOccupation} />}
              {familyInfo.motherName && <HeritageRow label={t('template.motherName')} value={familyInfo.motherName} />}
              {familyInfo.motherOccupation && <HeritageRow label={t('template.motherOccupation')} value={familyInfo.motherOccupation} />}
              {familyInfo.siblings && familyInfo.siblings.length > 0 && <HeritageRow label={t('template.siblings')} value={formatSiblings(familyInfo.siblings, t)} />}
              {familyInfo.familyType && <HeritageRow label={t('template.familyType')} value={tv(familyInfo.familyType, 'familyType')} />}
              {familyInfo.economicStatus && <HeritageRow label={t('template.economicStatus')} value={tv(familyInfo.economicStatus, 'economicStatus')} />}
              {getCustomFieldsForSection(bioData, 'family').map((f) => (
                <HeritageRow key={f.key} label={f.key} value={f.value} />
              ))}
              {familyInfo.familyValues && <p className="mt-3 border-l-2 border-amber-600 pl-3 text-sm text-amber-900/80">{familyInfo.familyValues}</p>}
            </HeritageSection>
          )}

          {hasExpectations(bioData) && (
            <HeritageSection title={t('template.partnerExpectations')}>
              {partnerExpectations.ageRange && <HeritageRow label={t('template.ageRange')} value={partnerExpectations.ageRange} />}
              {partnerExpectations.heightRange && <HeritageRow label={t('template.heightRange')} value={partnerExpectations.heightRange} />}
              {partnerExpectations.educationExpectation && <HeritageRow label={t('template.educationLabel')} value={partnerExpectations.educationExpectation} />}
              {partnerExpectations.occupationExpectation && <HeritageRow label={t('template.occupation')} value={partnerExpectations.occupationExpectation} />}
              {getCustomFieldsForSection(bioData, 'expectations').map((f) => (
                <HeritageRow key={f.key} label={f.key} value={f.value} />
              ))}
              {partnerExpectations.religiousExpectation && <p className="mt-3 border-l-2 border-amber-600 pl-3 text-sm text-amber-900/80">{partnerExpectations.religiousExpectation}</p>}
              {partnerExpectations.otherExpectations && <p className="mt-2 border-l-2 border-amber-600 pl-3 text-sm text-amber-900/80">{partnerExpectations.otherExpectations}</p>}
            </HeritageSection>
          )}

          {hasContactInfo(bioData) && (
            <HeritageSection title={t('template.contactInfo')}>
              <div className="rounded-lg border-2 border-amber-700/50 bg-amber-50/80 p-4">
                {contactInfo.email && <HeritageRow label={t('template.email')} value={contactInfo.email} />}
                {contactInfo.phone && <HeritageRow label={t('template.phone')} value={contactInfo.phone} />}
                {contactInfo.whatsapp && <HeritageRow label={t('template.whatsapp')} value={contactInfo.whatsapp} />}
                {contactInfo.guardianContact && <HeritageRow label={t('template.guardianContact')} value={contactInfo.guardianContact} />}
                {getCustomFieldsForSection(bioData, 'contact').map((f) => (
                  <HeritageRow key={f.key} label={f.key} value={f.value} />
                ))}
                {contactInfo.permanentAddress && <p className="mt-3 text-sm font-semibold text-amber-900">{t('template.address')}: <span className="font-normal text-amber-900/90">{contactInfo.permanentAddress}</span></p>}
                {contactInfo.currentAddress && <p className="mt-2 text-sm font-semibold text-amber-900">{t('template.currentAddress')}: <span className="font-normal text-amber-900/90">{contactInfo.currentAddress}</span></p>}
              </div>
            </HeritageSection>
          )}
        </div>

        <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
      </div>
    </div>
  );
};

const HeritageSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-l-4 border-amber-700/70 pl-5">
    <h2 className="mb-3 text-xl font-bold text-amber-900">{title}</h2>
    <div className="space-y-1">{children}</div>
  </div>
);

const HeritageRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex border-b border-dashed border-amber-300/80 py-1.5">
    <span className="w-36 shrink-0 text-sm font-semibold text-amber-900">{label}:</span>
    <span className="text-sm text-amber-900/90">{value}</span>
  </div>
);
