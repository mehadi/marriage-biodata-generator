/**
 * Base Template Component
 * Abstract base for all bio data templates
 * Follows Open/Closed Principle: Open for extension, closed for modification
 */

import { BioData } from '@/types/biodata';
import { calculateAge } from '@/lib/utils';

export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

export interface TemplateProps {
  bioData: BioData;
  className?: string;
}

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
