/**
 * Family Section Component
 * Single Responsibility: Handle family information form fields
 */

'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, useFieldArray, Control } from 'react-hook-form';
import { BioData } from '@/types/biodata';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Trash2 } from 'lucide-react';

const ECONOMIC_OPTIONS = ['Upper class', 'Upper middle class', 'Middle class', 'Lower middle class'] as const;
const FAMILY_TYPE_OPTIONS = ['Nuclear', 'Joint'] as const;
const RELATION_OPTIONS = ['Brother', 'Sister'] as const;
const SIBLING_MARITAL_OPTIONS = ['Married', 'Unmarried'] as const;

interface FamilySectionProps {
  register: UseFormRegister<BioData>;
  errors: FieldErrors<BioData>;
  control: Control<BioData>;
}

export const FamilySection: React.FC<FamilySectionProps> = ({ register, errors, control }) => {
  const { t, getOptionLabel } = useLanguage();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'familyInfo.siblings',
  });

  return (
    <Card id="family">
      <CardHeader>
        <CardTitle>{t('form.family.title')}</CardTitle>
        <CardDescription>{t('form.family.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label={t('form.family.fatherName')}
              placeholder={t('form.family.fatherNamePlaceholder')}
              {...register('familyInfo.fatherName')}
              error={errors.familyInfo?.fatherName?.message ? t(errors.familyInfo.fatherName.message as string) : undefined}
            />

            <Input
              label={t('form.family.fatherOccupation')}
              placeholder={t('form.family.fatherOccupationPlaceholder')}
              {...register('familyInfo.fatherOccupation')}
              error={errors.familyInfo?.fatherOccupation?.message ? t(errors.familyInfo.fatherOccupation.message as string) : undefined}
            />

            <Input
              label={t('form.family.motherName')}
              placeholder={t('form.family.motherNamePlaceholder')}
              {...register('familyInfo.motherName')}
              error={errors.familyInfo?.motherName?.message ? t(errors.familyInfo.motherName.message as string) : undefined}
            />

            <Input
              label={t('form.family.motherOccupation')}
              placeholder={t('form.family.motherOccupationPlaceholder')}
              {...register('familyInfo.motherOccupation')}
              error={errors.familyInfo?.motherOccupation?.message ? t(errors.familyInfo.motherOccupation.message as string) : undefined}
            />

            <Select
              label={t('form.family.economicStatus')}
              options={ECONOMIC_OPTIONS.map((o) => ({ value: o, label: getOptionLabel('economicStatus', o) }))}
              placeholder={t('form.family.economicPlaceholder')}
              {...register('familyInfo.economicStatus')}
              error={errors.familyInfo?.economicStatus?.message ? t(errors.familyInfo.economicStatus.message as string) : undefined}
            />

            <Select
              label={t('form.family.familyType')}
              options={FAMILY_TYPE_OPTIONS.map((o) => ({ value: o, label: getOptionLabel('familyType', o) }))}
              placeholder={t('form.family.familyTypePlaceholder')}
              {...register('familyInfo.familyType')}
              error={errors.familyInfo?.familyType?.message ? t(errors.familyInfo.familyType.message as string) : undefined}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-900">{t('form.family.siblings')}</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    relation: 'Brother',
                    name: '',
                    occupation: '',
                    maritalStatus: 'Unmarried',
                  })
                }
              >
                <Plus className="mr-1 h-4 w-4" />
                {t('form.family.addSibling')}
              </Button>
            </div>

            {fields.length === 0 && (
              <p className="text-sm text-slate-500">{t('form.family.noSiblings')}</p>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h5 className="text-sm font-medium text-slate-700">{t('form.family.siblingNumber', { n: String(index + 1) })}</h5>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Select
                    label={t('form.family.relation')}
                    options={RELATION_OPTIONS.map((o) => ({ value: o, label: getOptionLabel('relation', o) }))}
                    {...register(`familyInfo.siblings.${index}.relation`)}
                    error={errors.familyInfo?.siblings?.[index]?.relation?.message ? t(errors.familyInfo.siblings[index].relation?.message as string) : undefined}
                  />

                  <Input
                    label={t('form.family.nameOptional')}
                    placeholder={t('form.family.siblingNamePlaceholder')}
                    {...register(`familyInfo.siblings.${index}.name`)}
                  />

                  <Input
                    label={t('form.family.occupationOptional')}
                    placeholder={t('form.family.siblingOccupationPlaceholder')}
                    {...register(`familyInfo.siblings.${index}.occupation`)}
                  />

                  <Select
                    label={t('form.family.maritalStatusOptional')}
                    options={SIBLING_MARITAL_OPTIONS.map((o) => ({ value: o, label: getOptionLabel('siblingMarital', o) }))}
                    {...register(`familyInfo.siblings.${index}.maritalStatus`)}
                  />
                </div>
              </div>
            ))}
          </div>

          <Textarea
            label={t('form.family.familyValues')}
            placeholder={t('form.family.familyValuesPlaceholder')}
            rows={3}
            {...register('familyInfo.familyValues')}
            error={errors.familyInfo?.familyValues?.message ? t(errors.familyInfo.familyValues.message as string) : undefined}
          />
        </div>
      </CardContent>
    </Card>
  );
};
