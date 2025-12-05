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
      {/* Main container with new layout: Preview LEFT, Form RIGHT on desktop */}
      <Card className="overflow-hidden rounded-xl border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <div className="grid gap-0 lg:grid-cols-[380px_1fr]">
          {/* Left side - QR Preview (desktop) / Top (mobile) */}
          <div className="order-2 flex flex-col bg-muted/30 p-6 lg:order-1 lg:p-8">
            <QRPreview
              content={encodedContent}
              foregroundColor={foregroundColor}
              backgroundColor={backgroundColor}
              size={size}
              onGenerated={handleQRGenerated}
            />

            {/* Download buttons below preview */}
            <div className="mt-6">
              <QRDownload
                qrCode={generatedQR}
                filename={`${activeType}-qrcode`}
                onSave={handleSaveClick}
                showSave={true}
                disabled={!encodedContent}
              />
            </div>
          </div>

          {/* Right side - Form & Customization */}
          <div className="order-1 flex flex-col lg:order-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">Create QR Code</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-6 pb-6">
              <Tabs
                value={activeType}
                onValueChange={(v) => setActiveType(v as QRType)}
              >
                {/* Horizontal scrolling tabs for mobile */}
                <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
                  <TabsList className="mb-6 inline-flex h-auto min-w-full gap-1 bg-muted/50 p-1 lg:grid lg:w-full lg:grid-cols-7">
                    {QR_TYPES.map((type) => (
                      <TabsTrigger
                        key={type.value}
                        value={type.value}
                        className="flex min-h-[44px] min-w-[72px] flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm sm:flex-row sm:gap-2 sm:text-sm lg:min-w-0"
                      >
                        <type.icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="min-h-[200px]">
                  <TabsContent value="url" className="mt-0 animate-fade-in">
                    <URLForm onChange={handleFormChange("url")} />
                  </TabsContent>
                  <TabsContent value="text" className="mt-0 animate-fade-in">
                    <TextForm onChange={handleFormChange("text")} />
                  </TabsContent>
                  <TabsContent value="wifi" className="mt-0 animate-fade-in">
                    <WiFiForm onChange={handleFormChange("wifi")} />
                  </TabsContent>
                  <TabsContent value="vcard" className="mt-0 animate-fade-in">
                    <VCardForm onChange={handleFormChange("vcard")} />
                  </TabsContent>
                  <TabsContent value="email" className="mt-0 animate-fade-in">
                    <EmailForm onChange={handleFormChange("email")} />
                  </TabsContent>
                  <TabsContent value="phone" className="mt-0 animate-fade-in">
                    <PhoneForm onChange={handleFormChange("phone")} />
                  </TabsContent>
                  <TabsContent value="sms" className="mt-0 animate-fade-in">
                    <SMSForm onChange={handleFormChange("sms")} />
                  </TabsContent>
                </div>
              </Tabs>

              {/* Customization section integrated into form area */}
              <QRCustomizer
                foregroundColor={foregroundColor}
                backgroundColor={backgroundColor}
                size={size}
                onForegroundColorChange={setForegroundColor}
                onBackgroundColorChange={setBackgroundColor}
                onSizeChange={setSize}
              />
            </CardContent>
          </div>
        </div>
      </Card>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="rounded-xl">
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
                className="h-11"
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
              className="transition-all duration-200 hover:-translate-y-0.5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
