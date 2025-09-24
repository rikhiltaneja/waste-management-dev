"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  activeItem?: string;
  onItemClick?: (item: SidebarItem) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  showLogo?: boolean;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(({ 
  sections,
  activeItem,
  onItemClick,
  collapsed = false,
  className,
  showLogo = true,
  showBackButton = false,
  backButtonText = "Back",
  onBackClick,
}, ref) => {
  const { signOut } = useClerk();

  return (
    <div
      ref={ref}
      className={cn(
        "hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 rounded-3xl m-3 mr-0 mb-3 h-[calc(100vh-2.5rem)]",
        collapsed ? "w-16" : "w-72",
        className
      )}
    >
      {/* Back Button - Only shown when showBackButton is true */}
      {showBackButton && !collapsed && (
        <div className="p-4 pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackClick}
            className="w-full justify-start h-12 rounded-full text-gray-700 hover:bg-green-500/10 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backButtonText}
          </Button>
        </div>
      )}

      {/* Header with Logo */}
      {showLogo && (
        <div className="flex items-center justify-center p-4 pb-2">
          {!collapsed ? (
            <div className="flex items-center justify-center">
              <img
                src="/logo_green.png"
                alt="Logo"
                className="h-20 w-20 object-contain"
                loading="lazy"
              />
              {/* <img
                src="/wastex-logo.png"
                alt="WASTEX"
                className="h-12 w-auto object-contain mt-2"
                loading="lazy"
              /> */}
            </div>
          ) : (
            <img
              src="/logo_green.png"
              alt="Logo"
              className="h-8 w-8 object-contain mx-auto"
              loading="lazy"
            />
          )}
        </div>
      )}

      {/* Navigation */}
         <div className="flex-1 overflow-y-auto px-4 space-y-6 pt-8 sidebar-scroll">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              {section.title && !collapsed && (
                <h3 className="text-sm font-medium text-sidebar-foreground/60 px-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeItem === item.id
                  const [isHovered, setIsHovered] = React.useState(false)
                  
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start h-12 rounded-3xl transition-all duration-200 cursor-pointer",
                        isActive ? "text-white" : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]",
                        collapsed && "justify-center px-2"
                      )}
                      onClick={() => onItemClick?.(item)}
                      style={{
                        backgroundColor: isActive 
                          ? '#1D923C'
                          : (isHovered ? 'rgba(34, 197, 94, 0.1)' : '#f1f5f9')
                      }}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-full transition-all duration-200 w-8 h-8",
                          !collapsed && "mr-3"
                        )}
                        style={{
                          backgroundColor: isActive ? '#1D923C' : '#e2e8f0'
                        }}
                      >
                        <Icon className={cn(
                          "h-4 w-4",
                          isActive ? "text-white" : "text-gray-600"
                        )} />
                      </div>
                      {!collapsed && <span className="font-medium">{item.label}</span>}
                      {item.badge && !collapsed && (
                        <span className="ml-auto bg-red-600/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

      {/* Logout Button */}
      <div className="p-4 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ redirectUrl: "/" })}
            className={cn(
              "w-full justify-start h-12 rounded-3xl transition-all duration-200 cursor-pointer text-sidebar-foreground/80 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]",
              collapsed && "justify-center px-2"
            )}
            style={{
              backgroundColor: '#f1f5f9'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.color = '';
            }}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full transition-all duration-200 w-8 h-8",
                !collapsed && "mr-3"
              )}
              style={{
                backgroundColor: '#ef4444'
              }}
            >
              <LogOut className="h-4 w-4 text-white" />
            </div>
            {!collapsed && <span className="font-medium">Log Out</span>}
          </Button>
        </div>
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export { Sidebar };
