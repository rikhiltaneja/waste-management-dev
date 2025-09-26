"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/store/profile.store";
import { 
  User, 
  Star, 
  FileText, 
  ChevronRight,
  Settings as SettingsIcon,
  BarChart3,
  Clock,
  MapPin,
  Award,
  Calendar,
  Truck,
  CheckCircle
} from "lucide-react";

interface WorkerStats {
  completedTasks: number;
  assignedTasks: number;
  rating: number;
  totalRatings: number;
  hoursWorked: number;
  efficiency: number;
  areasServed: number;
  monthlyTarget: number;
}

export default function WorkerSettings() {
  const { user, isLoaded } = useUser();
  const { profile } = useUserProfile();
  const [workerStats, setWorkerStats] = useState<WorkerStats>({
    completedTasks: 0,
    assignedTasks: 0,
    rating: 0,
    totalRatings: 0,
    hoursWorked: 0,
    efficiency: 0,
    areasServed: 0,
    monthlyTarget: 0,
  });
  const [workerType, setWorkerType] = useState<'WASTE_COLLECTOR' | 'SWEEPER'>('WASTE_COLLECTOR');

  // Show loading state while user data is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Worker Settings</h1>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Mock worker data - replace with actual API calls
    setWorkerStats({
      completedTasks: 127,
      assignedTasks: 15,
      rating: 4.7,
      totalRatings: 89,
      hoursWorked: 168,
      efficiency: 94,
      areasServed: 12,
      monthlyTarget: 150,
    });

    // Mock worker type - get from user metadata or API
    setWorkerType('WASTE_COLLECTOR');
  }, [user]);

  const workerMenuItems = [
    { 
      icon: FileText, 
      label: "My Tasks", 
      description: "View assigned and completed tasks",
      href: "/dashboard/worker/tasks",
      color: "bg-blue-500"
    },
    { 
      icon: BarChart3, 
      label: "Performance", 
      description: "Track your work performance and statistics",
      href: "/dashboard/worker/performance",
      color: "bg-green-500"
    },
    { 
      icon: Calendar, 
      label: "Schedule", 
      description: "View your work schedule and shifts",
      href: "/dashboard/worker/schedule",
      color: "bg-purple-500"
    },
    { 
      icon: MapPin, 
      label: "Service Areas", 
      description: "View assigned service areas and routes",
      href: "/dashboard/worker/areas",
      color: "bg-orange-500"
    },
    { 
      icon: Star, 
      label: "Ratings & Reviews", 
      description: "View citizen feedback and ratings",
      href: "/dashboard/worker/reviews",
      color: "bg-yellow-500"
    },
    { 
      icon: Award, 
      label: "Achievements", 
      description: "View your badges and achievements",
      href: "/dashboard/worker/achievements",
      color: "bg-indigo-500"
    },
  ];

  const getWorkerTypeLabel = (type: string) => {
    return type === 'WASTE_COLLECTOR' ? 'Waste Collector' : 'Street Sweeper';
  };

  const getWorkerTypeColor = (type: string) => {
    return type === 'WASTE_COLLECTOR' ? 'from-blue-500 to-blue-700' : 'from-green-500 to-green-700';
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Worker Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Manage your work and track performance</p>
        </div>

        {/* Worker Stats Card */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getWorkerTypeColor(workerType)} p-6 text-white shadow-xl`}>
          <div className="absolute top-4 right-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {user?.fullName || profile.name || "Worker"}
            </h2>
            <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
              {getWorkerTypeLabel(workerType)}
            </Badge>
            <div className="flex items-center gap-2 mt-2">
              <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
              <span className="text-sm">{workerStats.rating}/5.0 ({workerStats.totalRatings} reviews)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-white/80">Completed</p>
              <p className="text-xl font-bold">{workerStats.completedTasks}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Assigned</p>
              <p className="text-xl font-bold">{workerStats.assignedTasks}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Efficiency</p>
              <p className="text-xl font-bold">{workerStats.efficiency}%</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Hours</p>
              <p className="text-xl font-bold">{workerStats.hoursWorked}h</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((workerStats.completedTasks / workerStats.monthlyTarget) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Monthly Target
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {workerStats.areasServed}
              </div>
              <div className="text-sm text-muted-foreground">
                Areas Served
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(workerStats.hoursWorked / 4)}
              </div>
              <div className="text-sm text-muted-foreground">
                Days Active
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {workerStats.rating.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Avg Rating
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Worker Menu Items */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Worker Dashboard</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workerMenuItems.map((item, index) => (
              <Card key={index} className="transition-all hover:shadow-lg cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.color} text-white group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Tasks Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Sector A - Waste Collection</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Completed
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Sector B - Waste Collection</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  In Progress
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <span className="font-medium">Sector C - Waste Collection</span>
                </div>
                <Badge variant="secondary">
                  Pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Worker Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Worker Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user?.fullName?.charAt(0) || profile.name?.charAt(0) || "W"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {user?.fullName || profile.name || "Worker"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress || profile.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile.phone || "No phone number"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Worker ID: #{user?.id?.slice(-8) || "12345678"}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Time Tracking
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}