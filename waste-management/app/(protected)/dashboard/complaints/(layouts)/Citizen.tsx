"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Plus, AlertCircle, Eye, Calendar, User } from "lucide-react";
import Image from "next/image";

import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Simple CitizenComplaintCard component similar to AdminComplaintCard
function CitizenComplaintCard({
  complaint,
  onViewDetails
}: {
  complaint: CitizenComplaint;
  onViewDetails?: (complaint: CitizenComplaint) => void;
}) {
  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
      RESOLVED: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

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

        {/* Status Message */}
        <div className="p-3 bg-gray-50 rounded-lg text-sm">
          {complaint.status === 'PENDING' && (
            <p className="text-gray-700">
              🔔 Your complaint has been submitted and is awaiting assignment to a worker.
            </p>
          )}
          {complaint.status === 'IN_PROGRESS' && (
            <p className="text-gray-700">
              ⚡ A worker has been assigned and is currently working on your complaint.
            </p>
          )}
          {complaint.status === 'RESOLVED' && (
            <p className="text-gray-700">
              ✅ Your complaint has been successfully resolved.
            </p>
          )}
        </div>

        {/* View Details Button */}
        {onViewDetails && (
          <div className="mt-3">
            <Button
              onClick={() => onViewDetails(complaint)}
              variant="outline"
              size="sm"
              className="w-full cursor-pointer"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CitizenComplaint() {
  const { getToken } = useAuth();

  const router = useRouter();

  const [complaints, setComplaints] = useState<CitizenComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<CitizenComplaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Fetch citizen's own complaints
  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/complaints`, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleViewDetails = (complaint: CitizenComplaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };



  if (loading) {
    return (
      <Loading />
    );
  }

  if (error && complaints.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchComplaints} variant="outline" className="cursor-pointer">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const pendingComplaints = complaints.filter(c => c.status === 'PENDING');
  const inProgressComplaints = complaints.filter(c => c.status === 'IN_PROGRESS');
  const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED');

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Track your waste management complaints and their progress</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
          <Button onClick={fetchComplaints} variant="outline" className="cursor-pointer text-sm">
            Refresh
          </Button>
          <Button onClick={() => router.push("/dashboard/complaints/new")} className="cursor-pointer text-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Complaint
          </Button>
        </div>
      </div>


      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-yellow-600">{pendingComplaints.length}</div>
            <p className="text-xs text-gray-500">Awaiting assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-blue-600">{inProgressComplaints.length}</div>
            <p className="text-xs text-gray-500">Being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600">{resolvedComplaints.length}</div>
            <p className="text-xs text-gray-500">Work completed</p>
          </CardContent>
        </Card>
      </div>

      {complaints.length === 0 ? (
        <div className="text-center py-8 md:py-12 text-gray-500">
          <AlertCircle className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-gray-300" />
          <p className="text-base md:text-lg font-medium text-gray-700">No complaints yet</p>
          <p className="text-sm mt-1 mb-3 md:mb-4">Create your first complaint to get started</p>
          <Button onClick={() => router.push("/dashboard/complaints/new")} className="cursor-pointer text-sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Complaint
          </Button>
        </div>
      ) : (
        <div className="space-y-6 md:space-y-8">
          {/* Pending Complaints Section */}
          {pendingComplaints.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">🔔 Pending Complaints</h2>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 self-start sm:self-center">
                  {pendingComplaints.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {pendingComplaints.map((complaint) => (
                  <CitizenComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          )}

          {/* In Progress Complaints Section */}
          {inProgressComplaints.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">⚡ In Progress</h2>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 self-start sm:self-center">
                  {inProgressComplaints.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {inProgressComplaints.map((complaint) => (
                  <CitizenComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Resolved Complaints Section */}
          {resolvedComplaints.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">✅ Resolved</h2>
                <Badge className="bg-green-100 text-green-800 border-green-200 self-start sm:self-center">
                  {resolvedComplaints.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {resolvedComplaints.map((complaint) => (
                  <CitizenComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Show message if only resolved complaints exist */}
          {pendingComplaints.length === 0 && inProgressComplaints.length === 0 && resolvedComplaints.length > 0 && (
            <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
              <div className="text-4xl mb-2">�</div>
              <p className="text-lg font-medium text-green-800">All complaints resolved!</p>
              <p className="text-sm text-green-600 mt-1">Great job working with our team to address your concerns.</p>
            </div>
          )}
        </div>
      )}

      {/* Complaint Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] mx-4 sm:mx-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Complaint Details
              {selectedComplaint && (
                <span className="block sm:inline text-xs sm:text-sm text-gray-500 font-normal sm:ml-2 mt-1 sm:mt-0">
                  ID: #{selectedComplaint.id}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <Badge className={`${selectedComplaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    selectedComplaint.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-green-100 text-green-800 border-green-200'
                  }`}>
                  {selectedComplaint.status.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-gray-500">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  {new Date(selectedComplaint.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Complaint Image */}
              {selectedComplaint.complaintImage && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Complaint Photo</h3>
                  <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={selectedComplaint.complaintImage}
                      alt="Complaint"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* People Involved */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Locality Admin
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-900">{selectedComplaint.localityAdmin?.name}</p>
                    <p className="text-sm text-gray-600">{selectedComplaint.localityAdmin?.email}</p>
                  </div>
                </div>

                {selectedComplaint.worker && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Assigned Worker
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-gray-900">{selectedComplaint.worker.name}</p>
                      <p className="text-sm text-gray-600">{selectedComplaint.worker.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Work Done Image (for resolved complaints) */}
              {selectedComplaint.status === 'RESOLVED' && selectedComplaint.workDoneImage && (
                <div>
                  <h3 className="text-sm font-medium text-green-800 mb-2">Work Completed - Photo Evidence</h3>
                  <div className="relative h-64 w-full rounded-lg overflow-hidden bg-green-50 border border-green-200">
                    <Image
                      src={selectedComplaint.workDoneImage}
                      alt="Work completed"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Rating and Review (for resolved complaints) */}
              {selectedComplaint.status === 'RESOLVED' && selectedComplaint.rating > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Your Feedback</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-700">Rating:</span>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < selectedComplaint.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({selectedComplaint.rating}/5)</span>
                  </div>
                  {selectedComplaint.reviewText && (
                    <div>
                      <span className="text-sm text-gray-700">Review:</span>
                      <p className="text-sm text-gray-800 italic mt-1">
                        &ldquo;{selectedComplaint.reviewText}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Status Timeline */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Status Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">Complaint submitted</span>
                  </div>
                  {selectedComplaint.worker && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">Worker assigned</span>
                    </div>
                  )}
                  {selectedComplaint.status === 'RESOLVED' && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">Work completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}