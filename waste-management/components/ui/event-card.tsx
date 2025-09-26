"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Users, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  imageSrc?: string;
  className?: string;
  registrations?: number;
  maxCapacity?: number;
  status?: "ACTIVE" | "CANCELLED" | "COMPLETED" | "DRAFT";
  targetAudience?: string[];
  onView?: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
  onEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "default" | "compact" | "list";
}
export function EventCard({
  title,
  description,
  date,
  location,
  imageSrc = "/events.png",
  className,
  registrations = 0,
  maxCapacity,
  status = 'ACTIVE',
  targetAudience = [],
  onView,
  onEdit,
  onDelete,
  variant = 'default',
}: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Compact variant for grid view
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          "bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
      >
        <div className="aspect-[16/10] w-full relative">
          <Image
            height={100}
            width={100}
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-1">{title}</h3>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
            {description}
          </p>
          <div className="space-y-2 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{registrations}/{maxCapacity || '∞'}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {targetAudience.length > 0 && targetAudience.join(', ')}
            </div>
            <div className="flex gap-1">
              {onView && (
                <Button variant="outline" size="sm" onClick={onView} className="p-1 h-6 w-6">
                  <Eye className="h-3 w-3" />
                </Button>
              )}
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit} className="p-1 h-6 w-6">
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {onDelete && (
                <Button variant="outline" size="sm" onClick={onDelete} className="p-1 h-6 w-6 text-red-600 hover:text-red-700">
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List variant for horizontal layout
  if (variant === 'list') {
    return (
      <div
        className={cn(
          "bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200",
          className
        )}
      >
        <div className="flex gap-4 p-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <Image
            height={100}
            width={100}
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-foreground text-base">{title}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{registrations}/{maxCapacity || '∞'} registered</span>
              </div>
            </div>
            {targetAudience.length > 0 && (
              <div className="text-xs text-muted-foreground mb-3">
                Target: {targetAudience.join(', ')}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            {onView && (
              <Button variant="outline" size="sm" onClick={onView}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant (original design)
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
          <Image
          width={100}
          height={100}
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2 leading-relaxed line-clamp-2">
            {description}
          </p>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{registrations}/{maxCapacity || '∞'}</span>
            </div>
          </div>
          {targetAudience.length > 0 && (
            <div className="text-xs text-muted-foreground mb-2">
              {targetAudience.join(', ')}
            </div>
          )}
          <div className="flex gap-1">
            {onView && (
              <Button variant="outline" size="sm" onClick={onView} className="p-1 h-6 w-6">
                <Eye className="h-3 w-3" />
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit} className="p-1 h-6 w-6">
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={onDelete} className="p-1 h-6 w-6 text-red-600 hover:text-red-700">
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop layout - vertical */}
      <div className="hidden sm:block">
        <div className="aspect-[16/10] w-full relative p-3 sm:p-4">
          <Image
            height={100}
            width={100}
            src={imageSrc}
            alt={title}
            className="w-full h-full rounded-2xl object-cover"
          />
          <div className="absolute top-5 right-5">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2">{title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">{description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{registrations}/{maxCapacity || '∞'}</span>
            </div>
          </div>
          {targetAudience.length > 0 && (
            <div className="text-xs text-muted-foreground mb-4">
              Target: {targetAudience.join(', ')}
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {onView && (
                <Button variant="outline" size="sm" onClick={onView}>
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
