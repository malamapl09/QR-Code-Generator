export type QRType = "url" | "text" | "wifi" | "vcard" | "email" | "phone" | "sms";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRCodeOptions {
  foregroundColor: string;
  backgroundColor: string;
  size: number;
  errorCorrection: ErrorCorrectionLevel;
}

export interface QRCodeData {
  id: string;
  userId: string | null;
  name: string | null;
  type: QRType;
  content: string;
  destinationUrl: string | null;
  isDynamic: boolean;
  shortCode: string | null;
  foregroundColor: string;
  backgroundColor: string;
  size: number;
  errorCorrection: ErrorCorrectionLevel;
  totalScans: number;
  uniqueScans: number;
  lastScannedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedQR {
  png: string; // base64 data URL
  svg: string; // SVG string
}

// Form data types for each QR type
export interface URLFormData {
  url: string;
}

export interface TextFormData {
  text: string;
}

export interface WiFiFormData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface VCardFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  website: string;
  address: string;
}

export interface EmailFormData {
  to: string;
  subject: string;
  body: string;
}

export interface PhoneFormData {
  phone: string;
}

export interface SMSFormData {
  phone: string;
  message: string;
}

export type QRFormData =
  | { type: "url"; data: URLFormData }
  | { type: "text"; data: TextFormData }
  | { type: "wifi"; data: WiFiFormData }
  | { type: "vcard"; data: VCardFormData }
  | { type: "email"; data: EmailFormData }
  | { type: "phone"; data: PhoneFormData }
  | { type: "sms"; data: SMSFormData };
