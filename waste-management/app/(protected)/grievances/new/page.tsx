"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";

export default function NewGrievances() {
  const [isMobile, setIsMobile] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [geolocationObject, setGeoLocationObject] =
    useState<Geolocation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    geolocation.getCurrentPosition((location) => {
      console.log(location);
    });

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // ...existing code...

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
      fileInputRef.current.value = ""; // reset previous selection
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      geolocationObject?.getCurrentPosition((location) => {
        console.log(location);
      });
      setImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRetake = () => {
    setImageSrc(undefined);
  };

  const handleNext = () => {
    alert("Proceeding to next step...");
    // Add your next step logic here
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
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
        className={`w-64 h-64 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 cursor-pointer mb-6 ${
          imageSrc ? "" : "hover:border-green-500"
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

      {/* Retake and Next buttons, only after photo is taken */}
      {imageSrc && (
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
    </div>
  );
}
