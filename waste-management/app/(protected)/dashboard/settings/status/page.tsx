"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import Loading from "@/app/loading";

interface Complaint {
  id: number;
  description: string;
  complaintImage: string;
  createdAt: string;
  citizenId: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  workerId: string | null;
  reviewText: string | null;
  rating: number;
  workDoneImage: string | null;
  localityAdminId: string;
  citizen: {
    id: string;
    name: string;
    email: string;
  };
  localityAdmin: {
    id: string;
    name: string;
    email: string;
  };
  worker: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface ApiResponse {
  complaints: Complaint[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ComplaintStatus() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      
      const response = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/complaints`,
        {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        }
      );

      setComplaints(response.data.complaints);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load complaints. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchComplaints}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Complaint Status
        </h1>
        <p className="text-muted-foreground">
          Track the status of all your submitted complaints
        </p>
      </div>

      {complaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Image
            src="/complaints_photo.svg"
            alt="No complaints"
            height={100}
            width={100}
            className="w-32 h-32 mb-4 opacity-50"
          />
          <p className="text-gray-500 text-center">
            No complaints found. Submit your first complaint to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Complaint Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={complaint.complaintImage}
                    alt="Complaint"
                    height={100}
                    width={100}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                  />
                </div>

                {/* Complaint Details */}
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Complaint #{complaint.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(complaint.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        complaint.status
                      )} mt-2 sm:mt-0`}
                    >
                      {complaint.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3">{complaint.description}</p>

                  {/* Additional Details */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Locality Admin:</span>{" "}
                      {complaint.localityAdmin.name}
                    </p>
                    {complaint.worker && (
                      <p>
                        <span className="font-medium">Assigned Worker:</span>{" "}
                        {complaint.worker.name}
                      </p>
                    )}
                    {complaint.reviewText && (
                      <p>
                        <span className="font-medium">Review:</span>{" "}
                        {complaint.reviewText}
                      </p>
                    )}
                    {complaint.rating > 0 && (
                      <p>
                        <span className="font-medium">Rating:</span>{" "}
                        {"★".repeat(complaint.rating)}
                        {"☆".repeat(5 - complaint.rating)}
                      </p>
                    )}
                  </div>

                  {/* Work Done Image */}
                  {complaint.workDoneImage && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Work Completed:
                      </p>
                      <Image
                        src={complaint.workDoneImage}
                        alt="Work completed"
                        height={100}
                        width={100}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}