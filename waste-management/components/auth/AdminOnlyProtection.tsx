"use client";

import { AdminProtection } from "./AdminProtection";

interface AdminOnlyProtectionProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export function AdminOnlyProtection({ children, fallbackPath }: AdminOnlyProtectionProps) {
  return (
    <AdminProtection allowedRoles={['Admin']} fallbackPath={fallbackPath}>
      {children}
    </AdminProtection>
  );
}