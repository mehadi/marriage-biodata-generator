/**
 * SectionNavigator Component
 * Navigation for form sections with scroll spy and completion badges.
 * Desktop: fixed sidebar. Mobile: floating FAB with dropdown (avoids blocking content).
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SectionCompletion } from '@/hooks/useBioDataForm';
import { 
  User, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Phone, 
  Image as ImageIcon, 
  Heart,
  ChevronRight,
  CheckCircle2,
  List,
  X,
} from 'lucide-react';

interface Section {
  id: string;
  nameKey: string;
  icon: React.ReactNode;
}

const sectionIds: Section[] = [
  { id: 'personal-info', nameKey: 'nav.personal', icon: <User className="h-4 w-4" /> },
  { id: 'religious-info', nameKey: 'nav.religious', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'education', nameKey: 'nav.education', icon: <GraduationCap className="h-4 w-4" /> },
  { id: 'professional', nameKey: 'nav.professional', icon: <Briefcase className="h-4 w-4" /> },
  { id: 'family', nameKey: 'nav.family', icon: <Users className="h-4 w-4" /> },
  { id: 'contact', nameKey: 'nav.contact', icon: <Phone className="h-4 w-4" /> },
  { id: 'photo', nameKey: 'nav.photo', icon: <ImageIcon className="h-4 w-4" /> },
  { id: 'expectations', nameKey: 'nav.expectations', icon: <Heart className="h-4 w-4" /> },
];

interface SectionNavigatorProps {
  sectionCompletion?: Partial<SectionCompletion>;
}

export const SectionNavigator: React.FC<SectionNavigatorProps> = ({ sectionCompletion = {} }) => {
  const t = useLanguage().t;
  const [activeSection, setActiveSection] = useState<string>('personal-info');
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const sections = sectionIds.map((s) => ({ ...s, name: t(s.nameKey) }));

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Show navigator after scrolling down a bit
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Desktop Navigation - Sidebar */}
      <nav
        className={`hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
        }`}
        aria-label="Form sections navigation"
      >
        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800/90">
          <div className="space-y-1">
            {sections.map((section) => {
              const isDone = !!sectionCompletion[section.id as keyof SectionCompletion];
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400'
                  }`}
                  aria-label={t('nav.navigateTo', { section: section.name })}
                  aria-current={isActive ? 'location' : undefined}
                >
                  <span
                    className={`flex-shrink-0 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  >
                    {section.icon}
                  </span>
                  <span className="flex-1 truncate">{section.name}</span>
                  {isActive && !isDone && (
                    <ChevronRight className="h-4 w-4 animate-pulse" />
                  )}
                  {isDone && (
                    <CheckCircle2
                      className={`h-4 w-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-emerald-500'
                      }`}
                    />
                  )}

                  {/* Active indicator bar */}
                  <span
                    className={`absolute left-0 top-1/2 h-2 w-1 -translate-y-1/2 rounded-r transition-all duration-200 ${
                      isActive ? 'bg-white' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Floating FAB bottom-left (Preview FAB is bottom-right) */}
      <div ref={mobileMenuRef} className="lg:hidden fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className={`flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-emerald-700 active:scale-95 ${
            isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label={mobileMenuOpen ? 'Close section menu' : 'Open section menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
        </button>

        {mobileMenuOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-scaleIn dark:border-slate-700 dark:bg-slate-800">
            <div className="max-h-[70vh] overflow-y-auto p-2">
              {sections.map((section) => {
                const isDone = !!sectionCompletion[section.id as keyof SectionCompletion];
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                    aria-label={t('nav.navigateTo', { section: section.name })}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {section.icon}
                    <span className="flex-1 truncate">{section.name}</span>
                    {isDone && (
                      <CheckCircle2
                        className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-emerald-500'}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
