"use client";

import React, { useState } from "react";
import { DashboardHeroSection } from "@/components/ui/dashboardherosection";
import { DonationTypeCard } from "@/components/ui/donations/donation-card";

const donationTypes = [
  {
    imageSrc: "/rupee-dynamic.png",
    title: "Community Clean-up Drives",
  },
  {
    imageSrc: "/camera-dynamic.png",
    title: "Recycling Centers & Scrap Management",
  },
  {
    imageSrc: "/trash-can-dynamic.png",
    title: "Safety Kits for Waste Workers",
  },
  {
    imageSrc: "/megaphone-dynamic.png",
    title: "Awareness & Training Programs",
  },
  {
    imageSrc: "/chat-bubble-dynamic.png",
    title: "Tree Plantation & Composting Initiatives",
  },
  {
    imageSrc: "/chat-bubble-dynamic.png",
    title: "Waste-to-Energy Projects",
  },
];

export function DonationsPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="bg-background">
      <div className="p-4 sm:p-0 space-y-4 sm:space-y-6">
        <DashboardHeroSection
          title="Rajab Shoukath"
          showHeading={true}
          leftSideProp={{ label: "", value: "" }}
          rightSideProp={{ label: "Total Donations", value: "₹1000.00" }}
        />
        <section>
          <div className="mb-2 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Donate now!
            </h2>
            <p className="text-sm text-muted-foreground">
              Where would you like to make an impact?
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {donationTypes.map((donation, idx) => (
              <div key={donation.title} onClick={() => handleSelect(idx)}>
                <DonationTypeCard
                  imageSrc={donation.imageSrc}
                  title={donation.title}
                  className={
                    selectedIndex === idx
                      ? "border-2 border-green-500 shadow-lg scale-101"
                      : ""
                  }
                />
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 hover:shadow-sm transition-all ease-linear duration-200 text-center cursor-pointer">
              <input />
            </div>
            <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 hover:shadow-sm transition-all ease-linear duration-200 text-center cursor-pointer">
              ₹1000.00
            </div>
            <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 hover:shadow-sm transition-all ease-linear duration-200 text-center cursor-pointer">
              ₹2000.00
            </div>
            <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 hover:shadow-sm transition-all ease-linear duration-200 text-center cursor-pointer">
              ₹3000.00
            </div>
            <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 hover:shadow-sm transition-all ease-linear duration-200 text-center cursor-pointer">
              ₹4000.00
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
