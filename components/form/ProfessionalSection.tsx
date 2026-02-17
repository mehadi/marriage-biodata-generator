/**
 * Professional Section Component
 * Single Responsibility: Handle professional/career information form fields
 */

'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BioData, INCOME_RANGES } from '@/types/biodata';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';

interface ProfessionalSectionProps {
  register: UseFormRegister<BioData>;
  errors: FieldErrors<BioData>;
}

export const ProfessionalSection: React.FC<ProfessionalSectionProps> = ({ register, errors }) => {
  const { t, getOptionLabel } = useLanguage();

  return (
    <Card id="professional">
      <CardHeader>
        <CardTitle>{t('form.professional.title')}</CardTitle>
        <CardDescription>{t('form.professional.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label={t('form.professional.occupation')}
            placeholder={t('form.professional.occupationPlaceholder')}
            {...register('professionalInfo.occupation')}
            error={errors.professionalInfo?.occupation?.message ? t(errors.professionalInfo.occupation.message as string) : undefined}
          />

          <Input
            label={t('form.professional.company')}
            placeholder={t('form.professional.companyPlaceholder')}
            {...register('professionalInfo.company')}
            error={errors.professionalInfo?.company?.message ? t(errors.professionalInfo.company.message as string) : undefined}
          />

          <Input
            label={t('form.professional.designation')}
            placeholder={t('form.professional.designationPlaceholder')}
            {...register('professionalInfo.designation')}
            error={errors.professionalInfo?.designation?.message ? t(errors.professionalInfo.designation.message as string) : undefined}
          />

          <Select
            label={t('form.professional.incomeRange')}
            options={INCOME_RANGES.map((o) => ({ value: o, label: getOptionLabel('income', o) }))}
            placeholder={t('form.professional.incomePlaceholder')}
            {...register('professionalInfo.incomeRange')}
            error={errors.professionalInfo?.incomeRange?.message ? t(errors.professionalInfo.incomeRange.message as string) : undefined}
          />

          <div className="md:col-span-2">
            <Input
              label={t('form.professional.workLocation')}
              placeholder={t('form.professional.workLocationPlaceholder')}
              {...register('professionalInfo.workLocation')}
              error={errors.professionalInfo?.workLocation?.message ? t(errors.professionalInfo.workLocation.message as string) : undefined}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
