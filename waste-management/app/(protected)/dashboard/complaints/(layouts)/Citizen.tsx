"use client";

import { useRouter } from "next/navigation";

export function CitizenGrievances() {
  const router = useRouter();

  const handleRaiseGrievance = () => {
    router.push("/dashboard/complaints/new");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[78vh]">
      <h2 className="text-xl font-semibold mb-2 text-center">Complaints</h2>
      <p className="text-gray-500 mb-6 text-center">
        You can view your previous Complaints here or raise a new one.
      </p>
      <button
        onClick={handleRaiseGrievance}
        className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
      >
        Raise New Complaint
      </button>
      {/* You can add a list of previous Complaints below if needed */}
    </div>
  );
}