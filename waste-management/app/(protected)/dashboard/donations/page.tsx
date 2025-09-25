'use client'

import { DonationsPage } from "./(layouts)/Donations";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function Donations() {
  // const {isLoaded, isSignedIn, userId, getToken} = useAuth()
  // useEffect(()=>{
  //   const init = async()
  // })
  return (
      <DonationsPage />
  );
}