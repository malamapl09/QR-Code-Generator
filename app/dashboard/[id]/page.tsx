"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { generateQRCode } from "@/lib/qr/generator";
import { downloadQRCode } from "@/lib/qr/generator";
import { StatsOverview } from "@/components/analytics/stats-overview";
import { ScansChart } from "@/components/analytics/scans-chart";
import { DeviceBreakdown } from "@/components/analytics/device-breakdown";
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
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Copy,
  Pencil,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { format, subDays, startOfDay, startOfWeek, isToday } from "date-fns";
import type { Database } from "@/types/database";
import type { GeneratedQR } from "@/types/qr";

type QRCode = Database["public"]["Tables"]["qr_codes"]["Row"];
type Scan = Database["public"]["Tables"]["scans"]["Row"];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QRDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedQR, setGeneratedQR] = useState<GeneratedQR | null>(null);

  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDestination, setEditDestination] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch QR code
      const { data: qr, error: qrError } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (qrError || !qr) {
        toast.error("QR code not found");
        router.push("/dashboard");
        return;
      }

      setQrCode(qr);
      setEditName(qr.name || "");
      setEditDestination(qr.destination_url || "");

      // Generate preview
      try {
        const generated = await generateQRCode({
          content: qr.is_dynamic
            ? `${window.location.origin}/q/${qr.short_code}`
            : qr.content,
          size: 300,
          foregroundColor: qr.foreground_color,
          backgroundColor: qr.background_color,
        });
        setGeneratedQR(generated);
      } catch (error) {
        console.error("Failed to generate QR:", error);
      }

      // Fetch scans for this QR code
      const { data: scanData } = await supabase
        .from("scans")
        .select("*")
        .eq("qr_code_id", id)
        .order("scanned_at", { ascending: false });

      setScans(scanData || []);
      setLoading(false);
    };

    fetchData();
  }, [user, id, supabase, router]);

  // Calculate analytics from scans
  const calculateStats = () => {
    const today = startOfDay(new Date());
    const weekStart = startOfWeek(new Date());

    const scansToday = scans.filter((s) =>
      isToday(new Date(s.scanned_at))
    ).length;

    const scansThisWeek = scans.filter(
      (s) => new Date(s.scanned_at) >= weekStart
    ).length;

    return {
      totalScans: qrCode?.total_scans || 0,
      uniqueScans: qrCode?.unique_scans || 0,
      scansToday,
      scansThisWeek,
    };
  };

  // Calculate daily chart data
  const getDailyData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return format(date, "yyyy-MM-dd");
    });

    const dailyCounts = last30Days.map((date) => {
      const dayScans = scans.filter(
        (s) => format(new Date(s.scanned_at), "yyyy-MM-dd") === date
      );
      return {
        date,
        totalScans: dayScans.length,
        uniqueScans: dayScans.filter((s) => s.is_unique).length,
      };
    });

    return dailyCounts;
  };

  // Calculate device breakdown
  const getDeviceData = () => {
    const deviceCounts: Record<string, number> = {};
    scans.forEach((scan) => {
      const device = scan.device_type || "unknown";
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    return Object.entries(deviceCounts).map(([deviceType, count]) => ({
      deviceType,
      count,
    }));
  };

  const handleCopyShortUrl = async () => {
    if (!qrCode?.short_code) return;
    const url = `${window.location.origin}/q/${qrCode.short_code}`;
    await navigator.clipboard.writeText(url);
    toast.success("Short URL copied to clipboard");
  };

  const handleDownload = (format: "png" | "svg") => {
    if (!generatedQR) return;
    const data = format === "png" ? generatedQR.png : generatedQR.svg;
    downloadQRCode(data, qrCode?.name || "qrcode", format);
    toast.success(`Downloaded as ${format.toUpperCase()}`);
  };

  const handleSaveEdit = async () => {
    if (!qrCode) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("qr_codes")
        .update({
          name: editName,
          destination_url: qrCode.is_dynamic ? editDestination : undefined,
        })
        .eq("id", qrCode.id);

      if (error) throw error;

      setQrCode({
        ...qrCode,
        name: editName,
        destination_url: editDestination,
      });
      setShowEditDialog(false);
      toast.success("QR code updated");
    } catch (error) {
      console.error("Failed to update:", error);
      toast.error("Failed to update QR code");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[350px]" />
          </div>
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (!qrCode) return null;

  const stats = calculateStats();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
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
              {qrCode.is_dynamic && <Badge>Dynamic</Badge>}
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowEditDialog(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Stats Overview */}
      <StatsOverview {...stats} />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Charts */}
        <div className="space-y-6 lg:col-span-2">
          <ScansChart data={getDailyData()} />
          <DeviceBreakdown data={getDeviceData()} />
        </div>

        {/* QR Code Preview & Actions */}
        <div className="space-y-6">
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
                  style={{ width: 200, height: 200 }}
                />
              )}

              <div className="flex w-full flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDownload("png")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDownload("svg")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  SVG
                </Button>
              </div>

              {qrCode.is_dynamic && qrCode.short_code && (
                <div className="mt-4 w-full">
                  <Label className="text-xs text-muted-foreground">
                    Short URL
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}/q/${qrCode.short_code}`}
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyShortUrl}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {qrCode.destination_url && (
                <div className="mt-4 w-full">
                  <Label className="text-xs text-muted-foreground">
                    Destination
                  </Label>
                  <a
                    href={qrCode.destination_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {qrCode.destination_url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>
                  {format(new Date(qrCode.created_at), "MMM d, yyyy")}
                </span>
              </div>
              {qrCode.last_scanned_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Scanned</span>
                  <span>
                    {format(new Date(qrCode.last_scanned_at), "MMM d, yyyy")}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="capitalize">{qrCode.type}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit QR Code</DialogTitle>
            <DialogDescription>
              Update the name and destination of your QR code.
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

            {qrCode.is_dynamic && (
              <div className="space-y-2">
                <Label htmlFor="edit-destination">Destination URL</Label>
                <Input
                  id="edit-destination"
                  value={editDestination}
                  onChange={(e) => setEditDestination(e.target.value)}
                  placeholder="https://example.com"
                />
                <p className="text-xs text-muted-foreground">
                  Change where this QR code redirects to.
                </p>
              </div>
            )}
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
