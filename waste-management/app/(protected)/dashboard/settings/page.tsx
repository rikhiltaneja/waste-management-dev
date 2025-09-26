"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/store/profile.store";
import { 
  User, 
  Gift, 
  Star, 
  FileText, 
  Settings as SettingsIcon,
  Users,
  BarChart3,
  Shield,
  ChevronRight
} from "lucide-react";

interface UserStats {
  totalPoints: number;
  totalDonations: number;
  completedRequests: number;
  pendingRequests: number;
  rating?: number;
  assignedTasks?: number;
  completedTasks?: number;
}

export default function Settings() {
  const { user, isLoaded } = useUser();
  const { profile } = useUserProfile();
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    totalDonations: 0,
    completedRequests: 0,
    pendingRequests: 0,
  });
  const [userRole, setUserRole] = useState<'Citizen' | 'Worker' | 'Admin'>('Citizen');

  useEffect(() => {
    // Mock data - replace with actual API calls
    setUserStats({
      totalPoints: profile.points || 12,
      totalDonations: 10.00,
      completedRequests: 8,
      pendingRequests: 2,
      rating: 4.5,
      assignedTasks: 15,
      completedTasks: 12,
    });

    // Determine user role based on user metadata or API call
    // For now, using mock logic
    const role = user?.publicMetadata?.role as string || 'citizen';
    setUserRole(role as 'Citizen' | 'Worker' | 'Admin');
  }, [profile.points, user]);

  const menuItems = {
    Citizen: [
      { icon: User, label: "Your Information", href: "/dashboard/settings/profile" },
      { icon: Gift, label: "Your Donations", href: "/dashboard/settings/donations" },
      { icon: Star, label: "Points", href: "/dashboard/settings/points" },
      { icon: FileText, label: "Requests", href: "/dashboard/settings/requests" },
    ],
    Worker: [
      { icon: User, label: "Your Information", href: "/dashboard/settings/profile" },
      { icon: FileText, label: "Assigned Tasks", href: "/dashboard/settings/tasks" },
      { icon: Star, label: "Performance", href: "/dashboard/settings/performance" },
      { icon: BarChart3, label: "Statistics", href: "/dashboard/settings/stats" },
    ],
    Admin: [
      { icon: User, label: "Your Information", href: "/dashboard/settings/profile" },
      { icon: Users, label: "Manage Users", href: "/dashboard/settings/users" },
      { icon: BarChart3, label: "Analytics", href: "/dashboard/settings/analytics" },
      { icon: Shield, label: "System Settings", href: "/dashboard/settings/system" },
      { icon: FileText, label: "Reports", href: "/dashboard/settings/reports" },
    ]
  };

  const currentMenuItems = menuItems[userRole] || menuItems.Citizen;

  // Show loading state while user data is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderStatsCard = () => {
    switch (userRole) {
      case 'Citizen':
        return (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-400 to-green-600 p-6 text-white shadow-lg">
            <div className="absolute top-4 right-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <span className="text-lg font-bold">W</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                {user?.fullName || profile.name || "User"}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-100">Total Points</p>
                <p className="text-2xl font-bold">{userStats.totalPoints}</p>
              </div>
              <div>
                <p className="text-sm text-green-100">Total Donations:</p>
                <p className="text-2xl font-bold">${userStats.totalDonations.toFixed(2)}</p>
              </div>
            </div>
          </div>
        );
      
      case 'Worker':
        return (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 p-6 text-white shadow-lg">
            <div className="absolute top-4 right-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <span className="text-lg font-bold">W</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                {user?.fullName || profile.name || "Worker"}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                <span className="text-sm">{userStats.rating}/5.0</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-100">Completed Tasks</p>
                <p className="text-2xl font-bold">{userStats.completedTasks}</p>
              </div>
              <div>
                <p className="text-sm text-blue-100">Assigned Tasks</p>
                <p className="text-2xl font-bold">{userStats.assignedTasks}</p>
              </div>
            </div>
          </div>
        );
      
      case 'Admin':
        return (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 p-6 text-white shadow-lg">
            <div className="absolute top-4 right-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Shield className="h-4 w-4" />
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                {user?.fullName || profile.name || "Admin"}
              </h2>
              <Badge variant="secondary" className="mt-2 bg-white/20 text-white">
                Administrator
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-purple-100">Total Users</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div>
                <p className="text-sm text-purple-100">Active Requests</p>
                <p className="text-2xl font-bold">56</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-400 to-green-600 p-6 text-white shadow-lg">
            <div className="absolute top-4 right-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <span className="text-lg font-bold">A</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                {user?.fullName || profile.name || "User"}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-100">Total Points</p>
                <p className="text-2xl font-bold">{userStats.totalPoints}</p>
              </div>
              <div>
                <p className="text-sm text-green-100">Total Donations:</p>
                <p className="text-2xl font-bold">${userStats.totalDonations.toFixed(2)}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>

        {/* Stats Card */}
        {renderStatsCard()}

        {/* Menu Items */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-foreground">
            {userRole === 'Citizen' ? 'Your Information' : 
             userRole === 'Worker' ? 'Worker Dashboard' : 'Admin Panel'}
          </h3>
          
          {currentMenuItems?.map((item, index) => (
            <Card key={index} className="transition-all hover:shadow-md cursor-pointer">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Stats for Citizens */}
        {userRole === 'Citizen' && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userStats.completedRequests}
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed Requests
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {userStats.pendingRequests}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pending Requests
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.fullName?.charAt(0) || profile.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {user?.fullName || profile.name || "User"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress || profile.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile.phone || "No phone number"}
                </p>
              </div>
              <SettingsIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}