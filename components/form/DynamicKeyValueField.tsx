/**
 * Dynamic Key-Value Field Component
 * Allows users to add custom key-value pairs beyond predefined form fields
 * Single Responsibility: Render and manage dynamic key-value entries per section
 */

'use client';

import React from 'react';
import { useFieldArray, Control } from 'react-hook-form';
import { BioData, CustomFieldsSectionId } from '@/types/biodata';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Trash2 } from 'lucide-react';

interface DynamicKeyValueFieldProps {
  sectionId: CustomFieldsSectionId;
  control: Control<BioData>;
}

const getFieldArrayName = (sectionId: CustomFieldsSectionId) =>
  `customFields.${sectionId}` as const;

export const DynamicKeyValueField: React.FC<DynamicKeyValueFieldProps> = ({
  sectionId,
  control,
}) => {
  const { t } = useLanguage();
  const fieldArrayName = getFieldArrayName(sectionId);

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldArrayName,
  });

  const handleAdd = () => append({ key: '', value: '' });

  if (fields.length === 0) {
    return (
      <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">{t('form.customFields.hint')}</p>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="mr-1 h-4 w-4" />
          {t('form.customFields.addField')}
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">{t('form.customFields.hint')}</p>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="mr-1 h-4 w-4" />
          {t('form.customFields.addField')}
        </Button>
      </div>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3 sm:flex-row sm:items-end dark:border-slate-700 dark:bg-slate-800/50"
          >
            <div className="flex-1">
              <Input
                placeholder={t('form.customFields.keyPlaceholder')}
                {...control.register(`${fieldArrayName}.${index}.key`)}
              />
            </div>
            <div className="flex flex-1 gap-2 sm:flex-row">
              <Input
                placeholder={t('form.customFields.valuePlaceholder')}
                {...control.register(`${fieldArrayName}.${index}.value`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
