/**
 * Guides Listing Page
 * Server component — fully SEO-friendly with Metadata API.
 */

import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllGuides } from '@/lib/guides/guides.data';
import { siteConfig } from '@/lib/site-config';
import { getCanonicalUrl } from '@/lib/seo';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { CollectionPageJsonLd } from '@/components/seo/CollectionPageJsonLd';
import { Heart, Clock, ChevronRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  // Root layout's title.template ("%s | Marriage Bio Data Maker") already appends the site name.
  title: 'Marriage Bio Data Guides & Tips',
  description:
    'Free guides on how to write the perfect Islamic marriage bio data, choose a template, and understand the marriage process — in English and Bangla.',
  openGraph: {
    title: 'Marriage Bio Data Guides & Tips',
    description: 'Learn how to create the perfect Islamic marriage bio data with our free guides.',
    type: 'website',
    url: getCanonicalUrl('/guides'),
    images: [...siteConfig.openGraph.images],
  },
  alternates: {
    canonical: getCanonicalUrl('/guides'),
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  'how-to':  'How-To',
  tips:      'Tips',
  culture:   'Culture',
};

const CATEGORY_COLORS: Record<string, string> = {
  'how-to': 'bg-emerald-100 text-emerald-700',
  tips:     'bg-blue-100 text-blue-700',
  culture:  'bg-amber-100 text-amber-700',
};

const GUIDES_TITLE = 'Guides & Tips';
const GUIDES_DESCRIPTION =
  'Everything you need to create the perfect Islamic marriage bio data — in English and Bangla.';

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <BreadcrumbJsonLd
        items={[
          { name: siteConfig.name, url: '/' },
          { name: GUIDES_TITLE, url: '/guides' },
        ]}
      />
      <CollectionPageJsonLd
        name={GUIDES_TITLE}
        description={GUIDES_DESCRIPTION}
        url={getCanonicalUrl('/guides')}
        items={guides.map((guide) => ({ name: guide.title, url: `/guides/${guide.slug}` }))}
      />
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <Heart className="h-6 w-6 text-emerald-600 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-lg font-bold text-slate-900">Marriage Bio Data Maker</span>
            </Link>
            <Link
              href="/create"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
            >
              Create Bio Data
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
              <BookOpen className="h-7 w-7 text-emerald-600" />
            </div>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-slate-900">{GUIDES_TITLE}</h1>
          <p className="mx-auto max-w-xl text-lg text-slate-600">
            {GUIDES_DESCRIPTION}
          </p>
        </div>

        {/* Guide Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
            >
              {/* Meta row */}
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[guide.category] ?? 'bg-slate-100 text-slate-600'}`}
                >
                  {CATEGORY_LABELS[guide.category] ?? guide.category}
                </span>
                <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                  {guide.lang === 'bn' ? 'বাংলা' : 'English'}
                </span>
              </div>

              <h2 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {guide.title}
              </h2>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">
                {guide.description}
              </p>

              {/* Footer row */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{guide.readingTimeMin} min read</span>
                </div>
                <div className="flex items-center gap-0.5 font-medium text-emerald-600 group-hover:gap-1.5 transition-all">
                  Read more <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">Ready to create yours?</h2>
          <p className="mb-6 text-emerald-100">
            Use our free tool to build a professional bio data in minutes.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-emerald-600 shadow-sm transition-all hover:bg-emerald-50 hover:shadow-md"
          >
            <Heart className="h-4 w-4" />
            Start Creating
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Marriage Bio Data Maker. All rights reserved.</p>
      </footer>
    </div>
  );
}
