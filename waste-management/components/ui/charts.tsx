"use client";

import * as React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart as RechartsAreaChart,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";
import Link from "next/link";

const wasteCollectionData = [
  { month: "Jan", value: 220 },
  { month: "Feb", value: 320 },
  { month: "Mar", value: 280 },
  { month: "Apr", value: 420 },
  { month: "May", value: 380 },
  { month: "Jun", value: 480 },
  { month: "Jul", value: 520 },
  { month: "Aug", value: 450 },
  { month: "Sep", value: 380 },
  { month: "Oct", value: 420 },
  { month: "Nov", value: 380 },
  { month: "Dec", value: 520 },
];

const workersData = [
  { name: "1", value: 80 },
  { name: "2", value: 75 },
  { name: "3", value: 60 },
  { name: "4", value: 30 },
  { name: "5", value: 20 },
  { name: "6", value: 10 },
];

interface AreaChartProps {
  className?: string;
  data?: Array<{ month: string; value: number }>;
  color?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

export function AreaChart({
  className,
  data = wasteCollectionData,
  color = "#22c55e",
  title,
  subtitle,
  description,
}: AreaChartProps) {
  return (
    <div className={cn("w-full", className)}>
      {(title || subtitle || description) && (
        <div className="mb-4">
          {title && <h4 className="text-lg font-semibold">{title}</h4>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      )}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data}>
            <defs>
              <linearGradient
                id="wasteCollectionGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                boxShadow:
                  "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              }}
              itemStyle={{ color: "#111827" }}
              formatter={(value: number) => [`${value}`, "Value"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill="url(#wasteCollectionGradient)"
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface BarChartProps {
  className?: string;
  data?: Array<{ name: string; value: number }>;
  color?: string;
  title?: string;
  subtitle?: string;
}

export function BarChart({
  className,
  data = workersData,
  color = "#eab308",
  title,
  subtitle,
}: BarChartProps) {
  return (
    <div className={cn("w-full", className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h4 className="text-lg font-semibold">{title}</h4>}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                boxShadow:
                  "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              }}
              itemStyle={{ color: "#111827" }}
              formatter={(value: number) => [`${value}`, "Value"]}
            />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-blue-500",
  className,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-3 sm:p-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-linear active:scale-[0.98]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="p-2 sm:p-3 rounded-lg"
            style={{ backgroundColor: "#F9FAFB" }}
          >
            <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", iconColor)} />
          </div>
          <div className="w-full">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface StatCardData {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor?: string;
}

export function StatsCardGrid({
  stats,
  className,
}: {
  stats: StatCardData[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
        className
      )}
    >
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  iconColor = "text-blue-500",
  onClick,
  className,
  href
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
  onClick?: () => void;
  className?: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "bg-card border border-border rounded-2xl p-2 sm:p-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-linear active:scale-[0.98]",
          className
        )}
        onClick={onClick}
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div
            className="p-2 sm:p-3 rounded-lg"
            style={{ backgroundColor: "#F9FAFB" }}
          >
            <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", iconColor)} />
          </div>
          <div className="w-full">
            <p className="text-md font-semibold truncate">{title}</p>
            <p className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function DashboardCharts() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
      <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 ease-linear">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Waste Collection
          </h3>
          <div className="text-left sm:text-right">
            <div className="text-xl sm:text-2xl font-bold text-success">
              +24
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              +10.1% from last month
            </div>
          </div>
        </div>
        <div className="h-40 sm:h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart data={wasteCollectionData}>
              <defs>
                <linearGradient
                  id="wasteCollectionGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                  boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                }}
                itemStyle={{ color: "#111827" }}
                formatter={(value: number) => [`${value}`, "Value"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#wasteCollectionGradient)"
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workers Chart */}
      <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 ease-linear">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Workers
          </h3>
          <div className="text-left sm:text-right">
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              100
            </div>
          </div>
        </div>
        <div className="h-40 sm:h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={workersData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                  boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                }}
                itemStyle={{ color: "#111827" }}
                formatter={(value: number) => [`${value}`, "Value"]}
              />
              <Bar dataKey="value" fill="#eab308" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
