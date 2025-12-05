"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRPreview } from "./qr-preview";
import { QRCustomizer } from "./qr-customizer";
import { QRDownload } from "./qr-download";
import { URLForm } from "./forms/url-form";
import { TextForm } from "./forms/text-form";
import { WiFiForm } from "./forms/wifi-form";
import { VCardForm } from "./forms/vcard-form";
import { EmailForm } from "./forms/email-form";
import { PhoneForm } from "./forms/phone-form";
import { SMSForm } from "./forms/sms-form";
import { encodeQRContent } from "@/lib/qr/encoder";
import { generateShortCode } from "@/lib/qr/shortcode";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Link2,
  Type,
  Wifi,
  User,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
} from "lucide-react";
import type { QRType, GeneratedQR } from "@/types/qr";

const QR_TYPES = [
  { value: "url" as const, label: "URL", icon: Link2 },
  { value: "text" as const, label: "Text", icon: Type },
  { value: "wifi" as const, label: "WiFi", icon: Wifi },
  { value: "vcard" as const, label: "vCard", icon: User },
  { value: "email" as const, label: "Email", icon: Mail },
  { value: "phone" as const, label: "Phone", icon: Phone },
  { value: "sms" as const, label: "SMS", icon: MessageSquare },
];

export function QRGenerator() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeType, setActiveType] = useState<QRType>("url");
  const [formData, setFormData] = useState<Record<QRType, unknown>>({
    url: null,
    text: null,
    wifi: null,
    vcard: null,
    email: null,
    phone: null,
    sms: null,
  });

  // Customization state
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [size, setSize] = useState(256);

  // Generated QR code
  const [generatedQR, setGeneratedQR] = useState<GeneratedQR | null>(null);

  // Save dialog state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [isDynamic, setIsDynamic] = useState(false);
  const [saving, setSaving] = useState(false);

  // Get the encoded content for the current form
  const currentFormData = formData[activeType];
  const encodedContent = currentFormData
    ? encodeQRContent(activeType, currentFormData)
    : null;

  // Form change handlers
  const handleFormChange = useCallback(
    (type: QRType) => (data: unknown) => {
      setFormData((prev) => ({ ...prev, [type]: data }));
    },
    []
  );

  // Handle QR generation callback
  const handleQRGenerated = useCallback((qr: GeneratedQR | null) => {
    setGeneratedQR(qr);
  }, []);

  // Handle save
  const handleSaveClick = () => {
    if (!user) {
      // Redirect to login
      router.push("/login?next=/");
      return;
    }
    setShowSaveDialog(true);
  };

  const handleSave = async () => {
    if (!user || !encodedContent || !currentFormData) return;

    setSaving(true);

    try {
      const supabase = createClient();
      const shortCode = isDynamic ? generateShortCode() : null;

      // For dynamic QRs, we need to determine the destination URL
      let destinationUrl: string | null = null;
      if (isDynamic && activeType === "url") {
        destinationUrl = encodedContent;
      }

      const { error } = await supabase.from("qr_codes").insert({
        user_id: user.id,
        name: saveName || `${activeType.toUpperCase()} QR Code`,
        type: activeType,
        content: encodedContent,
        destination_url: destinationUrl,
        is_dynamic: isDynamic,
        short_code: shortCode,
        foreground_color: foregroundColor,
        background_color: backgroundColor,
        size,
        error_correction: "M",
      });

      if (error) {
        throw error;
      }

      toast.success("QR code saved successfully");
      setShowSaveDialog(false);
      setSaveName("");
      setIsDynamic(false);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save QR code:", error);
      toast.error("Failed to save QR code");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left side - Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeType}
              onValueChange={(v) => setActiveType(v as QRType)}
            >
              <TabsList className="mb-6 grid w-full grid-cols-4 lg:grid-cols-7">
                {QR_TYPES.map((type) => (
                  <TabsTrigger
                    key={type.value}
                    value={type.value}
                    className="flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <type.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{type.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="url">
                <URLForm onChange={handleFormChange("url")} />
              </TabsContent>
              <TabsContent value="text">
                <TextForm onChange={handleFormChange("text")} />
              </TabsContent>
              <TabsContent value="wifi">
                <WiFiForm onChange={handleFormChange("wifi")} />
              </TabsContent>
              <TabsContent value="vcard">
                <VCardForm onChange={handleFormChange("vcard")} />
              </TabsContent>
              <TabsContent value="email">
                <EmailForm onChange={handleFormChange("email")} />
              </TabsContent>
              <TabsContent value="phone">
                <PhoneForm onChange={handleFormChange("phone")} />
              </TabsContent>
              <TabsContent value="sms">
                <SMSForm onChange={handleFormChange("sms")} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Right side - Preview & Customization */}
        <div className="space-y-6">
          <QRPreview
            content={encodedContent}
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
            size={size}
            onGenerated={handleQRGenerated}
          />

          <QRCustomizer
            foregroundColor={foregroundColor}
            backgroundColor={backgroundColor}
            size={size}
            onForegroundColorChange={setForegroundColor}
            onBackgroundColorChange={setBackgroundColor}
            onSizeChange={setSize}
          />

          <QRDownload
            qrCode={generatedQR}
            filename={`${activeType}-qrcode`}
            onSave={handleSaveClick}
            showSave={true}
            disabled={!encodedContent}
          />
        </div>
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save QR Code</DialogTitle>
            <DialogDescription>
              Save this QR code to your account for easy access and management.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input
                id="name"
                placeholder="My QR Code"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
              />
            </div>

            {activeType === "url" && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dynamic"
                  checked={isDynamic}
                  onChange={(e) => setIsDynamic(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="dynamic" className="font-normal">
                  Make this a dynamic QR code
                </Label>
              </div>
            )}

            {isDynamic && (
              <p className="text-sm text-muted-foreground">
                Dynamic QR codes let you change the destination URL later
                without reprinting the code. You&apos;ll also get scan analytics.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
