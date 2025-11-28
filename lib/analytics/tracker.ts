import { createAdminClient } from "@/lib/supabase/admin";
import { parseUserAgent } from "./device";
import type { TrackingData } from "@/types/analytics";

// Generate a visitor ID from IP and user agent for unique tracking
function hashVisitorId(ip: string | null, userAgent: string | null): string {
  const data = `${ip || "unknown"}-${userAgent || "unknown"}`;
  // Simple hash function for visitor identification
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Fire-and-forget analytics tracking
// Call this without awaiting to not block the redirect
export function trackScanAsync(data: TrackingData): void {
  trackScan(data).catch((error) => {
    console.error("Failed to track scan:", error);
  });
}

async function trackScan(data: TrackingData): Promise<void> {
  const supabase = createAdminClient();

  // Parse user agent
  const device = parseUserAgent(data.userAgent);

  // Generate visitor ID for unique tracking
  const visitorId = hashVisitorId(data.ip, data.userAgent);

  // Check if this visitor has scanned this QR before
  const { count } = await supabase
    .from("scans")
    .select("*", { count: "exact", head: true })
    .eq("qr_code_id", data.qrCodeId)
    .eq("visitor_id", visitorId);

  const isUnique = count === 0;

  // Insert scan record
  await supabase.from("scans").insert({
    qr_code_id: data.qrCodeId,
    ip_address: data.ip,
    visitor_id: visitorId,
    is_unique: isUnique,
    country: data.geo?.country,
    city: data.geo?.city,
    region: data.geo?.region,
    latitude: data.geo?.latitude,
    longitude: data.geo?.longitude,
    user_agent: data.userAgent,
    device_type: device.type,
    browser: device.browser,
    browser_version: device.browserVersion,
    os: device.os,
    os_version: device.osVersion,
    referrer: data.referrer,
    language: data.language?.split(",")[0], // Take primary language
  });
}
