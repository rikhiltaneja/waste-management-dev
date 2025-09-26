import { SidebarSection } from "@/components/sidebar/sidebar";
import { Activity, CalendarClock, ChartBar, ChartBarIncreasing, ChartColumn, Megaphone } from "lucide-react";
import { BookOpenCheck } from "lucide-react";
import { BrushCleaning } from "lucide-react";
import { Calendar } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { Camera } from "lucide-react";
import { Clock2 } from "lucide-react";
import { Coins } from "lucide-react";
import { CoinsIcon } from "lucide-react";
import { DollarSign } from "lucide-react";
import { HandCoins } from "lucide-react";
import { HelpCircle } from "lucide-react";
import { Home } from "lucide-react";
import { Settings } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import { ShoppingBasket } from "lucide-react";
import { Users } from "lucide-react";
import { Warehouse } from "lucide-react";
import { Wrench } from "lucide-react";

export const AdminSidebarSections: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
      { id: "leaderboard", label: "Leader Board", icon: Activity, href: "/dashboard/leaderboard" },
      { id: "complaints", label: "Complaints", icon: Megaphone, href: "/dashboard/complaints" },
      { id: "trainings", label: "Trainings", icon: CalendarClock, href: "/dashboard/trainings" },
    
    ],
  },
  {
    title: "Management",
    items: [
      { id: "workers", label: "Workers", icon: Wrench, href: "/dashboard/workers" },
      { id: "users", label: "Users", icon: Users, href: "/dashboard/users" },
      { id: "donations", label: "Donations", icon: HandCoins, href: "/dashboard/donations" },
    ],
  },
  // {
  //   title: "Community and Compliance",
  //   items: [
  //     { id: "cleaningdrives", label: "Drives & Campaigns", icon: BrushCleaning, href: "/dashboard/cleaningdrives" },
  //     { id: "trainings", label: "Trainings", icon: BookOpenCheck, href: "/dashboard/trainings" },
  //     { id: "incentives", label: "Incentives/Penalties", icon: Coins, href: "/dashboard/incentives" },
  //     { id: "support", label: "Support", icon: HelpCircle, href: "/support" },
  //     { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
  //   ],
  // },
];

export const WorkerSidebarSection: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
      { id: "events", label: "Trainings", icon: Calendar, href: "/dashboard/trainings" },
    ],
  },
  {
    title: "Management",
    items: [
      { id: "donation", label: "Donation", icon: CoinsIcon, href: "/dashboard/donations" },
      { id: "incentives", label: "Incentives", icon: DollarSign, href: "/dashboard/incentives" },
    ],
  },
  {
    title: "Misc",
    items: [
      { id: "shopping", label: "Shop", icon: ShoppingBag, href: "/dashboard/shop" },
      { id: "facilities", label: "Facilities", icon: BookOpenCheck, href: "/dashboard/facilities" },
    ],
  },
  {
    title: "Support & Settings",
    items: [
      { id: "support", label: "Support", icon: HelpCircle, href: "/dashboard/support" },
      { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
];
export const CitizenSidebarSection: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
      { id: "events", label: "Trainings", icon: Calendar, href: "/dashboard/trainings" },
      { id: "complaints", label: "Complaints", icon: Camera, href: "/dashboard/complaints/new" },
    ],
  },
  {
    title: "Community & Compliance",
    items: [
      { id: "donate", label: "Donate", icon: HandCoins, href: "/dashboard/donations" },
      // { id: "facilities", label: "Facilities", icon: BookOpenCheck, href: "/dashboard/facilities" },
      // { id: "cleaningdrives", label: "Cleaning Drives", icon: BrushCleaning, href: "/cleaningdrives" },
      { id: "shop", label: "Shop", icon: ShoppingBasket, href: "/dashboard/shop" },
    ],
  },
  {
    title: "Support & Settings",
    items: [
  //     { id: "support", label: "Support", icon: HelpCircle, href: "/support" },
      { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
];


// ------MOBILE NAVBAR---------
interface NavItem {
  id: number;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  href: string;
}

export const CitizenItems: NavItem[] = [
  { id: 0, icon: Home, label: "Home", href: "/dashboard" },
  {
    id: 1,
    icon: CalendarDays,
    label: "Trainings",
    href: "/dashboard/trainings",
  },
  {
    id: 2,
    icon: Camera,
    label: "New Complaint",
    href: "/dashboard/complaints/new",
  },
  {
    id: 3,
    icon: Coins,
    label: "My Donations",
    href: "/dashboard/donations",
  },
  { id: 4, icon: Settings, label: "Settings", href: "dashboard/settings" },
];
export const AdminItems: NavItem[] = [
  { id: 0, icon: Home, label: "Home", href: "/dashboard" },
  {
    id: 1,
    icon: CalendarDays,
    label: "Trainings",
    href: "/dashboard/trainings",
  },
  {
    id: 2,
    icon: Megaphone,
    label: "Complaints",
    href: "/dashboard/complaints",
  },
  {
    id: 3,
    icon: ChartColumn,
    label: "Leaderboard",
    href: "/dashboard/leaderboard",
  },
  { id: 4, icon: Settings, label: "Settings", href: "dashboard/settings" },
];
export const WorkerItems: NavItem[] = [
  { id: 0, icon: Home, label: "Home", href: "/dashboard" },
  {
    id: 1,
    icon: CalendarDays,
    label: "Trainings",
    href: "/dashboard/trainings",
  },
  {
    id: 2,
    icon: Camera,
    label: "New Complaint",
    href: "/dashboard/complaints/new",
  },
  {
    id: 3,
    icon: Clock2,
    label: "My Complaints",
    href: "/dashboard/complaints",
  },
  { id: 4, icon: Settings, label: "Settings", href: "dashboard/settings" },
];
