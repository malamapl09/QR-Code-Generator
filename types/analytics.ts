import { DeviceType } from "./database";

export interface ScanData {
  id: string;
  qrCodeId: string;
  scannedAt: string;
  ipAddress: string | null;
  visitorId: string | null;
  isUnique: boolean;
  country: string | null;
  countryName: string | null;
  region: string | null;
  city: string | null;
  deviceType: DeviceType;
  browser: string | null;
  os: string | null;
}

export interface AnalyticsOverview {
  totalScans: number;
  uniqueScans: number;
  scansToday: number;
  scansThisWeek: number;
  scansThisMonth: number;
}

export interface DailyStats {
  date: string;
  totalScans: number;
  uniqueScans: number;
}

export interface CountryStats {
  country: string;
  countryName: string;
  scanCount: number;
  uniqueCount: number;
}

export interface DeviceStats {
  deviceType: DeviceType;
  scanCount: number;
  percentage: number;
}

export interface BrowserStats {
  browser: string;
  scanCount: number;
  percentage: number;
}

export interface TrackingData {
  qrCodeId: string;
  ip: string | null;
  userAgent: string | null;
  referrer: string | null;
  language: string | null;
  geo?: {
    country?: string;
    city?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
  };
}
