/**
 * Landing Page
 * Modern, Islamic-themed homepage with features and CTA
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/context/LanguageContext';
import { 
  FileText, 
  Layout, 
  Download, 
  Lock, 
  Zap, 
  CheckCircle,
  Heart,
  Moon,
  Star
} from 'lucide-react';

export default function Home() {
  const t = useTranslation();
  const [isVisible, setIsVisible] = React.useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 animate-gradientShift">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group">
              <Heart className="h-8 w-8 text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <h1 className="text-2xl font-bold text-slate-900">
                {t('home.appName')}
              </h1>
            </div>
            <div className="flex items-center gap-3">
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

      <main>
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-label="Introduction">
        <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-6 flex justify-center gap-2">
            <Moon className="h-8 w-8 text-emerald-600 animate-float" />
            <Star className="h-6 w-6 animate-pulse text-amber-500" />
          </div>
          
          <h2 className="mb-6 text-5xl font-bold text-slate-900 sm:text-6xl">
            {t('home.hero.title')}
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {t('home.hero.titleHighlight')}
            </span>
          </h2>
          
          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-600">
            {t('home.hero.subtitle')}
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/create">
              <Button variant="primary" size="lg" className="shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all">
                <FileText className="mr-2 h-5 w-5" />
                {t('home.hero.startCreating')}
              </Button>
            </Link>
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
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700 shadow-sm">
            <Lock className="h-4 w-4 text-emerald-600" />
            <span className="font-medium">{t('home.hero.privacyBadge')}</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center scroll-animate opacity-0">
            <h2 id="features-heading" className="mb-4 text-3xl font-bold text-slate-900">
              {t('home.features.heading')}
            </h2>
            <p className="text-lg text-slate-600">
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

      {/* Template Showcase */}
      <section className="bg-gradient-to-br from-emerald-50 to-blue-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h3 className="mb-4 text-3xl font-bold text-slate-900">
              {t('home.templates.chooseStyle')}
            </h3>
            <p className="text-lg text-slate-600">
              {t('home.templates.subheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <TemplateCard
              name={t('home.templates.modern')}
              description={t('home.templates.modernDesc')}
              features={[t('home.templates.modernFeatures.0'), t('home.templates.modernFeatures.1'), t('home.templates.modernFeatures.2')]}
              popularChoiceLabel={t('home.templates.popularChoice')}
            />
            
            <TemplateCard
              name={t('home.templates.traditional')}
              description={t('home.templates.traditionalDesc')}
              features={[t('home.templates.traditionalFeatures.0'), t('home.templates.traditionalFeatures.1'), t('home.templates.traditionalFeatures.2')]}
              featured
              popularChoiceLabel={t('home.templates.popularChoice')}
            />
            
            <TemplateCard
              name={t('home.templates.elegant')}
              description={t('home.templates.elegantDesc')}
              features={[t('home.templates.elegantFeatures.0'), t('home.templates.elegantFeatures.1'), t('home.templates.elegantFeatures.2')]}
              popularChoiceLabel={t('home.templates.popularChoice')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-20" aria-label="Call to action">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-bold text-white">
            {t('home.cta.title')}
          </h2>
          <p className="mb-8 text-xl text-emerald-100">
            {t('home.cta.subtitle')}
          </p>
          <Link
            aria-label="Create your bio data now"
            href="/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-lg font-semibold text-emerald-600 shadow-sm transition-all hover:scale-105 hover:bg-emerald-50 hover:shadow-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <FileText className="h-5 w-5" />
            {t('home.cta.createNow')}
          </Link>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-1 text-center text-xs text-slate-500">
            <p>{t('home.footer.copyright')}</p>
            <p>
              Developed by Mehadi ·{' '}
              <a
                href="https://www.mehadi.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-emerald-600 hover:underline"
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

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200">
    <div className="mb-4 inline-flex rounded-lg bg-emerald-100 p-3 text-emerald-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
      {icon}
    </div>
    <h4 className="mb-2 text-xl font-semibold text-slate-900">{title}</h4>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

interface TemplateCardProps {
  name: string;
  description: string;
  features: string[];
  featured?: boolean;
  popularChoiceLabel?: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ name, description, features, featured, popularChoiceLabel }) => (
  <div className={`group rounded-xl border-2 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
    featured ? 'border-emerald-500 ring-2 ring-emerald-500/20 relative' : 'border-slate-200 hover:border-emerald-300'
  }`}>
    {featured && popularChoiceLabel && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <div className="inline-block rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1 text-xs font-semibold text-white shadow-md animate-pulse-subtle">
          ⭐ {popularChoiceLabel}
        </div>
      </div>
    )}
    <h4 className="mb-2 mt-2 text-2xl font-bold text-slate-900 transition-colors group-hover:text-emerald-600">{name}</h4>
    <p className="mb-4 text-slate-600 leading-relaxed">{description}</p>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2 text-sm text-slate-700 transition-transform duration-200 group-hover:translate-x-1">
          <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-600" />
          {feature}
        </li>
      ))}
    </ul>
  </div>
);
