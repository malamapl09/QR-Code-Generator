"use client";

import { Button } from "@/components/ui/button";
import { Download, Save, Copy, Check } from "lucide-react";
import { downloadQRCode } from "@/lib/qr/generator";
import { useState } from "react";
import { toast } from "sonner";
import type { GeneratedQR } from "@/types/qr";

interface QRDownloadProps {
  qrCode: GeneratedQR | null;
  filename?: string;
  onSave?: () => void;
  showSave?: boolean;
  disabled?: boolean;
}

export function QRDownload({
  qrCode,
  filename = "qrcode",
  onSave,
  showSave = true,
  disabled = false,
}: QRDownloadProps) {
  const [copied, setCopied] = useState(false);

  const handleDownloadPNG = () => {
    if (!qrCode) return;
    downloadQRCode(qrCode.png, filename, "png");
    toast.success("QR code downloaded as PNG");
  };

  const handleDownloadSVG = () => {
    if (!qrCode) return;
    downloadQRCode(qrCode.svg, filename, "svg");
    toast.success("QR code downloaded as SVG");
  };

  const handleCopy = async () => {
    if (!qrCode) return;

    try {
      // Convert base64 to blob
      const response = await fetch(qrCode.png);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setCopied(true);
      toast.success("QR code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy as data URL
      try {
        await navigator.clipboard.writeText(qrCode.png);
        setCopied(true);
        toast.success("QR code URL copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy QR code");
      }
    }
  };

  const isDisabled = disabled || !qrCode;

  return (
    <div className="flex flex-col gap-3">
      {/* Primary action - Save button (full width on mobile) */}
      {showSave && onSave && (
        <Button
          onClick={onSave}
          disabled={isDisabled}
          className="w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
          size="lg"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Locally
        </Button>
      )}

      {/* Secondary actions - Download/Copy buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={handleDownloadPNG}
          disabled={isDisabled}
          className="flex-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:flex-none"
        >
          <Download className="mr-2 h-4 w-4" />
          PNG
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadSVG}
          disabled={isDisabled}
          className="flex-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:flex-none"
        >
          <Download className="mr-2 h-4 w-4" />
          SVG
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={isDisabled}
          className="flex-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:flex-none"
        >
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
