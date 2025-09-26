"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Complaint } from "@/types";
import { formatDate } from "@/lib/utils";
import { Trash } from "lucide-react";
import Image from "next/image";

interface ComplaintCardProps {
  complaint: Complaint;
  onAssignWorker: (complaint: Complaint) => void;
  onViewDetails: (complaint: Complaint) => void;
  onDelete?: (complaint: Complaint) => void;
}

const getStatusColor = (status: string) => {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
    RESOLVED: "bg-green-100 text-green-800 border-green-200",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getWorkerTypeColor = (type: string) => {
  return type === "WASTE_COLLECTOR" 
    ? "bg-purple-100 text-purple-800 border-purple-200"
    : "bg-orange-100 text-orange-800 border-orange-200";
};

export function ComplaintCard({ complaint, onAssignWorker, onViewDetails, onDelete }: ComplaintCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 bg-white border-0 shadow-sm">
      {complaint.complaintImage && (
        <div className="h-56 p-2 bg-white">
          <Image
          height={100}
          width={100} 
            src={complaint.complaintImage} 
            alt="Complaint" 
            className="w-full h-full object-cover rounded-sm "
          />
        </div>
      )}
      
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Complaint #{complaint.id}</h3>
            <p className="text-xs text-gray-500">{formatDate(complaint.createdAt)}</p>
          </div>
          <Badge className={getStatusColor(complaint.status)}>
            {complaint.status.replace('_', ' ')}
          </Badge>
        </div>

        <p className="text-gray-700 text-xs">{complaint.description}</p>
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {complaint.citizen.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-gray-900 truncate">{complaint.citizen.name}</p>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px] py-0 px-1">
                Citizen
              </Badge>
            </div>
            <p className="text-xs text-gray-500">{complaint.citizen.locality.name}</p>
          </div>
        </div>

        {complaint.worker && (
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-green-500 text-white text-xs">
                {complaint.worker.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{complaint.worker.name}</p>
              <Badge className={`${getWorkerTypeColor(complaint.worker.workerType)} text-[10px] py-0 px-1`}>
                {complaint.worker.workerType.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        )}

        {complaint.status === 'RESOLVED' && complaint.rating > 0 && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(complaint.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-600">({complaint.rating}/5)</span>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          {complaint.status === 'PENDING' && (
            <Button 
              onClick={() => onAssignWorker(complaint)}
              className="flex-1 bg-primary text-xs py-2"
              size="sm"
            >
              Assign Worker
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(complaint)}
            className="text-xs py-2"
          >
            Details
          </Button>

          {onDelete && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(complaint)}
              className="text-xs py-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash/>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}