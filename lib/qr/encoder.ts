import type {
  URLFormData,
  TextFormData,
  WiFiFormData,
  VCardFormData,
  EmailFormData,
  PhoneFormData,
  SMSFormData,
  QRType,
} from "@/types/qr";

// URL - direct string
export function encodeURL(data: URLFormData): string {
  let url = data.url.trim();
  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
}

// Plain text - direct string
export function encodeText(data: TextFormData): string {
  return data.text;
}

// WiFi - WIFI:T:WPA;S:networkname;P:password;H:true;;
export function encodeWiFi(data: WiFiFormData): string {
  const parts = [
    `WIFI:T:${data.encryption}`,
    `S:${escapeWiFiString(data.ssid)}`,
  ];

  if (data.password && data.encryption !== "nopass") {
    parts.push(`P:${escapeWiFiString(data.password)}`);
  }

  if (data.hidden) {
    parts.push("H:true");
  }

  return `${parts.join(";")};;`;
}

// vCard 3.0 format
export function encodeVCard(data: VCardFormData): string {
  const fullName = `${data.firstName} ${data.lastName}`.trim();

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fullName}`,
    `N:${data.lastName};${data.firstName};;;`,
  ];

  if (data.phone) {
    lines.push(`TEL:${data.phone}`);
  }

  if (data.email) {
    lines.push(`EMAIL:${data.email}`);
  }

  if (data.company) {
    lines.push(`ORG:${data.company}`);
  }

  if (data.title) {
    lines.push(`TITLE:${data.title}`);
  }

  if (data.website) {
    lines.push(`URL:${data.website}`);
  }

  if (data.address) {
    lines.push(`ADR:;;${data.address};;;;`);
  }

  lines.push("END:VCARD");

  return lines.join("\n");
}

// Email - mailto:email@example.com?subject=...&body=...
export function encodeEmail(data: EmailFormData): string {
  const params = new URLSearchParams();

  if (data.subject) {
    params.set("subject", data.subject);
  }

  if (data.body) {
    params.set("body", data.body);
  }

  const queryString = params.toString();
  return `mailto:${data.to}${queryString ? `?${queryString}` : ""}`;
}

// Phone - tel:+1234567890
export function encodePhone(data: PhoneFormData): string {
  // Remove any non-digit characters except + at the start
  const cleaned = data.phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

// SMS - sms:+1234567890?body=...
export function encodeSMS(data: SMSFormData): string {
  const cleaned = data.phone.replace(/[^\d+]/g, "");

  if (data.message) {
    return `sms:${cleaned}?body=${encodeURIComponent(data.message)}`;
  }

  return `sms:${cleaned}`;
}

// Main encoder function
export function encodeQRContent(type: QRType, data: unknown): string {
  switch (type) {
    case "url":
      return encodeURL(data as URLFormData);
    case "text":
      return encodeText(data as TextFormData);
    case "wifi":
      return encodeWiFi(data as WiFiFormData);
    case "vcard":
      return encodeVCard(data as VCardFormData);
    case "email":
      return encodeEmail(data as EmailFormData);
    case "phone":
      return encodePhone(data as PhoneFormData);
    case "sms":
      return encodeSMS(data as SMSFormData);
    default:
      throw new Error(`Unknown QR type: ${type}`);
  }
}

// Helper to escape special characters in WiFi strings
function escapeWiFiString(str: string): string {
  return str.replace(/([\\;,:"'])/g, "\\$1");
}
