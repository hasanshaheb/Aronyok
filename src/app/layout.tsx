import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AdBanner from "../components/layout/AdBanner";
import CartDrawer from "../components/storefront/CartDrawer";
import FloatingAssistant from "../components/ai/FloatingAssistant";
import AnalyticsScripts from "../components/analytics/AnalyticsScripts";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://aronyok.vercel.app"),
  title: {
    default: "Aronyok (আরণ্যক) | With Nature, Towards the Future",
    template: "%s | Aronyok (আরণ্যক)",
  },
  description:
    "A comprehensive bilingual botanical platform for live fruit & spice plants, Sundarbans mangrove raw honey, organic therapeutic herbs, and artisanal pottery.",
  keywords: [
    "Aronyok",
    "আরণ্যক",
    "plants online Bangladesh",
    "living plants Dhaka",
    "grafted fruit trees",
    "medicinal herbs",
    "Sundarbans raw honey",
    "rooftop gardening Bangladesh",
    "indoor plants Dhaka",
  ],
  authors: [{ name: "Aronyok Botanical & Eco Living" }],
  creator: "Aronyok",
  publisher: "Aronyok",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: "en_US",
    url: "https://aronyok.vercel.app",
    siteName: "Aronyok (আরণ্যক)",
    title: "Aronyok (আরণ্যক) | With Nature, Towards the Future",
    description: "Pure living, medicinal herbs, grafted fruit seedlings, and traditional eco wisdom in Bangladesh.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aronyok - With Nature, Towards the Future",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aronyok (আরণ্যক) | With Nature, Towards the Future",
    description: "Pure living, medicinal herbs, grafted fruit seedlings, and traditional eco wisdom.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Aronyok",
  alternateName: "আরণ্যক",
  url: "https://aronyok.vercel.app",
  logo: "https://aronyok.vercel.app/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+880 1700 000000",
    contactType: "customer service",
    areaServed: "BD",
    availableLanguage: ["Bengali", "English"],
  },
  sameAs: [
    "https://facebook.com/aronyok",
    "https://instagram.com/aronyok",
  ],
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Aronyok (আরণ্যক)",
  url: "https://aronyok.vercel.app",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://aronyok.vercel.app/shop?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fdfbf7] text-[#1c241e] antialiased selection:bg-forest-200 selection:text-forest-900">
        <LanguageProvider>
          <CartProvider>
            <AnalyticsScripts />
            <AdBanner />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <FloatingAssistant />
            <Analytics />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
