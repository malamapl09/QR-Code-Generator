"use client";

import { useEffect, useState, useRef } from "react";
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
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const prevQrRef = useRef<string | null>(null);

  // Debounce the content to avoid regenerating on every keystroke
  const debouncedContent = useDebounce(content, 300);
  const debouncedFg = useDebounce(foregroundColor, 200);
  const debouncedBg = useDebounce(backgroundColor, 200);

  useEffect(() => {
    if (!debouncedContent) {
      setQrCode(null);
      onGenerated?.(null);
      prevQrRef.current = null;
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

        // Trigger animation only when QR content changes (not just colors)
        if (prevQrRef.current !== debouncedContent) {
          setShouldAnimate(true);
          setTimeout(() => setShouldAnimate(false), 300);
        }
        prevQrRef.current = debouncedContent;

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

  // Display size - larger on desktop, responsive on mobile
  const displaySize = Math.min(size, 320);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white p-6 shadow-inner">
      {loading ? (
        <Skeleton
          className="rounded-xl"
          style={{ width: displaySize, height: displaySize }}
        />
      ) : qrCode ? (
        <div className={shouldAnimate ? "animate-fade-in" : ""}>
          <img
            src={qrCode.png}
            alt="Generated QR Code"
            className="rounded-lg transition-all duration-300"
            style={{
              width: displaySize,
              height: displaySize,
            }}
          />
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 text-muted-foreground transition-all duration-300"
          style={{ width: displaySize, height: displaySize }}
        >
          <QrCode className="mb-4 h-16 w-16 opacity-30" />
          <p className="text-center text-sm font-medium opacity-60">
            Fill in the form to generate
            <br />
            your QR code
          </p>
        </div>
      )}
    </div>
  );
}
