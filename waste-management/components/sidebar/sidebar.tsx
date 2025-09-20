"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      sections,
      activeItem,
      onItemClick,
      collapsed = false,
      className,
    },
    ref
  ) => {
    const [isDark, setIsDark] = React.useState(false);

    React.useEffect(() => {
      const checkTheme = () => {
        setIsDark(document.documentElement.classList.contains("dark"));
      };

      checkTheme();
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }, []);

    const renderItem = (item: SidebarItem) => {
      const Icon = item.icon;
      const isActive = activeItem === item.id;

      const buttonContent = (
        <div className="flex items-center w-full mt-1">
          <div
            className={cn(
              "flex items-center justify-center rounded-full transition-all duration-200",
              "w-8 h-8",
              isActive
                ? isDark
                  ? "hover:opacity-90"
                  : "bg-green-500 hover:bg-green-600"
                : isDark
                ? "hover:opacity-80"
                : "bg-gray-200 hover:bg-gray-300",
              !collapsed && "mr-3"
            )}
            style={{
              backgroundColor: isActive
                ? isDark
                  ? "#1D923C"
                  : undefined
                : isDark
                ? "#393939"
                : undefined,
            }}
          >
            <Icon
              className={cn(
                "h-4 w-4",
                isActive ? "text-white" : "text-gray-700 dark:text-white"
              )}
            />
          </div>
          {!collapsed && (
            <>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-600/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </div>
      );

      const buttonClasses = cn(
        "w-full justify-start h-12 rounded-3xl transition-all duration-200 cursor-pointer",
        isActive
          ? "bg-green-600 text-white hover:bg-green-600 hover:text-white"
          : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
        collapsed && "justify-center px-2"
      );

      if (item.href) {
        // ✅ Use Next.js Link for client navigation
        return (
          <Link key={item.id} href={item.href} passHref>
            <Button asChild variant="ghost" size="sm" className={buttonClasses}>
              {buttonContent}
            </Button>
          </Link>
        );
      }

      // ✅ Use Button if only onClick is defined
      return (
        <Button
          key={item.id}
          variant="ghost"
          size="sm"
          className={buttonClasses}
          onClick={() => {
            if (item.id !== activeItem) {
              onItemClick?.(item);
              item.onClick?.();
            }
          }}
        >
          {buttonContent}
        </Button>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 rounded-3xl m-4 mr-0 mb-6 h-[calc(100vh-1.4rem)]" ,
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-center p-6">
          {!collapsed ? (
            <div className="flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 w-10 object-contain"
                loading="lazy"
              />
              <img
                src="/cavyor logo.png"
                alt="Cavyor"
                className="h-12 w-auto object-contain mt-2"
                loading="lazy"
              />
            </div>
          ) : (
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 w-8 object-contain mx-auto"
              loading="lazy"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 space-y-6 sidebar-scroll">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3 ">
              {section.title && !collapsed && (
                <h3 className="text-sm font-medium text-sidebar-foreground/60 px-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-2 ">
                {section.items.map((item) => renderItem(item))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start h-12 rounded-3xl text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200",
              collapsed && "justify-center px-2"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full transition-all duration-200",
                "w-8 h-8 bg-red-600 hover:bg-red-700",
                !collapsed && "mr-3"
              )}
            >
              <LogOut className="h-4 w-4 text-white" />
            </div>
            {!collapsed && <span className="font-medium">Log Out</span>}
          </Button>
        </div>
      </div>
    );
  }
);

Sidebar.displayName = "Sidebar";

export { Sidebar };
