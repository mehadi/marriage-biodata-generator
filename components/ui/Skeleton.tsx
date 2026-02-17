/**
 * Skeleton Component
 * Loading skeleton with shimmer effect for better perceived performance
 */

'use client';

import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  count = 1,
}) => {
  const baseClasses = 'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const skeletonClasses = clsx(
    baseClasses,
    variantClasses[variant],
    className
  );

  const style: React.CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  if (count === 1) {
    return <div className={skeletonClasses} style={style} role="status" aria-label="Loading..." />;
  }

  return (
    <div className="space-y-2" role="status" aria-label="Loading...">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClasses} style={style} />
      ))}
    </div>
  );
};

/**
 * Pre-built skeleton components for common use cases
 */

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('rounded-xl border border-slate-200 bg-white p-6', className)}>
    <Skeleton variant="rounded" height={24} width="60%" className="mb-4" />
    <Skeleton variant="text" count={3} />
  </div>
);

export const SkeletonInput: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    <Skeleton variant="text" height={14} width="30%" className="mb-2" />
    <Skeleton variant="rounded" height={42} />
  </div>
);

export const SkeletonButton: React.FC<{ className?: string }> = ({ className }) => (
  <Skeleton variant="rounded" height={40} width={120} className={className} />
);

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({ 
  size = 40, 
  className 
}) => (
  <Skeleton 
    variant="circular" 
    width={size} 
    height={size} 
    className={className} 
  />
);

export const SkeletonText: React.FC<{ 
  lines?: number; 
  className?: string;
}> = ({ 
  lines = 3, 
  className 
}) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index}
        variant="text" 
        width={index === lines - 1 ? '70%' : '100%'}
      />
    ))}
  </div>
);
