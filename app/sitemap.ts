import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllGuides } from "@/lib/guides/guides.data";

/** lastmod: at build time (static) this is the build date; at request time, current date. */
const lastMod = new Date();

/**
 * Dynamic sitemap for search engines (SEO best practice).
 * Served at /sitemap.xml and linked from robots.txt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: lastMod,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: lastMod,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: lastMod,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  const guideRoutes: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt ?? guide.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...guideRoutes];
}
