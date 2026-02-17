/**
 * i18n - Translation utilities and locale resolution
 * Single Responsibility: Provide translation lookup and interpolation
 */

import type { Locale } from './types';
import { en } from './translations/en';
import { bn } from './translations/bn';

export type Translations = typeof en;

const translations: Record<Locale, Translations> = {
  en,
  bn,
};

/**
 * Get nested value from object by dot-separated path
 */
function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Replace {{key}} placeholders in string with values from params
 */
function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => String(params[key] ?? `{{${key}}}`));
}

/**
 * Get translation for a key in the given locale.
 * Supports dot notation (e.g. 'home.hero.title') and interpolation (e.g. 'nav.navigateTo' with { section: 'Personal' }).
 */
export function t(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = translations[locale] as Record<string, unknown>;
  const value = getNested(dict, key);
  if (value) return interpolate(value, params);
  // Fallback to English
  const enDict = translations.en as Record<string, unknown>;
  const fallback = getNested(enDict, key);
  if (fallback) return interpolate(fallback, params);
  return key;
}

/**
 * Get option label for select options (e.g. options.maritalStatus['Never Married'])
 */
export function getOptionLabel(
  locale: Locale,
  optionKey: string,
  value: string
): string {
  const label = t(locale, `options.${optionKey}.${value}`);
  if (label.startsWith('options.')) return value;
  return label;
}

export { en } from './translations/en';
export { bn } from './translations/bn';
export type { Locale, Translations };
export type { EnTranslations } from './translations/en';
export { LOCALES, LOCALE_LABELS, STORAGE_KEY } from './types';
