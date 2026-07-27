import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Robots.txt for search engine crawlers.
 * Served at /robots.txt
 */
/**
 * AI crawlers explicitly allowed (training + answer-engine bots), matching the
 * site's goal of being discoverable/citable in ChatGPT, Claude, Perplexity,
 * Gemini, and Copilot. Kept as its own list so the policy is easy to change later.
 */
const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "Google-Extended",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "CCBot",
  "Bytespider",
  "Applebot-Extended",
  "cohere-ai",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/"],
      },
      ...AI_CRAWLER_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
