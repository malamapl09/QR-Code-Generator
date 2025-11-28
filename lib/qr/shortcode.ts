import { nanoid } from "nanoid";

// Generate a unique short code for dynamic QR codes
// Using nanoid for cryptographically secure random IDs
export function generateShortCode(length: number = 8): string {
  return nanoid(length);
}

// Validate a short code format
export function isValidShortCode(code: string): boolean {
  // Allow alphanumeric characters and hyphens/underscores
  return /^[A-Za-z0-9_-]{6,12}$/.test(code);
}
