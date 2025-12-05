"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { phoneSchema, type PhoneFormData } from "@/lib/validations/qr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";

interface PhoneFormProps {
  onChange: (data: PhoneFormData | null) => void;
}

export function PhoneForm({ onChange }: PhoneFormProps) {
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
    },
  });

  const phone = watch("phone");
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (isValid && phone) {
      onChangeRef.current({ phone });
    } else {
      onChangeRef.current(null);
    }
  }, [phone, isValid]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 234 567 8900"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Include country code for international numbers
        </p>
      </div>
    </div>
  );
}
