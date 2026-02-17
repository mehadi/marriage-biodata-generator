/**
 * Personal Info Section Component
 * Single Responsibility: Handle personal information form fields
 */

'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { BioData, COMPLEXION_OPTIONS, BLOOD_GROUP_OPTIONS, HEIGHT_OPTIONS } from '@/types/biodata';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';

const MARITAL_OPTIONS = ['Never Married', 'Divorced', 'Widowed'] as const;

interface PersonalInfoSectionProps {
  register: UseFormRegister<BioData>;
  errors: FieldErrors<BioData>;
  setValue: UseFormSetValue<BioData>;
  watch: UseFormWatch<BioData>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  register,
  errors,
  setValue,
  watch,
}) => {
  const { t, getOptionLabel } = useLanguage();
  const dateOfBirth = watch('personalInfo.dateOfBirth');

  return (
    <Card id="personal-info">
      <CardHeader>
        <CardTitle>{t('form.personal.title')}</CardTitle>
        <CardDescription>{t('form.personal.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label={t('form.personal.fullName')}
              placeholder={t('form.personal.fullNamePlaceholder')}
              {...register('personalInfo.fullName')}
              error={errors.personalInfo?.fullName?.message ? t(errors.personalInfo.fullName.message as string) : undefined}
            />
          </div>

          <DatePicker
            label={t('form.personal.dateOfBirth')}
            value={dateOfBirth}
            onChange={(date) => setValue('personalInfo.dateOfBirth', date)}
            error={errors.personalInfo?.dateOfBirth?.message ? t(errors.personalInfo.dateOfBirth.message as string) : undefined}
            placeholder={t('form.personal.dateOfBirthPlaceholder')}
            maxDate={new Date()}
          />

          <Select
            label={t('form.personal.height')}
            options={HEIGHT_OPTIONS.map((h) => ({ value: h, label: getOptionLabel('height', h) }))}
            placeholder={t('form.personal.heightPlaceholder')}
            {...register('personalInfo.height')}
            error={errors.personalInfo?.height?.message ? t(errors.personalInfo.height.message as string) : undefined}
          />

          <Select
            label={t('form.personal.complexion')}
            options={COMPLEXION_OPTIONS.map((o) => ({ value: o, label: getOptionLabel('complexion', o) }))}
            placeholder={t('form.personal.complexionPlaceholder')}
            {...register('personalInfo.complexion')}
            error={errors.personalInfo?.complexion?.message ? t(errors.personalInfo.complexion.message as string) : undefined}
          />

          <Select
            label={t('form.personal.bloodGroup')}
            options={BLOOD_GROUP_OPTIONS.map((o) => ({ value: o, label: getOptionLabel('bloodGroup', o) }))}
            placeholder={t('form.personal.bloodGroupPlaceholder')}
            {...register('personalInfo.bloodGroup')}
            error={errors.personalInfo?.bloodGroup?.message ? t(errors.personalInfo.bloodGroup.message as string) : undefined}
          />

          <Select
            label={t('form.personal.maritalStatus')}
            options={MARITAL_OPTIONS.map((o) => ({ value: o, label: getOptionLabel('maritalStatus', o) }))}
            placeholder={t('form.personal.maritalStatusPlaceholder')}
            {...register('personalInfo.maritalStatus')}
            error={errors.personalInfo?.maritalStatus?.message ? t(errors.personalInfo.maritalStatus.message as string) : undefined}
          />

          <Input
            label={t('form.personal.nationality')}
            placeholder={t('form.personal.nationalityPlaceholder')}
            {...register('personalInfo.nationality')}
            error={errors.personalInfo?.nationality?.message ? t(errors.personalInfo.nationality.message as string) : undefined}
          />

          <Input
            label={t('form.personal.placeOfBirth')}
            placeholder={t('form.personal.placeOfBirthPlaceholder')}
            {...register('personalInfo.placeOfBirth')}
            error={errors.personalInfo?.placeOfBirth?.message ? t(errors.personalInfo.placeOfBirth.message as string) : undefined}
          />
        </div>
      </CardContent>
    </Card>
  );
};
