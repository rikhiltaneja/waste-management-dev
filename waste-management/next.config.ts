import type { NextConfig } from "next";

// @ts-expect-error - next-pwa doesn't have TypeScript declarations
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

const pwaConfig = {
  dest: "public",
  disable: false, // Enable PWA for testing
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
};

export default withPWA(pwaConfig)(nextConfig);
