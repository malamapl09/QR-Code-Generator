"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { textSchema, type TextFormData } from "@/lib/validations/qr";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface TextFormProps {
  onChange: (data: TextFormData | null) => void;
}

export function TextForm({ onChange }: TextFormProps) {
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<TextFormData>({
    resolver: zodResolver(textSchema),
    mode: "onChange",
    defaultValues: {
      text: "",
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (isValid && formValues.text) {
      onChange(formValues);
    } else {
      onChange(null);
    }
  }, [formValues, isValid, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Text Content</Label>
        <Textarea
          id="text"
          placeholder="Enter your text here..."
          rows={4}
          {...register("text")}
        />
        {errors.text && (
          <p className="text-sm text-destructive">{errors.text.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {formValues.text?.length || 0} / 4000 characters
        </p>
      </div>
    </div>
  );
}
