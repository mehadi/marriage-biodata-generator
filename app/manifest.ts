import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Web app manifest for PWA and SEO.
 * Served at /manifest.webmanifest
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: siteConfig.url,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    icons: [
      {
        src: "/favicon.png",
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["lifestyle", "utilities"],
  };
}
