"use client";

import { useUser } from "@clerk/nextjs";
import { AdminComplaintPage } from "./(layouts)/Admin";
import { CitizenComplaint } from "./(layouts)/Citizen";
import { WorkerComplaint } from "./(layouts)/Worker";
import Loading from "@/app/loading";

export default function Complaints() {
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

  // Determine complaint page content based on role
  switch (role) {
    case "Admin":
      return <AdminComplaintPage />;
    case "Citizen":
      return <CitizenComplaint />;
    case "Worker":
      return <WorkerComplaint />;
    default:
      return <p>Role not recognized</p>;
  }
}