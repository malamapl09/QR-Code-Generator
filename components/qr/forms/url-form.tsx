"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { urlSchema, type URLFormData } from "@/lib/validations/qr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface URLFormProps {
  onChange: (data: URLFormData | null) => void;
}

export function URLForm({ onChange }: URLFormProps) {
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<URLFormData>({
    resolver: zodResolver(urlSchema),
    mode: "onChange",
    defaultValues: {
      url: "",
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (isValid && formValues.url) {
      onChange(formValues);
    } else {
      onChange(null);
    }
  }, [formValues, isValid, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          type="text"
          placeholder="https://example.com"
          {...register("url")}
        />
        {errors.url && (
          <p className="text-sm text-destructive">{errors.url.message}</p>
        )}
      </div>
    </div>
  );
}
