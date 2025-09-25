"use client";

import React, { useState } from "react";
import { DashboardHeroSection } from "@/components/ui/dashboardherosection";

const donationTypes = [
  "Community Clean-up Drives",
  "Recycling Centers & Scrap Management",
  "Safety Kits for Waste Workers",
  "Awareness & Training Programs",
  "Tree Plantation & Composting Initiatives",
  "Waste-to-Energy Projects",
  "Others"
];

const presetAmounts = [50, 100, 200, 500];

const recentDonations = [
  { name: "Aayush", cause: "Tree Plantation", amount: 100 },
  { name: "Rajab", cause: "Safety Kits", amount: 200 },
  { name: "Priya", cause: "Clean-up Drives", amount: 500 },
];

export function DonationsPage() {
  const [selectedCause, setSelectedCause] = useState(donationTypes[0]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = () => {
    setIsPaying(true);
    const amount = selectedAmount ?? Number(customAmount);
    console.log(`Donating ₹${amount} to ${selectedCause}`);
    // Add payment logic here
    setTimeout(() => setIsPaying(false), 1000);
  };

  return (
    <div className="bg-background">
      <div className="p-4 sm:p-8">
        <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Donate</h2>
            <p className="text-sm text-muted-foreground">Make a change today</p>
          </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Donation Form */}
          <div className="bg-card rounded-2xl p-6 shadow-md flex flex-col justify-center">
            <label className="mb-2 text-sm text-muted-foreground">Select Cause</label>
            <select
              value={selectedCause}
              onChange={e => setSelectedCause(e.target.value)}
              className="mb-6 p-2 rounded border border-border bg-background text-foreground"
            >
              {donationTypes.map(cause => (
                <option key={cause} value={cause}>{cause}</option>
              ))}
            </select>
            <label className="mb-2 text-sm text-muted-foreground">Select Amount</label>
            <div className="flex gap-2 mb-4 flex-wrap">
              {presetAmounts.map(amount => (
                <button
                  key={amount}
                  type="button"
                  className={`px-4 py-2 rounded border ${selectedAmount === amount ? "bg-green-500 text-white border-green-500" : "bg-background text-foreground border-border"} transition`}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                >
                  ₹{amount}
                </button>
              ))}
              <input
                type="number"
                min={1}
                placeholder="Custom"
                value={customAmount}
                onChange={e => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="px-4 py-2 rounded border border-border bg-background text-foreground w-24"
              />
            </div>
            <button
              className="mt-4 px-6 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
              disabled={isPaying || (!selectedAmount && !customAmount)}
              onClick={handlePay}
            >
              {isPaying ? "Processing..." : "Pay"}
            </button>
          </div>
          {/* Right Side: Illustration */}
          <div className="flex items-center justify-center">
            <img
              src="/donation-dynamic.svg"
              alt="Donations Illustration"
              className="max-w-xs w-full h-auto"
            />
          </div>
        </div>
        {/* Recent Donations Section */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Donations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentDonations.map((donation, idx) => (
              <div key={idx} className="bg-card rounded-xl p-4 border border-border shadow-sm">
                <div className="font-semibold text-foreground">{donation.name}</div>
                <div className="text-sm text-muted-foreground">{donation.cause}</div>
                <div className="mt-2 text-green-600 font-bold">₹{donation.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}