/**
 * SectionNavigator Component
 * Sticky navigation for form sections with scroll spy
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  User, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Phone, 
  Image as ImageIcon, 
  Heart,
  ChevronRight
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

export const SectionNavigator: React.FC = () => {
  const t = useLanguage().t;
  const [activeSection, setActiveSection] = useState<string>('personal-info');
  const [isVisible, setIsVisible] = useState(false);
  const sections = sectionIds.map((s) => ({ ...s, name: t(s.nameKey) }));

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
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120; // Account for sticky header
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
        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-3 shadow-lg">
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
                aria-label={t('nav.navigateTo', { section: section.name })}
                aria-current={activeSection === section.id ? 'location' : undefined}
              >
                <span
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    activeSection === section.id ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                >
                  {section.icon}
                </span>
                <span className="flex-1 truncate">{section.name}</span>
                {activeSection === section.id && (
                  <ChevronRight className="h-4 w-4 animate-pulse" />
                )}
                
                {/* Progress indicator dot */}
                <span
                  className={`absolute left-0 top-1/2 h-2 w-1 -translate-y-1/2 rounded-r transition-all duration-200 ${
                    activeSection === section.id ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Horizontal Scroll */}
      <nav
        className={`lg:hidden sticky top-[100px] z-30 bg-white border-b border-slate-200 shadow-sm transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        aria-label="Form sections navigation"
      >
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 py-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
                aria-label={t('nav.navigateTo', { section: section.name })}
                aria-current={activeSection === section.id ? 'location' : undefined}
              >
                {section.icon}
                <span className="whitespace-nowrap">{section.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};
