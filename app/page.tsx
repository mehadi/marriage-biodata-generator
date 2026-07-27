/**
 * Landing Page
 * Modern, Islamic-themed homepage with features, stats ribbon, and full 8-template showcase
 */

'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/context/LanguageContext';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';
import {
  FileText,
  Layout,
  Download,
  Lock,
  Zap,
  CheckCircle,
  Heart,
  Moon,
  Star,
  Printer,
  Globe2,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const;

// Modal only opens after a CTA click — no need to bundle it into the initial page load.
const OnboardingWizard = dynamic(() =>
  import('@/components/OnboardingWizard').then((m) => m.OnboardingWizard)
);

export default function Home() {
  const t = useTranslation();
  const [isVisible, setIsVisible] = React.useState(false);
  const [showWizard, setShowWizard] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slideInUp');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-blue-950/40 animate-gradientShift">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 dark:border-emerald-900/30 dark:bg-slate-900/95">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group">
              <Heart className="h-8 w-8 text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {t('home.appName')}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/guides" className="hidden text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 sm:inline">
                Guides
              </Link>
              <LanguageSwitcher />
              <Link href="/create">
                <Button variant="primary" className="shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30">
                  {t('home.createBioData')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Introduction">
        <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-6 flex justify-center gap-2">
            <Moon className="h-8 w-8 text-emerald-600 animate-float" />
            <Star className="h-6 w-6 animate-pulse text-amber-500" />
          </div>
          
          <h2 className="mb-6 text-5xl font-bold text-slate-900 dark:text-slate-100 sm:text-6xl">
            {t('home.hero.title')}
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {t('home.hero.titleHighlight')}
            </span>
          </h2>

          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-slate-400">
            {t('home.hero.subtitle')}
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowWizard(true)}
              className="shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all"
            >
              <FileText className="mr-2 h-5 w-5" />
              {t('home.hero.startCreating')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="transition-all hover:scale-105"
            >
              {t('home.hero.learnMore')}
            </Button>
          </div>

          {/* Privacy Badge */}
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700 shadow-sm dark:bg-emerald-900/20 dark:text-emerald-400">
            <Lock className="h-4 w-4 text-emerald-600" />
            <span className="font-medium">{t('home.hero.privacyBadge')}</span>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="border-y border-slate-200 bg-white py-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center sm:gap-16">
            <StatItem icon={<Layout className="h-5 w-5 text-emerald-600" />} value="8" label="Templates" />
            <StatItem icon={<Download className="h-5 w-5 text-blue-500" />} value="PDF & Image" label="Export Formats" />
            <StatItem icon={<Printer className="h-5 w-5 text-violet-500" />} value="Print" label="Ready" />
            <StatItem icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />} value="100%" label="Private" />
            <StatItem icon={<Globe2 className="h-5 w-5 text-amber-500" />} value="EN & বাংলা" label="Bilingual" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white dark:bg-slate-900 py-20" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center scroll-animate opacity-0">
            <h2 id="features-heading" className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
              {t('home.features.heading')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t('home.features.subheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="scroll-animate opacity-0" style={{ animationDelay: '0.1s' }}>
              <FeatureCard
                icon={<Layout className="h-8 w-8" />}
                title={t('home.features.beautifulTemplates')}
                description={t('home.features.beautifulTemplatesDesc')}
              />
            </div>
            
            <div className="scroll-animate opacity-0" style={{ animationDelay: '0.2s' }}>
              <FeatureCard
                icon={<FileText className="h-8 w-8" />}
                title={t('home.features.islamicFormat')}
                description={t('home.features.islamicFormatDesc')}
              />
            </div>
            
            <div className="scroll-animate opacity-0" style={{ animationDelay: '0.3s' }}>
              <FeatureCard
                icon={<Download className="h-8 w-8" />}
                title={t('home.features.exportOptions')}
                description={t('home.features.exportOptionsDesc')}
              />
            </div>
            
            <div className="scroll-animate opacity-0" style={{ animationDelay: '0.1s' }}>
              <FeatureCard
                icon={<Zap className="h-8 w-8" />}
                title={t('home.features.autoSave')}
                description={t('home.features.autoSaveDesc')}
              />
            </div>
            
            <div className="scroll-animate opacity-0" style={{ animationDelay: '0.2s' }}>
              <FeatureCard
                icon={<Lock className="h-8 w-8" />}
                title={t('home.features.privacy')}
                description={t('home.features.privacyDesc')}
              />
            </div>
            
            <div className="scroll-animate opacity-0" style={{ animationDelay: '0.3s' }}>
              <FeatureCard
                icon={<CheckCircle className="h-8 w-8" />}
                title={t('home.features.easyToUse')}
                description={t('home.features.easyToUseDesc')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase — all 8 */}
      <section className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 py-20" aria-labelledby="templates-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center scroll-animate opacity-0">
            <h3 id="templates-heading" className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
              {t('home.templates.chooseStyle')}
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t('home.templates.subheading')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            {TEMPLATE_PREVIEWS.map((tmpl, i) => (
              <div
                key={tmpl.id}
                className="scroll-animate opacity-0"
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                <TemplatePreviewCard
                  name={tmpl.name}
                  tag={tmpl.tag}
                  accent={tmpl.accent}
                  pattern={tmpl.pattern}
                  featured={tmpl.featured}
                  popularChoiceLabel={t('home.templates.popularChoice')}
                />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowWizard(true)}
              className="shadow-lg shadow-emerald-600/20"
            >
              <FileText className="mr-2 h-5 w-5" />
              {t('home.hero.startCreating')}
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white dark:bg-slate-900 py-20" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center scroll-animate opacity-0">
            <h2 id="faq-heading" className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
              {t('home.faq.heading')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t('home.faq.subheading')}
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_KEYS.map((key, i) => (
              <details
                key={key}
                className="group scroll-animate opacity-0 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-5"
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-slate-900 dark:text-slate-100">
                  {t(`home.faq.${key}`)}
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t(`home.faq.a${key.slice(1)}`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <FaqJsonLd
        items={FAQ_KEYS.map((key) => ({
          question: t(`home.faq.${key}`),
          answer: t(`home.faq.a${key.slice(1)}`),
        }))}
      />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-20" aria-label="Call to action">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-bold text-white">
            {t('home.cta.title')}
          </h2>
          <p className="mb-8 text-xl text-emerald-100">
            {t('home.cta.subtitle')}
          </p>
          <button
            aria-label="Create your bio data now"
            onClick={() => setShowWizard(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-lg font-semibold text-emerald-600 shadow-sm transition-all hover:scale-105 hover:bg-emerald-50 hover:shadow-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <FileText className="h-5 w-5" />
            {t('home.cta.createNow')}
          </button>
        </div>
      </section>
      </main>

      {/* Onboarding Wizard */}
      {showWizard && <OnboardingWizard onClose={() => setShowWizard(false)} />}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-1 text-center text-xs text-slate-500 dark:text-slate-400">
            <p>{t('home.footer.copyright')}</p>
            <p>
              Developed by Mehadi ·{' '}
              <a
                href="https://www.mehadi.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-emerald-600 hover:underline dark:text-slate-400 dark:hover:text-emerald-400"
              >
                www.mehadi.me
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Static data ────────────────────────────────────────────────────────────

interface TemplatePreviewData {
  id: string;
  name: string;
  tag: string;
  accent: string;
  pattern: string;
  featured?: boolean;
}

const TEMPLATE_PREVIEWS: TemplatePreviewData[] = [
  { id: 'modern',      name: 'Modern',      tag: 'Clean',      accent: 'bg-emerald-500', pattern: 'from-emerald-50 to-emerald-100' },
  { id: 'minimal',     name: 'Minimal',     tag: 'Simple',     accent: 'bg-slate-500',   pattern: 'from-slate-50 to-slate-100'    },
  { id: 'gradient',    name: 'Gradient',    tag: 'Vibrant',    accent: 'bg-blue-500',    pattern: 'from-blue-50 to-indigo-100'    },
  { id: 'card',        name: 'Card',        tag: 'Structured', accent: 'bg-violet-500',  pattern: 'from-violet-50 to-purple-100'  },
  { id: 'elegant',     name: 'Elegant',     tag: 'Luxe',       accent: 'bg-amber-500',   pattern: 'from-amber-50 to-yellow-100'   },
  { id: 'traditional', name: 'Traditional', tag: 'Classic',    accent: 'bg-rose-500',    pattern: 'from-rose-50 to-pink-100',  featured: true },
  { id: 'formal',      name: 'Formal',      tag: 'Official',   accent: 'bg-sky-600',     pattern: 'from-sky-50 to-cyan-100'       },
  { id: 'heritage',    name: 'Heritage',    tag: 'Cultural',   accent: 'bg-teal-600',    pattern: 'from-teal-50 to-emerald-100'   },
];

// ── Components ──────────────────────────────────────────────────────────────

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{value}</span>
    </div>
    <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
  </div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-700">
    <div className="mb-4 inline-flex rounded-lg bg-emerald-100 p-3 text-emerald-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/30 dark:text-emerald-400">
      {icon}
    </div>
    <h4 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
  </div>
);

interface TemplatePreviewCardProps {
  name: string;
  tag: string;
  accent: string;
  pattern: string;
  featured?: boolean;
  popularChoiceLabel?: string;
}

const TemplatePreviewCard: React.FC<TemplatePreviewCardProps> = ({
  name,
  tag,
  accent,
  pattern,
  featured,
  popularChoiceLabel,
}) => (
  <div
    className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white dark:bg-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
      featured
        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
        : 'border-slate-200 hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-600'
    }`}
  >
    {featured && popularChoiceLabel && (
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-0.5 text-[10px] font-semibold text-white shadow-sm">
          <Star className="h-2.5 w-2.5 fill-current" />
          {popularChoiceLabel}
        </span>
      </div>
    )}

    {/* Visual preview area */}
    <div className={`relative h-24 w-full overflow-hidden bg-gradient-to-br ${pattern}`}>
      {/* Simulated document layout lines */}
      <div className="absolute left-4 top-4 space-y-1.5">
        <div className={`h-2 w-20 rounded-full ${accent} opacity-80`} />
        <div className="h-1 w-16 rounded-full bg-slate-300 opacity-60" />
        <div className="h-1 w-12 rounded-full bg-slate-200 opacity-60" />
      </div>
      <div className="absolute bottom-3 left-4 right-4 space-y-1">
        <div className="h-0.5 w-full rounded-full bg-slate-200 opacity-50" />
        <div className="h-0.5 w-4/5 rounded-full bg-slate-200 opacity-40" />
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full ${accent} opacity-60`} />
    </div>

    {/* Card body */}
    <div className="flex flex-col gap-1 p-3">
      <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400 transition-colors">
        {name}
      </span>
      <span className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${accent}`}>
        {tag}
      </span>
    </div>
  </div>
);
