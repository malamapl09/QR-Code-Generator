"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { generateQRCode } from "@/lib/qr/generator";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreHorizontal,
  BarChart3,
  Download,
  Trash2,
  ExternalLink,
  Copy,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { Database } from "@/types/database";

type QRCode = Database["public"]["Tables"]["qr_codes"]["Row"];

interface QRCardProps {
  qrCode: QRCode;
  onDelete?: (id: string) => void;
}

export function QRCard({ qrCode, onDelete }: QRCardProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generate = async () => {
      try {
        const result = await generateQRCode({
          content: qrCode.content,
          size: 150,
          foregroundColor: qrCode.foreground_color,
          backgroundColor: qrCode.background_color,
        });
        setPreview(result.png);
      } catch {
        console.error("Failed to generate preview");
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [qrCode]);

  const copyShortUrl = async () => {
    if (!qrCode.short_code) return;
    const url = `${window.location.origin}/q/${qrCode.short_code}`;
    await navigator.clipboard.writeText(url);
    toast.success("Short URL copied to clipboard");
  };

  const handleDownload = async () => {
    if (!preview) return;

    const link = document.createElement("a");
    link.href = preview;
    link.download = `${qrCode.name || "qrcode"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded");
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/dashboard/${qrCode.id}`}>
          <div className="flex aspect-square items-center justify-center bg-muted p-4">
            {loading ? (
              <Skeleton className="h-32 w-32 rounded" />
            ) : preview ? (
              <img
                src={preview}
                alt={qrCode.name || "QR Code"}
                className="h-32 w-32 rounded"
              />
            ) : (
              <div className="h-32 w-32 rounded bg-gray-200" />
            )}
          </div>
        </Link>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <Link href={`/dashboard/${qrCode.id}`}>
                <h3 className="truncate font-semibold hover:underline">
                  {qrCode.name || "Untitled"}
                </h3>
              </Link>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {qrCode.type.toUpperCase()}
                </Badge>
                {qrCode.is_dynamic && (
                  <Badge variant="default" className="text-xs">
                    Dynamic
                  </Badge>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${qrCode.id}`}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                {qrCode.is_dynamic && qrCode.short_code && (
                  <>
                    <DropdownMenuItem onClick={copyShortUrl}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Short URL
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={qrCode.destination_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open Destination
                      </a>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete?.(qrCode.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-muted/50 px-4 py-3">
        <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
          <span>
            {qrCode.total_scans} scan{qrCode.total_scans !== 1 ? "s" : ""}
          </span>
          <span>
            {formatDistanceToNow(new Date(qrCode.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
