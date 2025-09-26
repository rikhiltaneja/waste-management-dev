"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96">Loading map...</div>
});

export default function FacilitiesDashboard() {
  return (
    <>
    <Map />
    </>
  );
}