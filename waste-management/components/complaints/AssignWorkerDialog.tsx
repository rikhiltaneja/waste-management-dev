"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Complaint, Worker } from "@/types";
import { RecommendedWorker, workerRecommendationService } from "@/services/workerRecommendation.service";
import { Loader2, RefreshCw } from "lucide-react";

interface AssignWorkerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  workers: Worker[];
  recommendedWorkers?: RecommendedWorker[];
  onAssign: (complaintId: number, workerId: string) => void;
  onRefreshRecommendations?: () => void;
  isLoadingRecommendations?: boolean;
}

export function AssignWorkerDialog({ 
  isOpen, 
  onClose, 
  complaint, 
  workers, 
  recommendedWorkers = [],
  onAssign,
  onRefreshRecommendations,
  isLoadingRecommendations = false
}: AssignWorkerDialogProps) {
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [showAllWorkers, setShowAllWorkers] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [internalRecommendedWorkers, setInternalRecommendedWorkers] = useState<RecommendedWorker[]>([]);
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedWorker("");
      setShowAllWorkers(false);
      setInternalRecommendedWorkers([]);
    }
  }, [isOpen]);

  // Fetch recommendations when dialog opens or complaint changes
  useEffect(() => {
    if (isOpen && complaint && (recommendedWorkers.length === 0 || internalRecommendedWorkers.length === 0)) {
      fetchRecommendations();
    }
  }, [isOpen, complaint?.id]); // Use complaint.id to avoid unnecessary re-renders

  const fetchRecommendations = async () => {
    if (!complaint) return;
    
    setInternalIsLoading(true);
    try {
      // Extract locality from complaint if available
      const locality = complaint.citizen?.locality?.name;
      
      // Determine worker type based on complaint description (simple heuristic)
      const description = complaint.description.toLowerCase();
      let workerType: 'SWEEPER' | 'WASTE_COLLECTOR' | undefined;
      
      if (description.includes('sweep') || description.includes('leaves') || description.includes('street')) {
        workerType = 'SWEEPER';
      } else if (description.includes('garbage') || description.includes('waste') || description.includes('bin')) {
        workerType = 'WASTE_COLLECTOR';
      }
      
      const recommendations = await workerRecommendationService.getRecommendedWorkers({
        locality,
        workerType,
        limit: 10,
        format: 'json'
      });
      
      setInternalRecommendedWorkers(recommendations);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      // Fallback to showing regular workers
      setInternalRecommendedWorkers([]);
    } finally {
      setInternalIsLoading(false);
    }
  };

  const handleRefreshRecommendations = () => {
    if (onRefreshRecommendations) {
      onRefreshRecommendations();
    } else {
      fetchRecommendations();
    }
  };

  // Helper function to get worker initials
  const getWorkerInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to generate avatar URL (using a placeholder service)
  const getAvatarUrl = (workerId: string) => {
    // Using DiceBear API for consistent avatars based on worker ID
    return `https://api.dicebear.com/7.x/initials/svg?seed=${workerId}&backgroundColor=3b82f6,8b5cf6,06b6d4,10b981,f59e0b,ef4444&textColor=ffffff`;
  };

  const handleAssign = async () => {
    if (!complaint || !selectedWorker) return;
    
    setIsAssigning(true);
    try {
      // Calculate task difficulty based on complaint description
      const taskDifficulty = workerRecommendationService.calculateTaskDifficulty(
        complaint.description,
        'general'
      );
      
      // Call the backend to update worker task count
      await workerRecommendationService.assignTaskToWorker({
        workerId: selectedWorker,
        complaintId: complaint.id,
        taskDifficulty
      });
      
      // Call the parent's onAssign function
      await onAssign(complaint.id, selectedWorker);
      
      setSelectedWorker("");
      onClose();
    } catch (error) {
      console.error('Failed to assign worker:', error);
      // Handle error (could show toast notification)
    } finally {
      setIsAssigning(false);
    }
  };

  // Use either passed recommendations or internal ones
  const activeRecommendedWorkers = recommendedWorkers.length > 0 ? recommendedWorkers : internalRecommendedWorkers;
  const activeIsLoading = isLoadingRecommendations || internalIsLoading;

  // Get top 6 recommended workers or fallback to first 6 workers
  const topRecommended = activeRecommendedWorkers.length > 0 
    ? activeRecommendedWorkers.slice(0, 6)
    : workers.slice(0, 6).map(worker => ({ ...worker, predictedScore: 0 }));

  // Get remaining workers for dropdown
  const remainingWorkers = activeRecommendedWorkers.length > 0
    ? workers.filter(w => !activeRecommendedWorkers.slice(0, 6).some(rw => rw.id === w.id))
    : workers.slice(6);

  const selectedWorkerData = workers.find(w => w.id === selectedWorker);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Assign Worker to Complaint #{complaint?.id}
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshRecommendations}
              disabled={activeIsLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${activeIsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Top Recommended Workers Grid */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">Recommended Workers</h3>
              {activeIsLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              )}
            </div>
            
            {activeIsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between">
                              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {topRecommended.map((worker) => (
                <Card 
                  key={worker.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedWorker === worker.id ? 'ring-2 ring-ring' : ''
                  }`}
                  onClick={() => setSelectedWorker(worker.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={getAvatarUrl(worker.id)} 
                            alt={worker.name}
                          />
                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                            {getWorkerInitials(worker.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{worker.name}</h4>
                          <p className="text-xs text-gray-500">{worker.workerType.replace('_', ' ')}</p>
                        </div>
                        {worker.predictedScore > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {worker.predictedScore.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Current Tasks:</span>
                          <span className="font-medium">{worker.assignedTasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Difficulty:</span>
                          <span className="font-medium">{worker.avgDifficulty.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Locality Rating:</span>
                          <span className="font-medium">{worker.localityRating.toFixed(1)}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Citizen Rating:</span>
                          <span className="font-medium">{worker.citizenRating.toFixed(1)}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-medium truncate ml-1">
                            {typeof worker.locality === 'string' ? worker.locality : worker.locality?.name || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Other Workers Dropdown */}
          {/* {remainingWorkers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Other Available Workers</h3>
              <Select 
                value={showAllWorkers && remainingWorkers.some(w => w.id === selectedWorker) ? selectedWorker : ""} 
                onValueChange={(value) => {
                  setSelectedWorker(value);
                  setShowAllWorkers(true);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select from other workers..." />
                </SelectTrigger>
                <SelectContent>
                  {remainingWorkers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      <div className="flex items-center gap-3 w-full">
                        <Avatar className="h-6 w-6">
                          <AvatarImage 
                            src={getAvatarUrl(worker.id)} 
                            alt={worker.name}
                          />
                          <AvatarFallback className="bg-gray-500 text-white text-xs">
                            {getWorkerInitials(worker.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center justify-between flex-1">
                          <span>{worker.name} - {worker.workerType.replace('_', ' ')}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            Tasks: {worker.assignedTasks} | Rating: {worker.citizenRating.toFixed(1)}/5
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )} */}

          {/* Selected Worker Details */}
          {selectedWorkerData && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={getAvatarUrl(selectedWorkerData.id)} 
                    alt={selectedWorkerData.name}
                  />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {getWorkerInitials(selectedWorkerData.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedWorkerData.name}</h4>
                  <p className="text-sm text-gray-600">{selectedWorkerData.workerType.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Tasks:</span>
                    <span className="font-medium">{selectedWorkerData.assignedTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed Tasks:</span>
                    <span className="font-medium">{selectedWorkerData.completedTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Difficulty:</span>
                    <span className="font-medium">{selectedWorkerData.avgDifficulty.toFixed(1)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Locality Rating:</span>
                    <span className="font-medium">{selectedWorkerData.localityRating.toFixed(1)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Citizen Rating:</span>
                    <span className="font-medium">{selectedWorkerData.citizenRating.toFixed(1)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">
                      {typeof selectedWorkerData.locality === 'string' ? selectedWorkerData.locality : selectedWorkerData.locality?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button 
            onClick={handleAssign}
            disabled={!selectedWorker || isAssigning || activeIsLoading}
            className="flex-1"
          >
            {isAssigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign Worker'
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isAssigning}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}