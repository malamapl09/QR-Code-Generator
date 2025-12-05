interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Pre-configured structured data for common schemas
export function SoftwareApplicationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "QR Code Generator",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    description:
      "Generate free QR codes for URLs, WiFi, contacts, email, phone and more. Customize colors, download PNG/SVG, and track scans with analytics.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
    featureList: [
      "URL QR Codes",
      "WiFi QR Codes",
      "vCard QR Codes",
      "Email QR Codes",
      "Phone QR Codes",
      "SMS QR Codes",
      "Color Customization",
      "PNG/SVG Download",
      "Scan Analytics",
      "Dynamic QR Codes",
    ],
  };

  return <JsonLd data={data} />;
}

export function WebsiteJsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://qr-code-generator-malamapl09s-projects.vercel.app";

  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "QR Code Generator",
    url: siteUrl,
    description:
      "Free online QR code generator with customization and analytics",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

export function FAQJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What's the difference between static and dynamic QR codes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Static QR codes encode data directly and cannot be changed. Dynamic QR codes point to our servers and can be updated anytime without reprinting. They also include scan analytics.",
        },
      },
      {
        "@type": "Question",
        name: "Can I cancel my subscription anytime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! All paid plans are billed monthly with no long-term commitment. You can cancel anytime from your dashboard.",
        },
      },
      {
        "@type": "Question",
        name: "What happens to my dynamic QR codes if I downgrade?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your QR codes will continue to work, but you won't be able to create new ones beyond your plan's limit or access analytics.",
        },
      },
    ],
  };

  return <JsonLd data={data} />;
}
