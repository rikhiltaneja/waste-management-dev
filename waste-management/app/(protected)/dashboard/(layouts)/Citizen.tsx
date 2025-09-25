"use client";

import React from "react";
import { ServiceCard } from "@/components/ui/service-card";
import { EventCard } from "@/components/ui/event-card";
import { DashboardHeroSection } from "@/components/ui/dashboardherosection";

export function CitizenDashboard() {
  return (
    <div className="bg-background">
      <div className="p-4 sm:p-0 space-y-4 sm:space-y-6">
        {/* Mobile Hero Section */}
        <DashboardHeroSection
          title="Rajab Shoukath"
          showHeading={true}
          leftSideProp={{ label: "Attended Trainings:", value: 24 }}
          rightSideProp={{ label: "Total Points", value: 12 }}
        />

        {/* Services */}
        <section>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Services</h2>
            <p className="text-sm text-muted-foreground">Explore services</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <ServiceCard
              imageSrc="/rupee-dynamic.png"
              title="Donate"
              description="Lorem ipsum dolor"
              href="/donations"
            />
            <ServiceCard
              imageSrc="/camera-dynamic.png"
              title="Report"
              description="Lorem ipsum dolor"
              href="/grievances/new"
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
              href="/trainings"
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
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Events</h2>
            <p className="text-sm text-muted-foreground">Explore events and campaigns</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <EventCard
              title="Ecosystem Campaign"
              description="Lorem ipsum dolor sit amet consectetur. In ridiculus nec Lorem ipsum dolor sit amet consectetur. In ridiculus nec"
              date="02/11/2025"
              location="Maheru, Punjab"
            />
            <EventCard
              title="Beach Cleanup Drive"
              description="Lorem ipsum dolor sit amet consectetur. In ridiculus nec Lorem ipsum dolor sit amet consectetur. In ridiculus nec"
              date="15/11/2025"
              location="Mumbai, Maharashtra"
            />
            <EventCard
              title="Recycling Workshop"
              description="Lorem ipsum dolor sit amet consectetur. In ridiculus nec Lorem ipsum dolor sit amet consectetur. In ridiculus nec"
              date="28/11/2025"
              location="Delhi, India"
            />
          </div>
        </section>
      </div>
    </div>
  );
}