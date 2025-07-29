import { useState } from 'react';
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../query/queryClient";
import { toast } from "react-toastify";
import { ImageType } from "@mod20/types";
import { 
  getImages, 
  uploadImage, 
  deleteImage 
} from '../services/apiSystem';

import { ImageFieldConfig } from '../components/MediaLibrary/types';

interface UseMediaLibraryProps {
  entityType: string; // e.g., 'role', 'system', 'race'
  entityData: any; // Current entity data
  queryKey: string[]; // Query key for the entity (e.g., ['role', systemSlug, sectionSlug])
  updateEntity: (fieldKey: string, value: any) => Promise<any>; // Function to update entity
  systemId?: string; // System ID for filtering images
}

export const useMediaLibrary = ({ 
  entityType, 
  entityData, 
  queryKey, 
  updateEntity,
  systemId 
}: UseMediaLibraryProps) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    config: ImageFieldConfig | null;
  }>({
    isOpen: false,
    config: null,
  });

  // No more assigned images calculation - use full library to prevent query-based flashing

  // Load media library filtered by system if systemId is provided
  const { data: mediaLibraryImages = [], isLoading: isLoadingImages, error: imagesError } = useQuery({
    queryKey: ["images", systemId],
    queryFn: () => {
      console.log('useMediaLibrary: Loading images for systemId:', systemId);
      return getImages(systemId);
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for uploading multiple images to media library
  const { mutate: uploadToMediaLibraryMutation, isPending: isUploading } = useMutation({
    mutationFn: async (files: File[]) => {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("alt", `${entityType} image`);
        formData.append("description", `Image for ${entityType}`);
        if (systemId) {
          console.log('useMediaLibrary: Uploading image with systemId:', systemId);
          formData.append("system", systemId);
        } else {
          console.warn('useMediaLibrary: No systemId provided for upload!');
        }
        return await uploadImage(formData);
      });
      return await Promise.all(uploadPromises);
    },
    onSuccess: (results) => {
      const count = results.length;
      toast(`${count} image${count > 1 ? 's' : ''} uploaded successfully!`);
      queryClient.invalidateQueries({ queryKey: ["images", systemId] });
    },
    onError: (err: Error) => {
      toast.error(`Upload failed: ${err.message}`);
    },
  });

  // Mutation for permanently deleting image from media library
  const { mutate: deleteImageMutation } = useMutation({
    mutationFn: async (imageId: string) => {
      await deleteImage(imageId);
    },
    onMutate: async (imageId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["images", systemId] });
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot the previous values
      const previousImages = queryClient.getQueryData(["images", systemId]);
      const previousEntity = queryClient.getQueryData(queryKey);
      
      // Optimistically remove image from images list
      queryClient.setQueryData(["images", systemId], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.filter((img: any) => img.id !== imageId);
      });
      
      // Optimistically remove image from entity data
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        
        const entityToUpdate = old.role || old.system || old.race || old; // Handle different response structures
        const updatedEntity = { ...entityToUpdate };
        
        // Remove from any image ID arrays
        Object.keys(updatedEntity).forEach(key => {
          if (Array.isArray(updatedEntity[key]) && key.toLowerCase().includes('image')) {
            updatedEntity[key] = updatedEntity[key].filter((id: string) => id !== imageId);
          }
          
          // Remove from single image ID fields
          if (updatedEntity[key] === imageId && key.toLowerCase().includes('image')) {
            updatedEntity[key] = null;
          }
        });
        
        return { ...old, [entityType]: updatedEntity };
      });
      
      return { previousImages, previousEntity };
    },
    onSuccess: () => {
      // Image deleted silently from media library
    },
    onError: (_err: Error, _imageId, context) => {
      // Roll back the optimistic updates
      if (context?.previousImages) {
        queryClient.setQueryData(["images", systemId], context.previousImages);
      }
      if (context?.previousEntity) {
        queryClient.setQueryData(queryKey, context.previousEntity);
      }
      // Failed deletion handled silently
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: ["images", systemId] });
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Generic mutation for adding image to entity field
  const { mutate: addImageMutation } = useMutation({
    mutationFn: async ({ imageId, config }: { imageId: string, config: ImageFieldConfig }) => {
      const currentValue = entityData[config.fieldKey];
      let newValue;
      
      if (config.isMultiple) {
        // For multiple image fields, always use ordered structure
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        
        // Add to ordered structure
        const nextOrder = currentArray.length > 0 
          ? Math.max(...currentArray.map((item: any) => item.orderby)) + 1 
          : 0;
        newValue = [...currentArray, { imageId, orderby: nextOrder }];
      } else {
        // For single fields, replace value
        newValue = imageId;
      }
      
      return await updateEntity(config.fieldKey, newValue);
    },
    onSuccess: (_data, { config }) => {
      // Close modal for single image fields, keep open for multiple
      if (!config.isMultiple) {
        closeModal();
      }
    },
    onError: (_err: Error, _variables) => {
      // Error handling without cache manipulation - local state handles updates
    },
  });

  // Generic mutation for removing image from entity field
  const { mutate: removeImageMutation } = useMutation({
    mutationFn: async ({ imageId, config }: { imageId: string, config: ImageFieldConfig }) => {
      const currentValue = entityData[config.fieldKey];
      let newValue;
      
      if (config.isMultiple) {
        // For multiple image fields, always use ordered structure
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        
        // Remove from ordered structure and reorder
        const filteredArray = currentArray.filter((item: any) => item.imageId !== imageId);
        newValue = filteredArray.map((item: any, index: number) => ({
          imageId: item.imageId,
          orderby: index
        }));
      } else {
        // For single fields, set to null
        newValue = null;
      }
      
      return await updateEntity(config.fieldKey, newValue);
    },
    onSuccess: (_data, _variables) => {
      // Image removed silently - local state handles UI updates
    },
    onError: (_err: Error, _variables) => {
      // Error handling without cache manipulation - local state handles updates
    },
  });

  // Helper function to get images for a specific field
  const getImagesForField = (config: ImageFieldConfig): ImageType[] => {
    if (!Array.isArray(mediaLibraryImages) || !mediaLibraryImages.length || !entityData) {
      return [];
    }

    const fieldValue = entityData[config.fieldKey];
    let imageIdentifiers: string[] = [];
    
    if (config.isMultiple && Array.isArray(fieldValue)) {
      // Always expect ordered structure: { imageId: string, orderby: number }[]
      const orderedImages = fieldValue.sort((a, b) => a.orderby - b.orderby);
      imageIdentifiers = orderedImages.map(item => item.imageId);
    } else if (!config.isMultiple && typeof fieldValue === 'string') {
      imageIdentifiers = [fieldValue];
    }
    
    if (!imageIdentifiers.length) {
      return [];
    }
    
    // Return images in the correct order
    const fieldImages = imageIdentifiers.map(imageId => 
      mediaLibraryImages.find(img => img.id === imageId)
    ).filter(Boolean) as ImageType[];
    
    return fieldImages;
  };

  // Generic function to handle adding image to any field
  const handleAddImageToField = (imageId: string, config: ImageFieldConfig) => {
    // Check if we're at the max limit for this field type
    const currentImages = getImagesForField(config);
    if (config.maxCount && currentImages.length >= config.maxCount) {
      // Max limit reached - prevent addition but don't show toast
      return;
    }

    // For single image fields, replace existing image
    if (!config.isMultiple && currentImages.length > 0) {
      const confirmReplace = window.confirm(`Replace the current ${config.label.toLowerCase()}?`);
      if (!confirmReplace) return;
    }

    addImageMutation({ imageId, config });
  };

  // Generic function to handle removing image from any field
  const handleRemoveImageFromField = (imageId: string, config: ImageFieldConfig) => {
    removeImageMutation({ imageId, config });
  };

  const handleImageDelete = (imageId: string, imageName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${imageName}" from the media library? This action cannot be undone and will remove the image from all ${entityType}s.`)) {
      deleteImageMutation(imageId);
    }
  };

  const openModal = (config: ImageFieldConfig) => {
    setModalState({
      isOpen: true,
      config,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      config: null,
    });
  };

  return {
    modalState,
    mediaLibraryImages,
    isLoadingImages,
    imagesError,
    isUploading,
    getImagesForField,
    handleAddImageToField,
    handleRemoveImageFromField,
    handleImageDelete,
    uploadToMediaLibraryMutation,
    openModal,
    closeModal,
  };
};