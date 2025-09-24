"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  imageSrc?: string;
  className?: string;
}

export function EventCard({
  title,
  description,
  date,
  location,
  imageSrc = "/events.png",
  className,
}: EventCardProps) {
  return (
    <div 
      className={cn(
        "bg-card border border-border rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]",
        className
      )}
    >
      {/* Mobile layout - horizontal */}
      <div className="sm:hidden flex gap-3 p-3">
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground mb-2 leading-relaxed line-clamp-2">
            {description}
          </p>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop layout - vertical */}
      <div className="hidden sm:block">
        <div className="aspect-[16/10] w-full relative p-3 sm:p-4">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full rounded-2xl object-cover"
          />
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2">{title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
