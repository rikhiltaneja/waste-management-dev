"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Complaint } from "@/types";
import { X } from "lucide-react";

interface ComplaintDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
}

export function ComplaintDetailsModal({ isOpen, onClose, complaint }: ComplaintDetailsModalProps) {
  if (!complaint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Complaint Details #{complaint.id}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complaint.complaintImage && (
              <div>
                <h4 className="font-medium mb-2">Complaint Image</h4>
                <img 
                  src={complaint.complaintImage} 
                  alt="Complaint" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            {complaint.workDoneImage && (
              <div>
                <h4 className="font-medium mb-2">Work Done Image</h4>
                <img 
                  src={complaint.workDoneImage} 
                  alt="Work Done" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{complaint.description}</p>
          </div>

          {/* Citizen Details */}
          <div>
            <h4 className="font-medium mb-2">Citizen Information</h4>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Name:</span> {complaint.citizen.name}</p>
              <p><span className="font-medium">Phone:</span> {complaint.citizen.phoneNumber}</p>
              <p><span className="font-medium">Email:</span> {complaint.citizen.email}</p>
              <p><span className="font-medium">Location:</span> {complaint.citizen.locality.name}, {complaint.citizen.locality.pincode}</p>
            </div>
          </div>

          {/* Worker Details */}
          {complaint.worker && (
            <div>
              <h4 className="font-medium mb-2">Assigned Worker</h4>
              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <p><span className="font-medium">Name:</span> {complaint.worker.name}</p>
                <p><span className="font-medium">Phone:</span> {complaint.worker.phoneNumber}</p>
                <p><span className="font-medium">Type:</span> 
                  <Badge className="ml-2">
                    {complaint.worker.workerType.replace('_', ' ')}
                  </Badge>
                </p>
              </div>
            </div>
          )}

          {/* Review */}
          {complaint.reviewText && (
            <div>
              <h4 className="font-medium mb-2">Citizen Review</h4>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(complaint.rating) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({complaint.rating}/5)</span>
                </div>
                <p className="text-gray-700">{complaint.reviewText}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}