"use client";
import React, { useState } from "react";
import Loading from "@/app/loading";
import {
  CalendarPlus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  Users2Icon,
  TicketIcon,
  Grid3X3,
  List,
  LayoutGrid,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatsCardGrid } from "@/components/ui/charts";
import {
  AddEventModal,
  EventFormData,
} from "@/components/modals/add-event-modal";
import { EventCard } from "@/components/ui/event-card";
import { formatDate } from "@/helpers/date.helper";
import { useTrainingEvents } from "@/hooks/useTrainingEvents";

type ViewMode = "table" | "grid" | "list" | "cards";

const CampaignPage = () => {
  const router = useRouter();
  const { 
    events, 
    isOperating, 
    createEvent, 
    updateEvent, 
    deleteEvent 
  } = useTrainingEvents();
  
  const [filter, setFilter] = useState<
    "ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "DRAFT"
  >("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] =
    useState<PhysicalTrainingEvent | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const handleAddEvent = () => {
    setIsAddModalOpen(true);
  };

  const handleCreateEvent = async (eventData: EventFormData) => {
    try {
      await createEvent(eventData);
      setIsAddModalOpen(false);
    } catch (error) {
      alert(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleViewEvent = (id: number) => {
    router.push(`/dashboard/trainings/${id}`);
  };

  const handleEditEvent = (id: number) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      setViewingEvent(event);
    }
  };

  const handleUpdateEvent = async (eventData: EventFormData) => {
    if (!viewingEvent) return;
    
    try {
      await updateEvent(viewingEvent.id, eventData);
      setViewingEvent(null);
    } catch (error) {
      alert(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
      } catch (error) {
        alert(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEvents = events.filter(
    (event) => filter === "ALL" || event.status === filter
  );

  // Calculate stats from events data
  const stats = {
    totalEvents: events.length,
    activeEvents: events.filter((e) => e.status === "ACTIVE").length,
    totalRegistrations: events.reduce((sum, e) => sum + e.registrations, 0),
    completedEvents: events.filter((e) => e.status === "COMPLETED").length,
  };

  const statusOptions: Array<
    "ALL" | "ACTIVE" | "DRAFT" | "COMPLETED" | "CANCELLED"
  > = ["ALL", "ACTIVE", "DRAFT", "COMPLETED", "CANCELLED"];

  return (
  <>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Physical Training Events
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Manage and monitor training events for citizens and workers
            </p>
          </div>
          <div>
            <Button onClick={handleAddEvent}>
              <Plus/>
              Add Event
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCardGrid
          stats={[
            {
              title: "Total Events",
              value: stats.totalEvents,
              icon: Calendar,
              iconColor: "text-amber-500",
            },
            {
              title: "Active Events",
              value: stats.activeEvents,
              icon: Clock,
              iconColor: "text-blue-500",
            },
            {
              title: "Total Registrations",
              value: stats.totalRegistrations,
              icon: Users2Icon,
              iconColor: "text-green-500",
            },
            {
              title: "Completed Events",
              value: stats.completedEvents,
              icon: TicketIcon,
              iconColor: "text-red-500",
            },
          ]}
        />

        {/* Filters and View Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                onClick={() => setFilter(status)}
                className="text-xs md:text-sm px-3 py-2 cursor-pointer"
              >
                {status}
              </Button>
            ))}
          </div>

          {/* View Mode Selector */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {/* Table Button: hidden on mobile */}
            <div className="hidden lg:block">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="px-3 py-2 cursor-pointer"
              >
                <List className="h-4 w-4" />
                <span className="hidden lg:inline ml-2">Table</span>
              </Button>
            </div>
            {/* Grid Button: always visible */}
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="px-3 py-2 cursor-pointer"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Grid</span>
            </Button>
            {/* List Button: hidden on mobile */}
            <div className="hidden lg:block">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3 py-2 cursor-pointer"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden lg:inline ml-2">List</span>
              </Button>
            </div>
            {/* Cards Button: always visible */}
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="px-3 py-2 cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Cards</span>
            </Button>
          </div>
        </div>

        {/* Events Display */}
        {/* Table View */}
        {viewMode === "table" && (
          <div className="hidden lg:block">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Schedule
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {event.title}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {event.description}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Target: {event.targetAudience.join(", ")}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(event.startDateTime)}
                          </div>
                          {event.endDateTime && (
                            <div className="text-sm text-gray-500">
                              to {formatDate(event.endDateTime)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            {event.location}
                          </div>
                          {event.locality && (
                            <div className="text-xs text-gray-500">
                              {event.locality.name}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {event.registrations}/{event.maxCapacity || "∞"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.maxCapacity
                              ? `${Math.round(
                                  (event.registrations / event.maxCapacity) *
                                    100
                                )}% full`
                              : "No limit"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              event.status
                            )}`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewEvent(event.id)}
                              className="p-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditEvent(event.id)}
                              className="p-2 cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 text-red-600 hover:text-red-700 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvents.map((event) => (
              <div
                onClick={() => handleViewEvent(event.id)}
                className="cursor-pointer"
                key={event.id}
              >
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={formatDate(event.startDateTime)}
                  location={event.location}
                  registrations={event.registrations}
                  maxCapacity={event.maxCapacity}
                  status={event.status}
                  targetAudience={event.targetAudience}
                  variant="compact"
                  onEdit={(e) => {
                    e.stopPropagation(); // prevents bubbling to parent div
                    handleEditEvent(event.id);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation(); // prevents bubbling to parent div
                    handleDeleteEvent(event.id);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="hidden lg:block">
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div
                  onClick={() => handleViewEvent(event.id)}
                  className="cursor-pointer"
                  key={event.id}
                >
                  <EventCard
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    date={formatDate(event.startDateTime)}
                    location={event.location}
                    registrations={event.registrations}
                    maxCapacity={event.maxCapacity}
                    status={event.status}
                    targetAudience={event.targetAudience}
                    variant="list"
                    onEdit={(e) => {
                      e.stopPropagation(); // prevents bubbling to parent div
                      handleEditEvent(event.id);
                    }}
                    onDelete={(e) => {
                      e.stopPropagation(); // prevents bubbling to parent div
                      handleDeleteEvent(event.id);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cards View */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                onClick={() => handleViewEvent(event.id)}
                className="cursor-pointer"
                key={event.id}
              >
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={formatDate(event.startDateTime)}
                  location={event.location}
                  registrations={event.registrations}
                  maxCapacity={event.maxCapacity}
                  status={event.status}
                  targetAudience={event.targetAudience}
                  variant="default"
                  onEdit={(e) => {
                    e.stopPropagation(); // prevents bubbling to parent div
                    handleEditEvent(event.id);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation(); // prevents bubbling to parent div
                    handleDeleteEvent(event.id);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No events found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "ALL"
                ? "Get started by creating a new event."
                : `No ${filter.toLowerCase()} events found.`}
            </p>
          </div>
        )}
      </div>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateEvent}
        isLoading={isOperating}
      />

      <AddEventModal
        isOpen={!!viewingEvent}
        onClose={() => setViewingEvent(null)}
        onSubmit={handleUpdateEvent}
        mode="edit"
        isLoading={isOperating}
        initialData={
          viewingEvent
            ? {
                title: viewingEvent.title,
                description: viewingEvent.description,
                startDateTime: viewingEvent.startDateTime.slice(0, 16), // Format for datetime-local input
                endDateTime: viewingEvent.endDateTime?.slice(0, 16) || "",
                location: viewingEvent.location,
                maxCapacity: viewingEvent.maxCapacity,
                targetAudience: viewingEvent.targetAudience,
                status:
                  viewingEvent.status === "COMPLETED" ||
                  viewingEvent.status === "CANCELLED"
                    ? "ACTIVE"
                    : viewingEvent.status,
                localityId: viewingEvent.localityId || null,
              }
            : undefined
        }
      />
  </>
  );
};

export default CampaignPage;
