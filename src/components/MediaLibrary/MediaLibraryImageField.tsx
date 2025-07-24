import React, { useState } from "react";
import { useMediaLibraryContext } from "./MediaLibraryContext";
import { ImageFieldConfig } from "./types";
import Button from "../Button";
import "./MediaLibraryImageField.scss";

// Helper function to get image URL
const getImageUrl = (filename: string) => {
  if (!filename) return "";
  return `http://localhost:3000/public/img/media/${filename}`;
};

interface MediaLibraryImageFieldProps {
  type: string;
  label: string;
  description: string;
  isMultiple: boolean;
  maxCount?: number;
  fieldKey: string;
}

export const MediaLibraryImageField: React.FC<MediaLibraryImageFieldProps> = ({
  type,
  label,
  description,
  isMultiple,
  maxCount,
  fieldKey,
}) => {
  const {
    getImagesForField,
    handleRemoveImageFromField,
    handleReorderImages,
    openModal,
    isUpdating,
  } = useMediaLibraryContext();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Create config object from individual props for backward compatibility
  const config: ImageFieldConfig = {
    type,
    label,
    description,
    isMultiple,
    maxCount,
    fieldKey,
  };

  const handleAdd = () => openModal(config);
  const handleRemove = (imageId: string) =>
    handleRemoveImageFromField(imageId, config);
  const currentImages = getImagesForField(config);

  // Drag and drop handlers for multiple images
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder the images
    const reorderedImages = [...currentImages];
    const [draggedImage] = reorderedImages.splice(draggedIndex, 1);
    reorderedImages.splice(dropIndex, 0, draggedImage);

    // Update the field with new order (array of image IDs)
    const newImageIds = reorderedImages.map((img) => img.id);
    handleReorderImages(newImageIds, config);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Single Image Field Design
  if (!isMultiple) {
    const image = currentImages[0];

    return (
      <div className="media-field media-field--single">
        <div className="media-field__header">
          <h3 className="media-field__label">{label}</h3>
          <p className="media-field__description">{description}</p>
        </div>

        {image ? (
          <div className="media-field__container">
            <div className="media-field__image-wrapper">
              <img
                src={getImageUrl(image.filename)}
                alt={image.alt || label}
                className="media-field__image"
              />
              <button
                onClick={() => handleRemove(image.id)}
                className="media-field__remove-btn"
                disabled={isUpdating}
              >
                ×
              </button>
            </div>
            <div className="media-field__title">
              {image.alt || image.filename || "Untitled"}
            </div>
          </div>
        ) : (
          <div className="media-field__empty">
            <Button onClick={handleAdd} disabled={isUpdating} type="button">
              Add {label}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Multiple Images Field Design
  return (
    <div className="media-field media-field--multiple">
      <div className="media-field__header">
        <div className="media-field__header-content">
          <h3 className="media-field__label">{label}</h3>
          <p className="media-field__description">{description}</p>
        </div>
      </div>

      <div className="media-field__list">
        {currentImages.length > 0 ? (
          currentImages.map((image, index) => (
            <div
              key={image.id}
              className={`media-field__item ${draggedIndex === index ? "media-field__item--dragging" : ""} ${dragOverIndex === index ? "media-field__item--drag-over" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="media-field__item-drag-handle">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <circle cx="2" cy="2" r="1" />
                  <circle cx="6" cy="2" r="1" />
                  <circle cx="10" cy="2" r="1" />
                  <circle cx="2" cy="6" r="1" />
                  <circle cx="6" cy="6" r="1" />
                  <circle cx="10" cy="6" r="1" />
                  <circle cx="2" cy="10" r="1" />
                  <circle cx="6" cy="10" r="1" />
                  <circle cx="10" cy="10" r="1" />
                </svg>
              </div>
              <img
                src={getImageUrl(image.filename)}
                alt={image.alt || `Image ${index + 1}`}
                className="media-field__item-image"
              />
              <div className="media-field__item-content">
                <div className="media-field__item-title">
                  {image.alt || image.filename || `Image ${index + 1}`}
                </div>
              </div>
              <button
                onClick={() => handleRemove(image.id)}
                className="media-field__item-remove"
                disabled={isUpdating}
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <div className="media-field__empty">
            <p>No images added yet</p>
          </div>
        )}
        <Button
          onClick={handleAdd}
          disabled={
            isUpdating ||
            (maxCount ? currentImages.length >= maxCount : false)
          }
          type="button"
        >
          Add Images
        </Button>
      </div>
    </div>
  );
};
