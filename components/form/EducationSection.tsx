/**
 * Education Section Component
 * Single Responsibility: Handle educational information form fields
 */

'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BioData } from '@/types/biodata';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';

interface EducationSectionProps {
  register: UseFormRegister<BioData>;
  errors: FieldErrors<BioData>;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ register, errors }) => {
  const t = useLanguage().t;

  return (
    <Card id="education">
      <CardHeader>
        <CardTitle>{t('form.education.title')}</CardTitle>
        <CardDescription>{t('form.education.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label={t('form.education.highestQualification')}
            placeholder={t('form.education.qualificationPlaceholder')}
            {...register('education.highestQualification')}
            error={errors.education?.highestQualification?.message ? t(errors.education.highestQualification.message as string) : undefined}
          />

          <Input
            label={t('form.education.institution')}
            placeholder={t('form.education.institutionPlaceholder')}
            {...register('education.institution')}
            error={errors.education?.institution?.message ? t(errors.education.institution.message as string) : undefined}
          />

          <Input
            label={t('form.education.fieldOfStudy')}
            placeholder={t('form.education.fieldPlaceholder')}
            {...register('education.fieldOfStudy')}
            error={errors.education?.fieldOfStudy?.message ? t(errors.education.fieldOfStudy.message as string) : undefined}
          />

          <Input
            label={t('form.education.yearOfCompletion')}
            placeholder={t('form.education.yearPlaceholder')}
            type="text"
            maxLength={4}
            {...register('education.yearOfCompletion')}
            error={errors.education?.yearOfCompletion?.message ? t(errors.education.yearOfCompletion.message as string) : undefined}
          />

          <div className="md:col-span-2">
            <Textarea
              label={t('form.education.additionalQualifications')}
              placeholder={t('form.education.additionalPlaceholder')}
              rows={3}
              {...register('education.additionalQualifications')}
              error={errors.education?.additionalQualifications?.message ? t(errors.education.additionalQualifications.message as string) : undefined}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
