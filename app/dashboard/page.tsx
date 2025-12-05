"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
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
import type { Database } from "@/types/database";

type QRCode = Database["public"]["Tables"]["qr_codes"]["Row"];

export default function DashboardPage() {
  const { user } = useAuth();

  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchQRCodes = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch QR codes:", error);
        toast.error("Failed to load QR codes");
      } else {
        setQrCodes(data || []);
      }
      setLoading(false);
    };

    fetchQRCodes();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteId) return;

    const supabase = createClient();
    // Soft delete
    const { error } = await supabase
      .from("qr_codes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", deleteId);

    if (error) {
      toast.error("Failed to delete QR code");
    } else {
      setQrCodes((prev) => prev.filter((qr) => qr.id !== deleteId));
      toast.success("QR code deleted");
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
            Manage and track your QR codes
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
              This action cannot be undone. The QR code will stop working if it
              was a dynamic code.
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
