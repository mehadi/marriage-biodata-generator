/**
 * Base Template Component
 * Abstract base for all bio data templates
 * Follows Open/Closed Principle: Open for extension, closed for modification
 */

import React from 'react';
import { BioData } from '@/types/biodata';
import { calculateAge } from '@/lib/utils';

export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

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
