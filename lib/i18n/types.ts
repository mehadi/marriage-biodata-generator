/**
 * i18n types - Locale and translation key types
 */

export type Locale = 'en' | 'bn';

export const LOCALES: Locale[] = ['en', 'bn'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  bn: 'বাংলা',
};

export const STORAGE_KEY = 'marriage-biodata-locale';
