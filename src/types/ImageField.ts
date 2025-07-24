import { ImageType } from "@mod20/types";

export interface ImageFieldProps {
  label: string;
  description: string;
  isMultiple: boolean;
  maxCount?: number;
  currentImages: ImageType[];
  onAddImage: () => void; // Just triggers modal open
  onRemoveImage: (imageId: string) => void;
  isLoading?: boolean;
}

export interface MediaLibraryModalProps {
  isOpen: boolean;
  title: string; // e.g., "Choose Images for Featured Images"
  label: string; // e.g., "Featured Images" - used for button text
  isMultiple: boolean;
  maxCount?: number;
  mediaLibraryImages: ImageType[];
  currentImages: ImageType[];
  onClose: () => void;
  onAddImage: (imageId: string) => void;
  onRemoveImage: (imageId: string) => void;
  onDeleteImage: (imageId: string, imageName: string) => void;
  onUpload: (files: File[]) => void;
  isLoadingImages?: boolean;
  imagesError?: Error | null;
  isUploading?: boolean;
}

export interface ImageUploadFieldProps {
  onUpload: (files: File[]) => void;
  isUploading?: boolean;
}