"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Monitor, Smartphone, Tablet, HelpCircle } from "lucide-react";

interface DeviceData {
  deviceType: string;
  count: number;
}

interface DeviceBreakdownProps {
  data: DeviceData[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DEVICE_ICONS = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: HelpCircle,
};

export function DeviceBreakdown({ data }: DeviceBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const formattedData = data.map((item) => ({
    name: item.deviceType.charAt(0).toUpperCase() + item.deviceType.slice(1),
    value: item.count,
    percentage: total > 0 ? ((item.count / total) * 100).toFixed(1) : 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 || total === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No device data available
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formattedData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {formattedData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {data.map((item, index) => {
                const Icon =
                  DEVICE_ICONS[item.deviceType as keyof typeof DEVICE_ICONS] ||
                  HelpCircle;
                const percentage =
                  total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
                return (
                  <div
                    key={item.deviceType}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">{item.deviceType}</span>
                    <span className="text-sm text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
