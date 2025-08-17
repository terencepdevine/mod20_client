import React from 'react';
import { MediaLibraryContext } from './MediaLibraryContext';
import MediaLibraryModal from '../MediaLibraryModal/MediaLibraryModal';
import { useMediaLibrary } from '../../hooks/useMediaLibrary';
import { MediaLibraryProviderProps, MediaLibraryContextType, ImageFieldConfig } from './types';

export const MediaLibraryProvider: React.FC<MediaLibraryProviderProps> = ({
  entityType,
  entityData,
  queryKey,
  updateEntity,
  isUpdating = false,
  systemId,
  children
}) => {
  const {
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
  } = useMediaLibrary({ entityType, entityData, queryKey, updateEntity, systemId });

  // Simplified modal handlers
  const handleModalAddImage = (imageId: string) => {
    modalState.config && handleAddImageToField(imageId, modalState.config);
  };

  const handleModalRemoveImage = (imageId: string) => {
    modalState.config && handleRemoveImageFromField(imageId, modalState.config);
  };

  // Handle reordering images in a field
  const handleReorderImages = (imageIds: string[], config: ImageFieldConfig) => {
    // For multiple image fields, convert to ordered structure
    if (config.isMultiple) {
      const orderedImages = imageIds.map((imageId, index) => ({
        imageId,
        orderby: index
      }));
      updateEntity(config.fieldKey, orderedImages);
    } else {
      // For single image fields, just update with the image ID
      updateEntity(config.fieldKey, imageIds[0] || null);
    }
  };

  const contextValue: MediaLibraryContextType = {
    getImagesForField,
    handleAddImageToField,
    handleRemoveImageFromField,
    handleReorderImages,
    openModal,
    isUpdating
  };

  return (
    <MediaLibraryContext.Provider value={contextValue}>
      {children}
      
      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={modalState.isOpen}
        title={
          modalState.config
            ? `Choose Images for ${modalState.config.label}`
            : "Choose Images"
        }
        label={modalState.config?.label || "Images"}
        isMultiple={modalState.config?.isMultiple || false}
        maxCount={modalState.config?.maxCount}
        mediaLibraryImages={mediaLibraryImages}
        currentImages={
          modalState.config ? getImagesForField(modalState.config) : []
        }
        onClose={closeModal}
        onAddImage={handleModalAddImage}
        onRemoveImage={handleModalRemoveImage}
        onDeleteImage={handleImageDelete}
        onUpload={(files: File[]) => uploadToMediaLibraryMutation({ files, imageType: modalState.config?.type })}
        isLoadingImages={isLoadingImages}
        imagesError={imagesError}
        isUploading={isUploading}
      />
    </MediaLibraryContext.Provider>
  );
};