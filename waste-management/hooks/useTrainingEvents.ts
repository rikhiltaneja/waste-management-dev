import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { EventFormData } from '@/components/modals/add-event-modal';

// Backend API response interface
interface BackendTrainingEvent {
  id: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string | null;
  location: string;
  maxCapacity: number | null;
  targetAudience: string[];
  status: string;
  createdAt: string;
  localityId: number;
  registrations?: unknown[];
  locality?: {
    id: number;
    name: string;
  };
  _count?: {
    registrations: number;
  };
}

export const useTrainingEvents = () => {
  const { getToken } = useAuth();
  const [events, setEvents] = useState<PhysicalTrainingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOperating, setIsOperating] = useState(false);

  // Transform backend event to frontend format
  const transformEvent = (event: BackendTrainingEvent): PhysicalTrainingEvent => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime || undefined,
    location: event.location,
    maxCapacity: event.maxCapacity || undefined,
    targetAudience: event.targetAudience,
    status: event.status as "ACTIVE" | "CANCELLED" | "COMPLETED" | "DRAFT",
    createdAt: event.createdAt,
    registrations: event._count?.registrations || event.registrations?.length || 0,
    locality: event.locality ? { name: event.locality.name } : undefined,
    localityId: event.localityId, // Include localityId for editing
  });

  // Generic API call function with authentication
  const apiCall = useCallback(async (
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
    body?: Record<string, unknown>
  ) => {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Authentication token not available');
    }

    const config: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...(body && { 'Content-Type': 'application/json' }),
      },
      ...(body && { body: JSON.stringify(body) }),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to ${method.toLowerCase()} event`);
    }

    return response.json();
  }, [getToken]);

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      
      const responseData = await apiCall('/physical-training');
      console.log("Backend response:", responseData);
      
      // Handle different response formats
      let backendEvents: BackendTrainingEvent[];
      if (Array.isArray(responseData)) {
        backendEvents = responseData;
      } else if (responseData.events && Array.isArray(responseData.events)) {
        backendEvents = responseData.events;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        backendEvents = responseData.data;
      } else {
        console.error("Unexpected response format:", responseData);
        backendEvents = [];
      }
      
      const transformedEvents = backendEvents.map(transformEvent);
      setEvents(transformedEvents);
      
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Create new event
  const createEvent = async (eventData: EventFormData) => {
    try {
      setIsOperating(true);
      
      const payload = {
        title: eventData.title,
        description: eventData.description,
        startDateTime: new Date(eventData.startDateTime).toISOString(),
        endDateTime: eventData.endDateTime ? new Date(eventData.endDateTime).toISOString() : null,
        location: eventData.location,
        maxCapacity: eventData.maxCapacity || null,
        targetAudience: eventData.targetAudience,
        status: eventData.status,
        localityId: eventData.localityId || 1,
      };

      console.log("Creating event with payload:", payload);
      
      const newEvent = await apiCall('/physical-training', 'POST', payload);
      const transformedEvent = transformEvent(newEvent);
      
      setEvents((prev) => [transformedEvent, ...prev]);
      console.log("Event created successfully!");
      
      return transformedEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    } finally {
      setIsOperating(false);
    }
  };

  // Update existing event
  const updateEvent = async (id: number, eventData: EventFormData) => {
    try {
      setIsOperating(true);
      
      const payload = {
        title: eventData.title,
        description: eventData.description,
        startDateTime: new Date(eventData.startDateTime).toISOString(),
        endDateTime: eventData.endDateTime ? new Date(eventData.endDateTime).toISOString() : null,
        location: eventData.location,
        maxCapacity: eventData.maxCapacity || null,
        targetAudience: eventData.targetAudience,
        status: eventData.status,
        localityId: eventData.localityId || 1,
      };

      console.log("Updating event with payload:", payload);
      
      const updatedEvent = await apiCall(`/physical-training/${id}`, 'PUT', payload);
      const transformedEvent = transformEvent(updatedEvent);
      
      setEvents((prev) => 
        prev.map((event) => 
          event.id === id ? { ...transformedEvent, registrations: event.registrations } : event
        )
      );
      
      console.log("Event updated successfully!");
      
      return transformedEvent;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    } finally {
      setIsOperating(false);
    }
  };

  // Delete event
  const deleteEvent = async (id: number) => {
    try {
      setIsOperating(true);
      
      await apiCall(`/physical-training/${id}`, 'DELETE');
      
      setEvents((prev) => prev.filter((event) => event.id !== id));
      console.log("Event deleted successfully!");
      
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    } finally {
      setIsOperating(false);
    }
  };

  // Load events on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        await fetchEvents();
      } catch (error) {
        alert(`Failed to fetch events: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    loadEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    isOperating,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
};