"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Star, 
  MapPin, 
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  ArrowUpDown,
  Crown,
  Medal,
  Award,
  Phone,
  Mail,
  Calendar,
  Clock,
  Dumbbell,
  Rocket,
  Eye
} from "lucide-react";

// Mock data based on the CSV structure
const mockWorkerData = [
  { worker_id: 44, worker_name: "Alex Johnson", tasks_assigned: 5, tasks_completed: 5, completion_ratio: 1.0, avg_difficulty: 5, locality_rating: 4, citizen_rating: 2, predicted_score: 0.88 },
  { worker_id: 128, worker_name: "Sarah Chen", tasks_assigned: 16, tasks_completed: 12, completion_ratio: 0.75, avg_difficulty: 5, locality_rating: 5, citizen_rating: 5, predicted_score: 0.86 },
  { worker_id: 85, worker_name: "Mike Rodriguez", tasks_assigned: 5, tasks_completed: 4, completion_ratio: 0.8, avg_difficulty: 5, locality_rating: 5, citizen_rating: 3, predicted_score: 0.82 },
  { worker_id: 112, worker_name: "Emma Wilson", tasks_assigned: 19, tasks_completed: 15, completion_ratio: 0.79, avg_difficulty: 5, locality_rating: 5, citizen_rating: 3, predicted_score: 0.82 },
  { worker_id: 79, worker_name: "David Kim", tasks_assigned: 16, tasks_completed: 11, completion_ratio: 0.69, avg_difficulty: 5, locality_rating: 4, citizen_rating: 5, predicted_score: 0.82 },
  { worker_id: 13, worker_name: "Lisa Thompson", tasks_assigned: 18, tasks_completed: 16, completion_ratio: 0.89, avg_difficulty: 4, locality_rating: 2, citizen_rating: 4, predicted_score: 0.81 },
  { worker_id: 124, worker_name: "James Brown", tasks_assigned: 17, tasks_completed: 17, completion_ratio: 1.0, avg_difficulty: 4, locality_rating: 2, citizen_rating: 4, predicted_score: 0.81 },
  { worker_id: 16, worker_name: "Anna Garcia", tasks_assigned: 14, tasks_completed: 13, completion_ratio: 0.93, avg_difficulty: 4, locality_rating: 4, citizen_rating: 1, predicted_score: 0.81 },
];

type SortField = 'predicted_score' | 'completion_ratio' | 'tasks_completed' | 'citizen_rating' | 'locality_rating' | 'avg_difficulty';
type SortOrder = 'asc' | 'desc';

export default function LeaderBoard() {
  const [sortField, setSortField] = useState<SortField>('predicted_score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<typeof mockWorkerData[0] | null>(null);

  const sortedAndFilteredData = useMemo(() => {
    let filtered = mockWorkerData.filter(worker => 
      worker.worker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.worker_id.toString().includes(searchTerm)
    );

    return filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [sortField, sortOrder, searchTerm]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 0.8) return { variant: "default" as const, label: "Excellent", color: "bg-green-100 text-green-800" };
    if (score >= 0.6) return { variant: "secondary" as const, label: "Good", color: "bg-blue-100 text-blue-800" };
    if (score >= 0.4) return { variant: "outline" as const, label: "Average", color: "bg-yellow-100 text-yellow-800" };
    return { variant: "destructive" as const, label: "Needs Improvement", color: "bg-red-100 text-red-800" };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-semibold text-gray-500">#{index + 1}</span>;
  };

  const topPerformers = sortedAndFilteredData.slice(0, 3);
  const avgCompletionRate = (sortedAndFilteredData.reduce((sum, worker) => sum + worker.completion_ratio, 0) / sortedAndFilteredData.length * 100).toFixed(1);
  const totalActiveTasks = sortedAndFilteredData.reduce((sum, worker) => sum + (worker.tasks_assigned - worker.tasks_completed), 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="bg-[#1B1B25] rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold mb-2">Worker Leaderboard</h1>
            <p className="text-sm opacity-80">Monitor performance and assign tasks efficiently</p>
          </div>
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm opacity-80">Active Workers</p>
                <p className="text-xl font-semibold">{sortedAndFilteredData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm opacity-80">Avg Completion Rate</p>
                <p className="text-xl font-semibold">{avgCompletionRate}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-sm opacity-80">Pending Tasks</p>
                <p className="text-xl font-semibold">{totalActiveTasks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top Performers
            </CardTitle>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="predicted_score">Performance Score</SelectItem>
                  <SelectItem value="completion_ratio">Success Rate</SelectItem>
                  <SelectItem value="tasks_completed">Tasks Completed</SelectItem>
                  <SelectItem value="avg_difficulty">Average Difficulty</SelectItem>
                  <SelectItem value="citizen_rating">Citizen Rating</SelectItem>
                  <SelectItem value="locality_rating">Locality Rating</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-1"
              >
                <ArrowUpDown className="w-4 h-4" />
                {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformers.map((worker, index) => (
              <div key={worker.worker_id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border">
                <div className="flex items-center justify-between mb-3">
                  {getRankIcon(index)}
                  <Badge className={getPerformanceBadge(worker.predicted_score).color}>
                    {(worker.predicted_score * 100).toFixed(0)}%
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-1">{worker.worker_name}</h3>
                <p className="text-sm text-gray-600 mb-3">ID: {worker.worker_id}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed:</span>
                    <span className="font-medium">{worker.tasks_completed}/{worker.tasks_assigned}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Success Rate:</span>
                    <span className="font-medium">{(worker.completion_ratio * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    
      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <div className="flex w-full items-center justify-between">
          <CardTitle>Complete Leaderboard</CardTitle>
          <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="w-72 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
                </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Rank</th>
                  <th className="text-left p-4 font-medium text-gray-700">Worker</th>
                  <th className="text-left p-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('tasks_completed')}>
                    <div className="flex items-center gap-1">
                      Tasks <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('completion_ratio')}>
                    <div className="flex items-center gap-1">
                      Success Rate <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('avg_difficulty')}>
                    <div className="flex items-center gap-1">
                      Avg. Difficulty <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('citizen_rating')}>
                    <div className="flex items-center gap-1">
                      Citizen Rating <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('locality_rating')}>
                    <div className="flex items-center gap-1">
                      Locality <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('predicted_score')}>
                    <div className="flex items-center gap-1">
                      Performance <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAndFilteredData.map((worker, index) => (
                  <tr key={worker.worker_id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{worker.worker_name}</div>
                        <div className="text-sm text-gray-500">ID: {worker.worker_id}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{worker.tasks_completed}/{worker.tasks_assigned}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${worker.completion_ratio * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{(worker.completion_ratio * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Rocket className="w-4 h-4 text-red-500" />
                        <span>{worker.avg_difficulty}/5</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{worker.citizen_rating}/5</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>{worker.locality_rating}/5</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getPerformanceBadge(worker.predicted_score).color}>
                        {(worker.predicted_score * 100).toFixed(0)}%
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => setSelectedWorker(worker)}>
                            <Eye />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Worker Profile</DialogTitle>
                            </DialogHeader>
                            {selectedWorker && (
                              <div className="space-y-6">
                                {/* Profile Header */}
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src="/profile-avatar.jpg" alt={selectedWorker.worker_name} />
                                    <AvatarFallback className="text-lg font-semibold bg-blue-500 text-white">
                                      {getInitials(selectedWorker.worker_name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <h3 className="text-xl font-semibold">{selectedWorker.worker_name}</h3>
                                    <p className="text-gray-600">Worker ID: {selectedWorker.worker_id}</p>
                                    <Badge className={getPerformanceBadge(selectedWorker.predicted_score).color}>
                                      {getPerformanceBadge(selectedWorker.predicted_score).label}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Contact Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Card>
                                    <CardContent className="p-4">
                                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Contact Information
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                          <Mail className="w-4 h-4 text-gray-500" />
                                          <span>{selectedWorker.worker_name.toLowerCase().replace(' ', '.')}@wastemanagement.com</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Phone className="w-4 h-4 text-gray-500" />
                                          <span>+1 (555) {String(selectedWorker.worker_id).padStart(3, '0')}-{String(selectedWorker.worker_id * 7).slice(-4)}</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardContent className="p-4">
                                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Work Schedule
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                          <Clock className="w-4 h-4 text-gray-500" />
                                          <span>Monday - Friday</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Clock className="w-4 h-4 text-gray-500" />
                                          <span>8:00 AM - 5:00 PM</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Performance Metrics */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{selectedWorker.tasks_completed}</div>
                                        <div className="text-sm text-gray-600">Tasks Completed</div>
                                      </div>
                                      <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{(selectedWorker.completion_ratio * 100).toFixed(0)}%</div>
                                        <div className="text-sm text-gray-600">Success Rate</div>
                                      </div>
                                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                                          {selectedWorker.citizen_rating}
                                          <Star className="w-4 h-4" />
                                        </div>
                                        <div className="text-sm text-gray-600">Citizen Rating</div>
                                      </div>
                                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
                                          {selectedWorker.locality_rating}
                                          <MapPin className="w-4 h-4" />
                                        </div>
                                        <div className="text-sm text-gray-600">Locality Rating</div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Task History */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Task Summary</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center">
                                        <span>Total Tasks Assigned:</span>
                                        <span className="font-semibold">{selectedWorker.tasks_assigned}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span>Tasks Completed:</span>
                                        <span className="font-semibold text-green-600">{selectedWorker.tasks_completed}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span>Pending Tasks:</span>
                                        <span className="font-semibold text-orange-600">{selectedWorker.tasks_assigned - selectedWorker.tasks_completed}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span>Average Task Difficulty:</span>
                                        <span className="font-semibold">{selectedWorker.avg_difficulty}/5</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span>Predicted Performance Score:</span>
                                        <Badge className={getPerformanceBadge(selectedWorker.predicted_score).color}>
                                          {(selectedWorker.predicted_score * 100).toFixed(0)}%
                                        </Badge>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}