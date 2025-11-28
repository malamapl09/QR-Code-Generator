import { z } from "zod";

export const urlSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .refine(
      (val) => {
        // Allow URLs with or without protocol
        const urlWithProtocol = val.startsWith("http") ? val : `https://${val}`;
        try {
          new URL(urlWithProtocol);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid URL" }
    ),
});

export const textSchema = z.object({
  text: z.string().min(1, "Text is required").max(4000, "Text is too long"),
});

export const wifiSchema = z.object({
  ssid: z.string().min(1, "Network name is required").max(32, "Network name is too long"),
  password: z.string().max(63, "Password is too long"),
  encryption: z.enum(["WPA", "WEP", "nopass"]),
  hidden: z.boolean(),
});

export const vcardSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string(),
  phone: z.string(),
  email: z.string().email("Invalid email address").or(z.literal("")),
  company: z.string(),
  title: z.string(),
  website: z.string().url("Invalid website URL").or(z.literal("")),
  address: z.string(),
});

export const emailSchema = z.object({
  to: z.string().email("Please enter a valid email address"),
  subject: z.string().max(200, "Subject is too long"),
  body: z.string().max(2000, "Body is too long"),
});

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[+]?[\d\s()-]{7,20}$/,
      "Please enter a valid phone number"
    ),
});

export const smsSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[+]?[\d\s()-]{7,20}$/,
      "Please enter a valid phone number"
    ),
  message: z.string().max(160, "Message is too long (160 characters max)"),
});

// QR customization options
export const qrOptionsSchema = z.object({
  foregroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color"),
  size: z.number().min(64).max(2048),
  errorCorrection: z.enum(["L", "M", "Q", "H"]),
});

// For saving a QR code
export const saveQRSchema = z.object({
  name: z.string().max(100, "Name is too long").optional(),
  type: z.enum(["url", "text", "wifi", "vcard", "email", "phone", "sms"]),
  content: z.string().min(1, "Content is required"),
  destinationUrl: z.string().url().optional().nullable(),
  isDynamic: z.boolean(),
  foregroundColor: z.string(),
  backgroundColor: z.string(),
  size: z.number(),
  errorCorrection: z.enum(["L", "M", "Q", "H"]),
});

export type URLFormData = z.infer<typeof urlSchema>;
export type TextFormData = z.infer<typeof textSchema>;
export type WiFiFormData = z.infer<typeof wifiSchema>;
export type VCardFormData = z.infer<typeof vcardSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
export type PhoneFormData = z.infer<typeof phoneSchema>;
export type SMSFormData = z.infer<typeof smsSchema>;
export type QROptions = z.infer<typeof qrOptionsSchema>;
export type SaveQRData = z.infer<typeof saveQRSchema>;
