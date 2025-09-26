export interface WorkerData {
  worker_id: number;
  worker_name?: string;
  tasks_assigned: number;
  tasks_completed: number;
  completion_ratio: number;
  avg_difficulty: number;
  locality_rating: number;
  citizen_rating: number;
  predicted_score: number;
}

export class LeaderboardService {
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  static async fetchLeaderboardData(): Promise<WorkerData[]> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI}/leaderboard`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      // Optionally add worker_name if needed
      return data.map((worker: WorkerData) => ({
        ...worker,
        worker_name: this.generateWorkerName(worker.worker_id)
      }));
    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
      throw error;
    }
  }

  private static generateWorkerName(workerId: number): string {
    const firstNames = [
      'Alex', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'James', 'Anna',
      'John', 'Maria', 'Chris', 'Jessica', 'Robert', 'Ashley', 'Michael',
      'Jennifer', 'William', 'Amanda', 'Daniel', 'Stephanie', 'Matthew',
      'Nicole', 'Anthony', 'Elizabeth', 'Mark', 'Helen', 'Steven', 'Michelle'
    ];
    
    const lastNames = [
      'Johnson', 'Chen', 'Rodriguez', 'Wilson', 'Kim', 'Thompson', 'Brown',
      'Garcia', 'Miller', 'Davis', 'Martinez', 'Anderson', 'Taylor', 'Thomas',
      'Jackson', 'White', 'Harris', 'Martin', 'Clark', 'Lewis', 'Robinson',
      'Walker', 'Perez', 'Hall', 'Young', 'Allen', 'Sanchez', 'Wright'
    ];

    const firstIndex = workerId % firstNames.length;
    const lastIndex = Math.floor(workerId / firstNames.length) % lastNames.length;
    
    return `${firstNames[firstIndex]} ${lastNames[lastIndex]}`;
  }
}