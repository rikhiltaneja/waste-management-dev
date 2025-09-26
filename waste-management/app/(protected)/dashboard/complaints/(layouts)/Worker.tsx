"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Clock, User, Phone, Calendar } from "lucide-react";
import Image from "next/image";

interface WorkerComplaint {
  id: number;
  description: string;
  complaintImage?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  citizen: {
    id: string;
    name: string;
    phoneNumber?: string;
    email: string;
  };
  localityAdmin: {
    id: string;
    name: string;
    email: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function WorkerComplaint() {
  const { getToken } = useAuth();
  const [complaints, setComplaints] = useState<WorkerComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<WorkerComplaint | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [workDoneImage, setWorkDoneImage] = useState<File | null>(null);
  const [workNotes, setWorkNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch worker's assigned complaints
  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${API_BASE_URL}/complaints?status=IN_PROGRESS`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
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
  }, [getToken]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleCompleteWork = (complaint: WorkerComplaint) => {
    setSelectedComplaint(complaint);
    setIsUpdateModalOpen(true);
    setWorkNotes("");
    setWorkDoneImage(null);
  };

  const handleSubmitCompletion = async () => {
    if (!selectedComplaint) return;

    try {
      setUpdating(true);
      const token = await getToken();
      
      const formData = new FormData();
      formData.append('status', 'RESOLVED');
      if (workDoneImage) {
        formData.append('workDoneImage', workDoneImage);
      }
      if (workNotes.trim()) {
        formData.append('workNotes', workNotes.trim());
      }

      const response = await fetch(`${API_BASE_URL}/complaints/${selectedComplaint.id}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Refresh complaints list
      await fetchComplaints();
      setIsUpdateModalOpen(false);
      setSelectedComplaint(null);
    } catch (err) {
      console.error('Error updating complaint:', err);
      setError(err instanceof Error ? err.message : 'Failed to update complaint');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your assigned complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchComplaints} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const inProgressComplaints = complaints.filter(c => c.status === 'IN_PROGRESS');
  const completedComplaints = complaints.filter(c => c.status === 'RESOLVED');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Assigned Work</h1>
          <p className="text-gray-600 mt-2">Manage your assigned complaints and update work progress</p>
        </div>
        <Button onClick={fetchComplaints} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressComplaints.length}</div>
            <p className="text-xs text-gray-500">Complaints in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedComplaints.length}</div>
            <p className="text-xs text-gray-500">Work completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Active Work ({inProgressComplaints.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedComplaints.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {inProgressComplaints.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-700">No active work assigned</p>
              <p className="text-sm mt-1">New assignments will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {inProgressComplaints.map((complaint) => (
                <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-500">#{complaint.id}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {complaint.complaintImage && (
                      <div className="relative h-40 w-full rounded-lg overflow-hidden">
                        <Image
                          src={complaint.complaintImage}
                          alt="Complaint"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <p className="text-gray-800">{complaint.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{complaint.citizen.name}</span>
                      </div>
                      {complaint.citizen.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{complaint.citizen.phoneNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Assigned: {formatDate(complaint.createdAt)}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleCompleteWork(complaint)}
                      className="w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedComplaints.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-700">No completed work yet</p>
              <p className="text-sm mt-1">Completed work will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedComplaints.map((complaint) => (
                <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge className={getStatusColor(complaint.status)}>
                        ✅ Completed
                      </Badge>
                      <span className="text-sm text-gray-500">#{complaint.id}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {complaint.complaintImage && (
                      <div className="relative h-40 w-full rounded-lg overflow-hidden">
                        <Image
                          src={complaint.complaintImage}
                          alt="Complaint"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <p className="text-gray-800">{complaint.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{complaint.citizen.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Completed: {formatDate(complaint.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Work Completion Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Mark Work as Complete</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="workNotes">Work Notes (Optional)</Label>
              <Textarea
                id="workNotes"
                placeholder="Describe the work completed..."
                value={workNotes}
                onChange={(e) => setWorkNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="workImage">Upload Work Done Photo (Optional)</Label>
              <Input
                id="workImage"
                type="file"
                accept="image/*"
                onChange={(e) => setWorkDoneImage(e.target.files?.[0] || null)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitCompletion}
              disabled={updating}
            >
              {updating ? "Updating..." : "Complete Work"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}