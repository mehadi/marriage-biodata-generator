/**
 * Religious Info Section Component
 * Single Responsibility: Handle religious information form fields
 */

'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BioData } from '@/types/biodata';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';

const PRAYER_OPTIONS = ['Regular 5 times', 'Mostly regular', 'Sometimes', 'Learning', 'None'];
const QURAN_OPTIONS = ['Fluent', 'Learning', 'Basic', 'None'];
const KNOWLEDGE_OPTIONS = ['Advanced', 'Intermediate', 'Basic', 'Learning', 'None'];
const HIJAB_OPTIONS = ['Yes', 'No', 'Sometimes', 'Planning to', 'None'];
const SECT_OPTIONS = ['Sunni', 'Shia', 'Other', 'Prefer not to say', 'None'];

interface ReligiousInfoSectionProps {
  register: UseFormRegister<BioData>;
  errors: FieldErrors<BioData>;
}

export const ReligiousInfoSection: React.FC<ReligiousInfoSectionProps> = ({ register, errors }) => {
  const { t, getOptionLabel } = useLanguage();

  return (
    <Card id="religious-info">
      <CardHeader>
        <CardTitle>{t('form.religious.title')}</CardTitle>
        <CardDescription>{t('form.religious.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select
            label={t('form.religious.prayerPractice')}
            options={PRAYER_OPTIONS.map((o) => ({ value: o, label: getOptionLabel('prayer', o) }))}
            placeholder={t('form.religious.prayerPlaceholder')}
            {...register('religiousInfo.prayerPractice')}
            error={errors.religiousInfo?.prayerPractice?.message ? t(errors.religiousInfo.prayerPractice.message as string) : undefined}
          />

          <Select
            label={t('form.religious.quranRecitation')}
            options={QURAN_OPTIONS.map((o) => ({ value: o, label: getOptionLabel('quran', o) }))}
            placeholder={t('form.religious.quranPlaceholder')}
            {...register('religiousInfo.quranRecitation')}
            error={errors.religiousInfo?.quranRecitation?.message ? t(errors.religiousInfo.quranRecitation.message as string) : undefined}
          />

          <Select
            label={t('form.religious.islamicKnowledge')}
            options={KNOWLEDGE_OPTIONS.map((o) => ({ value: o, label: getOptionLabel('islamicKnowledge', o) }))}
            placeholder={t('form.religious.knowledgePlaceholder')}
            {...register('religiousInfo.islamicKnowledge')}
            error={errors.religiousInfo?.islamicKnowledge?.message ? t(errors.religiousInfo.islamicKnowledge.message as string) : undefined}
          />

          <Select
            label={t('form.religious.hijabBeard')}
            options={HIJAB_OPTIONS.map((o) => ({ value: o, label: getOptionLabel('hijabBeard', o) }))}
            placeholder={t('form.religious.hijabPlaceholder')}
            {...register('religiousInfo.hijabOrBeard')}
            error={errors.religiousInfo?.hijabOrBeard?.message ? t(errors.religiousInfo.hijabOrBeard.message as string) : undefined}
          />

          <Select
            label={t('form.religious.sect')}
            options={SECT_OPTIONS.map((o) => ({ value: o, label: getOptionLabel('sect', o) }))}
            placeholder={t('form.religious.sectPlaceholder')}
            {...register('religiousInfo.sect')}
            error={errors.religiousInfo?.sect?.message ? t(errors.religiousInfo.sect.message as string) : undefined}
          />

          <Input
            label={t('form.religious.madhab')}
            placeholder={t('form.religious.madhabPlaceholder')}
            {...register('religiousInfo.madhab')}
            error={errors.religiousInfo?.madhab?.message ? t(errors.religiousInfo.madhab.message as string) : undefined}
          />

          <div className="md:col-span-2">
            <Textarea
              label={t('form.religious.otherReligious')}
              placeholder={t('form.religious.otherReligiousPlaceholder')}
              rows={3}
              {...register('religiousInfo.otherReligiousInfo')}
              error={errors.religiousInfo?.otherReligiousInfo?.message ? t(errors.religiousInfo.otherReligiousInfo.message as string) : undefined}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
