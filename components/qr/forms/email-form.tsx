"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, type EmailFormData } from "@/lib/validations/qr";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";

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

  const to = watch("to");
  const subject = watch("subject");
  const body = watch("body");
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (isValid && to) {
      onChangeRef.current({ to, subject, body });
    } else {
      onChangeRef.current(null);
    }
  }, [to, subject, body, isValid]);

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
