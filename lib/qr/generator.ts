import QRCode from "qrcode";
import type { QRCodeOptions, GeneratedQR, ErrorCorrectionLevel } from "@/types/qr";

export interface GenerateOptions {
  content: string;
  size?: number;
  foregroundColor?: string;
  backgroundColor?: string;
  errorCorrection?: ErrorCorrectionLevel;
}

export async function generateQRCode(options: GenerateOptions): Promise<GeneratedQR> {
  const {
    content,
    size = 256,
    foregroundColor = "#000000",
    backgroundColor = "#FFFFFF",
    errorCorrection = "M",
  } = options;

  const qrOptions = {
    width: size,
    color: {
      dark: foregroundColor,
      light: backgroundColor,
    },
    errorCorrectionLevel: errorCorrection,
    margin: 2,
  };

  // Generate PNG as base64 data URL
  const png = await QRCode.toDataURL(content, qrOptions);

  // Generate SVG string
  const svg = await QRCode.toString(content, {
    ...qrOptions,
    type: "svg",
  });

  return { png, svg };
}

export function downloadQRCode(dataUrl: string, filename: string, format: "png" | "svg") {
  const link = document.createElement("a");

  if (format === "svg") {
    // For SVG, create a blob from the SVG string
    const blob = new Blob([dataUrl], { type: "image/svg+xml" });
    link.href = URL.createObjectURL(blob);
  } else {
    // For PNG, use the data URL directly
    link.href = dataUrl;
  }

  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (format === "svg") {
    URL.revokeObjectURL(link.href);
  }
}
