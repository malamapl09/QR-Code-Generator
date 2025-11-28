"use client";

import { useEffect, useState } from "react";
import { generateQRCode } from "@/lib/qr/generator";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { QrCode } from "lucide-react";
import type { GeneratedQR } from "@/types/qr";

interface QRPreviewProps {
  content: string | null;
  foregroundColor: string;
  backgroundColor: string;
  size: number;
  onGenerated?: (qr: GeneratedQR | null) => void;
}

export function QRPreview({
  content,
  foregroundColor,
  backgroundColor,
  size,
  onGenerated,
}: QRPreviewProps) {
  const [qrCode, setQrCode] = useState<GeneratedQR | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounce the content to avoid regenerating on every keystroke
  const debouncedContent = useDebounce(content, 300);
  const debouncedFg = useDebounce(foregroundColor, 200);
  const debouncedBg = useDebounce(backgroundColor, 200);

  useEffect(() => {
    if (!debouncedContent) {
      setQrCode(null);
      onGenerated?.(null);
      return;
    }

    const generate = async () => {
      setLoading(true);
      try {
        const result = await generateQRCode({
          content: debouncedContent,
          size,
          foregroundColor: debouncedFg,
          backgroundColor: debouncedBg,
        });
        setQrCode(result);
        onGenerated?.(result);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
        setQrCode(null);
        onGenerated?.(null);
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [debouncedContent, debouncedFg, debouncedBg, size, onGenerated]);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-6">
      {loading ? (
        <Skeleton className="h-64 w-64 rounded-lg" />
      ) : qrCode ? (
        <img
          src={qrCode.png}
          alt="Generated QR Code"
          className="max-w-full rounded-lg"
          style={{
            width: Math.min(size, 300),
            height: Math.min(size, 300),
          }}
        />
      ) : (
        <div className="flex h-64 w-64 flex-col items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
          <QrCode className="mb-4 h-16 w-16 opacity-50" />
          <p className="text-center text-sm">
            Fill in the form to generate
            <br />
            your QR code
          </p>
        </div>
      )}
    </div>
  );
}
