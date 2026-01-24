"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QrCode, LayoutDashboard } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <QrCode className="h-6 w-6" />
          <span className="font-bold">QR Generator</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              My QR Codes
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
