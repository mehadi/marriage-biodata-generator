/**
 * TemplateSelector Component
 * Visual grid of template cards replacing the plain <Select> dropdown.
 * Each card shows a color swatch, name, style tag, and active ring.
 */

'use client';

import React from 'react';
import { TemplateType } from '@/types/biodata';
import { useTranslation } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { CheckCircle2, Lightbulb } from 'lucide-react';

interface TemplateConfig {
  id: TemplateType;
  label: string;
  tag: string;
  accent: string;
  pattern: string;
}

const TEMPLATES: TemplateConfig[] = [
  { id: 'modern',      label: 'Modern',      tag: 'Clean',      accent: 'bg-emerald-500', pattern: 'from-emerald-50 to-emerald-100' },
  { id: 'minimal',     label: 'Minimal',     tag: 'Simple',     accent: 'bg-slate-500',   pattern: 'from-slate-50 to-slate-100'    },
  { id: 'gradient',    label: 'Gradient',    tag: 'Vibrant',    accent: 'bg-blue-500',    pattern: 'from-blue-50 to-indigo-100'    },
  { id: 'card',        label: 'Card',        tag: 'Structured', accent: 'bg-violet-500',  pattern: 'from-violet-50 to-purple-100'  },
  { id: 'elegant',     label: 'Elegant',     tag: 'Luxe',       accent: 'bg-amber-500',   pattern: 'from-amber-50 to-yellow-100'   },
  { id: 'traditional', label: 'Traditional', tag: 'Classic',    accent: 'bg-rose-500',    pattern: 'from-rose-50 to-pink-100'      },
  { id: 'formal',      label: 'Formal',      tag: 'Official',   accent: 'bg-sky-600',     pattern: 'from-sky-50 to-cyan-100'       },
  { id: 'heritage',    label: 'Heritage',    tag: 'Cultural',   accent: 'bg-teal-600',    pattern: 'from-teal-50 to-emerald-100'   },
];

interface TemplateSelectorProps {
  value: TemplateType;
  onChange: (template: TemplateType) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ value, onChange }) => {
  const t = useTranslation();
  const selected = TEMPLATES.find((tmpl) => tmpl.id === value);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t('create.chooseTemplate')}
        </label>
        {selected && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            {selected.tag}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {TEMPLATES.map((tmpl) => {
          const isSelected = value === tmpl.id;
          return (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => onChange(tmpl.id)}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-xl border-2 text-left',
                'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
                isSelected
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-emerald-300'
              )}
              aria-pressed={isSelected}
            >
              {/* Color accent bar + mini document pattern */}
              <div className={cn('h-10 w-full bg-gradient-to-br relative overflow-hidden', tmpl.pattern)}>
                <div className={cn('absolute bottom-0 left-0 h-1.5 w-full', tmpl.accent)} />
                <div className="absolute left-2 top-2 space-y-1 opacity-50">
                  <div className={cn('h-1 w-10 rounded-full', tmpl.accent)} />
                  <div className="h-0.5 w-8 rounded-full bg-slate-400" />
                  <div className="h-0.5 w-6 rounded-full bg-slate-300" />
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col gap-0.5 p-2">
                <span className="truncate text-xs font-semibold text-slate-800 group-hover:text-emerald-700 dark:text-slate-200">
                  {tmpl.label}
                </span>
                <span className="text-[10px] leading-tight text-slate-500">{tmpl.tag}</span>
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <CheckCircle2 className="absolute right-1.5 top-1.5 h-4 w-4 text-emerald-600 drop-shadow-sm" />
              )}
            </button>
          );
        })}
      </div>

      <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        <Lightbulb className="h-3.5 w-3.5 shrink-0" />
        {t('create.templateTip')}
      </p>
    </div>
  );
};
