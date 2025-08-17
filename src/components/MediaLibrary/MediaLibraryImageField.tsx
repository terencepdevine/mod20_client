import React, { useEffect, useRef } from "react";
import { useMediaLibraryContext } from "./MediaLibraryContext";
import { ImageFieldConfig } from "./types";
import Button from "../Button/Button";
import Label from "../Label/Label";
import {
  ArrowUpTrayIcon,
  Bars2Icon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import "./MediaLibraryImageField.scss";
import { getImageUrl } from "../../utils/imageUtils";
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
import FormGroup from "../FormGroup";
import Card from "../Card/Card";

// Helper function to get image URL (now imported from utils)

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
        src={getImageUrl(image.filename, 'gallery')}
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
        <FormGroup>
          <Label htmlFor={fieldId} description={description}>
            {label}
          </Label>

          <Card className="media-field__content">
            {image ? (
              <>
                <img
                  src={getImageUrl(image.filename, type as 'gallery' | 'background')}
                  alt={image.alt || label}
                  className="media-field__image"
                />
                <div className="media-field__title-wrapper">
                  <div className="media-field__title">
                    {image.alt || image.filename || "Untitled"}
                  </div>
                  <button
                    onClick={() => handleRemove(image.id)}
                    className="media-field__remove-btn"
                    disabled={isUpdating}
                  >
                    <XMarkIcon />
                  </button>
                </div>
              </>
            ) : (
              <div className="media-field__empty">
                <p>No image added</p>
              </div>
            )}
            <Button
              id={fieldId}
              onClick={handleAdd}
              disabled={isUpdating || !!image}
              variant="outline"
              type="button"
              width="full"
            >
              Add {label} <ArrowUpTrayIcon className="w-4 h-4 fill-primary" />
            </Button>
          </Card>
        </FormGroup>
      </div>
    );
  }

  // Multiple Images Field Design
  const multipleFieldId = `media-field-${fieldKey}-multiple`;

  return (
    <div className="media-field media-field--multiple">
      <FormGroup>
        {label && (
          <Label htmlFor={multipleFieldId} description={description}>
            {label}
          </Label>
        )}

        <Card className="media-field__content">
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
              <p>No images added</p>
            </div>
          )}
          <Button
            id={multipleFieldId}
            onClick={handleAdd}
            variant="outline"
            disabled={
              isUpdating ||
              (maxCount ? currentImages.length >= maxCount : false)
            }
            type="button"
            width="full"
          >
            Add Images <ArrowUpTrayIcon className="w-4 h-4 fill-primary" />
          </Button>
        </Card>
      </FormGroup>
    </div>
  );
};
