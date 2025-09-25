"use client";

import React from "react";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="h-screen w-[100dvw] flex items-center justify-center bg-transparent">
      <Image src={"/loader.gif"} height={100} width={100} alt="loader" />
    </div>
  );
};

export default Loading;