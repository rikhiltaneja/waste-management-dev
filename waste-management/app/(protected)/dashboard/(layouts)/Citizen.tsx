"use client";

import React from "react";
import { HeaderCard } from "@/components/ui/header-card";
import { ServiceCard } from "@/components/ui/service-card";
import { EventCard } from "@/components/ui/event-card";

export function CitizenDashboard() {
  return (
    <div className="bg-background">
      <div className="p-4 sm:p-0 space-y-4 sm:space-y-6">
        {/* Mobile Hero Section */}
        <section className="sm:hidden relative mb-20">
          <div className="bg-[#1B1B25] rounded-3xl p-6 text-white pb-30">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/profile-avatar.jpg"
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-green-500 object-cover"
              />
              <div>
                <div className="text-lg font-semibold">Welcome Back,</div>
                <div className="text-sm opacity-80">Citizen</div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-12 left-4 right-4">
            <HeaderCard
              title="Rajab Shoukath"
              leftSideProp={{
                label: "Attended Trainings:",
                value: 24,
              }}
              rightSideProp={{
                label: "Total Points",
                value: 12,
              }}
              className="shadow-lg"
            />
          </div>
        </section>

        {/* Desktop Hero Section */}
        <section className="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#1B1B25] p-6 lg:p-10 rounded-3xl lg:rounded-4xl">
          <div className="lg:col-span-2 p-6 lg:p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/profile-avatar.jpg"
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-green-500 object-cover"
              />
              <div>
                <div className="text-sm opacity-80">Welcome Back,</div>
                <div className="text-sm opacity-80">Citizen</div>
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-semibold leading-tight">
              Clean future starts<br />
              with smart waste management.
            </h1>
          </div>
          <HeaderCard
            title="Rajab Shoukath"
            leftSideProp={{
              label: "Contributions",
              value: 24,
            }}
            rightSideProp={{
              label: "Incentives",
              value: "$248",
            }}
          />
        </section>

        {/* Services */}
        <section>
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Services</h2>
            <p className="text-sm text-muted-foreground">Explore services</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-5 gap-4">
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