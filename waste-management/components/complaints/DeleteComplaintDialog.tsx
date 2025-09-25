"use client";

import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { Complaint } from "@/types";

interface DeleteComplaintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onConfirm: (complaintId: number) => void;
  isLoading?: boolean;
}

export function DeleteComplaintDialog({
  isOpen,
  onClose,
  complaint,
  onConfirm,
  isLoading = false,
}: DeleteComplaintDialogProps) {
  const handleConfirm = () => {
    if (complaint) {
      onConfirm(complaint.id);
    }
  };

  const description = complaint
    ? `Are you sure you want to delete complaint #${complaint.id}? This action cannot be undone.

Complaint: ${complaint.description}
Citizen: ${complaint.citizen.name}
Location: ${complaint.citizen.locality.name}`
    : undefined;

  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Delete Complaint"
      description={description}
      itemType="complaint"
      isLoading={isLoading}
    />
  );
}