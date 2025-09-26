"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Eye } from "lucide-react";
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



const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
    />
  ));
};

export function CitizenComplaintCard({ complaint, onViewDetails }: CitizenComplaintCardProps) {
  console.log('CitizenComplaintCard rendering with:', complaint);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!complaint) {
    return <div className="bg-red-100 p-4 rounded">Error: No complaint data</div>;
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <Badge className={getStatusColor(complaint.status)}>
            {complaint.status.replace('_', ' ')}
          </Badge>
          <span className="text-sm text-gray-500">#{complaint.id}</span>
        </div>

        {/* Image */}
        {complaint.complaintImage && (
          <div className="relative h-40 w-full rounded-lg overflow-hidden mb-3">
            <Image
              src={complaint.complaintImage}
              alt="Complaint"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Description */}
        <p className="text-gray-800 mb-3 line-clamp-3">{complaint.description}</p>

        {/* Info */}
        <div className="text-sm text-gray-600 mb-3">
          <p><strong>Date:</strong> {formatDate(complaint.createdAt)}</p>
          <p><strong>Admin:</strong> {complaint.localityAdmin?.name}</p>
          {complaint.worker && (
            <p><strong>Worker:</strong> {complaint.worker.name}</p>
          )}
        </div>

        {/* Rating and Review (for resolved complaints) */}
        {complaint.status === 'RESOLVED' && complaint.rating > 0 && (
          <div className="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
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
          <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-sm font-medium text-green-800 mb-2">
              Work Completed - Photo Evidence:
            </p>
            <div className="relative h-32 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={complaint.workDoneImage}
                alt="Work completed"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {onViewDetails && (
            <Button 
              onClick={() => onViewDetails(complaint)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}