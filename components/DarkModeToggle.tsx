/**
 * Dark Mode Toggle Button
 * Single Responsibility: Toggle between light and dark themes
 */

'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface DarkModeToggleProps {
  className?: string;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className }) => {
  const { isDark, toggleTheme } = useTheme();
  const t = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? t('preview.lightMode') : t('preview.darkMode')}
      title={isDark ? t('preview.lightMode') : t('preview.darkMode')}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200',
        isDark
          ? 'bg-slate-700 text-amber-400 hover:bg-slate-600'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
        className
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};
