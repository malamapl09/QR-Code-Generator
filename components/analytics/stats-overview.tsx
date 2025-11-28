"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Calendar, TrendingUp } from "lucide-react";

interface StatsOverviewProps {
  totalScans: number;
  uniqueScans: number;
  scansToday: number;
  scansThisWeek: number;
}

export function StatsOverview({
  totalScans,
  uniqueScans,
  scansToday,
  scansThisWeek,
}: StatsOverviewProps) {
  const stats = [
    {
      title: "Total Scans",
      value: totalScans,
      icon: BarChart3,
      description: "All time",
    },
    {
      title: "Unique Visitors",
      value: uniqueScans,
      icon: Users,
      description: "Unique scanners",
    },
    {
      title: "Today",
      value: scansToday,
      icon: Calendar,
      description: "Scans today",
    },
    {
      title: "This Week",
      value: scansThisWeek,
      icon: TrendingUp,
      description: "Last 7 days",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
