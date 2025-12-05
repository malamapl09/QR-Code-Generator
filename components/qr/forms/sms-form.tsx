"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { smsSchema, type SMSFormData } from "@/lib/validations/qr";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";

interface SMSFormProps {
  onChange: (data: SMSFormData | null) => void;
}

export function SMSForm({ onChange }: SMSFormProps) {
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<SMSFormData>({
    resolver: zodResolver(smsSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
      message: "",
    },
  });

  const phone = watch("phone");
  const message = watch("message");
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (isValid && phone) {
      onChangeRef.current({ phone, message });
    } else {
      onChangeRef.current(null);
    }
  }, [phone, message, isValid]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 234 567 8900"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Pre-filled Message</Label>
        <Textarea
          id="message"
          placeholder="Enter a pre-filled message (optional)"
          rows={3}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {message?.length || 0} / 160 characters
        </p>
      </div>
    </div>
  );
}
