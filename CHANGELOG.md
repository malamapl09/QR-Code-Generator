# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- Converted from database-backed to client-only architecture
- QR codes now saved to browser localStorage instead of Supabase
- Dashboard reads from localStorage instead of database
- Simplified header navigation (removed auth buttons)
- Updated home page features section to reflect new capabilities

### Removed
- **Authentication** - No login/signup required, fully anonymous
- **Supabase integration** - Removed all database dependencies
- **Dynamic QR codes** - No short URLs or destination URL changes
- **Scan analytics** - No tracking, charts, or device/location data
- **Pricing page** - No subscription tiers
- **Middleware** - No route protection needed

### Dependencies Removed
- `@supabase/ssr`
- `@supabase/supabase-js`
- `ua-parser-js`
- `recharts`
- `@types/ua-parser-js`

### Files Removed
- `lib/supabase/` directory
- `components/auth/` directory
- `components/analytics/` directory
- `lib/analytics/` directory
- `app/(auth)/` directory (login, signup, callback)
- `app/q/` directory (dynamic QR redirect)
- `app/pricing/` directory
- `supabase/` directory (migrations)
- `middleware.ts`
- `hooks/use-auth.ts`
- `lib/qr/shortcode.ts`
- `types/database.ts`
- `types/analytics.ts`

### Added
- `lib/storage/qr-storage.ts` - localStorage utility for QR code persistence

### Fixed
- Added try-catch error handling for localStorage quota limits in storage functions
- Replaced console.error statements with silent failures and user-facing toast notifications
