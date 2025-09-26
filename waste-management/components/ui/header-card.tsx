"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeaderCardProps {
  title: string;
  leftSideProp?: {
    label: string;
    value: string | number;
  };
  rightSideProp?: {
    label: string;
    value: string | number;
  };
  className?: string;
  backgroundImage?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function HeaderCard({
  title,
  leftSideProp,
  rightSideProp,
  className,
  backgroundImage = "/vector.svg",
  gradientFrom = "#18BF67",
  gradientTo = "#2DD480",
}: HeaderCardProps) {
  return (
    <div 
      className={cn(
        "relative rounded-2xl overflow-hidden w-full h-full text-white hover:shadow-lg hover:scale-[1.01] transition-all duration-200 ease-linear",
        className
      )}
      style={{
        background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
      }}
    >
      <h2 className="text-xl font-semibold p-6">{title}</h2>

      {(leftSideProp || rightSideProp) && (
        <div className="flex justify-between items-center px-6 pb-6">
          {leftSideProp && (
            <div>
              <p className="text-sm mb-1">{leftSideProp.label}</p>
              <p className="text-3xl font-bold">{leftSideProp.value}</p>
            </div>
          )}

          {rightSideProp && (
            <div>
              <p className="text-sm mb-1">{rightSideProp.label}</p>
              <p className="text-3xl font-bold">{rightSideProp.value}</p>
            </div>
          )}
        </div>
      )}

      {backgroundImage && (
        <Image
          height={100}
          width={100}
          src={backgroundImage}
          alt="background decoration"
          className="absolute bottom-0 left-0 w-full h-auto"
        />
      )}
    </div>
  );
}
