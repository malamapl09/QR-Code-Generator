# QR Code Generator Web App Specification

## Core Concept

Free QR code creation with paid analytics, customization, and management features.

---

## MVP Features

### QR Code Types
- URL
- Plain text
- WiFi credentials
- vCard (contact card)
- Email
- Phone number
- SMS

### Basic Customization
- Foreground and background colors
- Size selection
- Download as PNG or SVG

### Account Features (Optional)
- Create account to save generated codes
- Basic code management

---

## Phase 2 Features

- **Scan Analytics** — Location, device type, time of scan, unique vs repeat visitors
- **Dynamic QR Codes** — Change destination URL without reprinting the code
- **Logo Embedding** — Place custom logo in center of QR code
- **Bulk Generation** — CSV upload for creating multiple codes at once
- **QR Code Templates** — Branded frames and design presets
- **API Access** — Programmatic code generation for developers

---

## Monetization Model

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Static QR codes, basic colors, no tracking |
| Starter | $7/month | 5 dynamic QRs, scan analytics, logo upload |
| Pro | $19/month | 50 dynamic QRs, full analytics, bulk generation, API |
| Business | $49/month | Unlimited codes, team access, white-label, priority support |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React or Next.js |
| Backend | Node.js |
| QR Generation | qrcode library (JS) or python-qrcode |
| Database | PostgreSQL (store codes, track scans) |
| Analytics | Custom tracking via redirect or pixel |
| Hosting | Vercel + Supabase or Railway |

---

## Key Pages

1. **Generator Page** — Main tool interface for creating codes
2. **Dashboard** — Manage saved codes, view analytics overview
3. **QR Detail Page** — Individual code stats, edit destination, download options
4. **Pricing Page** — Tier comparison and signup

---

## Revenue Drivers

### Dynamic QR Lock-in
Once a user prints a dynamic QR code, they can't switch providers without reprinting all materials. This creates strong retention.

### Analytics Value
Businesses need scan data for:
- Campaign performance tracking
- Geographic insights
- Time-based engagement patterns

### Bulk/API for Agencies
Marketing agencies and developers need programmatic access for client work.

---

## Technical Considerations

### Dynamic QR Architecture
Dynamic codes work by redirecting through your server:
1. QR points to: `yourdomain.com/q/abc123`
2. Server logs the scan (IP, user agent, timestamp)
3. Server redirects to the actual destination URL
4. User can change destination in dashboard anytime

### Analytics Data to Capture
- Timestamp
- IP address (for approximate location)
- User agent (device/browser)
- Referrer (if available)
- Unique visitor detection (cookie or fingerprint)

### QR Code Quality
- Error correction level options (L, M, Q, H)
- Minimum size recommendations based on intended use
- Logo integration without breaking scannability

### Performance
- QR generation should be near-instant
- Redirect latency must be minimal (<100ms)
- Analytics writes should be async

---

## Launch Checklist

- [ ] All QR types generating correctly
- [ ] Color customization working
- [ ] PNG/SVG download functional
- [ ] User accounts and code saving
- [ ] Dynamic QR redirect system
- [ ] Basic scan tracking
- [ ] Payment integration (Stripe)
- [ ] Dashboard with code management
- [ ] Pricing page live

---

## Growth Opportunities

- Chrome extension for quick QR generation
- Mobile app for scanning and creating
- Zapier/Make integrations
- WordPress plugin
- Shopify app for product QR codes
- Print-on-demand partnerships (business cards, stickers)
- White-label solution for agencies

---

## Comparison: PDF Tools vs QR Codes

| Factor | PDF Tools | QR Codes |
|--------|-----------|----------|
| Time to MVP | 1-2 weekends | 1 weekend |
| Recurring revenue potential | Medium | High (dynamic QRs = sticky) |
| SEO opportunity | Very high | Medium |
| Support burden | Low | Low |
| Competition | High but room exists | Medium |
| Technical complexity | Medium | Low |
