import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <QrCode className="mb-4 h-16 w-16 text-muted-foreground" />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        QR code not found or has been deleted.
      </p>
      <Link href="/" className="mt-6">
        <Button>Create a new QR code</Button>
      </Link>
    </div>
  );
}
