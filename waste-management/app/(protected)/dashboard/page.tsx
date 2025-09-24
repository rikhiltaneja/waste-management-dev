"use client";

import { AdminDashboard } from "./(layouts)/Admin";
import SideBarLayout from "@/components/sidebar/sidebar-layout";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddWorker = () => {
    // Navigate to worker creation page
    router.push("/dashboard/workers/new");
  };
  
  return (
    <SideBarLayout
      primaryAction={{
        label: "Add Worker",
        onClick: handleAddWorker,
        icon: UserPlus
      }}
      searchPlaceholder="Search Here..."
      onSearchChange={(value) => setSearchQuery(value)}
    >
      <AdminDashboard />
    </SideBarLayout>
  );
}
