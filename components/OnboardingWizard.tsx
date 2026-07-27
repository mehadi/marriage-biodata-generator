/**
 * Onboarding Wizard Component
 * 3-step wizard: Select Gender → Choose Template → Enter Name → Go to Create
 * Reduces time-to-value for first-time users.
 *
 * Uses sessionStorage as the data bridge to /create to avoid Next.js
 * client-side navigation timing issues with URL hash fragments.
 */

'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { TemplateType } from '@/types/biodata';
import { saveOnboardingSession } from '@/lib/shareState';
import { Heart, ChevronRight, ChevronLeft, Sparkles, X, Mars, Venus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface OnboardingWizardProps {
  onClose: () => void;
}

const TEMPLATE_OPTIONS: {
  id: TemplateType;
  label: string;
  accent: string;
  gradient: string;
}[] = [
  { id: 'modern',      label: 'Modern',      accent: 'border-emerald-500 bg-emerald-50',  gradient: 'from-emerald-400 to-teal-500'   },
  { id: 'traditional', label: 'Traditional', accent: 'border-amber-500 bg-amber-50',      gradient: 'from-amber-400 to-orange-500'   },
  { id: 'elegant',     label: 'Elegant',     accent: 'border-blue-500 bg-blue-50',        gradient: 'from-blue-400 to-indigo-500'    },
  { id: 'minimal',     label: 'Minimal',     accent: 'border-slate-400 bg-slate-50',      gradient: 'from-slate-400 to-slate-600'    },
  { id: 'gradient',    label: 'Gradient',    accent: 'border-cyan-500 bg-cyan-50',        gradient: 'from-cyan-400 to-blue-500'      },
  { id: 'heritage',    label: 'Heritage',    accent: 'border-teal-500 bg-teal-50',        gradient: 'from-teal-400 to-emerald-600'   },
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onClose }) => {
  const t = useTranslation();

  const [step, setStep]       = useState(1);
  const [gender, setGender]   = useState<'male' | 'female' | null>(null);
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [name, setName]       = useState('');

  const steps = [
    { num: 1, label: t('onboarding.step1Title') },
    { num: 2, label: t('onboarding.step2Title') },
    { num: 3, label: t('onboarding.step3Title') },
  ];

  const handleStart = () => {
    // Build the partial BioData to pre-fill the create form
    const preFilledData = {
      personalInfo: {
        fullName: name.trim(),
        gender: gender ?? undefined,
        dateOfBirth: '',
        height: '',
        complexion: '',
        bloodGroup: '',
        maritalStatus: 'Never Married' as const,
        nationality: '',
        placeOfBirth: '',
      },
    };

    // Store in sessionStorage — create page will consume this on mount
    saveOnboardingSession(preFilledData, template);

    // Use window.location.href for a reliable full navigation
    // (avoids Next.js client-side navigation timing issues)
    window.location.href = '/create';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          aria-label={t('common.close')}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-100 px-8 py-6 dark:border-slate-700">
          <div className="mb-1 flex items-center gap-2">
            <Heart className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {t('onboarding.title')}
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('onboarding.subtitle')}</p>

          {/* Step indicators */}
          <div className="mt-5 flex items-center gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all',
                    step >= s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                  )}
                >
                  {s.num}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 flex-1 rounded transition-all',
                      step > s.num ? 'bg-emerald-600' : 'bg-slate-100 dark:bg-slate-700'
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[240px] px-8 py-6">
          {/* Step 1 — Gender */}
          {step === 1 && (
            <div>
              <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t('onboarding.step1Title')}
              </h3>
              <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                {t('onboarding.step1Desc')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setGender('male')}
                  className={cn(
                    'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:scale-105',
                    gender === 'male'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-full',
                      gender === 'male' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                    )}
                  >
                    <Mars className="h-7 w-7" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {t('onboarding.groom')}
                  </span>
                </button>

                <button
                  onClick={() => setGender('female')}
                  className={cn(
                    'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:scale-105',
                    gender === 'female'
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-full',
                      gender === 'female' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                    )}
                  >
                    <Venus className="h-7 w-7" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {t('onboarding.bride')}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Template */}
          {step === 2 && (
            <div>
              <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t('onboarding.step2Title')}
              </h3>
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                {t('onboarding.step2Desc')}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATE_OPTIONS.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplate(tmpl.id)}
                    className={cn(
                      'rounded-xl border-2 p-3 text-center transition-all hover:scale-105',
                      template === tmpl.id
                        ? tmpl.accent
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                    )}
                  >
                    <div
                      className={cn(
                        'mx-auto mb-2 h-10 w-full rounded-lg bg-gradient-to-br',
                        tmpl.gradient
                      )}
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {tmpl.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Name */}
          {step === 3 && (
            <div>
              <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t('onboarding.step3Title')}
              </h3>
              <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                {t('onboarding.step3Desc')}
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('form.personal.fullNamePlaceholder')}
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-lg font-medium text-slate-900 outline-none transition-colors focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              />
              {name.trim() && (
                <div className="mt-4 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
                  <p className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">
                      &ldquo;{name}&rdquo; will appear in your bio data!
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-8 py-5 dark:border-slate-700">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t('onboarding.back')}
            </Button>
          ) : (
            <button
              onClick={onClose}
              className="text-sm text-slate-500 hover:text-slate-600 hover:underline dark:text-slate-400 dark:hover:text-slate-300"
            >
              {t('onboarding.skipOnboarding')}
            </button>
          )}

          {step < 3 ? (
            <Button
              variant="primary"
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && !gender}
            >
              {t('onboarding.next')}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleStart}>
              <Sparkles className="mr-1.5 h-4 w-4" />
              {t('onboarding.startCreating')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
