'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-slate-950 px-4 text-center">
      <AlertTriangle className="mb-6 h-12 w-12 text-amber-500" />
      <h1 className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-100">Something went wrong</h1>
      <p className="mb-8 max-w-md text-slate-600 dark:text-slate-400">
        An unexpected error occurred. Your data is safe — try again, or reload the page.
      </p>
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
