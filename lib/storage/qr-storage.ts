import { nanoid } from "nanoid";

export interface StoredQRCode {
  id: string;
  name: string;
  type: "url" | "text" | "wifi" | "vcard" | "email" | "phone" | "sms";
  content: string;
  foregroundColor: string;
  backgroundColor: string;
  size: number;
  errorCorrection: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "qr_codes";

const isBrowser = typeof window !== "undefined";

export function getQRCodes(): StoredQRCode[] {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getQRCodeById(id: string): StoredQRCode | null {
  const codes = getQRCodes();
  return codes.find((qr) => qr.id === id) || null;
}

export function saveQRCode(
  qr: Omit<StoredQRCode, "id" | "createdAt" | "updatedAt">
): StoredQRCode | null {
  const codes = getQRCodes();
  const now = new Date().toISOString();
  const newQR: StoredQRCode = {
    ...qr,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  };
  codes.unshift(newQR);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
    return newQR;
  } catch {
    // localStorage quota exceeded or unavailable
    return null;
  }
}

export function updateQRCode(
  id: string,
  updates: Partial<Omit<StoredQRCode, "id" | "createdAt">>
): StoredQRCode | null {
  const codes = getQRCodes();
  const index = codes.findIndex((qr) => qr.id === id);
  if (index === -1) return null;

  codes[index] = {
    ...codes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
    return codes[index];
  } catch {
    // localStorage quota exceeded or unavailable
    return null;
  }
}

export function deleteQRCode(id: string): boolean {
  const codes = getQRCodes();
  const filtered = codes.filter((qr) => qr.id !== id);
  if (filtered.length === codes.length) return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    // localStorage unavailable
    return false;
  }
}
