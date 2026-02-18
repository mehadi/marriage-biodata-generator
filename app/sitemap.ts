import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/** lastmod: at build time (static) this is the build date; at request time, current date. */
const lastMod = new Date();

/**
 * Dynamic sitemap for search engines (SEO best practice).
 * Served at /sitemap.xml and linked from robots.txt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  return [
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
  ];
}
