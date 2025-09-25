import { SidebarSection } from "@/components/sidebar/sidebar";
import { Activity, BarChart3, BookOpenCheck, BrushCleaning, Calendar, Coins, CoinsIcon, DollarSign, HandCoins, HelpCircle, Home, MessageSquareWarning, Settings, ShoppingBag, Users, Warehouse, Wrench } from "lucide-react";

export const AdminSidebarSections: SidebarSection[] = [
    {
      title: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
        {
          id: "leaderboard",
          label: "Leader Board",
          icon: Activity,
          href: "/dashboard/leaderboard",
        },
        {
          id: "reports",
          label: "Reports",
          icon: BarChart3,
          href: "/dashboard/reports",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          id: "workers",
          label: "Workers",
          icon: Wrench,
          href: "/dashboard/workers",
        },
        { id: "users", label: "Users", icon: Users, href: "/dashboard/users" },
        {
          id: "facilities",
          label: "Facilities",
          icon: Settings,
          href: "/dashboard/facilities",
        },
        {
          id: "inventory",
          label: "Inventory",
          icon: Warehouse,
          href: "/shop/inventory",
        },
      ],
    },
    {
      title: "Community and Compliance",
      items: [
        {
          id: "cleaningdrives",
          label: "Drives & Campaigns",
          icon: BrushCleaning,
          href: "/dashboard/cleaningdrives",
        },
        {
          id: "grievances",
          label: "Grievances",
          icon: MessageSquareWarning,
          href: "/dashboard/grievances",
        },
        {
          id: "trainings",
          label: "Trainings",
          icon: BookOpenCheck,
          href: "/dashboard/trainings",
        },
        {
          id: "incentives",
          label: "Incentives/Penalties",
          icon: Coins,
          href: "/dashboard/incentives",
        },
        {
          id: "donations",
          label: "Donations",
          icon: HandCoins,
          href: "/dashboard/donations",
        },
        { id: "support", label: "Support", icon: HelpCircle, href: "/support" },
        {
          id: "settings",
          label: "Settings",
          icon: Settings,
          href: "/dashboard/settings",
        },
      ],
    },
  ];

export const WorkerSidebarSection: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
      {
        id: "events",
        label: "Trainings",
        icon: Calendar,
        href: "/dashboard/trainings",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        id: "donation",
        label: "Donation",
        icon: CoinsIcon,
        href: "/dashboard/donations",
      },
      {
        id: "incentives",
        label: "Incentives",
        icon: DollarSign,
        href: "/dashboard/incentives",
      },
    ],
  },
  {
    title: "Misc",
    items: [
      {
        id: "shopping",
        label: "Shop",
        icon: ShoppingBag,
        href: "/dashboard/shop",
      },
    
    ],
  },
];
export const CitizenSidebarSection: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
      {
        id: "events",
        label: "Trainings",
        icon: Calendar,
        href: "/dashboard/trainings",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        id: "donation",
        label: "Donation",
        icon: Wrench,
        href: "/dashboard/donations",
      },
      {
        id: "facilities",
        label: "Facilities",
        icon: Settings,
        href: "/dashboard/facilities",
      },
      {
        id: "inventory",
        label: "Inventory",
        icon: Warehouse,
        href: "/shop/inventory",
      },
    ],
  },
];
