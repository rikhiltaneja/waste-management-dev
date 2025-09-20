"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();

  const { user } = useUser()

  useEffect(() => {
  if (isLoaded && isSignedIn) {
    testBackendRequest();
    console.log(user)
  }
}, [isLoaded, isSignedIn]);

  const testBackendRequest = async () => {
    const token = await getToken();
    const response = await axios.get("http://localhost:8080/citizens/all", {
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response);
  };

  return <>Dashboard Page!</>;
}
