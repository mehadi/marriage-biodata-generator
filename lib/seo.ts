/**
 * Shared SEO URL helpers. Use getCanonicalUrl for every page's alternates.canonical
 * instead of hand-concatenating siteConfig.url — prevents the class of bug where a
 * page silently inherits the wrong (parent) canonical because it forgot to set one.
 */

import { siteConfig } from "@/lib/site-config";

/** Build an absolute canonical URL for a given path (e.g. "/guides" or "/create"). */
export function getCanonicalUrl(path: string = ""): string {
  const normalizedPath = path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}
