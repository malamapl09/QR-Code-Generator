"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getQRCodeById,
  updateQRCode,
  type StoredQRCode,
} from "@/lib/storage/qr-storage";
import { generateQRCode, downloadQRCode } from "@/lib/qr/generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Download, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { GeneratedQR } from "@/types/qr";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QRDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [qrCode, setQrCode] = useState<StoredQRCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatedQR, setGeneratedQR] = useState<GeneratedQR | null>(null);

  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const qr = getQRCodeById(id);
    if (!qr) {
      toast.error("QR code not found");
      router.push("/dashboard");
      return;
    }

    setQrCode(qr);
    setEditName(qr.name || "");

    // Generate preview
    const generatePreview = async () => {
      try {
        const generated = await generateQRCode({
          content: qr.content,
          size: 300,
          foregroundColor: qr.foregroundColor,
          backgroundColor: qr.backgroundColor,
        });
        setGeneratedQR(generated);
      } catch {
        // Silently fail - page will show without QR preview
      }
      setLoading(false);
    };

    generatePreview();
  }, [id, router]);

  const handleDownload = (fmt: "png" | "svg") => {
    if (!generatedQR) return;
    const data = fmt === "png" ? generatedQR.png : generatedQR.svg;
    downloadQRCode(data, qrCode?.name || "qrcode", fmt);
    toast.success(`Downloaded as ${fmt.toUpperCase()}`);
  };

  const handleSaveEdit = () => {
    if (!qrCode) return;
    setSaving(true);

    try {
      const updated = updateQRCode(qrCode.id, { name: editName });
      if (updated) {
        setQrCode(updated);
        setShowEditDialog(false);
        toast.success("QR code updated");
      } else {
        throw new Error("Update failed");
      }
    } catch {
      toast.error("Failed to update QR code");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  if (!qrCode) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {qrCode.name || "Untitled QR Code"}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary">{qrCode.type.toUpperCase()}</Badge>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowEditDialog(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* QR Code Preview & Actions */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {generatedQR && (
              <img
                src={generatedQR.png}
                alt="QR Code"
                className="mb-4 rounded-lg"
                style={{ width: 250, height: 250 }}
              />
            )}

            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleDownload("png")}
              >
                <Download className="mr-2 h-4 w-4" />
                PNG
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleDownload("svg")}
              >
                <Download className="mr-2 h-4 w-4" />
                SVG
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{format(new Date(qrCode.createdAt), "MMM d, yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span>{format(new Date(qrCode.updatedAt), "MMM d, yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="capitalize">{qrCode.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size</span>
              <span>{qrCode.size}px</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Colors</span>
              <div className="flex gap-2">
                <div
                  className="h-5 w-5 rounded border"
                  style={{ backgroundColor: qrCode.foregroundColor }}
                  title={`Foreground: ${qrCode.foregroundColor}`}
                />
                <div
                  className="h-5 w-5 rounded border"
                  style={{ backgroundColor: qrCode.backgroundColor }}
                  title={`Background: ${qrCode.backgroundColor}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit QR Code</DialogTitle>
            <DialogDescription>
              Update the name of your QR code.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="My QR Code"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
