import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const createTitle = "Create Bio Data";
const createDescription =
  "Create your Islamic marriage bio data with our step-by-step form. Choose from Modern, Traditional, or Elegant templates. Export to PDF or image. Your data stays private.";

export const metadata: Metadata = {
  title: createTitle,
  description: createDescription,
  openGraph: {
    title: createTitle,
    description: createDescription,
    url: `${siteConfig.url}/create`,
    siteName: siteConfig.openGraph.siteName,
    type: "website",
    images: [...siteConfig.openGraph.images],
  },
  twitter: {
    card: siteConfig.twitter.card,
    title: createTitle,
    description: createDescription,
  },
  alternates: {
    canonical: `${siteConfig.url}/create`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CreateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: siteConfig.name, url: "/" },
          { name: "Create Bio Data", url: "/create" },
        ]}
      />
      {children}
    </>
  );
}
