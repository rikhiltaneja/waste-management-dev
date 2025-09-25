"use client";

import { useUserProfile } from "@/store/profile.store";
import { useEffect, useState, useRef } from "react";

export default function NewGrievances() {
  const [isMobile, setIsMobile] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [geolocationObject, setGeoLocationObject] =
    useState<Geolocation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [location, setLocation] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profile = useUserProfile((state) => state.profile);

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
      // You can auto-fill location here if desired
      // setLocation(`${loc.coords.latitude}, ${loc.coords.longitude}`);
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
        <img
          src="/complaints_photo.svg"
          alt="Complaints Illustration"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    alert("Grievance submitted!");
  };

  return (
    <div className="flex flex-col h-full px-4">
      {/* Header at the top */}
      {/* Middle section: centered vertically in remaining space */}
      <div className="flex flex-col items-center justify-center flex-grow">
        {/* Hidden file input for camera */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* Image template or captured image */}
        <div
          className={`w-64 h-64 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 mb-4 ${
            imageSrc ? "" : "cursor-pointer hover:border-green-500"
          }`}
          onClick={!imageSrc ? handleTemplateClick : undefined}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Captured"
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
            className="flex flex-col items-center w-full max-w-md mt-4 gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Location"
              value={profile.localityId}
              className="w-full px-4 py-2 rounded border border-gray-300"
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
    </div>
  );
}
