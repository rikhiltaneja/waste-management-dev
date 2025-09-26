"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Leaf,
  Shield,
  Recycle,
  Zap,
  MoreHorizontal,
  CheckCircle,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import confetti from "canvas-confetti";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { Roles } from "@/types/globals";

const donationTypes = [
  {
    id: "cleanup",
    name: "Community Clean-up Drives",
    icon: Users,
    description: "Support local community cleaning initiatives",
    impact: "1 drive = 500kg waste removed",
  },
  {
    id: "recycling",
    name: "Recycling Centers & Scrap Management",
    icon: Recycle,
    description: "Fund recycling infrastructure and equipment",
    impact: "₹100 = 50kg recycled materials",
  },
  {
    id: "safety",
    name: "Safety Kits for Waste Workers",
    icon: Shield,
    description: "Provide protective gear for waste management workers",
    impact: "₹200 = 1 complete safety kit",
  },
  {
    id: "awareness",
    name: "Awareness & Training Programs",
    icon: Award,
    description: "Educational programs for sustainable practices",
    impact: "₹500 = 50 people trained",
  },
  {
    id: "plantation",
    name: "Tree Plantation & Composting",
    icon: Leaf,
    description: "Green initiatives and organic waste management",
    impact: "₹50 = 5 trees planted",
  },
  {
    id: "energy",
    name: "Waste-to-Energy Projects",
    icon: Zap,
    description: "Convert waste into renewable energy",
    impact: "₹1000 = 100kWh clean energy",
  },
  {
    id: "others",
    name: "Others",
    icon: MoreHorizontal,
    description: "Support various environmental initiatives",
    impact: "Every contribution counts",
  },
];

const presetAmounts = [50, 100, 200, 500, 1000, 2000];

const recentDonations = [
  {
    name: "Aayush K.",
    cause: "Tree Plantation",
    amount: 100,
    timeAgo: "2 hours ago",
    avatar: "AK",
  },
  {
    name: "Rajab S.",
    cause: "Safety Kits",
    amount: 200,
    timeAgo: "5 hours ago",
    avatar: "RS",
  },
  {
    name: "Priya M.",
    cause: "Clean-up Drives",
    amount: 500,
    timeAgo: "1 day ago",
    avatar: "PM",
  },
  {
    name: "Dev P.",
    cause: "Recycling Centers",
    amount: 150,
    timeAgo: "2 days ago",
    avatar: "DP",
  },
  {
    name: "Sarah L.",
    cause: "Awareness Programs",
    amount: 300,
    timeAgo: "3 days ago",
    avatar: "SL",
  },
  {
    name: "Mike R.",
    cause: "Waste-to-Energy",
    amount: 1000,
    timeAgo: "1 week ago",
    avatar: "MR",
  },
];

const impactStats = [
  {
    label: "Total Raised",
    value: "₹2,45,000",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    label: "Active Donors",
    value: "1,234",
    icon: Users,
    color: "text-blue-600",
  },
  {
    label: "Projects Funded",
    value: "45",
    icon: CheckCircle,
    color: "text-purple-600",
  },
];

export function DonationsPage() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [selectedCause, setSelectedCause] = useState(donationTypes[0]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isPaying, setIsPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const confettiRef = useRef<ConfettiRef>(null);

  const handlePay = async () => {
    setIsPaying(true);
    const amount = selectedAmount ?? Number(customAmount);
    const token = await getToken();
    displayRazorpay(amount, token);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/donations/new`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsPaying(false);
    setShowSuccess(true);

    // Trigger confetti celebration
    triggerSuccessConfetti();

    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedAmount(null);
      setCustomAmount("");
    }, 3000);
  };

  function loadScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay(amount: number, token: unknown) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razropay failed to load!!");
      return;
    }

    let data;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/donations/new`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      data = res.data;
      console.log(data);
    } catch (err) {
      console.error(err);
      return;
    }

    console.log(data);

    const options = {
      key: process.env.NEXT_PUBLIC_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Waste Wise",
      description: "Donation",
      image: "../../../../public/logo_green.png",
      order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: "http://localhost:3000/dashboard/donations",
      // notes: {
      //   address: "Razorpay Corporate Office",
      // },
      theme: {
        color: "#1D923C",
      },
    };
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  }

  const triggerSuccessConfetti = () => {
    // Multiple confetti bursts for celebration
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Left side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"],
      });

      // Right side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"],
      });
    }, 250);
  };

  const selectedCauseData =
    donationTypes.find((cause) => cause.name === selectedCause.name) ||
    donationTypes[0];
  const IconComponent = selectedCauseData.icon;
  const donationAmount = (selectedAmount ?? Number(customAmount)) || 0;
  
  // Check if user is admin
  const userRole = user?.publicMetadata?.role as Roles;
  const isAdmin = userRole === 'Admin'


  return (
    <div className="bg-background min-h-screen relative">
      {/* Confetti Canvas */}
      <Confetti
        ref={confettiRef}
        className="absolute inset-0 pointer-events-none z-50"
        manualstart={true}
      />
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Main Grid Container */}
        <div className="grid grid-cols-3 gap-6">
          {/* Header - Full Width */}
          <div className="col-span-full">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-6 w-6 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Make a Difference
              </h1>
            </div>
            <p className="text-muted-foreground">
              Support environmental initiatives and create a cleaner, greener
              future for everyone.
            </p>
          </div>

          {/* Impact Stats - Full Width */}
          <div className="col-span-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn("p-2 rounded-lg bg-muted", stat.color)}
                        >
                          <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            {stat.value}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Donation Form - Hidden for Admin users */}
          {!isAdmin && (
            <div className="col-span-full lg:col-span-2">
              <Card className="border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    Donation Details
                  </CardTitle>
                  <CardDescription>
                    Choose a cause and amount to make your contribution
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cause Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground pb-2">
                      Select Cause
                    </label>
                    <Select
                      value={selectedCause.name}
                      onValueChange={(value) => {
                        const cause = donationTypes.find((c) => c.name === value);
                        if (cause) setSelectedCause(cause);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {donationTypes.map((cause) => (
                          <SelectItem key={cause.id} value={cause.name}>
                            <div className="flex items-center cursor-pointer gap-2">
                              <cause.icon className="h-4 w-4" />
                              {cause.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {selectedCauseData.description}
                    </p>
                  </div>

                  {/* Amount Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground pb-2">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {presetAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={
                            selectedAmount === amount ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount("");
                          }}
                          className="h-12 cursor-pointer"
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Custom:
                      </span>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Impact Preview */}
                  {donationAmount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 bg-accent rounded-lg border"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Your Impact</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedCauseData.impact}
                      </p>
                      <p className="text-lg font-semibold text-primary mt-1">
                        ₹{donationAmount.toLocaleString()}
                      </p>
                    </motion.div>
                  )}

                  {/* Success Message */}
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-green-50 border border-green-200 rounded-lg text-center"
                    >
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-green-800 font-medium">
                        Thank you for your donation!
                      </p>
                      <p className="text-green-600 text-sm">
                        Your contribution will make a real difference.
                      </p>
                    </motion.div>
                  )}

                  {/* Donate Button */}
                  <Button
                    onClick={handlePay}
                    disabled={
                      isPaying ||
                      (!selectedAmount && !customAmount) ||
                      showSuccess
                    }
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                  >
                    {isPaying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : showSuccess ? (
                      "Donation Complete!"
                    ) : (
                      `Donate ₹${donationAmount.toLocaleString()}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sidebar - Hidden for Admin users */}
          {!isAdmin && (
            <div className="col-span-full lg:col-span-1 space-y-6">
              {/* Illustration */}
              <Card className="border shadow-sm h-full">
                <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                  <img
                    src="/donation-dynamic.svg"
                    alt="Donations Illustration"
                    className="w-full max-w-xs mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-foreground mb-2">
                    Every Contribution Counts
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Join thousands of others in creating a sustainable future.
                  </p>
                </CardContent>
                </Card>
            </div>
          )}

         
          {/* Recent Donations */}
          <Card className="border shadow-sm col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Recent Donations</CardTitle>
              <CardDescription>
                Latest contributions from our community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentDonations.slice(0, 4).map((donation, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary-foreground flex items-center justify-center text-xs font-medium">
                    {donation.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {donation.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {donation.cause}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">
                      ₹{donation.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {donation.timeAgo}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
