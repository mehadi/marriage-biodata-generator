/**
 * Expectations Section Component
 * Single Responsibility: Handle partner expectations form fields
 */

'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BioData } from '@/types/biodata';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';

interface ExpectationsSectionProps {
  register: UseFormRegister<BioData>;
  errors: FieldErrors<BioData>;
}

export const ExpectationsSection: React.FC<ExpectationsSectionProps> = ({ register, errors }) => {
  const t = useLanguage().t;

  return (
    <Card id="expectations">
      <CardHeader>
        <CardTitle>{t('form.expectations.title')}</CardTitle>
        <CardDescription>{t('form.expectations.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label={t('form.expectations.ageRange')}
            placeholder={t('form.expectations.ageRangePlaceholder')}
            {...register('partnerExpectations.ageRange')}
            error={errors.partnerExpectations?.ageRange?.message ? t(errors.partnerExpectations.ageRange.message as string) : undefined}
          />

          <Input
            label={t('form.expectations.heightRange')}
            placeholder={t('form.expectations.heightRangePlaceholder')}
            {...register('partnerExpectations.heightRange')}
            error={errors.partnerExpectations?.heightRange?.message ? t(errors.partnerExpectations.heightRange.message as string) : undefined}
          />

          <div className="md:col-span-2">
            <Input
              label={t('form.expectations.educationExpectation')}
              placeholder={t('form.expectations.educationPlaceholder')}
              {...register('partnerExpectations.educationExpectation')}
              error={errors.partnerExpectations?.educationExpectation?.message ? t(errors.partnerExpectations.educationExpectation.message as string) : undefined}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label={t('form.expectations.occupationExpectation')}
              placeholder={t('form.expectations.occupationPlaceholder')}
              {...register('partnerExpectations.occupationExpectation')}
              error={errors.partnerExpectations?.occupationExpectation?.message ? t(errors.partnerExpectations.occupationExpectation.message as string) : undefined}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label={t('form.expectations.religiousExpectation')}
              placeholder={t('form.expectations.religiousPlaceholder')}
              rows={3}
              {...register('partnerExpectations.religiousExpectation')}
              error={errors.partnerExpectations?.religiousExpectation?.message ? t(errors.partnerExpectations.religiousExpectation.message as string) : undefined}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label={t('form.expectations.otherExpectations')}
              placeholder={t('form.expectations.otherPlaceholder')}
              rows={4}
              {...register('partnerExpectations.otherExpectations')}
              error={errors.partnerExpectations?.otherExpectations?.message ? t(errors.partnerExpectations.otherExpectations.message as string) : undefined}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
