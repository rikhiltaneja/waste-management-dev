"use client";

import { DeleteConfirmationModal } from "./delete-confirmation-modal";

interface User {
  id: string;
  name: string;
  email: string;
}

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (userId: string) => void;
  isLoading?: boolean;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  user,
  onConfirm,
  isLoading = false,
}: DeleteUserModalProps) {
  const handleConfirm = () => {
    if (user) {
      onConfirm(user.id);
    }
  };

  const description = user
    ? `Are you sure you want to delete user "${user.name}"? This will permanently remove their account and all associated data.

Email: ${user.email}

This action cannot be undone.`
    : undefined;

  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Delete User Account"
      description={description}
      itemType="user account"
      confirmButtonText="Delete User"
      isLoading={isLoading}
    />
  );
}