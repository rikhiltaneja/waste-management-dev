"use client";

import { Complaint } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, User, MoreHorizontal, UserPlus, Eye, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ComplaintListItemProps {
  complaint: Complaint;
  onAssignWorker: (complaint: Complaint) => void;
  onViewDetails: (complaint: Complaint) => void;
  onDelete: (complaint: Complaint) => void;
}

const statusConfig = {
  PENDING: { color: "bg-yellow-100 text-yellow-800", icon: "🔔" },
  IN_PROGRESS: { color: "bg-blue-100 text-blue-800", icon: "⚡" },
  RESOLVED: { color: "bg-green-100 text-green-800", icon: "✅" },
};

export function ComplaintListItem({ 
  complaint, 
  onAssignWorker, 
  onViewDetails, 
  onDelete 
}: ComplaintListItemProps) {
  const statusInfo = statusConfig[complaint.status as keyof typeof statusConfig];

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        {/* Left Section - Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4">
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900 truncate">
                  Complaint #{complaint.id}
                </h3>
                <Badge className={`${statusInfo.color} text-xs`}>
                  {complaint.status.replace('_', ' ')}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {complaint.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-32">{complaint.citizen.locality.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{complaint.citizen.name}</span>
                </div>
                {complaint.worker && (
                  <div className="flex items-center gap-1">
                    <UserPlus className="h-3 w-3" />
                    <span className="text-blue-600">{complaint.worker.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 ml-4">
          {complaint.status === 'PENDING' && (
            <Button
              size="sm"
              onClick={() => onAssignWorker(complaint)}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Assign
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(complaint)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {complaint.status === 'PENDING' && (
                <DropdownMenuItem onClick={() => onAssignWorker(complaint)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Worker
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(complaint)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )}