"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  imageSrc: string;
  title: string;
  description: string;
  href: string;
  className?: string;
}

export function ServiceCard({
  imageSrc,
  title,
  description,
  href,
  className,
}: ServiceCardProps) {
  return (
    <Link href={href} className="group">
      <div 
        className={cn(
          "bg-card border border-border rounded-2xl p-3 sm:p-4 hover:shadow-md transition-all duration-200 text-center hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
      >
        <div className="w-32 h-26 sm:w-20 sm:h-20 lg:w-32 lg:h-32 xl:w-45 xl:h-35 rounded-2xl bg-gradient-to-bl from-[#90DBD0] to-[#BFDEC7] flex items-center justify-center mx-auto mb-2 sm:mb-3 p-3 sm:p-4 lg:p-6">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="font-semibold text-foreground text-xs sm:text-sm lg:text-base">
          {title}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      </div>
    </Link>
  );
}
