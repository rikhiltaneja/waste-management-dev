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
import { Plus, Clock, CheckCircle, AlertCircle, Calendar, Star } from "lucide-react";
import Image from "next/image";

interface CitizenComplaint {
  id: number;
  description: string;
  complaintImage?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  rating?: number;
  reviewText?: string;
  workDoneImage?: string;
  worker?: {
    id: string;
    name: string;
    email: string;
  };
  localityAdmin: {
    id: string;
    name: string;
    email: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function CitizenComplaint() {
  const { getToken } = useAuth();
  const [complaints, setComplaints] = useState<CitizenComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newComplaintDescription, setNewComplaintDescription] = useState("");
  const [newComplaintImage, setNewComplaintImage] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  // Fetch citizen's own complaints
  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${API_BASE_URL}/complaints`, {
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

  const handleCreateComplaint = async () => {
    if (!newComplaintDescription.trim() || !newComplaintImage) {
      setError("Please provide both description and image for the complaint");
      return;
    }

    try {
      setCreating(true);
      const token = await getToken();
      
      const formData = new FormData();
      formData.append('description', newComplaintDescription.trim());
      formData.append('complaintImage', newComplaintImage);

      const response = await fetch(`${API_BASE_URL}/complaints/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Refresh complaints list
      await fetchComplaints();
      setIsCreateModalOpen(false);
      setNewComplaintDescription("");
      setNewComplaintImage(null);
      setError(null);
    } catch (err) {
      console.error('Error creating complaint:', err);
      setError(err instanceof Error ? err.message : 'Failed to create complaint');
    } finally {
      setCreating(false);
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
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your complaints...</p>
        </div>
      </div>
    );
  }

  if (error && complaints.length === 0) {
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

  const pendingComplaints = complaints.filter(c => c.status === 'PENDING');
  const inProgressComplaints = complaints.filter(c => c.status === 'IN_PROGRESS');
  const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-gray-600 mt-2">Track your waste management complaints and their progress</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchComplaints} variant="outline">
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Complaint
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingComplaints.length}</div>
            <p className="text-xs text-gray-500">Awaiting assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressComplaints.length}</div>
            <p className="text-xs text-gray-500">Being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedComplaints.length}</div>
            <p className="text-xs text-gray-500">Work completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Complaints List */}
      {complaints.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-700">No complaints yet</p>
          <p className="text-sm mt-1 mb-4">Create your first complaint to get started</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Complaint
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({complaints.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingComplaints.length})</TabsTrigger>
            <TabsTrigger value="progress">In Progress ({inProgressComplaints.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolvedComplaints.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {complaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {inProgressComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {resolvedComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Create Complaint Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Create New Complaint</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the waste management issue..."
                value={newComplaintDescription}
                onChange={(e) => setNewComplaintDescription(e.target.value)}
                rows={4}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="complaintImage">Upload Photo *</Label>
              <Input
                id="complaintImage"
                type="file"
                accept="image/*"
                onChange={(e) => setNewComplaintImage(e.target.files?.[0] || null)}
                className="mt-1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Photo of the issue is required</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setError(null);
              }}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateComplaint}
              disabled={creating || !newComplaintDescription.trim() || !newComplaintImage}
            >
              {creating ? "Creating..." : "Create Complaint"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  function ComplaintCard({ complaint }: { complaint: CitizenComplaint }) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {getStatusIcon(complaint.status)}
              <Badge className={getStatusColor(complaint.status)}>
                {complaint.status.replace('_', ' ')}
              </Badge>
            </div>
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
              <Calendar className="h-4 w-4" />
              <span>Submitted: {formatDate(complaint.createdAt)}</span>
            </div>
            
            {complaint.worker && (
              <div className="text-sm">
                <strong>Assigned Worker:</strong> {complaint.worker.name}
              </div>
            )}
          </div>

          {/* Work Done Image */}
          {complaint.workDoneImage && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Work Completed:</p>
              <div className="relative h-32 w-full rounded-lg overflow-hidden">
                <Image
                  src={complaint.workDoneImage}
                  alt="Work Done"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Rating */}
          {complaint.status === 'RESOLVED' && complaint.rating && (
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Your Rating:</span>
                <div className="flex gap-1">
                  {renderStars(complaint.rating)}
                </div>
              </div>
              {complaint.reviewText && (
                <p className="text-sm text-gray-600 italic">&ldquo;{complaint.reviewText}&rdquo;</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}