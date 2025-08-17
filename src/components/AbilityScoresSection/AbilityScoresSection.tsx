import React, { useEffect, useRef } from "react";
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
import "./AbilityScoresSection.scss";

interface AbilityScoresSectionProps {
  fields: any[];
  register: any;
  remove: (index: number) => void;
  append: (value: {
    name: string;
    description: string;
    abbr?: string;
    order?: number;
  }) => void;
  move: (fromIndex: number, toIndex: number) => void;
  setValue?: (name: string, value: any) => void;
}

interface SortableAbilityItemProps {
  field: any;
  index: number;
  register: any;
  remove: (index: number) => void;
}

const SortableAbilityItem: React.FC<SortableAbilityItemProps> = ({
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
      className={`ability-scores-section__item ${isDragging ? "ability-scores-section__item--dragging" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="ability-scores-section__item-drag-handle"
      >
        ⋮⋮
      </div>
      <div className="ability-scores-section__item-name">
        <Input
          type="text"
          placeholder="Ability Name (e.g., Strength, Constitution)"
          label={`Ability ${index + 1} Name`}
          {...register(`abilities.${index}.name` as const, {
            required: "Ability name is required",
          })}
        />
      </div>
      <div className="ability-scores-section__item-abbr">
        <Input
          type="text"
          placeholder="STR"
          label={`Ability ${index + 1} Abbreviation`}
          {...register(`abilities.${index}.abbr` as const)}
        />
      </div>
      <div className="ability-scores-section__item-description">
        <Input
          type="text"
          placeholder="Description (optional)"
          label={`Ability ${index + 1} Description`}
          {...register(`abilities.${index}.description` as const)}
        />
      </div>
      <div className="ability-scores-section__item-actions">
        <Button type="button" variant="outline" onClick={() => remove(index)}>
          Remove
        </Button>
      </div>
      {/* Hidden order field to maintain order */}
      <input
        type="hidden"
        {...register(`abilities.${index}.order` as const)}
        value={index}
      />
    </div>
  );
};

const AbilityScoresSection: React.FC<AbilityScoresSectionProps> = ({
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
            setValue(`abilities.${index}.order`, index);
          });
        }, 0);
      }
    }
  };

  return (
    <div className="ability-scores-section">
      <h3 className="ability-scores-section__title">Ability Scores</h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="ability-scores-section__list">
            {fields.map((field, index) => (
              <SortableAbilityItem
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
      <div className="ability-scores-section__add-button">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              name: "",
              description: "",
              abbr: "",
              order: fields.length,
            })
          }
        >
          Add Ability Score
        </Button>
      </div>
    </div>
  );
};

export default AbilityScoresSection;
