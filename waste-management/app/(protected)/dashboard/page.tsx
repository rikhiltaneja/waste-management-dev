"use client";

import { AdminDashboard } from "./(layouts)/Admin";
import SideBarLayout from "@/components/sidebar/sidebar-layout";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CitizenDashboard } from "./(layouts)/Citizen";
import { useUser } from "@clerk/nextjs";
import { WorkerDashboard } from "./(layouts)/Worker";

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
    } else if (role == "Worker") {
      return (
        <SideBarLayout>
          <WorkerDashboard />
        </SideBarLayout>
      );
    }else{
      return (
        <SideBarLayout>
          <p>User not logged in</p>
        </SideBarLayout>
      )
    }
  };

  return <>{roleBasedRendered(role)}</>;
}
