"use client";

import { useState, useMemo, useEffect } from "react";
import { Complaint, Worker } from "@/types";
import { workerRecommendationService, RecommendedWorker } from "@/services/workerRecommendation.service";

// This would normally come from an API
const dummyComplaints: Complaint[] = [
  {
    id: 1,
    description: "Garbage not collected for 3 days in our street. The bins are overflowing and creating a bad smell.",
    complaintImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    createdAt: "2024-01-15T10:30:00Z",
    citizenId: "citizen_1",
    status: "PENDING",
    rating: 0,
    citizen: {
      id: "citizen_1",
      name: "Rajesh Kumar",
      phoneNumber: "+91-9876543210",
      email: "rajesh.kumar@email.com",
      locality: {
        id: 1,
        name: "MG Road",
        pincode: "560001"
      }
    }
  },
  {
    id: 5,
    description: "Garbage not collected for 3 days in our street. The bins are overflowing and creating a bad smell.",
    complaintImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    createdAt: "2024-01-15T10:30:00Z",
    citizenId: "citizen_1",
    status: "PENDING",
    rating: 0,
    citizen: {
      id: "citizen_1",
      name: "Rajesh Kumar",
      phoneNumber: "+91-9876543210",
      email: "rajesh.kumar@email.com",
      locality: {
        id: 1,
        name: "MG Road",
        pincode: "560001"
      }
    }
  },
  {
    id: 6,
    description: "Garbage not collected for 3 days in our street. The bins are overflowing and creating a bad smell.",
    complaintImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",    
    createdAt: "2024-01-15T10:30:00Z",
    citizenId: "citizen_1",
    status: "PENDING",
    rating: 0,
    citizen: {
      id: "citizen_1",
      name: "Rajesh Kumar",
      phoneNumber: "+91-9876543210",
      email: "rajesh.kumar@email.com",
      locality: {
        id: 1,
        name: "MG Road",
        pincode: "560001"
      }
    }
  },
  {
    id: 2,
    description: "Street sweeping not done properly. Leaves and debris scattered everywhere after yesterday's rain.",
    complaintImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
    createdAt: "2024-01-14T14:20:00Z",
    citizenId: "citizen_2",
    status: "IN_PROGRESS",
    workerId: "worker_1",
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
        pincode: "560025"
      }
    },
    worker: {
      id: "worker_1",
      name: "Suresh Babu",
      phoneNumber: "+91-9876543212",
      workerType: "SWEEPER"
    }
  },
  {
    id: 3,
    description: "Illegal dumping of construction waste near the park. This needs immediate attention.",
    complaintImage: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400",
    createdAt: "2024-01-13T09:15:00Z",
    citizenId: "citizen_3",
    status: "RESOLVED",
    workerId: "worker_2",
    localityAdminId: "admin_1",
    rating: 4.5,
    reviewText: "Great work! The area is clean now.",
    workDoneImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
    citizen: {
      id: "citizen_3",
      name: "Amit Patel",
      phoneNumber: "+91-9876543213",
      email: "amit.patel@email.com",
      locality: {
        id: 2,
        name: "Koramangala",
        pincode: "560034"
      }
    },
    worker: {
      id: "worker_2",
      name: "Lakshmi Devi",
      phoneNumber: "+91-9876543214",
      workerType: "WASTE_COLLECTOR"
    }
  }
];

const dummyWorkers: Worker[] = [
  {
    id: "worker_1",
    name: "Suresh Babu",
    phoneNumber: "+91-9876543212",
    email: "suresh.babu@email.com",
    workerType: "SWEEPER",
    assignedTasks: 5,
    completedTasks: 23,
    avgDifficulty: 3.2,
    localityRating: 4.1,
    citizenRating: 4.3,
    locality: {
      id: 1,
      name: "Brigade Road",
      pincode: "560025"
    }
  },
  {
    id: "worker_2",
    name: "Lakshmi Devi",
    phoneNumber: "+91-9876543214",
    email: "lakshmi.devi@email.com",
    workerType: "WASTE_COLLECTOR",
    assignedTasks: 3,
    completedTasks: 18,
    avgDifficulty: 4.1,
    localityRating: 4.8,
    citizenRating: 4.6,
    locality: {
      id: 2,
      name: "Koramangala",
      pincode: "560034"
    }
  },
  {
    id: "worker_3",
    name: "Ravi Kumar",
    phoneNumber: "+91-9876543215",
    email: "ravi.kumar@email.com",
    workerType: "SWEEPER",
    assignedTasks: 2,
    completedTasks: 31,
    avgDifficulty: 2.8,
    localityRating: 4.5,
    citizenRating: 4.9,
    locality: {
      id: 1,
      name: "MG Road",
      pincode: "560001"
    }
  },
  {
    id: "worker_4",
    name: "Manjula Reddy",
    phoneNumber: "+91-9876543216",
    email: "manjula.reddy@email.com",
    workerType: "WASTE_COLLECTOR",
    assignedTasks: 7,
    completedTasks: 15,
    avgDifficulty: 3.5,
    localityRating: 3.8,
    citizenRating: 4.2,
    locality: {
      id: 3,
      name: "Indiranagar",
      pincode: "560038"
    }
  },
  {
    id: "worker_5",
    name: "Ganesh Murthy",
    phoneNumber: "+91-9876543217",
    email: "ganesh.murthy@email.com",
    workerType: "SWEEPER",
    assignedTasks: 4,
    completedTasks: 27,
    avgDifficulty: 3.7,
    localityRating: 4.3,
    citizenRating: 4.1,
    locality: {
      id: 2,
      name: "Koramangala",
      pincode: "560034"
    }
  },
  {
    id: "worker_6",
    name: "Kavitha Nair",
    phoneNumber: "+91-9876543218",
    email: "kavitha.nair@email.com",
    workerType: "WASTE_COLLECTOR",
    assignedTasks: 1,
    completedTasks: 42,
    avgDifficulty: 4.2,
    localityRating: 4.7,
    citizenRating: 4.8,
    locality: {
      id: 1,
      name: "Brigade Road",
      pincode: "560025"
    }
  },
  {
    id: "worker_7",
    name: "Ramesh Gowda",
    phoneNumber: "+91-9876543219",
    email: "ramesh.gowda@email.com",
    workerType: "SWEEPER",
    assignedTasks: 6,
    completedTasks: 12,
    avgDifficulty: 2.9,
    localityRating: 3.9,
    citizenRating: 3.8,
    locality: {
      id: 4,
      name: "Whitefield",
      pincode: "560066"
    }
  },
  {
    id: "worker_8",
    name: "Sunitha Rao",
    phoneNumber: "+91-9876543220",
    email: "sunitha.rao@email.com",
    workerType: "WASTE_COLLECTOR",
    assignedTasks: 8,
    completedTasks: 9,
    avgDifficulty: 3.1,
    localityRating: 3.5,
    citizenRating: 3.7,
    locality: {
      id: 3,
      name: "Indiranagar",
      pincode: "560038"
    }
  }
];

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>(dummyComplaints);
  const [recommendedWorkers, setRecommendedWorkers] = useState<RecommendedWorker[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const assignWorker = async (complaintId: number, workerId: string) => {
    const worker = dummyWorkers.find(w => w.id === workerId);
    if (!worker) return;

    try {
      // Find the complaint to calculate task difficulty
      const complaint = complaints.find(c => c.id === complaintId);
      const taskDifficulty = complaint 
        ? workerRecommendationService.calculateTaskDifficulty(complaint.description)
        : 5;

      // Update backend with task assignment
      await workerRecommendationService.assignTaskToWorker({
        workerId,
        complaintId,
        taskDifficulty
      });

      // Update local state
      setComplaints(prev => prev.map(complaint => 
        complaint.id === complaintId 
          ? {
              ...complaint,
              workerId,
              worker: {
                id: worker.id,
                name: worker.name,
                phoneNumber: worker.phoneNumber,
                workerType: worker.workerType
              },
              status: "IN_PROGRESS" as const,
              localityAdminId: "admin_1"
            }
          : complaint
      ));

      // Refresh recommendations after assignment
      await fetchRecommendedWorkers();
      
    } catch (error) {
      console.error('Failed to assign worker:', error);
      // Still update local state for demo purposes
      setComplaints(prev => prev.map(complaint => 
        complaint.id === complaintId 
          ? {
              ...complaint,
              workerId,
              worker: {
                id: worker.id,
                name: worker.name,
                phoneNumber: worker.phoneNumber,
                workerType: worker.workerType
              },
              status: "IN_PROGRESS" as const,
              localityAdminId: "admin_1"
            }
          : complaint
      ));
    }
  };

  const deleteComplaint = (complaintId: number) => {
    setComplaints(prev => prev.filter(complaint => complaint.id !== complaintId));
  };

  // Fetch recommended workers from API
  const fetchRecommendedWorkers = async (complaint?: Complaint | null, options?: {
    locality?: string;
    workerType?: 'SWEEPER' | 'WASTE_COLLECTOR';
    limit?: number;
  }) => {
    setIsLoadingRecommendations(true);
    try {
      // Extract parameters from complaint if provided
      let locality = options?.locality;
      let workerType = options?.workerType;
      
      if (complaint && !locality) {
        locality = complaint.citizen?.locality?.name;
      }
      
      if (complaint && !workerType) {
        // Simple heuristic to determine worker type from complaint description
        const description = complaint.description.toLowerCase();
        if (description.includes('sweep') || description.includes('leaves') || description.includes('street')) {
          workerType = 'SWEEPER';
        } else if (description.includes('garbage') || description.includes('waste') || description.includes('bin')) {
          workerType = 'WASTE_COLLECTOR';
        }
      }

      const workers = await workerRecommendationService.getRecommendedWorkers({
        locality,
        workerType,
        limit: options?.limit || 15,
        format: 'json'
      });
      setRecommendedWorkers(workers);
    } catch (error) {
      console.error('Failed to fetch recommended workers:', error);
      // Fallback to local scoring algorithm
      setRecommendedWorkers(getLocalRecommendedWorkers());
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Fallback local scoring algorithm
  const getLocalRecommendedWorkers = () => {
    const scoredWorkers = dummyWorkers.map(worker => {
      let score = 0;
      
      // Base score from citizen rating (0-5 scale, weight: 30%)
      score += (worker.citizenRating / 5) * 30;
      
      // Locality rating (0-5 scale, weight: 25%)
      score += (worker.localityRating / 5) * 25;
      
      // Workload factor - prefer workers with fewer assigned tasks (weight: 20%)
      const maxTasks = Math.max(...dummyWorkers.map(w => w.assignedTasks));
      const workloadScore = maxTasks > 0 ? (1 - (worker.assignedTasks / maxTasks)) : 1;
      score += workloadScore * 20;
      
      // Experience factor - completed tasks (weight: 15%)
      const maxCompleted = Math.max(...dummyWorkers.map(w => w.completedTasks));
      const experienceScore = maxCompleted > 0 ? (worker.completedTasks / maxCompleted) : 0;
      score += experienceScore * 15;
      
      // Difficulty handling (weight: 10%)
      const difficultyScore = (worker.avgDifficulty / 5);
      score += difficultyScore * 10;

      return {
        ...worker,
        predictedScore: Math.round(score * 10) / 10 // Round to 1 decimal place
      };
    });

    return scoredWorkers.sort((a, b) => b.predictedScore - a.predictedScore);
  };

  // Generate recommended workers with predicted scores
  const getRecommendedWorkers = (complaint: Complaint | null):RecommendedWorker[] => {
    if (!complaint) return [];

    // If we have API recommendations, use them
    if (recommendedWorkers.length > 0) {
      return recommendedWorkers.filter(worker => {
        // Filter by locality if complaint has locality info
        if (complaint.citizen?.locality?.name) {
          const complaintLocality = complaint.citizen.locality.name.toLowerCase();
          const workerLocality = typeof worker.locality === 'string' 
            ? worker.locality.toLowerCase() 
            : worker.locality?.name?.toLowerCase() || '';
          
          // Prefer workers from same locality, but don't exclude others completely
          return workerLocality.includes(complaintLocality) || 
                 complaintLocality.includes(workerLocality) ||
                 worker.predictedScore > 7; // Include high-scoring workers regardless of locality
        }
        return true;
      }).slice(0, 10); // Limit to top 10
    }

    // Fallback to local algorithm
    return getLocalRecommendedWorkers();
  };

  // Load recommendations on component mount
  useEffect(() => {
    fetchRecommendedWorkers();
  }, []);

  return {
    allComplaints: complaints,
    workers: dummyWorkers,
    assignWorker,
    deleteComplaint,
    getRecommendedWorkers,
    fetchRecommendedWorkers,
    isLoadingRecommendations
  };
}