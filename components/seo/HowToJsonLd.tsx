/**
 * HowTo JSON-LD — only render this for guides whose content is a genuine
 * step-by-step procedure (see Guide.howToSteps), not for general tip lists.
 */

interface HowToStep {
  name: string;
  text: string;
}

interface HowToJsonLdProps {
  name: string;
  description: string;
  steps: HowToStep[];
}

export function HowToJsonLd({ name, description, steps }: HowToJsonLdProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
