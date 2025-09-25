"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Settings,
  CalendarDays,
  BriefcaseBusiness,
  Clock2,
} from "lucide-react";

interface NavItem {
  id: number;
  icon: React.ReactNode;
  label: string;
  href: string;
}

const items: NavItem[] = [
  { id: 0, icon: <Home size={23} />, label: "Home", href: "/dashboard" },
  {
    id: 1,
    icon: <CalendarDays size={23} />,
    label: "Search",
    href: "/cleaningdrives",
  },
  {
    id: 2,
    icon: <BriefcaseBusiness size={23} />,
    label: "Alerts",
    href: "/dashboard/trainings",
  },
  {
    id: 3,
    icon: <Clock2 size={23} />,
    label: "Profile",
    href: "/dashboard/complaints",
  },
  { id: 4, icon: <Settings size={23} />, label: "Saved", href: "/settings" },
];

const MobileNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 md:hidden">
      <div className="relative flex items-center justify-between gap-2 bg-[#111827e5] backdrop-blur-2xl rounded-full px-4 py-2 shadow-xl border-3 border-white overflow-hidden">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.id}
              className="relative flex-1 flex items-center justify-center group"
            >
              <motion.button
                onClick={() => {
                  if (!isActive) router.push(item.href);
                }}
                whileHover={{ scale: 1.15 }}
                animate={{ scale: isActive ? 1.1 : 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 
                relative z-10 rounded-full cursor-pointer
                ${isActive ? "bg-[#2DD480]" : "bg-[#FFFFFF17]"} text-white
                `}
              >
                {item.icon}
              </motion.button>
              <span className="absolute bottom-full mb-1 px-2 py-1 text-xs rounded-md bg-gray-500 text-white dark:bg-gray-200 dark:text-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-center">
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavbar;
