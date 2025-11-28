"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <h3 className="font-semibold">Customize</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="foreground-color">Foreground Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="foreground-color"
              value={foregroundColor}
              onChange={(e) => onForegroundColorChange(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border"
            />
            <span className="text-sm text-muted-foreground">
              {foregroundColor}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="background-color">Background Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="background-color"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border"
            />
            <span className="text-sm text-muted-foreground">
              {backgroundColor}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Download Size</Label>
        <Select
          value={size.toString()}
          onValueChange={(value) => onSizeChange(parseInt(value))}
        >
          <SelectTrigger>
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
  );
}
