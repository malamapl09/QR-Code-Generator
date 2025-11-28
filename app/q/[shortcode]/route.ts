import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { trackScanAsync } from "@/lib/analytics/tracker";

// Use Edge Runtime for fastest response times
export const runtime = "edge";

// Vercel provides geo data on the request object
interface VercelGeo {
  country?: string;
  city?: string;
  region?: string;
  latitude?: string;
  longitude?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;

  try {
    const supabase = createAdminClient();

    // Fetch QR code destination
    const { data: qrCode, error } = await supabase
      .from("qr_codes")
      .select("id, destination_url, is_dynamic")
      .eq("short_code", shortcode)
      .eq("is_dynamic", true)
      .is("deleted_at", null)
      .single();

    if (error || !qrCode || !qrCode.destination_url) {
      // QR code not found - redirect to 404 page
      return NextResponse.redirect(
        new URL("/not-found", request.url),
        { status: 302 }
      );
    }

    // Fire-and-forget analytics tracking (DO NOT await)
    // This ensures the redirect is not blocked by analytics
    // Vercel Edge provides geo data - safely access it
    const geo = (request as unknown as { geo?: VercelGeo }).geo;

    trackScanAsync({
      qrCodeId: qrCode.id,
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      userAgent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
      language: request.headers.get("accept-language"),
      geo: geo ? {
        country: geo.country,
        city: geo.city,
        region: geo.region,
        latitude: geo.latitude ? parseFloat(geo.latitude) : undefined,
        longitude: geo.longitude ? parseFloat(geo.longitude) : undefined,
      } : undefined,
    });

    // Immediate redirect to destination
    return NextResponse.redirect(qrCode.destination_url, { status: 302 });
  } catch (error) {
    console.error("Redirect error:", error);
    // On any error, still try to provide a graceful fallback
    return NextResponse.redirect(
      new URL("/not-found", request.url),
      { status: 302 }
    );
  }
}
