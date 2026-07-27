/**
 * Base Template Component
 * Abstract base for all bio data templates
 * Follows Open/Closed Principle: Open for extension, closed for modification
 * Shared rendering utilities reduce duplication across all 8 templates
 */

import React from 'react';
import { BioData } from '@/types/biodata';
import { calculateAge } from '@/lib/utils';

export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;
export type GetOptionLabelFn = (optionKey: string, value: string) => string;

export interface TemplateProps {
  bioData: BioData;
  className?: string;
}

const DEFAULT_PHOTO_SIZE_PERCENT = 100;

/**
 * Returns inline style for photo container so size can be scaled by user preference.
 * @param baseSizePx - Base size in pixels (e.g. 128 for h-32)
 * @param bioData - BioData containing optional photoSizePercent (50–200)
 */
export const getPhotoSizeStyle = (
  baseSizePx: number,
  bioData: BioData
): React.CSSProperties => {
  const percent = bioData.photoSizePercent ?? DEFAULT_PHOTO_SIZE_PERCENT;
  const size = Math.round((baseSizePx * percent) / 100);
  return { width: size, height: size, minWidth: size, minHeight: size };
};

/**
 * Utility function to safely render field values
 */
export const renderField = (value: unknown, t?: TranslateFn): string => {
  if (value === undefined || value === null || value === '') {
    return t ? t('common.notSpecified') : 'Not specified';
  }
  return String(value);
};

/**
 * Calculate and format age from date of birth
 */
export const getAge = (dob: string, t?: TranslateFn): string => {
  if (!dob) return t ? t('common.notSpecified') : 'Not specified';
  const age = calculateAge(dob);
  return t ? `${age} ${t('common.years')}` : `${age} years`;
};

/**
 * Translate a dropdown option value using the provided getOptionLabel function.
 * Falls back to the raw value if translation is unavailable.
 */
export const translateValue = (
  value: string | undefined | null,
  optionKey: string,
  getOptionLabel?: GetOptionLabelFn
): string => {
  if (!value) return '';
  if (!getOptionLabel) return value;
  const translated = getOptionLabel(optionKey, value);
  return translated || value;
};

/**
 * Get custom fields for a section (filters out empty key-value pairs)
 */
export const getCustomFieldsForSection = (
  bioData: BioData,
  sectionId: string
): Array<{ key: string; value: string }> => {
  const entries = bioData.customFields?.[sectionId as keyof typeof bioData.customFields] ?? [];
  return entries.filter((e) => e?.key?.trim() && e?.value?.trim());
};

/**
 * Format siblings list
 */
export const formatSiblings = (siblings: BioData['familyInfo']['siblings'], t?: TranslateFn): string => {
  if (!siblings || siblings.length === 0) return t ? t('common.none') : 'None';

  const brothersCount = siblings.filter((s) => s.relation === 'Brother').length;
  const sistersCount = siblings.filter((s) => s.relation === 'Sister').length;

  const parts: string[] = [];
  if (brothersCount > 0) {
    parts.push(t
      ? (brothersCount > 1 ? t('template.brothersPlural', { count: brothersCount }) : t('template.brothers', { count: brothersCount }))
      : `${brothersCount} Brother${brothersCount > 1 ? 's' : ''}`);
  }
  if (sistersCount > 0) {
    parts.push(t
      ? (sistersCount > 1 ? t('template.sistersPlural', { count: sistersCount }) : t('template.sisters', { count: sistersCount }))
      : `${sistersCount} Sister${sistersCount > 1 ? 's' : ''}`);
  }
  return parts.join(', ');
};

/**
 * Resolve the accent color palette based on the bio data gender field.
 * Used by all templates to provide gender-aware color theming.
 */
export interface GenderPalette {
  primary: string;        // e.g. 'text-emerald-600'
  primaryBg: string;      // e.g. 'bg-emerald-600'
  primaryBorder: string;  // e.g. 'border-emerald-600'
  primaryLight: string;   // e.g. 'bg-emerald-50'
  header: string;         // e.g. 'border-b-4 border-emerald-600'
}

export const getGenderPalette = (gender?: string): GenderPalette => {
  if (gender === 'female') {
    return {
      primary: 'text-rose-600',
      primaryBg: 'bg-rose-600',
      primaryBorder: 'border-rose-600',
      primaryLight: 'bg-rose-50',
      header: 'border-b-4 border-rose-500',
    };
  }
  // Default (male / unspecified) — emerald
  return {
    primary: 'text-emerald-600',
    primaryBg: 'bg-emerald-600',
    primaryBorder: 'border-emerald-600',
    primaryLight: 'bg-emerald-50',
    header: 'border-b-4 border-emerald-600',
  };
};

/**
 * Shared InfoRow component used across most templates.
 * Render as a named export so each template can import it from BaseTemplate.
 */
export const InfoRow: React.FC<{ label: string; value: string; accentClass?: string }> = ({
  label,
  value,
  accentClass = 'text-slate-700',
}) => (
  <div>
    <span className={`text-sm font-medium ${accentClass}`}>{label}:</span>
    <span className="ml-2 text-sm text-slate-600">{value}</span>
  </div>
);

/**
 * Shared section renderer: renders an array of {label, value} pairs as InfoRows,
 * plus an optional text block (e.g. family values, expectations body).
 * Eliminates the per-template duplication of null-guarded field rows.
 */
export interface SectionField {
  label: string;
  value?: string | null;
  /** If true, render as a standalone paragraph block instead of inline label:value */
  block?: boolean;
  /** Skip rendering if value equals this (e.g. 'None') */
  skipIfEquals?: string;
}

export const renderSectionFields = (
  fields: SectionField[],
  accentClass?: string
): React.ReactNode[] => {
  return fields
    .filter((f) => {
      if (!f.value) return false;
      if (f.skipIfEquals && f.value === f.skipIfEquals) return false;
      return true;
    })
    .map((f) =>
      f.block ? (
        <div key={f.label} className="col-span-2 mt-3">
          <p className="text-sm font-medium text-slate-700">{f.label}:</p>
          <p className="text-sm text-slate-600">{f.value}</p>
        </div>
      ) : (
        <InfoRow key={f.label} label={f.label} value={f.value!} accentClass={accentClass} />
      )
    );
};
