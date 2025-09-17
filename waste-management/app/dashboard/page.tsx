"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();

  useEffect(() => {
  if (isLoaded && isSignedIn) {
    testBackendRequest();
  }
}, [isLoaded, isSignedIn]);

  const testBackendRequest = async () => {
    const token = await getToken();
    console.log(token)
    const response = await axios.get("http://localhost:8080/citizens/all");
    console.log(response);
  };

  return <>Dashboard Page!</>;
}
