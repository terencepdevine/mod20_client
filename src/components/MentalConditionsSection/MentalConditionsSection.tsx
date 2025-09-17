import React, { useEffect, useRef } from "react";
import {
  FieldArrayWithId,
  UseFormRegister,
  UseFormSetValue,
  FieldPath,
} from "react-hook-form";
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

import Input from "../Input/Input";
import Button from "../Button/Button";
import Card from "../Card/Card";
import FormRow from "../FormRow/FormRow";
import "./MentalConditionsSection.scss";

interface MentalConditionFormData {
  id?: string;
  name: string;
  description?: string;
  severity?: number;
  minPercentage?: number;
  maxPercentage?: number;
  order?: number;
}

interface FormData {
  mentalConditions: MentalConditionFormData[];
}

interface MentalConditionsSectionProps {
  fields: FieldArrayWithId<FormData, "mentalConditions", "id">[];
  register: UseFormRegister<FormData>;
  remove: (index: number) => void;
  append: (value: MentalConditionFormData) => void;
  move: (fromIndex: number, toIndex: number) => void;
  setValue?: UseFormSetValue<FormData>;
}

interface SortableMentalConditionItemProps {
  field: FieldArrayWithId<FormData, "mentalConditions", "id">;
  index: number;
  register: UseFormRegister<FormData>;
  remove: (index: number) => void;
}

const SortableMentalConditionItem: React.FC<SortableMentalConditionItemProps> = ({
  field,
  index,
  register,
  remove,
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
      className={`mental-conditions-section__item ${isDragging ? "mental-conditions-section__item--dragging" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="mental-conditions-section__item-drag-handle"
      >
        ⋮⋮
      </div>
      
      <div className="mental-conditions-section__item-content">
        <Card>
          <FormRow columns={2}>
            <Input
              type="text"
              placeholder="Condition Name (e.g., Stressed, Panicked, Broken)"
              label={`Mental Condition ${index + 1} Name`}
              {...register(`mentalConditions.${index}.name` as const)}
            />
            <Input
              type="text"
              placeholder="Effect description (optional)"
              label={`Mental Condition ${index + 1} Description`}
              {...register(`mentalConditions.${index}.description` as const)}
            />
          </FormRow>
          
          <FormRow columns={3}>
            <Input
              type="number"
              placeholder="1-10"
              label="Severity Level"
              description="Optional severity level (1-10 scale)"
              {...register(`mentalConditions.${index}.severity` as const, {
                valueAsNumber: true,
                min: { value: 1, message: "Severity must be at least 1" },
                max: { value: 10, message: "Severity cannot exceed 10" },
              })}
            />
            <Input
              type="number"
              placeholder="0"
              label="Min Percentage"
              description="Starting percentage for this condition"
              {...register(`mentalConditions.${index}.minPercentage` as const, {
                valueAsNumber: true,
                min: { value: 0, message: "Minimum percentage must be at least 0" },
                max: { value: 100, message: "Minimum percentage cannot exceed 100" },
              })}
            />
            <Input
              type="number"
              placeholder="100"
              label="Max Percentage"
              description="Ending percentage for this condition"
              {...register(`mentalConditions.${index}.maxPercentage` as const, {
                valueAsNumber: true,
                min: { value: 0, message: "Maximum percentage must be at least 0" },
                max: { value: 100, message: "Maximum percentage cannot exceed 100" },
              })}
            />
          </FormRow>
        </Card>
      </div>

      <div className="mental-conditions-section__item-actions">
        <Button type="button" variant="outline" onClick={() => remove(index)}>
          Remove
        </Button>
      </div>
      
      {/* Hidden order field to maintain order */}
      <input
        type="hidden"
        {...register(`mentalConditions.${index}.order` as const)}
        value={index}
      />
    </div>
  );
};

const MentalConditionsSection: React.FC<MentalConditionsSectionProps> = ({
  fields,
  register,
  remove,
  append,
  move,
  setValue,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      move(oldIndex, newIndex);

      // Update order values in form after reordering
      if (setValue) {
        // Update all order values to match new positions
        setTimeout(() => {
          fields.forEach((_, index) => {
            setValue(`mentalConditions.${index}.order`, index);
          });
        }, 0);
      }
    }
  };

  return (
    <div className="mental-conditions-section">
      <h3 className="mental-conditions-section__title">Mental Conditions</h3>
      <p className="mental-conditions-section__description">
        Define mental conditions that characters can experience in this system (e.g., "Stressed", "Panicked", "Broken").
        These are separate from regular physical conditions.
      </p>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mental-conditions-section__list">
            {fields.map((field, index) => (
              <SortableMentalConditionItem
                key={field.id}
                field={field}
                index={index}
                register={register}
                remove={remove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      <div className="mental-conditions-section__add-button">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              name: "",
              description: "",
              severity: undefined,
              minPercentage: undefined,
              maxPercentage: undefined,
              order: fields.length,
            })
          }
        >
          Add Mental Condition
        </Button>
      </div>
    </div>
  );
};

export default MentalConditionsSection;