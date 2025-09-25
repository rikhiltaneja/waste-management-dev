"use client"
import SideBarLayout from "@/components/sidebar/sidebar-layout";
import { AdminSidebarSections, CitizenSidebarSection, WorkerSidebarSection } from "@/constants/sidebar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
      const { user } = useUser();

      const role = (user?.publicMetadata?.role as string) || "";

      const sidebarSections =
    role === "Admin"
      ? AdminSidebarSections
      : role === "Worker"
      ? WorkerSidebarSection
      : CitizenSidebarSection;


  return (
      <div className="h-screen bg-background overflow-hidden">
         <SideBarLayout customSidebarSections={sidebarSections}>
              <div className="pt-8">
                      {children}
              </div>
          </SideBarLayout>
      </div>
  );
}