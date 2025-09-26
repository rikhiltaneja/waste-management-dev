"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Roles } from "@/types/globals";

interface AdminProtectionProps {
  children: React.ReactNode;
  allowedRoles?: Roles[];
  fallbackPath?: string;
}

export function AdminProtection({ 
  children, 
  allowedRoles = ['Admin'], 
  fallbackPath = '/dashboard' 
}: AdminProtectionProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    // Get user role from session claims
    const userRole = user?.publicMetadata?.role as Roles;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      router.push(fallbackPath);
      return;
    }

    setIsAuthorized(true);
    setIsChecking(false);
  }, [isLoaded, isSignedIn, user, allowedRoles, fallbackPath, router]);

  if (!isLoaded || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => router.push(fallbackPath)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}