export interface PhysicalTrainingEvent {
  id: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime?: string;
  location: string;
  maxCapacity?: number;
  targetAudience: string[];
  status: "ACTIVE" | "CANCELLED" | "COMPLETED" | "DRAFT";
  createdAt: string;
  registrations: number;
  locality?: {
    name: string;
  };
  localityId?: number;
}

export interface Complaint {
  id: number;
  description: string;
  complaintImage?: string;
  createdAt: string;
  citizenId: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
  workerId?: string;
  reviewText?: string;
  rating: number;
  workDoneImage?: string;
  localityAdminId?: string;
  citizen: {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    locality: {
      id: number;
      name: string;
      pincode: string;
    };
  };
  worker?: {
    id: string;
    name: string;
    phoneNumber: string;
    workerType: "WASTE_COLLECTOR" | "SWEEPER";
  };
  localityAdmin?: {
    id: string;
    name: string;
  };
}

export interface Worker {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  workerType: "WASTE_COLLECTOR" | "SWEEPER";
  assignedTasks: number;
  completedTasks: number;
  avgDifficulty: number;
  localityRating: number;
  citizenRating: number;
  locality: {
    id: number;
    name: string;
    pincode: string;
  };
}