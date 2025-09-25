import MobileNavbar from "@/components/ui/mob-navbar";
import { ClerkProvider } from "@clerk/nextjs";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="h-screen bg-background overflow-hidden">
        {children}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <MobileNavbar />
        </div>
      </div>
  );
}