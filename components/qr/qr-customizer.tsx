"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface QRCustomizerProps {
  foregroundColor: string;
  backgroundColor: string;
  size: number;
  onForegroundColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
}

const SIZE_OPTIONS = [
  { value: 128, label: "Small (128px)" },
  { value: 256, label: "Medium (256px)" },
  { value: 512, label: "Large (512px)" },
  { value: 1024, label: "Extra Large (1024px)" },
];

export function QRCustomizer({
  foregroundColor,
  backgroundColor,
  size,
  onForegroundColorChange,
  onBackgroundColorChange,
  onSizeChange,
}: QRCustomizerProps) {
  return (
    <div className="space-y-4 rounded-xl border bg-muted/30 p-4 transition-all duration-200 hover:bg-muted/40">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">Customize</h3>
      </div>

      <Separator className="bg-border/50" />

      {/* Colors and size in responsive grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Foreground Color */}
        <div className="space-y-2">
          <Label htmlFor="foreground-color" className="text-xs font-medium text-muted-foreground">
            Foreground Color
          </Label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="color"
                id="foreground-color"
                value={foregroundColor}
                onChange={(e) => onForegroundColorChange(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-lg border-2 border-border bg-transparent transition-all duration-200 hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {foregroundColor.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <Label htmlFor="background-color" className="text-xs font-medium text-muted-foreground">
            Background Color
          </Label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="color"
                id="background-color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-lg border-2 border-border bg-transparent transition-all duration-200 hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {backgroundColor.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Download Size */}
        <div className="space-y-2">
          <Label htmlFor="size" className="text-xs font-medium text-muted-foreground">
            Download Size
          </Label>
          <Select
            value={size.toString()}
            onValueChange={(value) => onSizeChange(parseInt(value))}
          >
            <SelectTrigger className="h-10 transition-all duration-200 hover:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
