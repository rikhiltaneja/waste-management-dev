"use client";

import React, { useEffect, useState } from "react";
import { DashboardHeroSection } from "@/components/ui/dashboardherosection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useUser } from "@clerk/nextjs";
import { InitialisationService } from "@/services/initialization.service";
import { useUserProfile } from "@/store/profile.store";
import { Complaint } from "@/types";
import { formatDate } from "@/helpers/date.helper";
import { CheckCircle, Clock, AlertCircle, Camera, Upload } from "lucide-react";
import Image from "next/image";

// Mock data for worker-assigned complaints
const mockWorkerComplaints: Complaint[] = [
  {
    id: 2,
    description:
      "Street sweeping not done properly. Leaves and debris scattered everywhere after yesterday's rain.",
    complaintImage:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
    createdAt: "2024-01-14T14:20:00Z",
    citizenId: "citizen_2",
    status: "IN_PROGRESS",
    workerId: "current_worker",
    localityAdminId: "admin_1",
    rating: 0,
    citizen: {
      id: "citizen_2",
      name: "Priya Sharma",
      phoneNumber: "+91-9876543211",
      email: "priya.sharma@email.com",
      locality: {
        id: 1,
        name: "Brigade Road",
        pincode: "560025",
      },
    },
    worker: {
      id: "current_worker",
      name: "Current Worker",
      phoneNumber: "+91-9876543212",
      workerType: "SWEEPER",
    },
  },
  {
    id: 4,
    description:
      "Garbage bins overflowing near the bus stop. Urgent cleaning required.",
    complaintImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    createdAt: "2024-01-16T08:45:00Z",
    citizenId: "citizen_4",
    status: "IN_PROGRESS",
    workerId: "current_worker",
    localityAdminId: "admin_1",
    rating: 0,
    citizen: {
      id: "citizen_4",
      name: "Arjun Singh",
      phoneNumber: "+91-9876543220",
      email: "arjun.singh@email.com",
      locality: {
        id: 1,
        name: "MG Road",
        pincode: "560001",
      },
    },
    worker: {
      id: "current_worker",
      name: "Current Worker",
      phoneNumber: "+91-9876543212",
      workerType: "WASTE_COLLECTOR",
    },
  },
  {
    id: 7,
    description:
      "Construction debris dumped illegally. Needs immediate removal.",
    complaintImage:
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400",
    createdAt: "2024-01-17T11:30:00Z",
    citizenId: "citizen_5",
    status: "RESOLVED",
    workerId: "current_worker",
    localityAdminId: "admin_1",
    rating: 4.5,
    reviewText: "Excellent work! Area is completely clean now.",
    workDoneImage:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
    citizen: {
      id: "citizen_5",
      name: "Meera Patel",
      phoneNumber: "+91-9876543221",
      email: "meera.patel@email.com",
      locality: {
        id: 2,
        name: "Koramangala",
        pincode: "560034",
      },
    },
    worker: {
      id: "current_worker",
      name: "Current Worker",
      phoneNumber: "+91-9876543212",
      workerType: "WASTE_COLLECTOR",
    },
  },
];

export function WorkerDashboard() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();
  const setUserProfile = useUserProfile((state) => state.updateProfile);
  const profile = useUserProfile((state) => state.profile);
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState("in-progress");

  useEffect(() => {
    async function init() {
      if (isLoaded && isSignedIn && user) {
        const token = await getToken();
        const initializationService = new InitialisationService(
          user.publicMetadata.role as string,
          user.id,
          token as string
        );

        // For now, we'll use mock data. In a real app, you'd fetch worker profile
        const mockProfile = {
          id: user.id,
          name: user.fullName || "Worker",
          email: user.primaryEmailAddress?.emailAddress || "",
          phone: user.primaryPhoneNumber?.phoneNumber || "",
          points: 850,
          localityId: 1, // Default locality for worker
        };

        setUserProfile(mockProfile);
        setComplaints(mockWorkerComplaints);
        setLoading(false);
      }
    }
    init();
  }, [isLoaded, isSignedIn, user, getToken, setUserProfile]);

  const handleComplaintAction = (complaint: Complaint, action: string) => {
    if (action === "mark-complete") {
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaint.id
            ? { ...c, status: "RESOLVED" as const, rating: 4.0 }
            : c
        )
      );
    }
  };

  const handleViewDetails = (complaint: Complaint) => {
    // In a real app, this would open a detailed modal
    console.log("View details for complaint:", complaint.id);
  };

  // Group complaints by status
  const inProgressComplaints = complaints.filter(
    (c) => c.status === "IN_PROGRESS"
  );
  const completedComplaints = complaints.filter((c) => c.status === "RESOLVED");
  const allAssignedComplaints = complaints;

  if (loading || !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="p-4 sm:p-0 space-y-4 sm:space-y-6">
        {/* Hero Section */}
        <DashboardHeroSection
          title={profile.name}
          showHeading={true}
          leftSideProp={{
            label: "Completed Tasks:",
            value: completedComplaints.length,
          }}
          rightSideProp={{ label: "Total Points", value: profile.points }}
        />

        {/* Quick Stats */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Active Tasks
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {inProgressComplaints.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    {completedComplaints.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-medium">
                    Total Assigned
                  </p>
                  <p className="text-2xl font-bold text-orange-800">
                    {allAssignedComplaints.length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Assigned Complaints */}
        <section>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              My Assigned Complaints
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your assigned tasks and track progress
            </p>
          </div>

          <Tabs defaultValue="in-progress" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="in-progress"
                isActive={activeTab === "in-progress"}
                onClick={() => setActiveTab("in-progress")}
                className="flex items-center gap-2"
              >
                🔄 In Progress
                <Badge className="bg-blue-200 text-blue-800 text-xs ml-1">
                  {inProgressComplaints.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="completed"
                isActive={activeTab === "completed"}
                onClick={() => setActiveTab("completed")}
                className="flex items-center gap-2"
              >
                ✅ Completed
                <Badge className="bg-green-200 text-green-800 text-xs ml-1">
                  {completedComplaints.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="all"
                isActive={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                className="flex items-center gap-2"
              >
                📋 All Tasks
                <Badge className="bg-gray-200 text-gray-800 text-xs ml-1">
                  {allAssignedComplaints.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="in-progress"
              isActive={activeTab === "in-progress"}
              className="mt-6"
            >
              {inProgressComplaints.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">🎉</div>
                  <p className="text-lg font-medium text-gray-700">
                    No active tasks!
                  </p>
                  <p className="text-sm mt-1">
                    All your assigned complaints are completed.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {inProgressComplaints.map((complaint) => (
                    <WorkerComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      onAction={handleComplaintAction}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="completed"
              isActive={activeTab === "completed"}
              className="mt-6"
            >
              {completedComplaints.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-lg font-medium text-gray-700">
                    No completed tasks yet
                  </p>
                  <p className="text-sm mt-1">
                    Completed tasks will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {completedComplaints.map((complaint) => (
                    <WorkerComplaintCard
                      key={complaint.id}
                      complaint={complaint}
                      onAction={handleComplaintAction}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="all"
              isActive={activeTab === "all"}
              className="mt-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {allAssignedComplaints.map((complaint) => (
                  <WorkerComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    onAction={handleComplaintAction}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}

// Worker-specific complaint card component
interface WorkerComplaintCardProps {
  complaint: Complaint;
  onAction: (complaint: Complaint, action: string) => void;
  onViewDetails: (complaint: Complaint) => void;
}

function WorkerComplaintCard({
  complaint,
  onAction,
  onViewDetails,
}: WorkerComplaintCardProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
      RESOLVED: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 bg-white border-0 shadow-sm">
      {complaint.complaintImage && (
        <div className="h-48 p-2 bg-white">
          <Image
            height={100}
            width={100} 
            src={complaint.complaintImage} 
            alt="Complaint" 
            className="w-full h-full object-cover rounded-sm"
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-gray-900">
                Task #{complaint.id}
              </h3>
              {complaint.status === "IN_PROGRESS" && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {formatDate(complaint.createdAt)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={getStatusColor(complaint.status)}>
              {complaint.status.replace("_", " ")}
            </Badge>
            {/* Priority indicator based on how long ago it was created */}
            {(() => {
              const daysSinceCreated = Math.floor(
                (Date.now() - new Date(complaint.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              if (daysSinceCreated > 2) {
                return (
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    High Priority
                  </Badge>
                );
              } else if (daysSinceCreated > 1) {
                return (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                    Medium
                  </Badge>
                );
              }
              return (
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Normal
                </Badge>
              );
            })()}
          </div>
        </div>

        <p className="text-gray-700 text-sm">{complaint.description}</p>

        {/* Citizen Info */}
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {complaint.citizen.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {complaint.citizen.name}
            </p>
            <p className="text-xs text-gray-500">
              {complaint.citizen.locality.name}
            </p>
          </div>
        </div>

        {/* Rating for completed tasks */}
        {complaint.status === "RESOLVED" && complaint.rating > 0 && (
          <div className="p-2 bg-yellow-50 rounded-md space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(complaint.rating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({complaint.rating}/5)
              </span>
            </div>
            {complaint.reviewText && (
              <p className="text-xs text-gray-600 italic">
                &quot;{complaint.reviewText}&quot;
              </p>
            )}
          </div>
        )}

        {/* Work completion indicator */}
        {complaint.status === "RESOLVED" && (
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-xs text-green-700 font-medium">
              Task Completed Successfully
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          {complaint.status === "IN_PROGRESS" && (
            <>
              <Button
                onClick={() => onAction(complaint, "mark-complete")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-xs py-2"
                size="sm"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Mark Complete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAction(complaint, "upload-photo")}
                className="text-xs py-2"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </>
          )}

          {complaint.status === "RESOLVED" && complaint.workDoneImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(complaint)}
              className="flex-1 text-xs py-2"
            >
              <Upload className="h-3 w-3 mr-1" />
              View Work Photo
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
        </div>
      </div>
    </Card>
  );
}
