import Link from 'next/link';
import { Heart, Home, FileText } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-blue-950/40 px-4 text-center">
      <Heart className="mb-6 h-12 w-12 text-emerald-600" />
      <h1 className="mb-3 text-4xl font-bold text-slate-900 dark:text-slate-100">Page not found</h1>
      <p className="mb-8 max-w-md text-slate-600 dark:text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
        >
          <Home className="h-4 w-4" />
          Go home
        </Link>
        <Link
          href="/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-emerald-600 px-6 py-3 font-semibold text-emerald-600 dark:text-emerald-400 dark:border-emerald-500 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          <FileText className="h-4 w-4" />
          Create bio data
        </Link>
      </div>
    </div>
  );
}
