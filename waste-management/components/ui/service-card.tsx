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
          "bg-card border border-border rounded-2xl p-3 sm:p-4 hover:shadow-md h-full transition-all ease-linear duration-200 hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
      >
        <div className="w-full aspect-square w-full h-32 sm:h-42 rounded-2xl bg-gradient-to-bl from-[#90DBD0] to-[#BFDEC7] flex items-center justify-center  mb-2 sm:mb-3 p-3 sm:p-4 lg:p-6">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3"
          />
        </div>
        <div>
        <div className="font-semibold text-foreground text-xs sm:text-sm lg:text-base">
          {title}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
        </div>
      </div>
    </Link>
  );
}
