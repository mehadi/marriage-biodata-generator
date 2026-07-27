/**
 * JSON-LD structured data for SEO (Organization + WebApplication).
 * Rendered in root layout for rich results in search.
 */

import { siteConfig } from "@/lib/site-config";

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${siteConfig.url}/#webapp`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Islamic marriage bio data templates",
          "PDF and image export",
          "Privacy-first, no server storage",
          "Multiple template styles",
        ],
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        logo: `${siteConfig.url}/icon-512.png`,
        // TODO: add real social profile URLs (Facebook/Twitter/Instagram/LinkedIn) here once available.
        sameAs: [] as string[],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        url: siteConfig.url,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        // No potentialAction here: this site has no search feature, and "CreateAction"
        // (previously here) isn't a schema.org action Google's rich-result pipeline
        // consumes for WebSite — only SearchAction is, so a fake one would be inert.
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
