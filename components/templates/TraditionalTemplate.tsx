/**
 * Traditional Template Component
 * Classic border designs, formal layout
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
  hasExpectations 
} from '@/lib/sectionValidation';

export const TraditionalTemplate: React.FC<TemplateProps> = ({ bioData, className }) => {
  const { t, getOptionLabel } = useLanguage();
  const { personalInfo, religiousInfo, education, professionalInfo, familyInfo, contactInfo, partnerExpectations, photo } = bioData;
  const tv = (value: string | undefined | null, key: string) => translateValue(value, key, getOptionLabel);

  return (
    <div className={cn('mx-auto w-[210mm] bg-white p-8 shadow-lg print:shadow-none', className)}>
      <div className="border-4 border-double border-amber-700 p-6">
        <div className="mb-8 border-b-2 border-amber-700 pb-6 text-center">
          <h1 className="mb-2 font-serif text-4xl font-bold text-amber-900">{renderField(personalInfo.fullName, t)}</h1>
          <p className="font-serif text-lg italic text-amber-700">{t('template.marriageBioData')}</p>
          {photo && (
            <div className="mx-auto mt-4 overflow-hidden rounded-full border-4 border-amber-700 shadow-md" style={getPhotoSizeStyle(160, bioData)}>
              <img src={photo} alt={t('common.profile')} className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {hasPersonalInfo(bioData) && (
            <Section title={t('template.personalInfo')}>
              <ClassicInfoGrid>
                {personalInfo.fullName && <ClassicRow label={t('template.fullName')} value={personalInfo.fullName} />}
                {personalInfo.dateOfBirth && <ClassicRow label={t('template.age')} value={getAge(personalInfo.dateOfBirth, t)} />}
                {personalInfo.dateOfBirth && <ClassicRow label={t('template.dateOfBirth')} value={personalInfo.dateOfBirth} />}
                {personalInfo.height && <ClassicRow label={t('template.height')} value={personalInfo.height} />}
                {personalInfo.complexion && <ClassicRow label={t('template.complexion')} value={tv(personalInfo.complexion, 'complexion')} />}
                {personalInfo.bloodGroup && <ClassicRow label={t('template.bloodGroup')} value={tv(personalInfo.bloodGroup, 'bloodGroup')} />}
                {personalInfo.maritalStatus && <ClassicRow label={t('template.maritalStatus')} value={tv(personalInfo.maritalStatus, 'maritalStatus')} />}
                {personalInfo.nationality && <ClassicRow label={t('template.nationality')} value={personalInfo.nationality} />}
                {personalInfo.placeOfBirth && <ClassicRow label={t('template.placeOfBirth')} value={personalInfo.placeOfBirth} />}
                {getCustomFieldsForSection(bioData, 'personal-info').map((f) => (
                  <ClassicRow key={f.key} label={f.key} value={f.value} />
                ))}
              </ClassicInfoGrid>
            </Section>
          )}

          {hasReligiousInfo(bioData) && (
            <Section title={t('template.religiousInfo')}>
              <ClassicInfoGrid>
                {religiousInfo.prayerPractice && religiousInfo.prayerPractice !== 'None' && <ClassicRow label={t('template.prayerPractice')} value={tv(religiousInfo.prayerPractice, 'prayer')} />}
                {religiousInfo.quranRecitation && religiousInfo.quranRecitation !== 'None' && <ClassicRow label={t('template.quranRecitation')} value={tv(religiousInfo.quranRecitation, 'quran')} />}
                {religiousInfo.islamicKnowledge && religiousInfo.islamicKnowledge !== 'None' && <ClassicRow label={t('template.islamicKnowledge')} value={tv(religiousInfo.islamicKnowledge, 'islamicKnowledge')} />}
                {religiousInfo.hijabOrBeard && religiousInfo.hijabOrBeard !== 'None' && <ClassicRow label={t('template.hijabBeard')} value={tv(religiousInfo.hijabOrBeard, 'hijabBeard')} />}
                {religiousInfo.sect && religiousInfo.sect !== 'None' && <ClassicRow label={t('template.sect')} value={tv(religiousInfo.sect, 'sect')} />}
                {religiousInfo.madhab && <ClassicRow label={t('template.madhab')} value={religiousInfo.madhab} />}
                {getCustomFieldsForSection(bioData, 'religious-info').map((f) => (
                  <ClassicRow key={f.key} label={f.key} value={f.value} />
                ))}
              </ClassicInfoGrid>
              {religiousInfo.otherReligiousInfo && (
                <p className="mt-3 border-l-2 border-amber-700 pl-3 text-sm italic text-slate-600">
                  {religiousInfo.otherReligiousInfo}
                </p>
              )}
            </Section>
          )}

          {hasEducation(bioData) && (
            <Section title={t('template.educationalBackground')}>
              <ClassicInfoGrid>
                {education.highestQualification && <ClassicRow label={t('template.qualification')} value={education.highestQualification} />}
                {education.institution && <ClassicRow label={t('template.institution')} value={education.institution} />}
                {education.fieldOfStudy && <ClassicRow label={t('template.fieldOfStudy')} value={education.fieldOfStudy} />}
                {education.yearOfCompletion && <ClassicRow label={t('template.yearOfCompletion')} value={education.yearOfCompletion} />}
                {getCustomFieldsForSection(bioData, 'education').map((f) => (
                  <ClassicRow key={f.key} label={f.key} value={f.value} />
                ))}
              </ClassicInfoGrid>
              {education.additionalQualifications && (
                <p className="mt-3 border-l-2 border-amber-700 pl-3 text-sm text-slate-600">
                  <span className="font-semibold">{t('template.additionalQualifications')}: </span>
                  {education.additionalQualifications}
                </p>
              )}
            </Section>
          )}

          {hasProfessionalInfo(bioData) && (
            <Section title={t('template.professionalInfo')}>
              <ClassicInfoGrid>
                {professionalInfo.occupation && <ClassicRow label={t('template.occupation')} value={professionalInfo.occupation} />}
                {professionalInfo.company && <ClassicRow label={t('template.company')} value={professionalInfo.company} />}
                {professionalInfo.designation && <ClassicRow label={t('template.designation')} value={professionalInfo.designation} />}
                {professionalInfo.incomeRange && <ClassicRow label={t('template.annualIncome')} value={tv(professionalInfo.incomeRange, 'income')} />}
                {professionalInfo.workLocation && <ClassicRow label={t('template.workLocation')} value={professionalInfo.workLocation} />}
                {getCustomFieldsForSection(bioData, 'professional').map((f) => (
                  <ClassicRow key={f.key} label={f.key} value={f.value} />
                ))}
              </ClassicInfoGrid>
            </Section>
          )}

          {hasFamilyInfo(bioData) && (
            <Section title={t('template.familyBackground')}>
              <ClassicInfoGrid>
                {familyInfo.fatherName && <ClassicRow label={t('template.fatherName')} value={familyInfo.fatherName} />}
                {familyInfo.fatherOccupation && <ClassicRow label={t('template.fatherOccupation')} value={familyInfo.fatherOccupation} />}
                {familyInfo.motherName && <ClassicRow label={t('template.motherName')} value={familyInfo.motherName} />}
                {familyInfo.motherOccupation && <ClassicRow label={t('template.motherOccupation')} value={familyInfo.motherOccupation} />}
                {familyInfo.siblings && familyInfo.siblings.length > 0 && <ClassicRow label={t('template.siblings')} value={formatSiblings(familyInfo.siblings, t)} />}
                {familyInfo.familyType && <ClassicRow label={t('template.familyType')} value={tv(familyInfo.familyType, 'familyType')} />}
                {familyInfo.economicStatus && <ClassicRow label={t('template.economicStatus')} value={tv(familyInfo.economicStatus, 'economicStatus')} />}
                {getCustomFieldsForSection(bioData, 'family').map((f) => (
                  <ClassicRow key={f.key} label={f.key} value={f.value} />
                ))}
              </ClassicInfoGrid>
              {familyInfo.familyValues && (
                <p className="mt-3 border-l-2 border-amber-700 pl-3 text-sm text-slate-600">
                  <span className="font-semibold">{t('template.familyValues')}: </span>
                  {familyInfo.familyValues}
                </p>
              )}
            </Section>
          )}

          {hasExpectations(bioData) && (
            <Section title={t('template.partnerExpectations')}>
              <ClassicInfoGrid>
                {partnerExpectations.ageRange && <ClassicRow label={t('template.ageRange')} value={partnerExpectations.ageRange} />}
                {partnerExpectations.heightRange && <ClassicRow label={t('template.heightRange')} value={partnerExpectations.heightRange} />}
                {partnerExpectations.educationExpectation && <ClassicRow label={t('template.educationLabel')} value={partnerExpectations.educationExpectation} />}
                {partnerExpectations.occupationExpectation && <ClassicRow label={t('template.occupation')} value={partnerExpectations.occupationExpectation} />}
                {getCustomFieldsForSection(bioData, 'expectations').map((f) => (
                  <ClassicRow key={f.key} label={f.key} value={f.value} />
                ))}
              </ClassicInfoGrid>
              {partnerExpectations.religiousExpectation && (
                <p className="mt-3 border-l-2 border-amber-700 pl-3 text-sm text-slate-600">
                  <span className="font-semibold">{t('template.religiousExpectation')}: </span>
                  {partnerExpectations.religiousExpectation}
                </p>
              )}
              {partnerExpectations.otherExpectations && (
                <p className="mt-2 border-l-2 border-amber-700 pl-3 text-sm text-slate-600">
                  <span className="font-semibold">{t('template.otherExpectations')}: </span>
                  {partnerExpectations.otherExpectations}
                </p>
              )}
            </Section>
          )}

          {hasContactInfo(bioData) && (
            <Section title={t('template.contactInfo')}>
              <div className="rounded border border-amber-700 bg-amber-50 p-4">
                <ClassicInfoGrid>
                  {contactInfo.email && <ClassicRow label={t('template.email')} value={contactInfo.email} />}
                  {contactInfo.phone && <ClassicRow label={t('template.phone')} value={contactInfo.phone} />}
                  {contactInfo.whatsapp && <ClassicRow label={t('template.whatsapp')} value={contactInfo.whatsapp} />}
                  {contactInfo.guardianContact && <ClassicRow label={t('template.guardianContact')} value={contactInfo.guardianContact} />}
                  {getCustomFieldsForSection(bioData, 'contact').map((f) => (
                    <ClassicRow key={f.key} label={f.key} value={f.value} />
                  ))}
                </ClassicInfoGrid>
                {contactInfo.permanentAddress && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-amber-900">{t('template.address')}:</p>
                    <p className="text-sm text-slate-700">{contactInfo.permanentAddress}</p>
                  </div>
                )}
                {contactInfo.currentAddress && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-amber-900">{t('template.currentAddress')}:</p>
                    <p className="text-sm text-slate-700">{contactInfo.currentAddress}</p>
                  </div>
                )}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-l-4 border-amber-700 pl-4">
    <h2 className="mb-3 font-serif text-xl font-bold text-amber-900">{title}</h2>
    {children}
  </div>
);

const ClassicInfoGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="space-y-2">{children}</div>
);

const ClassicRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex border-b border-dotted border-amber-300 pb-1">
    <span className="w-1/3 font-serif text-sm font-semibold text-amber-900">{label}:</span>
    <span className="w-2/3 text-sm text-slate-700">{value}</span>
  </div>
);
