/**
 * Language Context
 * Single Responsibility: Provide current locale and translation function to the app
 */

'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n/types';
import { t as translate, getOptionLabel as getOptionLabelUtil } from '@/lib/i18n';
import { STORAGE_KEY } from '@/lib/i18n';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getOptionLabel: (optionKey: string, value: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === 'en' || stored === 'bn') {
      setLocaleState(stored);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale === 'bn' ? 'bn' : 'en';
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale === 'bn' ? 'bn' : 'en';
    }
  }, [locale, mounted]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(locale, key, params),
    [locale]
  );

  const getOptionLabel = useCallback(
    (optionKey: string, value: string) => getOptionLabelUtil(locale, optionKey, value),
    [locale]
  );

  const value: LanguageContextValue = {
    locale,
    setLocale,
    t,
    getOptionLabel,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

export function useTranslation() {
  return useLanguage().t;
}
