import React, { useEffect, useRef } from "react";
import { useMediaLibraryContext } from "./MediaLibraryContext";
import { ImageFieldConfig } from "./types";
import Button from "../Button";
import Label from "../forms/Label";
import {
  ArrowUpTrayIcon,
  Bars2Icon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import "./MediaLibraryImageField.scss";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Helper function to get image URL
const getImageUrl = (filename: string) => {
  if (!filename) return "";
  return `http://localhost:3000/public/img/media/${filename}`;
};

// Sortable Image Item Component
const SortableImageItem: React.FC<{
  image: any;
  index: number;
  handleRemove: (imageId: string) => void;
  isUpdating: boolean;
}> = ({ image, index, handleRemove, isUpdating }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const elementRef = useRef<HTMLDivElement>(null);

  // Set CSS custom properties for transform and transition
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.style.setProperty(
        "--dnd-transform",
        CSS.Transform.toString(transform) || "none",
      );
      elementRef.current.style.setProperty(
        "--dnd-transition",
        transition || "none",
      );
    }
  }, [transform, transition]);

  // Combine refs
  const combinedRef = (el: HTMLDivElement | null) => {
    elementRef.current = el;
    setNodeRef(el);
  };

  return (
    <div
      ref={combinedRef}
      className={`media-field__item ${isDragging ? "media-field__item--dragging" : ""}`}
    >
      <div
        className="media-field__item-drag-handle"
        {...attributes}
        {...listeners}
      >
        <Bars2Icon />
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
        <XMarkIcon />
      </button>
    </div>
  );
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

  // dnd-kit drag and drop handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentImages.findIndex((img) => img.id === active.id);
      const newIndex = currentImages.findIndex((img) => img.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedImages = arrayMove(currentImages, oldIndex, newIndex);
        const newImageIds = reorderedImages.map((img) => img.id);
        handleReorderImages(newImageIds, config);
      }
    }
  };

  // Single Image Field Design
  if (!isMultiple) {
    const image = currentImages[0];
    const fieldId = `media-field-${fieldKey}`;

    return (
      <div className="media-field media-field--single">
        <div className="media-field__label">
          <Label
            htmlFor={fieldId}
            variant="media-field"
            description={description}
          >
            {label}
          </Label>
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
                <XMarkIcon />
              </button>
            </div>
            <div className="media-field__title">
              {image.alt || image.filename || "Untitled"}
            </div>
          </div>
        ) : (
          <div className="media-field__empty">
            <Button
              id={fieldId}
              onClick={handleAdd}
              disabled={isUpdating}
              type="button"
            >
              Add {label}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Multiple Images Field Design
  const multipleFieldId = `media-field-${fieldKey}-multiple`;

  return (
    <div className="media-field media-field--multiple">
      <div className="media-field__label">
        <Label
          htmlFor={multipleFieldId}
          variant="media-field"
          description={description}
        >
          {label}
        </Label>
      </div>

      <div className="media-field__list">
        {currentImages.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentImages.map((img) => img.id)}
              strategy={verticalListSortingStrategy}
            >
              {currentImages.map((image, index) => (
                <SortableImageItem
                  key={image.id}
                  image={image}
                  index={index}
                  handleRemove={handleRemove}
                  isUpdating={isUpdating}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="media-field__empty">
            <p>No images added yet</p>
          </div>
        )}
        <Button
          id={multipleFieldId}
          onClick={handleAdd}
          variant="outline"
          disabled={
            isUpdating || (maxCount ? currentImages.length >= maxCount : false)
          }
          type="button"
        >
          Add Images <ArrowUpTrayIcon className="w-4 h-4 fill-primary" />
        </Button>
      </div>
    </div>
  );
};
