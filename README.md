# QR Code Generator

A modern, client-side QR code generator web application built with Next.js 16 and Tailwind CSS. No account required - all data stored locally in your browser.

**Live Demo:** [https://qr-code-generator-malamapl09s-projects.vercel.app](https://qr-code-generator-malamapl09s-projects.vercel.app)

## Features

- Generate QR codes for 7 different types:
  - **URL** - Website links
  - **Text** - Plain text messages
  - **WiFi** - Network credentials (SSID, password, encryption)
  - **vCard** - Contact cards with name, phone, email, etc.
  - **Email** - Pre-filled email composition
  - **Phone** - Click-to-call phone numbers
  - **SMS** - Pre-filled text messages
- Customize foreground and background colors
- Download as PNG or SVG
- Copy QR code to clipboard
- Save QR codes locally (browser localStorage)
- Manage saved QR codes from dashboard

### SEO & Marketing
- Dynamic OpenGraph and Twitter card images
- Structured data (JSON-LD) for rich search snippets
- Auto-generated sitemap.xml and robots.txt
- Google Analytics integration (optional)
- Google AdSense integration (optional)

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Storage | Browser localStorage |
| QR Generation | qrcode (npm) |
| Forms | React Hook Form + Zod |
| Analytics | Google Analytics (optional) |
| Monetization | Google AdSense (optional) |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/malamapl09/QR-Code-Generator.git
cd QR-Code-Generator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)

Copy the example environment file:
```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Analytics & Ads (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
qr-code-generator/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page - QR Generator
│   ├── not-found.tsx           # 404 page
│   ├── robots.ts               # SEO: robots.txt
│   ├── sitemap.ts              # SEO: sitemap.xml
│   ├── opengraph-image.tsx     # Dynamic OG image
│   ├── twitter-image.tsx       # Twitter card image
│   └── dashboard/
│       ├── page.tsx            # Saved QR codes list
│       └── [id]/page.tsx       # QR detail view
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── layout/
│   │   └── header.tsx          # Navigation header
│   ├── qr/
│   │   ├── qr-generator.tsx    # Main generator component
│   │   ├── qr-preview.tsx      # Live QR preview
│   │   ├── qr-customizer.tsx   # Color/size options
│   │   ├── qr-download.tsx     # Download buttons
│   │   ├── qr-card.tsx         # Dashboard card
│   │   └── forms/              # Type-specific input forms
│   ├── seo/
│   │   └── json-ld.tsx         # Structured data
│   └── ads/
│       └── ad-banner.tsx       # AdSense banner
│
├── lib/
│   ├── storage/
│   │   └── qr-storage.ts       # localStorage utility
│   ├── qr/
│   │   ├── generator.ts        # QR generation logic
│   │   └── encoder.ts          # Type-specific encoding
│   └── validations/
│       └── qr.ts               # Zod schemas
│
├── hooks/
│   └── use-debounce.ts         # Debounce hook
│
└── types/
    └── qr.ts                   # QR code types
```

## Data Storage

QR codes are saved in browser localStorage under the key `qr_codes`. Data persists across sessions but is browser-specific and will be lost if browser data is cleared.

### Storage Schema
```typescript
interface StoredQRCode {
  id: string;
  name: string;
  type: "url" | "text" | "wifi" | "vcard" | "email" | "phone" | "sms";
  content: string;
  foregroundColor: string;
  backgroundColor: string;
  size: number;
  errorCorrection: string;
  createdAt: string;
  updatedAt: string;
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables (optional)
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional - Analytics & Monetization
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.
