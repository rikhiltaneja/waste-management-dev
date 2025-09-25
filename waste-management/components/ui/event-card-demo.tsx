"use client";

import React from "react";
import { EventCard } from "./event-card";

export function EventCardDemo() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">EventCard Demo</h2>
      
      {/* Default variant */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Default Card View</h3>
        <div className="max-w-sm">
          <EventCard
            title="Recycling Workshop"
            description="Lorem ipsum dolor sit amet consectetur. In ridiculus nec Lorem ipsum dolor sit amet consectetur. In ridiculus nec"
            date="28/11/2025"
            location="Delhi, India"
            registrations={25}
            maxCapacity={50}
            status="ACTIVE"
            targetAudience={["CITIZEN", "WORKER"]}
            onView={() => console.log("View clicked")}
            onEdit={() => console.log("Edit clicked")}
            onDelete={() => console.log("Delete clicked")}
          />
        </div>
      </div>

      {/* Compact variant */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Compact Grid View</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
          <EventCard
            title="Recycling Workshop"
            description="Lorem ipsum dolor sit amet consectetur. In ridiculus nec Lorem ipsum dolor sit amet consectetur. In ridiculus nec"
            date="28/11/2025"
            location="Delhi, India"
            registrations={25}
            maxCapacity={50}
            status="ACTIVE"
            targetAudience={["CITIZEN", "WORKER"]}
            variant="compact"
            onView={() => console.log("View clicked")}
            onEdit={() => console.log("Edit clicked")}
            onDelete={() => console.log("Delete clicked")}
          />
          <EventCard
            title="Composting Workshop"
            description="Learn hands-on composting techniques for sustainable waste management"
            date="15/12/2025"
            location="Mumbai, India"
            registrations={18}
            maxCapacity={30}
            status="DRAFT"
            targetAudience={["CITIZEN"]}
            variant="compact"
            onView={() => console.log("View clicked")}
            onEdit={() => console.log("Edit clicked")}
            onDelete={() => console.log("Delete clicked")}
          />
        </div>
      </div>

      {/* List variant */}
      <div>
        <h3 className="text-lg font-semibold mb-3">List View</h3>
        <div className="space-y-4 max-w-4xl">
          <EventCard
            title="Recycling Workshop"
            description="Lorem ipsum dolor sit amet consectetur. In ridiculus nec Lorem ipsum dolor sit amet consectetur. In ridiculus nec"
            date="28/11/2025"
            location="Delhi, India"
            registrations={25}
            maxCapacity={50}
            status="ACTIVE"
            targetAudience={["CITIZEN", "WORKER"]}
            variant="list"
            onView={() => console.log("View clicked")}
            onEdit={() => console.log("Edit clicked")}
            onDelete={() => console.log("Delete clicked")}
          />
        </div>
      </div>
    </div>
  );
}