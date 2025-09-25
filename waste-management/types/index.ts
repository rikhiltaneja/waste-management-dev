interface PhysicalTrainingEvent {
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
}