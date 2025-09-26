"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { 
  MapPin, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Users,
  TrendingUp
} from "lucide-react";
import { StatsCardGrid } from "@/components/ui/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { Roles } from "@/types/globals";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[30rem] bg-muted rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
});

// Mock data for facilities
const facilities = [
  {
    id: 1,
    name: "Central Collection Point",
    address: "Main Street, Downtown",
    status: "active",
    capacity: 85,
    lastCollection: "2 hours ago",
    type: "Primary Hub"
  },
  {
    id: 2,
    name: "North District Center",
    address: "North Avenue, Sector 12",
    status: "full",
    capacity: 100,
    lastCollection: "6 hours ago",
    type: "District Hub"
  },
  {
    id: 3,
    name: "Community Drop-off",
    address: "Park Road, Residential Area",
    status: "active",
    capacity: 45,
    lastCollection: "1 hour ago",
    type: "Community Point"
  },
  {
    id: 4,
    name: "Industrial Zone Hub",
    address: "Industrial Complex, Zone A",
    status: "maintenance",
    capacity: 0,
    lastCollection: "1 day ago",
    type: "Industrial Hub"
  }
];

export default function FacilitiesDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const stats = {
    totalFacilities: 24,
    activeFacilities: 18,
    fullFacilities: 3,
    maintenanceFacilities: 3,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "full":
        return "text-red-600 bg-red-50";
      case "maintenance":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "full":
        return <AlertTriangle className="h-4 w-4" />;
      case "maintenance":
        return <Clock className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || facility.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });
  const { user } = useUser();

  // Check if user is admin
  const userRole = user?.publicMetadata?.role as Roles;
  const isAdmin = userRole === "Admin";

  return (
    <div className="space-y-6 bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Collection Facilities</h1>
          <p className="text-muted-foreground">Monitor and manage waste collection points</p>
        </div>
        {isAdmin&&(
          <Button className="w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Add New Facility
        </Button>
        )}
      </div>

      {/* Stats Cards */}
      <StatsCardGrid
        stats={[
          {
            title: "Total Facilities",
            value: stats.totalFacilities,
            icon: MapPin,
            iconColor: "text-blue-500",
          },
          {
            title: "Active Facilities",
            value: stats.activeFacilities,
            icon: CheckCircle,
            iconColor: "text-green-500",
          },
          {
            title: "Full Capacity",
            value: stats.fullFacilities,
            icon: AlertTriangle,
            iconColor: "text-red-500",
          },
          {
            title: "Under Maintenance",
            value: stats.maintenanceFacilities,
            icon: Clock,
            iconColor: "text-yellow-500",
          },
        ]}
      />

      {/* Search and Filter */}
      {/* <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("all")}
          >
            All
          </Button>
          <Button
            variant={selectedFilter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={selectedFilter === "full" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("full")}
          >
            Full
          </Button>
          <Button
            variant={selectedFilter === "maintenance" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("maintenance")}
          >
            Maintenance
          </Button>
        </div>
      </div> */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Facilities Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[30rem] rounded-b-lg overflow-hidden flex justify-center">
                <Map />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Facilities List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Facilities Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{facility.name}</h3>
                      <p className="text-xs text-muted-foreground">{facility.address}</p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(facility.status)}`}>
                      {getStatusIcon(facility.status)}
                      {facility.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium">{facility.capacity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          facility.capacity >= 90 ? 'bg-red-500' :
                          facility.capacity >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${facility.capacity}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Last Collection</span>
                      <span className="font-medium">{facility.lastCollection}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">{facility.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}