import React from 'react';

export interface ImageFieldConfig {
  type: string;
  label: string;
  description: string;
  isMultiple: boolean;
  maxCount?: number;
  fieldKey: string; // Generic field key (e.g., 'imageIds', 'backgroundImageId', 'heroImageId')
}

// Generic interface for ordered images (not specific to Role)
export interface OrderedImage {
  imageId: string;
  orderby: number;
}

export interface MediaLibraryContextType {
  getImagesForField: (config: ImageFieldConfig) => any[];
  handleAddImageToField: (imageId: string, config: ImageFieldConfig) => void;
  handleRemoveImageFromField: (imageId: string, config: ImageFieldConfig) => void;
  handleReorderImages: (imageIds: string[], config: ImageFieldConfig) => void;
  openModal: (config: ImageFieldConfig) => void;
  isUpdating: boolean;
}

export interface MediaLibraryProviderProps {
  entityType: string; // e.g., 'role', 'system', 'race'
  entityData: any; // Current entity data
  queryKey: string[]; // Query key for the entity
  updateEntity: (fieldKey: string, value: any) => Promise<any>; // Function to update entity
  isUpdating?: boolean;
  children: React.ReactNode;
}