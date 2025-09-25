"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: ReactNode;
}

interface TabsListProps {
  className?: string;
  children: ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
  isActive?: boolean;
}

export function Tabs({ defaultValue, className, children }: TabsProps) {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  );
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div className={cn("inline-flex h-12 items-center justify-center rounded-lg bg-gray-100 p-1", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, onClick, isActive }: TabsTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-white text-gray-900 shadow-sm" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, isActive }: TabsContentProps) {
  if (!isActive) return null;
  
  return (
    <div className={cn("mt-4", className)}>
      {children}
    </div>
  );
}