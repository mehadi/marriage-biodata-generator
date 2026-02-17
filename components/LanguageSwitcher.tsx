/**
 * Language Switcher Component
 * Toggle between English and Bangla
 */

'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALE_LABELS, type Locale } from '@/lib/i18n/types';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={cn('inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5', className)}
      role="tablist"
      aria-label="Language"
    >
      {(['en', 'bn'] as Locale[]).map((loc) => (
        <button
          key={loc}
          type="button"
          role="tab"
          aria-selected={locale === loc}
          onClick={() => setLocale(loc)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            locale === loc
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          )}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
