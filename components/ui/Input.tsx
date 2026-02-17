/**
 * Input Component
 * Enhanced input field with better focus states and validation
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, success, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value && String(props.value).length > 0;

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
          {icon && (
            <div className={cn(
              "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-colors duration-200",
              isFocused ? "text-emerald-600" : "text-slate-400",
              error && "text-red-500"
            )}>
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900',
              'placeholder:text-slate-400',
              'transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
              icon && 'pl-10',
              (success || error) && 'pr-10',
              error 
                ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20 animate-shake' 
                : success 
                  ? 'border-emerald-300 bg-emerald-50/50 focus:border-emerald-500 focus:ring-emerald-500/20'
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
            {...props}
          />

          {/* Success/Error Icon */}
          {(success || error) && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              {error ? (
                <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
              ) : success ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" aria-hidden="true" />
              ) : null}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600 animate-fadeIn" role="alert">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {error}
          </p>
        )}
        
        {hint && !error && (
          <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
