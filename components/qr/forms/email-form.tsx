"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, type EmailFormData } from "@/lib/validations/qr";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface EmailFormProps {
  onChange: (data: EmailFormData | null) => void;
}

export function EmailForm({ onChange }: EmailFormProps) {
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      to: "",
      subject: "",
      body: "",
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (isValid && formValues.to) {
      onChange(formValues);
    } else {
      onChange(null);
    }
  }, [formValues, isValid, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="to">Email Address *</Label>
        <Input
          id="to"
          type="email"
          placeholder="recipient@example.com"
          {...register("to")}
        />
        {errors.to && (
          <p className="text-sm text-destructive">{errors.to.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="Email subject"
          {...register("subject")}
        />
        {errors.subject && (
          <p className="text-sm text-destructive">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Message</Label>
        <Textarea
          id="body"
          placeholder="Your message..."
          rows={4}
          {...register("body")}
        />
        {errors.body && (
          <p className="text-sm text-destructive">{errors.body.message}</p>
        )}
      </div>
    </div>
  );
}
