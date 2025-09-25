"use client";

import React, { useEffect, useState } from "react";
import { ServiceCard } from "@/components/ui/service-card";
import { EventCard } from "@/components/ui/event-card";
import { DashboardHeroSection } from "@/components/ui/dashboardherosection";
import { useAuth, useUser } from "@clerk/nextjs";
import { InitialisationService } from "@/services/initialization.service";
import { useUserProfile } from "@/store/profile.store";
import { useRouter } from "next/navigation";
import { formatDate } from "@/helpers/date.helper";

export function CitizenDashboard() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const setUserProfile = useUserProfile((state) => state.updateProfile);
  const profile = useUserProfile((state) => state.profile);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<PhysicalTrainingEvent[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      if (isLoaded && isSignedIn && user) {
        const token = await getToken();
        const initializationService = new InitialisationService(
          user.publicMetadata.role as string,
          user.id,
          token as string
        );
        const profileData = await initializationService.getCitizenProfile();
        setUserProfile(profileData);
        setLoading(false);
      }
    }
    init();
  }, [isLoaded, isSignedIn, user, getToken, setUserProfile]);

  const handleViewEvent = (id: number) => {
    router.push(`/dashboard/trainings/${id}`);
  };
  useEffect(() => {
    const mockEvents: PhysicalTrainingEvent[] = [
      {
        id: 1,
        title: "Recycling Workshop",
        description:
          "Lorem ipsum dolor sit amet consectetur. In ridiculus nec Lorem ipsum dolor sit amet consectetur. In ridiculus nec",
        startDateTime: "2025-11-28T10:00:00Z",
        endDateTime: "2025-11-28T12:00:00Z",
        location: "Delhi, India",
        maxCapacity: 50,
        targetAudience: ["CITIZEN", "WORKER"],
        status: "ACTIVE",
        createdAt: "2024-01-01T00:00:00Z",
        registrations: 35,
        locality: { name: "Central Delhi" },
      },
      {
        id: 2,
        title: "Waste Segregation Training",
        description:
          "Learn proper waste segregation techniques for better waste management",
        startDateTime: "2024-01-15T10:00:00Z",
        endDateTime: "2024-01-15T12:00:00Z",
        location: "Jalandhar",
        maxCapacity: 50,
        targetAudience: ["CITIZEN", "WORKER"],
        status: "COMPLETED",
        createdAt: "2024-01-01T00:00:00Z",
        registrations: 45,
        locality: { name: "Downtown" },
      },
      {
        id: 3,
        title: "Composting Workshop",
        description:
          "Hands-on composting techniques for households and community gardens",
        startDateTime: "2024-01-20T14:00:00Z",
        endDateTime: "2024-01-20T16:00:00Z",
        location: "Green Park",
        maxCapacity: 30,
        targetAudience: ["CITIZEN"],
        status: "DRAFT",
        createdAt: "2024-01-02T00:00:00Z",
        registrations: 0,
        locality: { name: "Uptown" },
      },
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 100);
  }, []);
  if (loading || !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }
  return (
    <div className="bg-background">
      <div className="p-4 sm:p-0 space-y-4 sm:space-y-6">
        {/* Mobile Hero Section */}
        <DashboardHeroSection
          title={profile.name}
          showHeading={true}
          leftSideProp={{ label: "Attended Trainings:", value: 10 }}
          rightSideProp={{ label: "Total Points", value: profile.points }}
        />

        {/* Services */}
        <section>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Services
            </h2>
            <p className="text-sm text-muted-foreground">Explore services</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <ServiceCard
              imageSrc="/rupee-dynamic.png"
              title="Donate"
              description="Lorem ipsum dolor"
              href="/dashboard/donations"
            />
            <ServiceCard
              imageSrc="/camera-dynamic.png"
              title="Report"
              description="Lorem ipsum dolor"
              href="/dashboard/complaints/new"
            />
            <ServiceCard
              imageSrc="/trash-can-dynamic.png"
              title="Station"
              description="Lorem ipsum dolor"
              href="/dashboard/facilities"
            />
            <ServiceCard
              imageSrc="/megaphone-dynamic.png"
              title="Campaign"
              description="Lorem ipsum dolor"
              href="/dashboard/trainings"
            />
            <ServiceCard
              imageSrc="/chat-bubble-dynamic.png"
              title="Chat"
              description="Lorem ipsum dolor"
              href="/support"
            />
          </div>
        </section>

        {/* Events */}
        <section className="pb-4">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Events
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore events and campaigns
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
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
                  variant="compact"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
