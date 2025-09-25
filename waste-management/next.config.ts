import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

// Simple approach: Disable PWA when using Turbopack to avoid webpack conflicts
// The warning occurs because Turbopack and webpack-based plugins don't mix well

export default nextConfig;
