import SideBarLayout from "@/components/sidebar/sidebar-layout";
import MobileNavbar from "@/components/ui/mob-navbar";
import { ClerkProvider } from "@clerk/nextjs";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
          <SideBarLayout>{children}</SideBarLayout>
          <div>
            <MobileNavbar />
          </div>
    </ClerkProvider>
  );
}