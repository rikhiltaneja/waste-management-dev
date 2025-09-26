"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Star, Calendar, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react";
import Image from "next/image";

// Citizen complaint interface that matches the backend response
interface CitizenComplaint {
  id: number;
  description: string;
  complaintImage?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  citizenId: string;
  workerId: string | null;
  localityAdminId: string;
  rating: number;
  reviewText: string | null;
  workDoneImage: string | null;
  citizen: {
    id: string;
    name: string;
    email: string;
  };
  worker: {
    id: string;
    name: string;
    email: string;
  } | null;
  localityAdmin: {
    id: string;
    name: string;
    email: string;
  };
}

interface CitizenComplaintCardProps {
  complaint: CitizenComplaint;
  onViewDetails?: (complaint: CitizenComplaint) => void;
}

const getStatusColor = (status: string) => {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
    RESOLVED: "bg-green-100 text-green-800 border-green-200",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <AlertCircle className="h-4 w-4" />;
    case 'IN_PROGRESS':
      return <Clock className="h-4 w-4" />;
    case 'RESOLVED':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
    />
  ));
};

export function CitizenComplaintCard({ complaint, onViewDetails }: CitizenComplaintCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 bg-white border shadow-sm">
      {/* Complaint Image */}
      {complaint.complaintImage && (
        <div className="relative h-48 bg-gray-100">
          <Image
            src={complaint.complaintImage}
            alt="Complaint"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Complaint #{complaint.id}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(complaint.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge className={getStatusColor(complaint.status)}>
              {getStatusIcon(complaint.status)}
              <span className="ml-1">{complaint.status.replace('_', ' ')}</span>
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed">{complaint.description}</p>

        {/* Locality Admin Info */}
        <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-indigo-500 text-white text-sm font-medium">
              {complaint.localityAdmin.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {complaint.localityAdmin.name}
              </p>
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs px-2 py-0.5">
                Locality Admin
              </Badge>
            </div>
            <p className="text-xs text-gray-600">{complaint.localityAdmin.email}</p>
          </div>
        </div>

        {/* Worker Info */}
        {complaint.worker && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-green-500 text-white text-sm font-medium">
                {complaint.worker.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {complaint.worker.name}
                </p>
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-0.5">
                  Assigned Worker
                </Badge>
              </div>
              <p className="text-xs text-gray-600">{complaint.worker.email}</p>
            </div>
          </div>
        )}

        {/* Rating and Review (for resolved complaints) */}
        {complaint.status === 'RESOLVED' && complaint.rating > 0 && (
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-900">Your Rating:</span>
              <div className="flex">
                {renderStars(complaint.rating)}
              </div>
              <span className="text-sm text-gray-600">({complaint.rating}/5)</span>
            </div>
            {complaint.reviewText && (
              <p className="text-sm text-gray-700 italic">
                &ldquo;{complaint.reviewText}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Work Done Image (for resolved complaints) */}
        {complaint.status === 'RESOLVED' && complaint.workDoneImage && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-sm font-medium text-green-800 mb-2">
              Work Completed - Photo Evidence:
            </p>
            <div className="relative h-32 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={complaint.workDoneImage}
                alt="Work completed"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        )}

        {/* Status Message */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {getStatusIcon(complaint.status)}
            <div className="flex-1">
              {complaint.status === 'PENDING' && (
                <p className="text-sm text-gray-700">
                  Your complaint has been submitted and is awaiting assignment to a worker.
                </p>
              )}
              {complaint.status === 'IN_PROGRESS' && (
                <p className="text-sm text-gray-700">
                  A worker has been assigned and is currently working on your complaint.
                </p>
              )}
              {complaint.status === 'RESOLVED' && (
                <p className="text-sm text-gray-700">
                  Your complaint has been successfully resolved.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onViewDetails && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(complaint)}
              className="w-full text-sm py-2 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}