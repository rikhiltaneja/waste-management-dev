"use client";

import React, { useState } from "react";
import {
  Trash2,
  Users,
  Wrench,
  DollarSign,
  FileText,
  Coins,
  MessageSquare,
  Folder,
  CalendarPlus,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  StatsCardGrid,
  DashboardCharts,
  ActionCard,
} from "@/components/ui/charts";

export function AdminDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("Rajab");

  const stats = {
    totalWastes: 126,
    activeUsers: 200,
    activeWorkers: 200,
    totalDonations: 314.0,
    collectedWastes: 24,
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-3 sm:space-y-4 bg-background">
      {/* Greeting Section */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          {getGreeting()} {username}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Explore what&apos;s today at WasteWise
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCardGrid
        stats={[
          {
            title: "Total Wastes Collected",
            value: stats.totalWastes,
            icon: Trash2,
            iconColor: "text-amber-500",
          },
          {
            title: "Active Users",
            value: stats.activeUsers,
            icon: Users,
            iconColor: "text-blue-500",
          },
          {
            title: "Active Workers",
            value: stats.activeWorkers,
            icon: Wrench,
            iconColor: "text-green-500",
          },
          {
            title: "Total Donations",
            value: `$${stats.totalDonations.toFixed(2)}`,
            icon: DollarSign,
            iconColor: "text-green-500",
          },
        ]}
      />

      {/* Charts Section */}
      <div>
        <DashboardCharts />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pb-12 sm:pb-4">
       <ActionCard
  title="Create Event"
  description="Plan and schedule new waste management events."
  icon={CalendarPlus}
  iconColor="text-amber-500"
  href="/dashboard/trainings"
/>
<ActionCard
  title="Manage Users"
  description="View, edit, and control user accounts and roles."
  icon={Users}
  iconColor="text-blue-500"
  href="/dashboard/users"
/>
<ActionCard
  title="Manage Donations"
  description="Track and oversee donation records and activity."
  icon={DollarSign}
  iconColor="text-green-500"
  href="/dashboard/donations"
/>
<ActionCard
  title="Manage Incentives"
  description="Create and manage rewards for citizen participation."
  icon={Coins}
  iconColor="text-green-500"
  href="/dashboard/incentives"
/>
<ActionCard
  title="View User Feedback"
  description="Read and respond to citizen feedback and reports."
  icon={FileText}
  iconColor="text-amber-500"
  href="/dashboard/user-feedback"
/>
<ActionCard
  title="Collection Points"
  description="Monitor and update waste collection point locations."
  icon={MapPin}
  iconColor="text-red-500"
  href="/dashboard/facilities"
/>

      </div>
    </div>
  );
}
