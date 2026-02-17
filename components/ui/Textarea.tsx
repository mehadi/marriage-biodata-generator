/**
 * Textarea Component
 * Enhanced textarea field with better UX and accessibility
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCharCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, showCharCount, className, maxLength, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(props.value ? String(props.value).length : 0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        
        <div className={cn(
          "relative transition-all duration-200",
          isFocused && "scale-[1.01]"
        )}>
          <textarea
            ref={ref}
            className={cn(
              'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 resize-y min-h-[100px]',
              'placeholder:text-slate-400',
              'transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
              error 
                ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20 animate-shake' 
                : 'border-slate-300 hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={handleChange}
            maxLength={maxLength}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined
            }
            {...props}
          />
        </div>
        
        {/* Character Count */}
        {(showCharCount || maxLength) && (
          <div className="mt-1.5 flex justify-end">
            <span className={cn(
              "text-xs",
              maxLength && charCount > maxLength * 0.9 
                ? "text-amber-600 font-medium" 
                : "text-slate-500"
            )}>
              {charCount}{maxLength && `/${maxLength}`}
            </span>
          </div>
        )}
        
        {error && (
          <p 
            id={`${props.id}-error`}
            className="mt-1.5 flex items-center gap-1 text-xs text-red-600 animate-fadeIn" 
            role="alert"
          >
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {error}
          </p>
        )}
        
        {hint && !error && (
          <p 
            id={`${props.id}-hint`}
            className="mt-1.5 text-xs text-slate-500"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
