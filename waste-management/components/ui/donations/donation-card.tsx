"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DonationTypeProps {
  imageSrc: string;
  title: string;
  className?: string;
}

export function DonationTypeCard({
  imageSrc,
  title,
  className,
}: DonationTypeProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-3 sm:p-4 hover:shadow-md transition-all ease-linear duration-200 text-center hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
        className
      )}
    >
      <div className="w-25 h-26 sm:w-32 sm:h-20 lg:w-28 lg:h-32 xl:w-45 xl:h-35 rounded-2xl bg-gradient-to-bl from-[#90DBD0] to-[#BFDEC7] flex items-center justify-center mx-auto mb-2 sm:mb-3 p-3 sm:p-4 lg:p-6">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="font-semibold text-foreground text-xs sm:text-sm lg:text-base">
        {title}
      </div>
    </div>
  );
}
