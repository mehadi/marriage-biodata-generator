/**
 * Card Component
 * Enhanced container with hover effects and collapsible option
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hoverable = false, collapsible = false, defaultCollapsed = false, ...props }, ref) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    // If collapsible, we need to handle the children specially
    if (collapsible) {
      const childArray = React.Children.toArray(children);
      const header = childArray.find((child) => 
        React.isValidElement(child) && child.type === CardHeader
      );
      const otherChildren = childArray.filter((child) => child !== header);

      return (
        <div
          ref={ref}
          className={cn(
            'rounded-xl border border-slate-200 bg-white shadow-sm',
            'transition-all duration-200 ease-in-out',
            hoverable && 'hover:shadow-md hover:border-emerald-200',
            className
          )}
          {...props}
        >
          {header && React.cloneElement(header as React.ReactElement<CardHeaderProps>, {
            onClick: () => setIsCollapsed(!isCollapsed),
            className: cn((header as React.ReactElement<CardHeaderProps>).props.className, 'cursor-pointer p-6 pb-0'),
            collapsible: true,
            isCollapsed,
          })}
          <div
            className={cn(
              'overflow-hidden transition-all duration-300 ease-in-out',
              isCollapsed ? 'max-h-0' : 'max-h-[5000px]'
            )}
          >
            <div className="p-6 pt-4">
              {otherChildren}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
          'transition-all duration-200 ease-in-out',
          hoverable && 'hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  collapsible?: boolean;
  isCollapsed?: boolean;
  actions?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, collapsible, isCollapsed, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mb-6 flex items-start justify-between gap-4',
          className
        )}
        {...props}
      >
        <div className="flex flex-1 flex-col space-y-1.5">
          {children}
        </div>
        
        {(actions || collapsible) && (
          <div className="flex items-center gap-2">
            {actions}
            {collapsible && (
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-slate-500 transition-transform duration-200',
                  isCollapsed ? '-rotate-90' : 'rotate-0'
                )}
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-xl font-semibold leading-tight text-slate-900', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm leading-relaxed text-slate-600', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';
