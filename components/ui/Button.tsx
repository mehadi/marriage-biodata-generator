/**
 * Button Component
 * Enhanced reusable button with ripple effect and better states
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  iconOnly?: boolean;
  children: React.ReactNode;
}

interface RippleType {
  x: number;
  y: number;
  size: number;
  key: number;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, iconOnly, className, children, disabled, ...props }, ref) => {
    const [ripples, setRipples] = useState<RippleType[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (ripples.length > 0) {
        const timeout = setTimeout(() => {
          setRipples([]);
        }, 600);
        return () => clearTimeout(timeout);
      }
    }, [ripples]);

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple = {
        x,
        y,
        size,
        key: Date.now(),
      };

      setRipples([...ripples, newRipple]);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading) {
        createRipple(event);
        props.onClick?.(event);
      }
    };

    const baseStyles = cn(
      'relative inline-flex items-center justify-center rounded-lg font-medium overflow-hidden',
      'transition-all duration-200 ease-in-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95',
      'select-none'
    );
    
    const variants = {
      primary: cn(
        'bg-emerald-600 text-white shadow-sm',
        'hover:bg-emerald-700 hover:shadow-md hover:scale-105',
        'focus-visible:ring-emerald-500'
      ),
      secondary: cn(
        'bg-slate-600 text-white shadow-sm',
        'hover:bg-slate-700 hover:shadow-md hover:scale-105',
        'focus-visible:ring-slate-500'
      ),
      outline: cn(
        'border-2 border-emerald-600 text-emerald-600 bg-transparent',
        'hover:bg-emerald-50 hover:border-emerald-700 hover:scale-105',
        'focus-visible:ring-emerald-500'
      ),
      ghost: cn(
        'text-slate-700 bg-transparent',
        'hover:bg-slate-100 hover:text-slate-900',
        'focus-visible:ring-slate-500'
      ),
      danger: cn(
        'bg-red-600 text-white shadow-sm',
        'hover:bg-red-700 hover:shadow-md hover:scale-105',
        'focus-visible:ring-red-500'
      ),
    };
    
    const sizes = {
      sm: iconOnly ? 'h-8 w-8 p-0' : 'px-3 py-1.5 text-sm',
      md: iconOnly ? 'h-10 w-10 p-0' : 'px-4 py-2 text-base',
      lg: iconOnly ? 'h-12 w-12 p-0' : 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={(node) => {
          // @ts-ignore
          buttonRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple Effect */}
        {ripples.map((ripple) => (
          <span
            key={ripple.key}
            className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {!iconOnly && <span>Loading...</span>}
            </>
          ) : (
            children
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
