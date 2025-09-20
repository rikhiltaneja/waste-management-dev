"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar, SidebarItem, SidebarSection } from "@/components/sidebar/sidebar";
// import { Header } from "@components/header"
import {
  Home,
  Users,
  Settings,
  BarChart3,
  HelpCircle,
  Wrench,
  BrushCleaning,
  HandCoins,
  Activity,
  Warehouse,
  MessageSquareWarning,
  BookOpenCheck,
  Coins,
} from "lucide-react";

interface SideBarLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  customSidebarSections?: SidebarSection[];
  activeItem?: string;
}

export function SideBarLayout({
  children,
  customSidebarSections,
  activeItem: customActiveItem,
}: SideBarLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const getActiveItem = () => {
    if (customActiveItem) return customActiveItem;

    if (pathname === "/dashboard") return "dashboard";
    if (pathname === "/dashboard/monitoring") return "monitoring";
    if (pathname === "/dashboard/reports") return "reports";

    if (pathname === "/dashboard/workers") return "workers";
    if (pathname === "/dashboard/users") return "users";
    if (pathname === "/dashboard/facilities") return "facilities";
    if (pathname === "/shop/inventory") return "inventory";

    if (pathname === "/cleaningdrives") return "cleaningdrives";
    if (pathname === "/grievances") return "grievances";
    if (pathname === "/trainings") return "trainings";
    if (pathname === "/incentives") return "incentives";
    if (pathname === "/donations") return "donations";
    if (pathname === "/support") return "support";
    if (pathname === "/settings") return "settings";

    return "dashboard";
  };

  const sidebarSections: SidebarSection[] = [
    {
      title: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
        { id: "monitoring", label: "Monitoring", icon: Activity, href: "/dashboard/monitoring" },
        { id: "reports", label: "Reports", icon: BarChart3, href: "/dashboard/reports" },
      ],
    },
    {
      title: "Management",
      items: [
        { id: "workers", label: "Workers", icon: Wrench, href: "/dashboard/workers" },
        { id: "users", label: "Users", icon: Users, href: "/dashboard/users" },
        { id: "facilities", label: "Facilities", icon: Settings, href: "/dashboard/facilities" },
        { id: "inventory", label: "Inventory", icon: Warehouse, href: "/shop/inventory" },
      ],
    },
    {
      title: "Community and Compliance",
      items: [
        { id: "cleaningdrives", label: "Drives & Campaigns", icon: BrushCleaning, href: "/cleaningdrives" },
        { id: "grievances", label: "Grievances", icon: MessageSquareWarning, href: "/grievances" },
        { id: "trainings", label: "Trainings", icon: BookOpenCheck, href: "/trainings" },
        { id: "incentives", label: "Incentives/Penalties", icon: Coins, href: "/incentives" },
        { id: "donations", label: "Donations", icon: HandCoins, href: "/donations" },
        { id: "support", label: "Support", icon: HelpCircle, href: "/support" },
        { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
      ],
    },
  ];

  const handleItemClick = (item: SidebarItem) => {
    if (item.href) router.push(item.href);
    if (item.onClick) item.onClick();
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        sections={customSidebarSections || sidebarSections}
        activeItem={getActiveItem()}
        onItemClick={handleItemClick}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <main className="flex-1 overflow-y-auto p-4 pb-8 bg-background">
          <div className="mx-auto h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
