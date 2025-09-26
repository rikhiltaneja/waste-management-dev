"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { CitizenItems, AdminItems, WorkerItems } from "@/constants/sidebar";


const MobileNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  // Get user role from metadata or default to 'citizen'
  const userRole = user?.publicMetadata?.role as string;

  // Select navigation items based on user role
  const getNavigationItems = () => {
    switch (userRole) {
      case 'Admin':
        return AdminItems;
      case 'Worker':
        return WorkerItems;
      case 'Citizen':
      default:
        return CitizenItems;
    }
  };

  const items = getNavigationItems();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 md:hidden">
      <div className="relative flex items-center justify-between bg-[#111827e5] backdrop-blur-2xl rounded-full px-1 py-1 shadow-xl border-3 border-white overflow-hidden">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.id}
              className="relative flex items-center justify-center group"
            >
              <motion.button
                onClick={() => {
                  if (!isActive) router.push(item.href);
                }}
                whileHover={{ scale: 1.15 }}
                animate={{ scale: isActive ? 1.1 : 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className={`flex items-center justify-center size-13
                relative z-10 rounded-full cursor-pointer
                ${isActive ? "bg-[#2DD480]" : "bg-[#FFFFFF17]"} text-white
                `}
              >
                <item.icon size={20} />
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
