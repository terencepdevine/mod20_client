import { useState, useMemo } from 'react';
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../query/queryClient";
import { toast } from "react-toastify";
import { ImageType } from "@mod20/types";
import { 
  getImages, 
  uploadImage, 
  addImageToRoleField, 
  removeImageFromRoleField, 
  addImageToRole, 
  removeImageFromRole, 
  deleteImage 
} from '../services/apiSystem';


interface UseImageFieldsProps {
  systemSlug: string;
  sectionSlug: string;
  role: any; // Role data
}

export // Temporary interface for config until we fully refactor
interface TempImageFieldConfig {
  type: string;
  label: string;
  description: string;
  isMultiple: boolean;
  maxCount?: number;
  apiFieldName: 'images' | 'imageIds' | 'backgroundImageId';
}

export const useImageFields = ({ systemSlug, sectionSlug, role }: UseImageFieldsProps) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    config: TempImageFieldConfig | null;
  }>({
    isOpen: false,
    config: null,
  });

  // Always load assigned images for display in sections
  const assignedImageIds = useMemo(() => {
    const ids = new Set<string>();
    
    // Add gallery images
    const galleryIds = role?.imageIds || [];
    galleryIds.forEach((id: string) => ids.add(id));
    
    // Add background image
    if (role?.backgroundImageId) {
      ids.add(role.backgroundImageId);
    }
    
    return Array.from(ids);
  }, [role?.imageIds, role?.images, role?.backgroundImageId]);

  const { data: assignedImages = [] } = useQuery({
    queryKey: ["images", "assigned", assignedImageIds],
    queryFn: getImages,
    enabled: assignedImageIds.length > 0,
    staleTime: 5 * 60 * 1000,
    select: (allImages) => {
      // Filter to only return images that are assigned to this role
      return allImages.filter((img: ImageType) => {
        return assignedImageIds.includes(img.id);
      });
    }
  });

  // Query for full media library - only when modal is open
  const { data: fullMediaLibraryImages = [], isLoading: isLoadingImages, error: imagesError } = useQuery({
    queryKey: ["images"],
    queryFn: getImages,
    enabled: modalState.isOpen,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Use the appropriate image set based on context
  const mediaLibraryImages = modalState.isOpen ? fullMediaLibraryImages : assignedImages;

  // Mutation for uploading multiple images to media library
  const { mutate: uploadToMediaLibraryMutation, isPending: isUploading } = useMutation({
    mutationFn: async (files: File[]) => {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("alt", `${role?.name || "Role"} image`);
        formData.append("description", `Image for ${role?.name || "role"}`);
        return await uploadImage(formData);
      });
      return await Promise.all(uploadPromises);
    },
    onSuccess: (results) => {
      const count = results.length;
      toast(`${count} image${count > 1 ? 's' : ''} uploaded successfully!`);
      queryClient.invalidateQueries({ queryKey: ["images"] });
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
      await queryClient.cancelQueries({ queryKey: ["images"] });
      await queryClient.cancelQueries({ queryKey: ["role", systemSlug, sectionSlug] });
      
      // Snapshot the previous values
      const previousImages = queryClient.getQueryData(["images"]);
      const previousRole = queryClient.getQueryData(["role", systemSlug, sectionSlug]);
      
      // Optimistically remove image from images list
      queryClient.setQueryData(["images"], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.filter((img: any) => img.id !== imageId);
      });
      
      // Optimistically remove image from role data
      queryClient.setQueryData(["role", systemSlug, sectionSlug], (old: any) => {
        if (!old?.role) return old;
        
        const updatedRole = { ...old.role };
        
        // Remove from imageIds array if present
        if (updatedRole.imageIds) {
          updatedRole.imageIds = updatedRole.imageIds.filter((id: string) => id !== imageId);
        }
        
        // Remove from backgroundImageId if it matches
        if (updatedRole.backgroundImageId === imageId) {
          updatedRole.backgroundImageId = null;
        }
        
        return { ...old, role: updatedRole };
      });
      
      return { previousImages, previousRole };
    },
    onSuccess: () => {
      toast("Image deleted permanently from media library");
    },
    onError: (err: Error, imageId, context) => {
      // Roll back the optimistic updates
      if (context?.previousImages) {
        queryClient.setQueryData(["images"], context.previousImages);
      }
      if (context?.previousRole) {
        queryClient.setQueryData(["role", systemSlug, sectionSlug], context.previousRole);
      }
      toast.error(`Failed deleting image: ${err.message}`);
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: ["images"] });
      queryClient.invalidateQueries({ queryKey: ["role", systemSlug, sectionSlug] });
    },
  });

  // Helper function to get images for a specific field
  const getImagesForField = (config: TempImageFieldConfig): ImageType[] => {
    if (!Array.isArray(mediaLibraryImages) || !mediaLibraryImages.length) {
      return [];
    }

    let imageIdentifiers: string[] = [];
    
    if (config.apiFieldName === 'images' || config.apiFieldName === 'imageIds') {
      imageIdentifiers = role?.imageIds || [];
    } else if (config.apiFieldName === 'backgroundImageId') {
      const backgroundId = role?.backgroundImageId;
      imageIdentifiers = backgroundId ? [backgroundId] : [];
    }
    
    if (!imageIdentifiers.length) {
      return [];
    }
    
    const fieldImages = mediaLibraryImages.filter(img => {
      return imageIdentifiers.includes(img.id);
    });
    
    return fieldImages;
  };

  // Mutation for adding image to role with optimistic updates
  const { mutate: addImageMutation } = useMutation({
    mutationFn: async ({ imageId, config }: { imageId: string, config: TempImageFieldConfig }) => {
      if (config.apiFieldName === 'images' || config.apiFieldName === 'imageIds') {
        return await addImageToRole(systemSlug, sectionSlug, imageId);
      } else if (config.apiFieldName === 'backgroundImageId') {
        return await addImageToRoleField(systemSlug, sectionSlug, imageId, 'backgroundImageId');
      }
      throw new Error('Invalid field type');
    },
    onMutate: async ({ imageId, config }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["role", systemSlug, sectionSlug] });
      
      // Snapshot the previous value
      const previousRole = queryClient.getQueryData(["role", systemSlug, sectionSlug]);
      
      // Optimistically update the role data
      queryClient.setQueryData(["role", systemSlug, sectionSlug], (old: any) => {
        if (!old?.role) return old;
        
        const updatedRole = { ...old.role };
        
        if (config.apiFieldName === 'images' || config.apiFieldName === 'imageIds') {
          const currentIds = updatedRole.imageIds || [];
          updatedRole.imageIds = [...currentIds, imageId];
        } else if (config.apiFieldName === 'backgroundImageId') {
          updatedRole.backgroundImageId = imageId;
        }
        
        return { ...old, role: updatedRole };
      });
      
      return { previousRole };
    },
    onSuccess: (data, { config }) => {
      toast(`Image added to ${config.label.toLowerCase()} successfully`);
      
      // Close modal for single image fields, keep open for multiple
      if (!config.isMultiple) {
        closeModal();
      }
    },
    onError: (err: Error, { config }, context) => {
      // Roll back the optimistic update
      if (context?.previousRole) {
        queryClient.setQueryData(["role", systemSlug, sectionSlug], context.previousRole);
      }
      toast.error(`Failed adding image to ${config.label.toLowerCase()}: ${err.message}`);
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: ["role", systemSlug, sectionSlug] });
      queryClient.invalidateQueries({ queryKey: ["images"] });
    }
  });

  // Generic function to handle adding image to any field
  const handleAddImageToField = (imageId: string, config: TempImageFieldConfig) => {
    // Check if we're at the max limit for this field type
    const currentImages = getImagesForField(config);
    if (config.maxCount && currentImages.length >= config.maxCount) {
      toast.error(`Cannot exceed ${config.maxCount} image${config.maxCount > 1 ? 's' : ''} for ${config.label}`);
      return;
    }

    // For single image fields, replace existing image
    if (!config.isMultiple && currentImages.length > 0) {
      const confirmReplace = window.confirm(`Replace the current ${config.label.toLowerCase()}?`);
      if (!confirmReplace) return;
    }

    addImageMutation({ imageId, config });
  };

  // Mutation for removing image from role with optimistic updates
  const { mutate: removeImageMutation } = useMutation({
    mutationFn: async ({ imageId, config }: { imageId: string, config: TempImageFieldConfig }) => {
      if (config.apiFieldName === 'images' || config.apiFieldName === 'imageIds') {
        return await removeImageFromRole(systemSlug, sectionSlug, imageId);
      } else if (config.apiFieldName === 'backgroundImageId') {
        return await removeImageFromRoleField(systemSlug, sectionSlug, imageId, 'backgroundImageId');
      }
      throw new Error('Invalid field type');
    },
    onMutate: async ({ imageId, config }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["role", systemSlug, sectionSlug] });
      
      // Snapshot the previous value
      const previousRole = queryClient.getQueryData(["role", systemSlug, sectionSlug]);
      
      // Optimistically update the role data
      queryClient.setQueryData(["role", systemSlug, sectionSlug], (old: any) => {
        if (!old?.role) return old;
        
        const updatedRole = { ...old.role };
        
        if (config.apiFieldName === 'images' || config.apiFieldName === 'imageIds') {
          updatedRole.imageIds = (updatedRole.imageIds || []).filter((id: string) => id !== imageId);
        } else if (config.apiFieldName === 'backgroundImageId') {
          updatedRole.backgroundImageId = null;
        }
        
        return { ...old, role: updatedRole };
      });
      
      return { previousRole };
    },
    onSuccess: (data, { config }) => {
      toast(`Image removed from ${config.label.toLowerCase()} successfully`);
    },
    onError: (err: Error, { config }, context) => {
      // Roll back the optimistic update
      if (context?.previousRole) {
        queryClient.setQueryData(["role", systemSlug, sectionSlug], context.previousRole);
      }
      toast.error(`Failed removing image from ${config.label.toLowerCase()}: ${err.message}`);
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: ["role", systemSlug, sectionSlug] });
      queryClient.invalidateQueries({ queryKey: ["images"] });
    }
  });

  // Generic function to handle removing image from any field
  const handleRemoveImageFromField = (imageId: string, config: TempImageFieldConfig) => {
    removeImageMutation({ imageId, config });
  };

  const handleImageDelete = (imageId: string, imageName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${imageName}" from the media library? This action cannot be undone and will remove the image from all roles.`)) {
      deleteImageMutation(imageId);
    }
  };

  const openModal = (config: TempImageFieldConfig) => {
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