import SideBarLayout from "@/components/sidebar/sidebar-layout";

export default function GrievanceNewLayout({ children }: { children: React.ReactNode }) {
  return (
    <SideBarLayout>
      {children}
    </SideBarLayout>
  );
}