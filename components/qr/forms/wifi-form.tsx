"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wifiSchema, type WiFiFormData } from "@/lib/validations/qr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

interface WiFiFormProps {
  onChange: (data: WiFiFormData | null) => void;
}

export function WiFiForm({ onChange }: WiFiFormProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<WiFiFormData>({
    resolver: zodResolver(wifiSchema),
    mode: "onChange",
    defaultValues: {
      ssid: "",
      password: "",
      encryption: "WPA",
      hidden: false,
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (isValid && formValues.ssid) {
      onChange(formValues);
    } else {
      onChange(null);
    }
  }, [formValues, isValid, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ssid">Network Name (SSID)</Label>
        <Input
          id="ssid"
          placeholder="MyWiFiNetwork"
          {...register("ssid")}
        />
        {errors.ssid && (
          <p className="text-sm text-destructive">{errors.ssid.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="encryption">Security Type</Label>
        <Select
          value={formValues.encryption}
          onValueChange={(value) =>
            setValue("encryption", value as "WPA" | "WEP" | "nopass")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select security type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA">WPA/WPA2</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="nopass">No Password</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formValues.encryption !== "nopass" && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter WiFi password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="hidden"
          className="h-4 w-4 rounded border-gray-300"
          {...register("hidden")}
        />
        <Label htmlFor="hidden" className="font-normal">
          Hidden Network
        </Label>
      </div>
    </div>
  );
}
