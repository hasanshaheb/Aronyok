import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AdBanner from "../components/layout/AdBanner";
import CartDrawer from "../components/storefront/CartDrawer";
import FloatingAssistant from "../components/ai/FloatingAssistant";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Aronyok (অরণ্যক) | Pure Living, Herbs & Eco Store",
  description:
    "A comprehensive bilingual platform for wild raw honey, organic herbs, pottery, living plants, and traditional eco wisdom.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#fdfbf7] text-[#1c241e] antialiased selection:bg-forest-200 selection:text-forest-900">
        <LanguageProvider>
          <CartProvider>
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
