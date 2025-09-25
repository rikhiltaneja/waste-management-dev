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
      const response = await fetch(`${this.API_BASE_URL}/workers-prediction/leaderboard`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      return this.parseCSVToWorkerData(csvText);
    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
      throw error;
    }
  }

  private static parseCSVToWorkerData(csvText: string): WorkerData[] {
    const lines = csvText.trim().split('\n');
    
    if (lines.length < 2) {
      throw new Error('Invalid CSV format: insufficient data');
    }
    
    const headers = lines[0].split(',');
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',');
      
      if (values.length < 8) {
        console.warn(`Skipping incomplete row ${index + 1}: ${line}`);
        return null;
      }
      
      const worker: WorkerData = {
        worker_id: parseInt(values[0]) || 0,
        tasks_assigned: parseInt(values[1]) || 0,
        tasks_completed: parseInt(values[2]) || 0,
        completion_ratio: parseFloat(values[3]) || 0,
        avg_difficulty: parseInt(values[4]) || 0,
        locality_rating: parseInt(values[5]) || 0,
        citizen_rating: parseInt(values[6]) || 0,
        predicted_score: parseFloat(values[7]) || 0,
        worker_name: this.generateWorkerName(parseInt(values[0]) || 0)
      };
      return worker;
    }).filter((worker): worker is WorkerData => worker !== null);
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