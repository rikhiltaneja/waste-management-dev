"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AdminDashboard } from "./(layouts)/Admin";
import { CitizenDashboard } from "./(layouts)/Citizen";
import { WorkerDashboard } from "./(layouts)/Worker";

export default function DashboardPage() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const role = (user?.publicMetadata?.role as string) || "";

  // Determine dashboard content and sidebar sections dynamically
  const dashboardContent = (() => {
    if (!isLoaded) return <p>Loading...</p>;
    if (!isSignedIn) return <p>User not logged in</p>;

    switch (role) {
      case "Admin":
        return <AdminDashboard/>;
      case "Citizen":
        return <CitizenDashboard />;
      case "Worker":
        return <WorkerDashboard />;
      default:
        return <p>Role not recognized</p>;
    }
  })();

  return (
      <>
      {dashboardContent}
      </>
  );
}
