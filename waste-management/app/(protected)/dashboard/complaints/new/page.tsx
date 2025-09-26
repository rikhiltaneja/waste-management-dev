"use client";

import { useUserProfile } from "@/store/profile.store";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { localityService } from "@/services/locality.service";
import Loading from "@/app/loading";
import axios from "axios";
import Image from "next/image";

export default function NewGrievances() {
  const [isMobile, setIsMobile] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [geolocationObject, setGeoLocationObject] =
    useState<Geolocation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [wasteType, setWasteType] = useState("");
  const [description, setDescription] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profile = useUserProfile((state) => state.profile);
  const { getToken } = useAuth();
  const router = useRouter();

  const wasteTypeOptions = [
    { value: "", label: "Select type of waste" },
    { value: "Societal", label: "Societal" },
    { value: "Industrial", label: "Industrial" },
    { value: "Domestic", label: "Domestic" },
    { value: "Medical", label: "Medical" },
    { value: "Other", label: "Other" },
  ];

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }

    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 640);
      window.addEventListener("resize", handleResize);
    }

    const geolocation = navigator.geolocation;
    setGeoLocationObject(geolocation);
    geolocation.getCurrentPosition((loc) => {
      console.log(loc);
    });

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  if (!isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Image
          src="/complaints_photo.svg"
          alt="Complaints Illustration"
          height={100}
          width={100}
          className="w-48 h-48 mb-4"
        />
        <p className="text-gray-500 mt-2 text-center">
          Please open this page on your phone to upload a photo or use location.
        </p>
      </div>
    );
  }

  const handleTemplateClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      geolocationObject?.getCurrentPosition((loc) => {
        console.log(loc);
      });
      setImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRetake = () => {
    setImageSrc(undefined);
    setShowForm(false);
  };

  const handleNext = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!imageSrc || !description || !wasteType) {
      alert("Please fill all fields and upload an image.");
      setIsLoading(false);
      return;
    }

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("Image file missing.");
      setIsLoading(false);
      return;
    }

    // Get auth token for API call
    const token = await getToken();

    const formData = new FormData();
    formData.append("description", description);
    formData.append("complaintImage", file);
    // Remove citizenId - backend will get it from auth token
    // Remove wasteType and location for now since backend doesn't expect them

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/complaints/create`, formData, {
        headers: { 
          ...(token && { 'Authorization': `Bearer ${token}` }),
          // Don't set Content-Type for FormData - let axios handle it
        },
      })
      .then((response) => {
        setSuccessId(response.data.id);
      })
      .catch((error) => {
        if (error?.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert("Failed to submit grievance. Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  if (isLoading) {
    return <Loading />;
  }
  if (successId) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex items-center justify-center mb-6">
          <span className="text-green-600 text-[6rem]">✓</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center text-foreground">
          Your complaint has been registered!
        </h2>
        <p className="text-lg text-center mb-2">
          Complaint ID:{" "}
          <span className="font-mono font-semibold">{successId}</span>
        </p>
        <p className="text-gray-500 text-center mb-6">
          You will receive details over email.
        </p>
        <button
          onClick={() => router.push("/dashboard/complaints")}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-grow h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageChange}
      />

      <div
        className={`w-74 h-74 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 mb-4 ${
          imageSrc ? "" : "cursor-pointer hover:border-green-500"
        }`}
        onClick={!imageSrc ? handleTemplateClick : undefined}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="Captured"
            height={100}
            width={100}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span className="text-gray-400 text-lg">Tap to take a photo</span>
        )}
      </div>

      {/* Image Confirmation section below the image */}
      <div className="mb-4 sm:mb-6 w-full text-center">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Image Confirmation
        </h2>
        <p className="text-sm text-muted-foreground">
          Continue to enter details
        </p>
      </div>

      {/* Retake and Next buttons, only after photo is taken and before form */}
      {imageSrc && !showForm && (
        <div className="flex gap-4">
          <button
            onClick={handleRetake}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            Retake
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Form after clicking Next */}
      {imageSrc && showForm && (
        <form
          className="flex flex-col items-center w-full max-w-md mt-2 gap-4 pb-8"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Location"
            value={profile.localityId ? localityService.getLocalityName(profile.localityId) : "Unknown Location"}
            className="w-full px-4 py-2 rounded border border-gray-300 bg-gray-100"
            required
            disabled
          />
          {/* Waste Type Dropdown */}
          <select
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300"
            required
          >
            {wasteTypeOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.value === ""}
              >
                {option.label}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 min-h-[100px] resize-none"
            required
          />
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
