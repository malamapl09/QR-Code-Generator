import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://qr-code-generator-malamapl09s-projects.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free QR Code Generator - Create Custom QR Codes",
    template: "%s | QR Code Generator",
  },
  description:
    "Generate free QR codes for URLs, WiFi, contacts, email, phone & more. Customize colors and download PNG/SVG instantly.",
  keywords: [
    "QR code generator",
    "free QR code",
    "WiFi QR code",
    "vCard QR code",
    "QR code maker",
    "create QR code online",
  ],
  authors: [{ name: "QR Code Generator" }],
  creator: "QR Code Generator",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "QR Code Generator",
    title: "Free QR Code Generator - Create Custom QR Codes",
    description:
      "Generate free QR codes for URLs, WiFi, contacts & more. Customize colors and download PNG/SVG instantly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator",
    description:
      "Generate free QR codes for URLs, WiFi, contacts & more. Customize colors and download instantly.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      {process.env.NEXT_PUBLIC_ADSENSE_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </html>
  );
}
