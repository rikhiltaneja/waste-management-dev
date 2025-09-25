"use client";

import { useEffect, useState } from "react";

export default function NewGrievances() {
  const [isMobile, setIsMobile] = useState(true);
  const [videoSrc, setVideoSrc] = useState(undefined);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [geolocationObject, setGeoLocationObject] =
    useState<Geolocation | null>(null);

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

  if (!isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        <img
          src="/complaints_photo.svg"
          alt="Complaints Illustration"
          className="w-48 h-48 mb-4" // increased size
        />
        <p className="text-gray-500 mt-2 text-center">
          Please open this page on your phone to upload a photo or use location.
        </p>
      </div>
    );
  }

  const clickPhoto = () => {
    if (navigator.mediaDevices) {
      // MediaDevices API is available
      const constraints = {
        video: true,
      };

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
          const videoElement: HTMLVideoElement = document.getElementById(
            "camera-stream"
          ) as HTMLVideoElement;
          videoElement.srcObject = stream;
        })
        .catch(function (error) {
          console.error("Error accessing the camera", error);
        });
    } else {
      alert("Camera API not supported by this browser.");
    }
  };

  return (
    <>
      {/* <button onClick={clickPhoto}>Upload Photo</button>
      <video id="camera-stream" autoPlay></video> */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            geolocationObject?.getCurrentPosition((location) => {
              console.log(location);
            });
            setImageSrc(URL.createObjectURL(e.target.files[0]));
          }
        }}
      />
      {imageSrc && <img src={imageSrc} />}
    </>
  );
}
