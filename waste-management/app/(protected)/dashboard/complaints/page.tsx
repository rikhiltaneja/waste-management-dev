import { AdminComplaintPage } from "./(layouts)/Admin";
import { AdminOnlyProtection } from "@/components/auth/AdminOnlyProtection";

export default function Complaints() {
  return (
    <AdminOnlyProtection>
      <AdminComplaintPage />
    </AdminOnlyProtection>
  );
}