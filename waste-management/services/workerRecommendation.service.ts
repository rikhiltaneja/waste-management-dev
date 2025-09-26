interface RecommendedWorker {
  id: string;
  name: string;
  workerType: string;
  assignedTasks: number;
  completedTasks: number;
  avgDifficulty: number;
  localityRating: number;
  citizenRating: number;
  locality:
    | string
    | {
        id: number;
        name: string;
        pincode: string;
      };
  predictedScore: number;
  email?: string;
  phoneNumber?: string;
}

interface AssignTaskRequest {
  workerId: string;
  complaintId: number;
  taskDifficulty?: number;
}

interface AssignTaskResponse {
  success: boolean;
  message: string;
  workerId: string;
  complaintId: number;
  newTaskCount: number;
}

class WorkerRecommendationService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  async getRecommendedWorkers(options?: {
    locality?: string;
    workerType?: "SWEEPER" | "WASTE_COLLECTOR";
    limit?: number;
    format?: "csv" | "json";
  }): Promise<RecommendedWorker[]> {
    try {
      const params = new URLSearchParams();
      if (options?.locality) params.append("locality", options.locality);
      if (options?.workerType) params.append("workerType", options.workerType);
      if (options?.limit) params.append("limit", options.limit.toString());
      // Always request JSON from API
      const url = `${this.baseUrl}/workers-prediction/recommend`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch recommended workers: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching recommended workers:", error);
      throw error;
    }
  }

  async assignTaskToWorker(
    request: AssignTaskRequest
  ): Promise<AssignTaskResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/workers-prediction/assign-task`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to assign task: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error assigning task to worker:", error);
      throw error;
    }
  }

  // private parseCsvToWorkers(csvData: string): RecommendedWorker[] {
  //   const lines = csvData.trim().split("\n");
  //   if (lines.length < 2) return [];

  //   const headers = lines[0].split(",").map((h) => h.trim());

  //   return lines.slice(1).map((line) => {
  //     const values = line.split(",").map((v) => v.trim());
  //     const worker: any = {};

  //     headers.forEach((header, index) => {
  //       const value = values[index] || "";

  //       // Map backend field names to frontend field names
  //       const fieldMapping: Record<string, string> = {
  //         worker_id: "id",
  //         assigned_tasks: "assignedTasks",
  //         completed_tasks: "completedTasks",
  //         avg_difficulty: "avgDifficulty",
  //         locality_rating: "localityRating",
  //         citizen_rating: "citizenRating",
  //         predicted_score: "predictedScore",
  //         worker_type: "workerType",
  //       };

  //       const mappedField = fieldMapping[header] || header;

  //       // Convert numeric fields
  //       if (["assignedTasks", "completedTasks"].includes(mappedField)) {
  //         worker[mappedField] = parseInt(value) || 0;
  //       } else if (
  //         [
  //           "avgDifficulty",
  //           "localityRating",
  //           "citizenRating",
  //           "predictedScore",
  //         ].includes(mappedField)
  //       ) {
  //         worker[mappedField] = parseFloat(value) || 0;
  //       } else {
  //         worker[mappedField] = value;
  //       }
  //     });

  //     // Ensure required fields are set with defaults
  //     worker.id = worker.id || '';
  //     worker.name = worker.name || `Worker ${worker.id}`;
  //     worker.workerType = worker.workerType || worker.worker_type || "SWEEPER";
  //     worker.assignedTasks = worker.assignedTasks || 0;
  //     worker.completedTasks = worker.completedTasks || 0;
  //     worker.avgDifficulty = worker.avgDifficulty || 0;
  //     worker.localityRating = worker.localityRating || 0;
  //     worker.citizenRating = worker.citizenRating || 0;
  //     worker.predictedScore = worker.predictedScore || 0;
  //     worker.locality = worker.locality || "Unknown";

  //     return worker as RecommendedWorker;
  //   });
  // }

  // Helper method to calculate task difficulty based on complaint type/description
  
  calculateTaskDifficulty(
    complaintDescription: string,
    complaintType?: string
  ): number {
    const description = complaintDescription.toLowerCase();

    // Simple heuristic based on keywords
    if (
      description.includes("illegal dumping") ||
      description.includes("construction waste")
    ) {
      return 8; // High difficulty
    } else if (
      description.includes("overflowing") ||
      description.includes("not collected")
    ) {
      return 6; // Medium-high difficulty
    } else if (
      description.includes("sweeping") ||
      description.includes("leaves")
    ) {
      return 4; // Medium difficulty
    } else {
      return 5; // Default medium difficulty
    }
  }
}

export const workerRecommendationService = new WorkerRecommendationService();
export type { RecommendedWorker, AssignTaskRequest, AssignTaskResponse };
