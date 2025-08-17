import React, { useEffect, useRef, useState } from "react";
import { UseFormRegister, UseFormSetValue, UseFormGetValues, Control } from "react-hook-form";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TraitType } from "@mod20/types";
import { useTraits } from "../../hooks/useTraits";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Select from "../Select/Select";
import TextEditor from "../TextEditor/TextEditor";
import "./TraitsSection.scss";

interface TraitField {
  id: string;
  trait: string;
  order?: number;
}

interface CreateTraitData {
  name: string;
  description: string;
}

interface TraitsSectionProps {
  fields: TraitField[];
  register: UseFormRegister<any>;
  remove: (index: number) => void;
  append: (value: { trait: string; order?: number }) => void;
  move: (fromIndex: number, toIndex: number) => void;
  setValue?: UseFormSetValue<any>;
  systemId: string;
  control?: Control<any>;
  getValues?: UseFormGetValues<any>;
  onCreateTrait?: (traitData: CreateTraitData) => Promise<TraitType>;
}

interface SortableTraitItemProps {
  field: TraitField;
  index: number;
  register: UseFormRegister<any>;
  remove: (index: number) => void;
  availableTraits: TraitType[];
  usedTraitIds: string[];
}

const SortableTraitItem: React.FC<SortableTraitItemProps> = ({
  field,
  index,
  register,
  remove,
  availableTraits,
  usedTraitIds,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

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
      className={`traits-section__item ${isDragging ? "traits-section__item--dragging" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="traits-section__item-drag-handle"
      >
        ⋮⋮
      </div>
      <div className="traits-section__item-select">
        <Select
          label={`Trait ${index + 1}`}
          placeholder="Select a trait..."
          options={availableTraits
            .filter((trait) => !usedTraitIds.includes(trait.id) || field.trait === trait.id)
            .map((trait) => ({
              value: trait.id,
              label: trait.name,
            }))}
          {...register(`traits.${index}.trait` as const, {
            required: "Please select a trait",
          })}
        />
      </div>
      <div className="traits-section__item-remove">
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => remove(index)}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export const TraitsSection: React.FC<TraitsSectionProps> = ({
  fields,
  register,
  remove,
  append,
  move,
  setValue,
  systemId,
  control,
  getValues,
  onCreateTrait,
}) => {
  const { data: traits = [], isPending, isError, refetch } = useTraits(systemId);
  const [isCreatingTrait, setIsCreatingTrait] = useState(false);
  const [newTraitName, setNewTraitName] = useState("");
  const [newTraitDescription, setNewTraitDescription] = useState("");
  const [isSubmittingNewTrait, setIsSubmittingNewTrait] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((field) => field.id === active.id);
    const newIndex = fields.findIndex((field) => field.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      move(oldIndex, newIndex);
      
      if (setValue) {
        fields.forEach((_, idx) => {
          setValue(`traits.${idx}.order`, idx);
        });
      }
    }
  };

  const handleAddTrait = () => {
    const nextOrder = fields.length;
    append({
      trait: "",
      order: nextOrder,
    });
  };

  const handleCreateNewTrait = async (): Promise<void> => {
    if (!onCreateTrait || !newTraitName.trim()) return;
    
    const description = control && getValues 
      ? getValues('newTraitDescription') || ''
      : newTraitDescription.trim();
    
    setIsSubmittingNewTrait(true);
    
    try {
      const newTrait = await onCreateTrait({
        name: newTraitName.trim(),
        description,
      });
      
      await refetch();
      
      append({
        trait: newTrait.id,
        order: fields.length,
      });
      
      resetCreateTraitForm();
    } catch (error) {
      console.error("Failed to create trait:", error);
    } finally {
      setIsSubmittingNewTrait(false);
    }
  };

  const resetCreateTraitForm = (): void => {
    setNewTraitName("");
    setNewTraitDescription("");
    if (setValue) {
      setValue('newTraitDescription', '');
    }
    setIsCreatingTrait(false);
  };

  const handleCancelNewTrait = (): void => {
    resetCreateTraitForm();
  };

  const usedTraitIds = fields.map(field => field.trait).filter(Boolean);
  const canAddMoreTraits = usedTraitIds.length < traits.length;
  const isFormDisabled = isSubmittingNewTrait;

  if (isPending) {
    return (
      <div className="traits-section">
        <div className="traits-section__loading">Loading traits...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="traits-section">
        <div className="traits-section__error">
          Error loading traits. Please check your connection and try again.
        </div>
      </div>
    );
  }

  if (traits.length === 0) {
    return (
      <div className="traits-section">
        <div className="traits-section__empty">
          <p>No traits available for this system.</p>
          <p>Create traits first to add them to races.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="traits-section">
      <div className="traits-section__header">
        <h4>Traits</h4>
        <p>Add and order traits for this race. Traits will be displayed in the order shown below.</p>
      </div>

      {fields.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="traits-section__items">
              {fields.map((field, index) => (
                <SortableTraitItem
                  key={field.id}
                  field={field}
                  index={index}
                  register={register}
                  remove={remove}
                  availableTraits={traits}
                  usedTraitIds={usedTraitIds}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="traits-section__actions">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddTrait}
          disabled={!canAddMoreTraits}
        >
          {fields.length === 0 ? "Add First Trait" : "Add Another Trait"}
        </Button>
        {!canAddMoreTraits && traits.length > 0 && (
          <p className="traits-section__max-message">
            All available traits have been added.
          </p>
        )}
      </div>

      {/* Create New Trait Section */}
      {onCreateTrait && (
        <div className="traits-section__create-new">
          <div className="traits-section__create-header">
            <h5>Create New Trait</h5>
            <p>Create a new trait that will be available for this system.</p>
          </div>
          
          {!isCreatingTrait ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsCreatingTrait(true)}
            >
              Create New Trait
            </Button>
          ) : (
            <div className="traits-section__create-form">
              <div className="traits-section__create-fields">
                <Input
                  type="text"
                  label="Trait Name"
                  placeholder="Enter trait name..."
                  value={newTraitName}
                  onChange={(e) => setNewTraitName(e.target.value)}
                  disabled={isFormDisabled}
                />
                
                {control ? (
                  <TextEditor
                    control={control}
                    name="newTraitDescription"
                    label="Trait Description"
                    placeholder="Enter trait description..."
                    defaultValue=""
                  />
                ) : (
                  <div>
                    <label htmlFor="newTraitDescription">Trait Description</label>
                    <textarea
                      id="newTraitDescription"
                      placeholder="Enter trait description..."
                      value={newTraitDescription}
                      onChange={(e) => setNewTraitDescription(e.target.value)}
                      disabled={isFormDisabled}
                      rows={4}
                    />
                  </div>
                )}
              </div>
              
              <div className="traits-section__create-actions">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleCreateNewTrait}
                  disabled={!newTraitName.trim() || isFormDisabled}
                >
                  {isFormDisabled ? "Creating..." : "Create Trait"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelNewTrait}
                  disabled={isFormDisabled}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};