"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getQRCodes,
  deleteQRCode,
  type StoredQRCode,
} from "@/lib/storage/qr-storage";
import { QRCard } from "@/components/qr/qr-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, QrCode } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<StoredQRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const codes = getQRCodes();
    setQrCodes(codes);
    setLoading(false);
  }, []);

  const handleDelete = () => {
    if (!deleteId) return;

    const success = deleteQRCode(deleteId);
    if (success) {
      setQrCodes((prev) => prev.filter((qr) => qr.id !== deleteId));
      toast.success("QR code deleted");
    } else {
      toast.error("Failed to delete QR code");
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My QR Codes</h1>
          <p className="mt-1 text-muted-foreground">
            Your locally saved QR codes
          </p>
        </div>
        <Link href="/">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      {qrCodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16">
          <QrCode className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No QR codes yet</h2>
          <p className="mt-2 text-muted-foreground">
            Create your first QR code to get started
          </p>
          <Link href="/" className="mt-6">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create QR Code
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {qrCodes.map((qrCode) => (
            <QRCard
              key={qrCode.id}
              qrCode={qrCode}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete QR Code?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The QR code will be permanently
              deleted from your browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
