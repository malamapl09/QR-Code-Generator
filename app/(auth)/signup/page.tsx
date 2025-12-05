import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a free QR Code Generator account to save your QR codes, track scans with analytics, and create dynamic codes you can update anytime.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignupForm />
    </div>
  );
}
