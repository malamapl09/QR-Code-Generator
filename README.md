# QR Code Generator

A modern, full-featured QR code generator web application built with Next.js 16, Supabase, and Tailwind CSS.

**Live Demo:** [https://qr-code-generator-malamapl09s-projects.vercel.app](https://qr-code-generator-malamapl09s-projects.vercel.app)

## Features

### Free Features (No Account Required)
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

### Premium Features (Account Required)
- Save QR codes to your account
- Create **Dynamic QR Codes** - change destination URLs without reprinting
- **Scan Analytics** - track scans with:
  - Total and unique visitor counts
  - Geographic location (country, city)
  - Device type (mobile, desktop, tablet)
  - Browser and OS information
  - Time-series charts
- Manage all your QR codes from a dashboard

### SEO & Marketing
- Dynamic OpenGraph and Twitter card images
- Structured data (JSON-LD) for rich search snippets
- Auto-generated sitemap.xml and robots.txt
- Page-specific metadata optimization
- Google Analytics integration
- Google AdSense integration (non-intrusive, hidden for logged-in users)

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Database | PostgreSQL (Supabase) |
| Authentication | Supabase Auth |
| QR Generation | qrcode (npm) |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Analytics | Google Analytics (@next/third-parties) |
| Monetization | Google AdSense |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/malamapl09/QR-Code-Generator.git
cd QR-Code-Generator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the SQL to create all tables, functions, and policies

### 4. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Analytics & Ads (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

Find these values in your Supabase dashboard under **Settings > API**.

### 5. Configure Supabase Authentication

1. Go to **Authentication > Providers** in Supabase
2. Enable the **Email** provider
3. Go to **Authentication > URL Configuration**
4. Set **Site URL** to `http://localhost:3000`
5. Add `http://localhost:3000/callback` to **Redirect URLs**

### 6. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
qr-code-generator/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page - QR Generator
│   ├── not-found.tsx           # 404 page
│   ├── robots.ts               # SEO: robots.txt generation
│   ├── sitemap.ts              # SEO: sitemap.xml generation
│   ├── opengraph-image.tsx     # SEO: Dynamic OG image
│   ├── twitter-image.tsx       # SEO: Twitter card image
│   ├── (auth)/
│   │   ├── login/page.tsx      # Login page
│   │   ├── signup/page.tsx     # Signup page
│   │   └── callback/route.ts   # Auth callback handler
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard layout (noindex)
│   │   ├── page.tsx            # QR codes list
│   │   └── [id]/page.tsx       # QR detail + analytics
│   ├── pricing/page.tsx        # Pricing tiers
│   └── q/[shortcode]/route.ts  # Dynamic QR redirect (Edge)
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
│   ├── analytics/
│   │   ├── stats-overview.tsx  # Summary cards
│   │   ├── scans-chart.tsx     # Time-series chart
│   │   └── device-breakdown.tsx # Device pie chart
│   ├── seo/
│   │   └── json-ld.tsx         # Structured data components
│   ├── ads/
│   │   └── ad-banner.tsx       # AdSense banner (auth-aware)
│   └── auth/
│       ├── auth-provider.tsx   # Auth context
│       ├── login-form.tsx
│       └── signup-form.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── admin.ts            # Service role client
│   ├── qr/
│   │   ├── generator.ts        # QR generation logic
│   │   ├── encoder.ts          # Type-specific encoding
│   │   └── shortcode.ts        # Short code generation
│   ├── analytics/
│   │   ├── tracker.ts          # Scan tracking
│   │   └── device.ts           # User agent parsing
│   └── validations/
│       └── qr.ts               # Zod schemas
│
├── hooks/
│   ├── use-auth.ts             # Auth hook
│   └── use-debounce.ts         # Debounce hook
│
├── types/
│   ├── qr.ts                   # QR code types
│   ├── database.ts             # Database types
│   └── analytics.ts            # Analytics types
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
│
└── middleware.ts               # Auth middleware
```

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `qr_codes` | Stores QR code data, customization, and denormalized scan counts |
| `scans` | Individual scan events with device/location data |
| `profiles` | User profiles extending Supabase Auth |

### Key Features
- Row Level Security (RLS) on all tables
- Automatic scan statistics updates via triggers
- Profile auto-creation on user signup

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/q/[shortcode]` | GET | Dynamic QR redirect with analytics (Edge Runtime) |
| `/callback` | GET | Supabase auth callback handler |
| `/sitemap.xml` | GET | Auto-generated sitemap for SEO |
| `/robots.txt` | GET | Crawler directives |
| `/opengraph-image` | GET | Dynamic OG image (Edge Runtime) |
| `/twitter-image` | GET | Dynamic Twitter card image (Edge Runtime) |

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional - Analytics & Monetization
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

## Pricing Tiers (Suggested)

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Unlimited static QR codes, basic colors |
| Starter | $7/mo | 5 dynamic QRs, scan analytics |
| Pro | $19/mo | 50 dynamic QRs, bulk generation, API |
| Business | $49/mo | Unlimited, team access, white-label |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/malamapl09/QR-Code-Generator/issues) page.
