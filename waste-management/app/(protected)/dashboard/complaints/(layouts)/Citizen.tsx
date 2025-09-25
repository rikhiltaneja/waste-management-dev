"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ChevronRight,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Grievance {
  id: number;
  title: string;
  description: string;
  category: 'WASTE_COLLECTION' | 'MISSED_PICKUP' | 'ILLEGAL_DUMPING' | 'DAMAGED_BINS' | 'OTHER';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  submittedAt: string;
  updatedAt: string;
  location: string;
  assignedTo?: string;
  responseMessage?: string;
  images?: string[];
}

// Mock data based on the Figma design showing trash pickup requests
const mockGrievances: Grievance[] = [
  {
    id: 1,
    title: "Trash Picked Up",
    description: "Regular waste collection completed successfully. All garbage bags were collected from the designated pickup point.",
    category: 'WASTE_COLLECTION',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    submittedAt: '2025-02-11T08:00:00Z',
    updatedAt: '2025-02-11T10:30:00Z',
    location: 'Sector 15, Block A, New Delhi',
    assignedTo: 'Jane Doe',
    responseMessage: 'Waste collection completed successfully. Thank you for your cooperation.'
  },
  {
    id: 2,
    title: "Missed Pickup Request",
    description: "Waste collection was missed on the scheduled day. Garbage is accumulating and needs immediate attention.",
    category: 'MISSED_PICKUP',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    submittedAt: '2025-02-10T14:30:00Z',
    updatedAt: '2025-02-11T09:15:00Z',
    location: 'Sector 22, Block B, New Delhi',
    assignedTo: 'John Smith',
    responseMessage: 'Team has been dispatched to your location. Expected completion within 2 hours.'
  },
  {
    id: 3,
    title: "Illegal Dumping Report",
    description: "Construction debris dumped illegally near the park area. This is creating environmental hazards and blocking pedestrian access.",
    category: 'ILLEGAL_DUMPING',
    status: 'PENDING',
    priority: 'URGENT',
    submittedAt: '2025-02-09T16:45:00Z',
    updatedAt: '2025-02-09T16:45:00Z',
    location: 'Green Park Extension, Near Metro Station',
    responseMessage: 'Your complaint has been received and is under review.'
  },
  {
    id: 4,
    title: "Damaged Waste Bin",
    description: "Community waste bin is damaged and overflowing. Needs repair or replacement urgently.",
    category: 'DAMAGED_BINS',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    submittedAt: '2025-02-08T11:20:00Z',
    updatedAt: '2025-02-10T15:45:00Z',
    location: 'Sector 18, Main Market',
    assignedTo: 'Municipal Team C',
    responseMessage: 'Waste bin has been replaced with a new one. Regular maintenance scheduled.'
  },
  {
    id: 5,
    title: "Organic Waste Collection",
    description: "Special request for organic waste collection from residential society. Large quantity of garden waste needs proper disposal.",
    category: 'WASTE_COLLECTION',
    status: 'PENDING',
    priority: 'LOW',
    submittedAt: '2025-02-07T09:00:00Z',
    updatedAt: '2025-02-08T12:30:00Z',
    location: 'Rose Garden Society, Sector 21',
    responseMessage: 'Request acknowledged. Specialized team will be assigned soon.'
  }
];

type FilterStatus = 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export function CitizenGrievances() {
  const router = useRouter();
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const handleRaiseGrievance = () => {
    router.push("/dashboard/grievances/new");
  };

  const handleViewDetails = (grievance: Grievance) => {
    setSelectedGrievance(grievance);
    setIsDetailsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
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

  const filteredGrievances = mockGrievances.filter(
    (grievance) => filter === 'ALL' || grievance.status === filter
  );

  const stats = {
    total: mockGrievances.length,
    pending: mockGrievances.filter(g => g.status === 'PENDING').length,
    inProgress: mockGrievances.filter(g => g.status === 'IN_PROGRESS').length,
    resolved: mockGrievances.filter(g => g.status === 'RESOLVED').length,
  };

  const statusOptions: FilterStatus[] = ['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

  return (
    <div className="min-w-0 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
            My Grievances
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Track and manage your waste management requests
          </p>
        </div>
        <Button onClick={handleRaiseGrievance} className="cursor-pointer flex-shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Raise New</span> Grievance
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg flex-shrink-0">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Pending</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">In Progress</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Resolved</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer flex-shrink-0"
          >
            {status === 'IN_PROGRESS' ? 'IN PROGRESS' : status}
          </Button>
        ))}
      </div>

      {/* Grievances List */}
      <div className="space-y-4">
        {filteredGrievances.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <Trash2 className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
            <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
              No grievances found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              {filter === 'ALL' 
                ? "You haven't raised any grievances yet." 
                : `No ${filter.toLowerCase().replace('_', ' ')} grievances found.`
              }
            </p>
            {filter === 'ALL' && (
              <div className="mt-4 sm:mt-6">
                <Button onClick={handleRaiseGrievance} className="cursor-pointer text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Raise Your First Grievance
                </Button>
              </div>
            )}
          </div>
        ) : (
          filteredGrievances.map((grievance) => (
            <Card key={grievance.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-3 sm:p-4 lg:p-6">
                {/* Mobile Layout */}
                <div className="block lg:hidden">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-1">
                          {grievance.title}
                        </h3>
                        <button
                          onClick={() => setExpandedCard(expandedCard === grievance.id ? null : grievance.id)}
                          className="p-1 hover:bg-gray-100 rounded cursor-pointer flex-shrink-0"
                        >
                          {expandedCard === grievance.id ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 mb-2 flex-wrap">
                        {getStatusIcon(grievance.status)}
                        <Badge className={`${getStatusColor(grievance.status)} text-xs px-1.5 py-0.5`}>
                          {grievance.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={`${getPriorityColor(grievance.priority)} text-xs px-1.5 py-0.5`}>
                          {grievance.priority}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">
                        {grievance.assignedTo ? `Picked up by ${grievance.assignedTo}` : 'Awaiting assignment'}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{formatDate(grievance.submittedAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {expandedCard === grievance.id && (
                    <div className="border-t pt-3 space-y-2">
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{grievance.description}</p>
                      <div className="flex items-start text-xs sm:text-sm text-gray-600">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{grievance.location}</span>
                      </div>
                      <Button 
                        onClick={() => handleViewDetails(grievance)}
                        variant="outline" 
                        size="sm"
                        className="w-full cursor-pointer text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center justify-between min-w-0">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Trash2 className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                        {grievance.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 truncate">
                        {grievance.assignedTo ? `Picked up by ${grievance.assignedTo}` : 'Awaiting assignment'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center min-w-0">
                          <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{formatDate(grievance.submittedAt)}</span>
                        </div>
                        <div className="flex items-center min-w-0">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{grievance.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(grievance.status)}
                      <Badge className={getStatusColor(grievance.status)}>
                        {grievance.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Badge className={getPriorityColor(grievance.priority)}>
                      {grievance.priority}
                    </Badge>
                    <Button 
                      onClick={() => handleViewDetails(grievance)}
                      variant="outline" 
                      size="sm"
                      className="cursor-pointer"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto mx-4 my-4 w-[calc(100vw-2rem)] sm:mx-auto sm:my-8 sm:w-auto sm:max-w-2xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Grievance Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedGrievance && (
            <div className="space-y-4 sm:space-y-6">
              {/* Status and Priority */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {getStatusIcon(selectedGrievance.status)}
                <Badge className={`${getStatusColor(selectedGrievance.status)} text-xs sm:text-sm`}>
                  {selectedGrievance.status.replace('_', ' ')}
                </Badge>
                <Badge className={`${getPriorityColor(selectedGrievance.priority)} text-xs sm:text-sm`}>
                  {selectedGrievance.priority} Priority
                </Badge>
              </div>

              {/* Title and Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedGrievance.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedGrievance.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900">{selectedGrievance.category.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedGrievance.location}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assigned To</label>
                    <p className="text-gray-900">
                      {selectedGrievance.assignedTo || 'Not assigned yet'}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Submitted</label>
                    <p className="text-gray-900">{formatDate(selectedGrievance.submittedAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-gray-900">{formatDate(selectedGrievance.updatedAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Grievance ID</label>
                    <p className="text-gray-900 font-mono">#{selectedGrievance.id.toString().padStart(6, '0')}</p>
                  </div>
                </div>
              </div>

              {/* Response Message */}
              {selectedGrievance.responseMessage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Official Response</h4>
                  <p className="text-blue-800">{selectedGrievance.responseMessage}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  variant="outline"
                  className="cursor-pointer"
                >
                  Close
                </Button>
                {selectedGrievance.status === 'PENDING' && (
                  <Button variant="outline" className="cursor-pointer">
                    Edit Grievance
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}