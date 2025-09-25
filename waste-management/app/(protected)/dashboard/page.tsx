"use client";

import { AdminDashboard } from "./(layouts)/Admin";
import SideBarLayout from "@/components/sidebar/sidebar-layout";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CitizenDashboard } from "./(layouts)/Citizen";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { isSignedIn, user, isLoaded } = useUser();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      console.log(user.publicMetadata)
      setRole(user.publicMetadata.role as string);
    }
  }, [isSignedIn, isLoaded]);

  const handleAddWorker = () => {
    // Navigate to worker creation page
    router.push("/dashboard/workers/new");
  };

  const roleBasedRendered = (role: string) => {
    if (role == "Admin") {
      return (
        <SideBarLayout
          primaryAction={{
            label: "Add Worker",
            onClick: handleAddWorker,
            icon: UserPlus,
          }}
          searchPlaceholder="Search Here..."
          onSearchChange={(value) => setSearchQuery(value)}
        >
          <AdminDashboard />
        </SideBarLayout>
      );
    } else if (role == "Citizen") {
      return (
        <SideBarLayout>
          <CitizenDashboard />
        </SideBarLayout>
      );
    }else{
      return (
        <SideBarLayout>
          loading
        </SideBarLayout>
      )
    }
  };

  return <>{roleBasedRendered(role)}</>;
}
