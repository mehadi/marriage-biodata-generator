/**
 * Individual Guide Page
 * Server component with dynamic metadata for SEO.
 */

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getGuideBySlug, getAllGuideSlugs, getAllGuides } from '@/lib/guides/guides.data';
import { siteConfig } from '@/lib/site-config';
import { getCanonicalUrl } from '@/lib/seo';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import { HowToJsonLd } from '@/components/seo/HowToJsonLd';
import { Heart, Clock, ChevronLeft, BookOpen } from 'lucide-react';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: 'Guide Not Found' };

  const canonical = getCanonicalUrl(`/guides/${slug}`);

  return {
    // Root layout's title.template ("%s | Marriage Bio Data Maker") already appends the site name.
    title: guide.title,
    description: guide.description,
    authors: [{ name: guide.author }],
    alternates: {
      canonical,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      url: canonical,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt ?? guide.publishedAt,
      authors: [guide.author],
      images: [...siteConfig.openGraph.images],
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: guide.title,
      description: guide.description,
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  'how-to': 'How-To',
  tips:     'Tips',
  culture:  'Culture',
};

const CATEGORY_COLORS: Record<string, string> = {
  'how-to': 'bg-emerald-100 text-emerald-700',
  tips:     'bg-blue-100 text-blue-700',
  culture:  'bg-amber-100 text-amber-700',
};

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const related = getAllGuides().filter((g) => g.slug !== slug).slice(0, 2);
  const formattedDate = new Date(guide.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbJsonLd
        items={[
          { name: siteConfig.name, url: '/' },
          { name: 'Guides & Tips', url: '/guides' },
          { name: guide.title, url: `/guides/${slug}` },
        ]}
      />
      <ArticleJsonLd
        headline={guide.title}
        description={guide.description}
        url={getCanonicalUrl(`/guides/${slug}`)}
        datePublished={guide.publishedAt}
        dateModified={guide.updatedAt}
        authorName={guide.author}
      />
      {guide.howToSteps && (
        <HowToJsonLd
          name={guide.title}
          description={guide.description}
          steps={guide.howToSteps}
        />
      )}
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
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

      <main id="main-content" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Back link */}
        <Link
          href="/guides"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        {/* Article header */}
        <article itemScope itemType="https://schema.org/Article">
          <header className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[guide.category] ?? 'bg-slate-100 text-slate-600'}`}
              >
                {CATEGORY_LABELS[guide.category] ?? guide.category}
              </span>
              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                {guide.lang === 'bn' ? 'বাংলা' : 'English'}
              </span>
            </div>

            <h1
              itemProp="headline"
              className="mb-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl"
            >
              {guide.title}
            </h1>

            <p className="mb-5 text-lg leading-relaxed text-slate-600" itemProp="description">
              {guide.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span itemProp="author" itemScope itemType="https://schema.org/Person">
                By <span itemProp="name" className="font-medium text-slate-700">{guide.author}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{guide.readingTimeMin} min read</span>
              </div>
              <time itemProp="datePublished" dateTime={guide.publishedAt}>
                {formattedDate}
              </time>
            </div>
          </header>

          {/* Article body */}
          <div
            itemProp="articleBody"
            className="prose prose-slate prose-emerald max-w-none
              prose-headings:font-bold prose-headings:text-slate-900
              prose-p:leading-relaxed prose-p:text-slate-700
              prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
              prose-li:text-slate-700 prose-strong:text-slate-900"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />
        </article>

        {/* Inline CTA */}
        <div className="my-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
          <h3 className="mb-1 text-xl font-bold text-slate-900">Try it now — it&apos;s free</h3>
          <p className="mb-4 text-slate-600">Create your bio data in minutes with 8 professional templates.</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
          >
            <Heart className="h-4 w-4" />
            Start Creating for Free
          </Link>
        </div>

        {/* Related guides */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-5 text-xl font-bold text-slate-900">
              Related Guides
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/guides/${rel.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    {CATEGORY_LABELS[rel.category]}
                  </p>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {rel.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Marriage Bio Data Maker. All rights reserved.</p>
      </footer>
    </div>
  );
}
