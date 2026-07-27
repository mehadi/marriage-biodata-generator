/**
 * Modern Template Component
 * Clean, minimalist design with accent colors
 * Supports gender-aware color theming and bilingual option value translation
 */

'use client';

import React from 'react';
import {
  TemplateProps,
  renderField,
  getAge,
  formatSiblings,
  getPhotoSizeStyle,
  getCustomFieldsForSection,
  translateValue,
  getGenderPalette,
  InfoRow,
} from './BaseTemplate';
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

export const ModernTemplate: React.FC<TemplateProps> = ({ bioData, className }) => {
  const { t, getOptionLabel } = useLanguage();
  const { personalInfo, religiousInfo, education, professionalInfo, familyInfo, contactInfo, partnerExpectations, photo } = bioData;
  const palette = getGenderPalette(personalInfo?.gender);
  const tv = (value: string | undefined | null, key: string) => translateValue(value, key, getOptionLabel);

  return (
    <div className={cn('mx-auto w-[210mm] bg-white p-8 shadow-lg print:shadow-none', className)}>
      <div className={cn('mb-8 pb-6', palette.header)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-4xl font-bold text-slate-900">{renderField(personalInfo.fullName, t)}</h1>
            <p className={cn('text-lg', palette.primary)}>{t('template.marriageBioData')}</p>
          </div>
          {photo && (
            <div className={cn('ml-4 shrink-0 overflow-hidden rounded-lg border-4', palette.primaryBorder)} style={getPhotoSizeStyle(128, bioData)}>
              <img src={photo} alt={t('common.profile')} className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {hasPersonalInfo(bioData) && (
        <section className="mb-6">
          <h2 className={cn('mb-4 text-xl font-semibold', palette.primary)}>{t('template.personalInfo')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {personalInfo.fullName && <InfoRow label={t('template.fullName')} value={personalInfo.fullName} />}
            {personalInfo.dateOfBirth && <InfoRow label={t('template.age')} value={getAge(personalInfo.dateOfBirth, t)} />}
            {personalInfo.dateOfBirth && <InfoRow label={t('template.dateOfBirth')} value={personalInfo.dateOfBirth} />}
            {personalInfo.height && <InfoRow label={t('template.height')} value={personalInfo.height} />}
            {personalInfo.complexion && <InfoRow label={t('template.complexion')} value={tv(personalInfo.complexion, 'complexion')} />}
            {personalInfo.bloodGroup && <InfoRow label={t('template.bloodGroup')} value={tv(personalInfo.bloodGroup, 'bloodGroup')} />}
            {personalInfo.maritalStatus && <InfoRow label={t('template.maritalStatus')} value={tv(personalInfo.maritalStatus, 'maritalStatus')} />}
            {personalInfo.nationality && <InfoRow label={t('template.nationality')} value={personalInfo.nationality} />}
            {personalInfo.placeOfBirth && <InfoRow label={t('template.placeOfBirth')} value={personalInfo.placeOfBirth} />}
            {getCustomFieldsForSection(bioData, 'personal-info').map((f) => (
              <InfoRow key={f.key} label={f.key} value={f.value} />
            ))}
          </div>
        </section>
      )}

      {hasReligiousInfo(bioData) && (
        <section className="mb-6">
          <h2 className={cn('mb-4 text-xl font-semibold', palette.primary)}>{t('template.religiousInfo')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {religiousInfo.prayerPractice && religiousInfo.prayerPractice !== 'None' && <InfoRow label={t('template.prayerPractice')} value={tv(religiousInfo.prayerPractice, 'prayer')} />}
            {religiousInfo.quranRecitation && religiousInfo.quranRecitation !== 'None' && <InfoRow label={t('template.quranRecitation')} value={tv(religiousInfo.quranRecitation, 'quran')} />}
            {religiousInfo.islamicKnowledge && religiousInfo.islamicKnowledge !== 'None' && <InfoRow label={t('template.islamicKnowledge')} value={tv(religiousInfo.islamicKnowledge, 'islamicKnowledge')} />}
            {religiousInfo.hijabOrBeard && religiousInfo.hijabOrBeard !== 'None' && <InfoRow label={t('template.hijabBeard')} value={tv(religiousInfo.hijabOrBeard, 'hijabBeard')} />}
            {religiousInfo.sect && religiousInfo.sect !== 'None' && <InfoRow label={t('template.sect')} value={tv(religiousInfo.sect, 'sect')} />}
            {religiousInfo.madhab && <InfoRow label={t('template.madhab')} value={religiousInfo.madhab} />}
            {getCustomFieldsForSection(bioData, 'religious-info').map((f) => (
              <InfoRow key={f.key} label={f.key} value={f.value} />
            ))}
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
          <h2 className={cn('mb-4 text-xl font-semibold', palette.primary)}>{t('template.educationalBackground')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {education.highestQualification && <InfoRow label={t('template.qualification')} value={education.highestQualification} />}
            {education.institution && <InfoRow label={t('template.institution')} value={education.institution} />}
            {education.fieldOfStudy && <InfoRow label={t('template.fieldOfStudy')} value={education.fieldOfStudy} />}
            {education.yearOfCompletion && <InfoRow label={t('template.yearOfCompletion')} value={education.yearOfCompletion} />}
            {getCustomFieldsForSection(bioData, 'education').map((f) => (
              <InfoRow key={f.key} label={f.key} value={f.value} />
            ))}
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
          <h2 className={cn('mb-4 text-xl font-semibold', palette.primary)}>{t('template.professionalInfo')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {professionalInfo.occupation && <InfoRow label={t('template.occupation')} value={professionalInfo.occupation} />}
            {professionalInfo.company && <InfoRow label={t('template.company')} value={professionalInfo.company} />}
            {professionalInfo.designation && <InfoRow label={t('template.designation')} value={professionalInfo.designation} />}
            {professionalInfo.incomeRange && <InfoRow label={t('template.annualIncome')} value={tv(professionalInfo.incomeRange, 'income')} />}
            {professionalInfo.workLocation && <InfoRow label={t('template.workLocation')} value={professionalInfo.workLocation} />}
            {getCustomFieldsForSection(bioData, 'professional').map((f) => (
              <InfoRow key={f.key} label={f.key} value={f.value} />
            ))}
          </div>
        </section>
      )}

      {hasFamilyInfo(bioData) && (
        <section className="mb-6">
          <h2 className={cn('mb-4 text-xl font-semibold', palette.primary)}>{t('template.familyBackground')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {familyInfo.fatherName && <InfoRow label={t('template.fatherName')} value={familyInfo.fatherName} />}
            {familyInfo.fatherOccupation && <InfoRow label={t('template.fatherOccupation')} value={familyInfo.fatherOccupation} />}
            {familyInfo.motherName && <InfoRow label={t('template.motherName')} value={familyInfo.motherName} />}
            {familyInfo.motherOccupation && <InfoRow label={t('template.motherOccupation')} value={familyInfo.motherOccupation} />}
            {familyInfo.siblings && familyInfo.siblings.length > 0 && <InfoRow label={t('template.siblings')} value={formatSiblings(familyInfo.siblings, t)} />}
            {familyInfo.familyType && <InfoRow label={t('template.familyType')} value={tv(familyInfo.familyType, 'familyType')} />}
            {familyInfo.economicStatus && <InfoRow label={t('template.economicStatus')} value={tv(familyInfo.economicStatus, 'economicStatus')} />}
            {getCustomFieldsForSection(bioData, 'family').map((f) => (
              <InfoRow key={f.key} label={f.key} value={f.value} />
            ))}
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
          <h2 className={cn('mb-4 text-xl font-semibold', palette.primary)}>{t('template.partnerExpectations')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {partnerExpectations.ageRange && <InfoRow label={t('template.ageRange')} value={partnerExpectations.ageRange} />}
            {partnerExpectations.heightRange && <InfoRow label={t('template.heightRange')} value={partnerExpectations.heightRange} />}
            {partnerExpectations.educationExpectation && <InfoRow label={t('template.educationLabel')} value={partnerExpectations.educationExpectation} />}
            {partnerExpectations.occupationExpectation && <InfoRow label={t('template.occupation')} value={partnerExpectations.occupationExpectation} />}
            {getCustomFieldsForSection(bioData, 'expectations').map((f) => (
              <InfoRow key={f.key} label={f.key} value={f.value} />
            ))}
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
        <section className={cn('rounded-lg p-4', palette.primaryLight)}>
          <h2 className={cn('mb-4 text-xl font-semibold', palette.primary)}>{t('template.contactInfo')}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {contactInfo.email && <InfoRow label={t('template.email')} value={contactInfo.email} />}
            {contactInfo.phone && <InfoRow label={t('template.phone')} value={contactInfo.phone} />}
            {contactInfo.whatsapp && <InfoRow label={t('template.whatsapp')} value={contactInfo.whatsapp} />}
            {contactInfo.guardianContact && <InfoRow label={t('template.guardianContact')} value={contactInfo.guardianContact} />}
            {getCustomFieldsForSection(bioData, 'contact').map((f) => (
              <InfoRow key={f.key} label={f.key} value={f.value} />
            ))}
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
