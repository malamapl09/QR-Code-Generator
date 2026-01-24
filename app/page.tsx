import { Header } from "@/components/layout/header";
import { QRGenerator } from "@/components/qr/qr-generator";
import { AdBanner } from "@/components/ads/ad-banner";
import {
  SoftwareApplicationJsonLd,
  WebsiteJsonLd,
} from "@/components/seo/json-ld";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SoftwareApplicationJsonLd />
      <WebsiteJsonLd />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Free QR Code Generator
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Create QR codes for URLs, WiFi, contacts, and more. Customize colors
              and download for free. Save locally to manage your QR codes.
            </p>
          </div>

          <QRGenerator />

          <AdBanner className="my-8" />

          {/* Features Section */}
          <section className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Instant Generation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Generate QR codes instantly as you type. Download in PNG or SVG
                format.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.39m3.42 3.415a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.764m3.42 3.415a6.776 6.776 0 00-3.42-3.415"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Custom Colors</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Customize your QR codes with your brand colors for a unique look.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Local Storage</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Save your QR codes locally for easy access and management later.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
