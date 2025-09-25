import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toast } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Waste Management System",
  description: "Smart waste management and monitoring system for citizens and administrators",
  manifest: "/manifest.json",
  themeColor: "#22c55e",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WasteManager",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="theme-color" content="#22c55e" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="WasteManager" />
          <meta name="mobile-web-app-capable" content="yes" />
          <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body
          className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
        >
          {children}
          <Toast theme="light" />
        </body>
      </html>
    </ClerkProvider>
  );
}
