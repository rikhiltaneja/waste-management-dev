"use client";

import { useEffect, useState } from "react";

export function CitizenGrievances() {
  const [videoSrc, setVideoSrc] = useState(undefined);
  const [imageSrc, setImageSrc] = useState(undefined);
  const [geolocationObject, setGeoLocationObject] = useState<Geolocation | null>(null)

  useEffect(()=>{
    // setGeoLocation()
    const geolocation = navigator.geolocation
    setGeoLocationObject(geolocation)
    geolocation.getCurrentPosition((location)=>{
      console.log(location)
    })
  }, [])

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
            geolocationObject?.getCurrentPosition((location)=>{
              console.log(location)
            })
            setImageSrc(URL.createObjectURL(e.target.files[0]) as any);
          }
        }}
      />
      <img src={imageSrc} />
    </>
  );
}
