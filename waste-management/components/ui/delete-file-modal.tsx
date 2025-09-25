"use client";

import { DeleteConfirmationModal } from "./delete-confirmation-modal";

interface FileItem {
  id: string;
  name: string;
  size?: number;
  type?: string;
}

interface DeleteFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
  onConfirm: (fileId: string) => void;
  isLoading?: boolean;
}

export function DeleteFileModal({
  isOpen,
  onClose,
  file,
  onConfirm,
  isLoading = false,
}: DeleteFileModalProps) {
  const handleConfirm = () => {
    if (file) {
      onConfirm(file.id);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  const description = file
    ? `Are you sure you want to delete "${file.name}"? This action cannot be undone.

${file.type ? `Type: ${file.type}` : ""}
${file.size ? `Size: ${formatFileSize(file.size)}` : ""}`
    : undefined;

  return (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Delete File"
      description={description}
      itemType="file"
      confirmButtonText="Delete File"
      isLoading={isLoading}
    />
  );
}