import { siteConfig } from "@/lib/site-config";
import { getAllGuides } from "@/lib/guides/guides.data";

/**
 * llms.txt — a curated, Markdown summary of the site for LLMs/AI assistants
 * (ChatGPT, Claude, Perplexity, etc.) to ingest directly, per the emerging
 * llms.txt convention (llmstxt.org). Kept in sync with lib/site-config.ts and
 * lib/guides/guides.data.ts rather than duplicating facts by hand.
 * Served at /llms.txt.
 */
export async function GET() {
  const guides = getAllGuides();

  const guideLines = guides
    .map((g) => `- [${g.title}](${siteConfig.url}/guides/${g.slug}): ${g.description}`)
    .join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name} is a free web tool for creating Islamic marriage bio data (also
called a marriage CV or rishta profile). Users fill in a guided form and export a
professionally designed document as PDF or image, choosing from 8 templates. All
data is stored in the user's own browser (localStorage) — nothing is uploaded to a
server unless the user explicitly chooses the optional server-generated PDF export.
The app is fully bilingual (English and Bangla).

## Key facts

- Price: free, no signup or account required.
- Templates: 8 (Modern, Traditional, Elegant, Minimal, Gradient, Card, Formal, Heritage).
- Export formats: PDF, PNG image, direct print.
- Languages: English and Bangla (বাংলা).
- Privacy: bio data is stored locally in the browser, not on a server, by default.

## Pages

- [Home](${siteConfig.url}/): overview, features, and template gallery.
- [Create Bio Data](${siteConfig.url}/create): the guided form and live preview/export tool.
- [Guides](${siteConfig.url}/guides): articles on writing bio data, choosing a template, and the Islamic marriage process.

## Guides

${guideLines}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
