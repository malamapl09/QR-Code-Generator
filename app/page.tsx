import { Header } from "@/components/layout/header";
import { QRGenerator } from "@/components/qr/qr-generator";
import { AdBanner } from "@/components/ads/ad-banner";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Free QR Code Generator
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Create QR codes for URLs, WiFi, contacts, and more. Download for
              free or save to your account for tracking and management.
            </p>
          </div>

          <QRGenerator />

          {/* Ad Banner - Only shown to non-authenticated users */}
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
                    d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Track Scans</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create dynamic QR codes and track scans with detailed analytics.
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
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </div>
              <h3 className="font-semibold">Dynamic QR Codes</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Change destination URLs anytime without reprinting your QR codes.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
