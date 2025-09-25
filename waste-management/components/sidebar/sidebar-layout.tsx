"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar, SidebarItem, SidebarSection } from "@/components/sidebar/sidebar";
import { Header } from "@/components/ui/header";
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
  showLogo?: boolean;
  sidebarBackButton?: boolean;
  sidebarBackText?: string;
  onSidebarBackClick?: () => void;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
}

function SideBarLayout({
  children,
  title,
  showBackButton = false,
  onBackClick,
  primaryAction,
  customSidebarSections,
  activeItem: customActiveItem,
  showLogo = true,
  sidebarBackButton = false,
  sidebarBackText = "Back",
  onSidebarBackClick,
  searchPlaceholder = "Search Here...",
  onSearchChange
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
    if (pathname === "/grievances/new") return "grievances";
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
    <div className="flex h-screen bg-background overflow-hidden sidebar-layout">
      <div className="flex flex-col">
        {sidebarBackButton && (
          <div className="mx-4 mt-4 mb-2">
            <button
              onClick={onSidebarBackClick}
              className="flex items-center space-x-3 bg-sidebar border border-sidebar-border rounded-full hover:bg-sidebar-accent transition-all duration-200 w-full sm:w-64 h-12"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white">
                <div className="w-6 h-6 bg-muted/50 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-black">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </div>
              </div>
              <span className="text-sidebar-foreground font-medium text-sm">{sidebarBackText}</span>
            </button>
          </div>
        )}
        
        <Sidebar
          sections={customSidebarSections || sidebarSections}
          activeItem={getActiveItem()}
          onItemClick={handleItemClick}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          showLogo={showLogo}
          showBackButton={false}
        />
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <Header
          // className="mb-4"
          showBackButton={showBackButton}
          onBackClick={onBackClick}
          searchPlaceholder={searchPlaceholder}
          onSearchChange={onSearchChange}
          primaryAction={primaryAction}
        />
        
        {/* Main Content - Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 pt-1 sm:pt-1 mb-20 sm:mb-7">
          {/* <div className="p-3 sm:p-6 rounded-2xl h-full"> */}
            {children}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

export default SideBarLayout;