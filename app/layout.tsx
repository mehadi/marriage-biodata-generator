import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: "/favicon.png",
  },
  title: {
    default: `${siteConfig.name} - Create Islamic Bio Data`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: "Mehadi", url: "https://www.mehadi.me" }],
  creator: "Mehadi",
  publisher: "Mehadi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: siteConfig.openGraph.type,
    locale: siteConfig.defaultLocale,
    url: siteConfig.url,
    siteName: siteConfig.openGraph.siteName,
    title: `${siteConfig.name} - Create Islamic Bio Data`,
    description: siteConfig.description,
    images: [...siteConfig.openGraph.images],
  },
  twitter: {
    card: siteConfig.twitter.card,
    creator: siteConfig.twitter.creator,
    title: `${siteConfig.name} - Create Islamic Bio Data`,
    description: siteConfig.description,
  },
  robots: {
    index: siteConfig.robots.index,
    follow: siteConfig.robots.follow,
    googleBot: {
      index: siteConfig.robots.index,
      follow: siteConfig.robots.follow,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "lifestyle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd />
        <Providers>
          {children}
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
