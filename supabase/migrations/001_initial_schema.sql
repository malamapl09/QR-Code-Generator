-- ===========================================
-- QR Code Generator Database Schema
-- Supabase PostgreSQL
-- ===========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- ENUM Types
-- ===========================================

CREATE TYPE qr_type AS ENUM (
  'url',
  'text',
  'wifi',
  'vcard',
  'email',
  'phone',
  'sms'
);

CREATE TYPE device_type AS ENUM (
  'desktop',
  'mobile',
  'tablet',
  'unknown'
);

-- ===========================================
-- QR Codes Table
-- ===========================================

CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core fields
  name VARCHAR(255),
  type qr_type NOT NULL,
  content TEXT NOT NULL,
  destination_url TEXT,

  -- Dynamic QR fields
  is_dynamic BOOLEAN DEFAULT FALSE,
  short_code VARCHAR(12) UNIQUE,

  -- Customization
  foreground_color VARCHAR(7) DEFAULT '#000000',
  background_color VARCHAR(7) DEFAULT '#FFFFFF',
  size INTEGER DEFAULT 256,
  error_correction VARCHAR(1) DEFAULT 'M',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Stats (denormalized for quick access)
  total_scans INTEGER DEFAULT 0,
  unique_scans INTEGER DEFAULT 0,
  last_scanned_at TIMESTAMPTZ,

  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Indexes for qr_codes
CREATE INDEX idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX idx_qr_codes_short_code ON qr_codes(short_code) WHERE short_code IS NOT NULL;
CREATE INDEX idx_qr_codes_created_at ON qr_codes(created_at DESC);
CREATE INDEX idx_qr_codes_is_dynamic ON qr_codes(is_dynamic) WHERE is_dynamic = TRUE;

-- ===========================================
-- Scans (Analytics) Table
-- ===========================================

CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,

  -- Scan metadata
  scanned_at TIMESTAMPTZ DEFAULT NOW(),

  -- Visitor identification
  ip_address INET,
  visitor_id VARCHAR(64),
  is_unique BOOLEAN DEFAULT TRUE,

  -- Location (from IP lookup)
  country VARCHAR(2),
  country_name VARCHAR(100),
  region VARCHAR(100),
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Device info (from user agent)
  user_agent TEXT,
  device_type device_type DEFAULT 'unknown',
  browser VARCHAR(50),
  browser_version VARCHAR(20),
  os VARCHAR(50),
  os_version VARCHAR(20),

  -- Additional context
  referrer TEXT,
  language VARCHAR(10)
);

-- Indexes for scans
CREATE INDEX idx_scans_qr_code_id ON scans(qr_code_id);
CREATE INDEX idx_scans_scanned_at ON scans(scanned_at DESC);
CREATE INDEX idx_scans_country ON scans(country);
CREATE INDEX idx_scans_device_type ON scans(device_type);
CREATE INDEX idx_scans_visitor_id ON scans(visitor_id);
CREATE INDEX idx_scans_qr_time ON scans(qr_code_id, scanned_at DESC);

-- ===========================================
-- User Profiles (extends Supabase Auth)
-- ===========================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,

  -- Subscription/billing
  plan VARCHAR(20) DEFAULT 'free',
  stripe_customer_id VARCHAR(255),

  -- Limits (based on plan)
  dynamic_qr_limit INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Functions & Triggers
-- ===========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to update QR code stats after scan insert
CREATE OR REPLACE FUNCTION update_qr_scan_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE qr_codes
  SET
    total_scans = total_scans + 1,
    unique_scans = unique_scans + CASE WHEN NEW.is_unique THEN 1 ELSE 0 END,
    last_scanned_at = NEW.scanned_at
  WHERE id = NEW.qr_code_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_scan_stats
  AFTER INSERT ON scans
  FOR EACH ROW EXECUTE FUNCTION update_qr_scan_stats();

-- Function to generate unique short code
CREATE OR REPLACE FUNCTION generate_short_code()
RETURNS VARCHAR(8) AS $$
DECLARE
  chars VARCHAR(62) := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result VARCHAR(8) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * 62 + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================

ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- QR Codes policies
CREATE POLICY "Users can view own QR codes"
  ON qr_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create QR codes"
  ON qr_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own QR codes"
  ON qr_codes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own QR codes"
  ON qr_codes FOR DELETE
  USING (auth.uid() = user_id);

-- Allow public read of QR codes by short_code (for redirects)
CREATE POLICY "Anyone can read QR by short_code"
  ON qr_codes FOR SELECT
  USING (short_code IS NOT NULL AND is_dynamic = TRUE);

-- Scans policies (users can view scans for their own QR codes)
CREATE POLICY "Users can view scans for own QR codes"
  ON scans FOR SELECT
  USING (
    qr_code_id IN (
      SELECT id FROM qr_codes WHERE user_id = auth.uid()
    )
  );

-- Service role can insert scans (for async tracking)
CREATE POLICY "Service can insert scans"
  ON scans FOR INSERT
  WITH CHECK (TRUE);

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ===========================================
-- Analytics Views
-- ===========================================

CREATE VIEW scan_stats_daily AS
SELECT
  qr_code_id,
  DATE(scanned_at) as scan_date,
  COUNT(*) as total_scans,
  COUNT(*) FILTER (WHERE is_unique) as unique_scans
FROM scans
GROUP BY qr_code_id, DATE(scanned_at);

CREATE VIEW scan_stats_by_country AS
SELECT
  qr_code_id,
  country,
  country_name,
  COUNT(*) as scan_count,
  COUNT(*) FILTER (WHERE is_unique) as unique_count
FROM scans
WHERE country IS NOT NULL
GROUP BY qr_code_id, country, country_name;

CREATE VIEW scan_stats_by_device AS
SELECT
  qr_code_id,
  device_type,
  COUNT(*) as scan_count
FROM scans
GROUP BY qr_code_id, device_type;
