"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AdminDashboard } from "./(layouts)/Admin";
import { CitizenDashboard } from "./(layouts)/Citizen";
import { WorkerDashboard } from "./(layouts)/Worker";
import Loading from "@/app/loading";

export default function DashboardPage() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const role = (user?.publicMetadata?.role as string) || "";

  // Show loading screen that breaks out of sidebar layout
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isSignedIn) {
    return <p>User not logged in</p>;
  }

  // Determine dashboard content based on role
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
}
