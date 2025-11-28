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
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={handleDownloadPNG}
        disabled={isDisabled}
      >
        <Download className="mr-2 h-4 w-4" />
        PNG
      </Button>
      <Button
        variant="outline"
        onClick={handleDownloadSVG}
        disabled={isDisabled}
      >
        <Download className="mr-2 h-4 w-4" />
        SVG
      </Button>
      <Button variant="outline" onClick={handleCopy} disabled={isDisabled}>
        {copied ? (
          <Check className="mr-2 h-4 w-4" />
        ) : (
          <Copy className="mr-2 h-4 w-4" />
        )}
        Copy
      </Button>
      {showSave && onSave && (
        <Button onClick={onSave} disabled={isDisabled}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      )}
    </div>
  );
}
