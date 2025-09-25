"use client";

import { useState } from "react";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { ComplaintListItem } from "@/components/complaints/ComplaintListItem";
import { ComplaintStats } from "@/components/complaints/ComplaintStats";
import { AssignWorkerDialog } from "@/components/complaints/AssignWorkerDialog";
import { ComplaintDetailsModal } from "@/components/complaints/ComplaintDetailsModal";
import { DeleteComplaintDialog } from "@/components/complaints/DeleteComplaintDialog";
import { useComplaints } from "@/hooks/useComplaints";
import { Complaint } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, List } from "lucide-react";

export function AdminComplaintPage() {
  const { 
    allComplaints, 
    workers, 
    assignWorker,
    deleteComplaint,
    getRecommendedWorkers,
    fetchRecommendedWorkers,
    isLoadingRecommendations
  } = useComplaints();
  
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Group complaints by status
  const pendingComplaints = allComplaints.filter(c => c.status === 'PENDING');
  const inProgressComplaints = allComplaints.filter(c => c.status === 'IN_PROGRESS');
  const resolvedComplaints = allComplaints.filter(c => c.status === 'RESOLVED');

  const handleAssignWorker = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsAssignDialogOpen(true);
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDeleteDialogOpen(true);
  };

  const handleWorkerAssignment = (complaintId: number, workerId: string) => {
    assignWorker(complaintId, workerId);
  };

  const handleDeleteConfirm = (complaintId: number) => {
    deleteComplaint(complaintId);
  };

  const EmptyState = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div className="text-center py-12 text-gray-500">
      <div className="text-4xl mb-4">{icon}</div>
      <p className="text-lg font-medium text-gray-700">{title}</p>
      <p className="text-sm mt-1">{description}</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Complaint Management</h1>
          <p className="text-gray-600 mt-2">Manage complaints efficiently by status</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {/* <ComplaintStats complaints={allComplaints} /> */}

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="pending"
            isActive={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-2 cursor-pointer ${
              activeTab === "pending" 
                ? "bg-yellow-100 text-yellow-800 border border-yellow-200" 
                : ""
            }`}
          >
            🔔 Pending
            <Badge className="bg-yellow-200 text-yellow-800 text-xs">
              {pendingComplaints.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="in-progress"
            isActive={activeTab === "in-progress"}
            onClick={() => setActiveTab("in-progress")}
            className={`flex items-center gap-2 cursor-pointer ${
              activeTab === "in-progress" 
                ? "bg-blue-100 text-blue-800 border border-blue-200" 
                : ""
            }`}
          >
            ⚡ In Progress
            <Badge className="bg-blue-200 text-blue-800 text-xs">
              {inProgressComplaints.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="resolved"
            isActive={activeTab === "resolved"}
            onClick={() => setActiveTab("resolved")}
            className={`flex items-center gap-2 cursor-pointer ${
              activeTab === "resolved" 
                ? "bg-green-100 text-green-800 border border-green-200" 
                : ""
            }`}
          >
            ✅ Resolved
            <Badge className="bg-green-200 text-green-800 text-xs">
              {resolvedComplaints.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" isActive={activeTab === "pending"} className="mt-6">
          {pendingComplaints.length === 0 ? (
            <EmptyState
              icon="🎉"
              title="No pending complaints!"
              description="All complaints have been assigned to workers."
            />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {pendingComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onAssignWorker={handleAssignWorker}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {pendingComplaints.map((complaint) => (
                <ComplaintListItem
                  key={complaint.id}
                  complaint={complaint}
                  onAssignWorker={handleAssignWorker}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" isActive={activeTab === "in-progress"} className="mt-6">
          {inProgressComplaints.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No complaints in progress"
              description="Assign workers to pending complaints to get started."
            />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {inProgressComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onAssignWorker={handleAssignWorker}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {inProgressComplaints.map((complaint) => (
                <ComplaintListItem
                  key={complaint.id}
                  complaint={complaint}
                  onAssignWorker={handleAssignWorker}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved" isActive={activeTab === "resolved"} className="mt-6">
          {resolvedComplaints.length === 0 ? (
            <EmptyState
              icon="🏁"
              title="No resolved complaints yet"
              description="Completed work will appear here with citizen feedback."
            />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {resolvedComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onAssignWorker={handleAssignWorker}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {resolvedComplaints.map((complaint) => (
                <ComplaintListItem
                  key={complaint.id}
                  complaint={complaint}
                  onAssignWorker={handleAssignWorker}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AssignWorkerDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        complaint={selectedComplaint}
        workers={workers}
        recommendedWorkers={getRecommendedWorkers(selectedComplaint)}
        onAssign={handleWorkerAssignment}
        onRefreshRecommendations={fetchRecommendedWorkers}
        isLoadingRecommendations={isLoadingRecommendations}
      />

      <ComplaintDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        complaint={selectedComplaint}
      />

      <DeleteComplaintDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        complaint={selectedComplaint}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}