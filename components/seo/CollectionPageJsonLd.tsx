/**
 * CollectionPage + ItemList JSON-LD for listing pages (e.g. /guides).
 */

import { siteConfig } from "@/lib/site-config";

export interface CollectionPageItem {
  name: string;
  url: string;
}

interface CollectionPageJsonLdProps {
  name: string;
  description: string;
  url: string;
  items: CollectionPageItem[];
}

export function CollectionPageJsonLd({ name, description, url, items }: CollectionPageJsonLdProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
