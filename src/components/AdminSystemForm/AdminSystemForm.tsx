import React from "react";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  useWatch,
} from "react-hook-form";
import { TrashIcon } from "@heroicons/react/16/solid";

import {
  SystemFormData,
  AdminSystemFormProps,
  createSystemFormData,
} from "../../types/adminTypes";

// Components
import AbilityScoresSection from "../AbilityScoresSection";
import Button from "../Button/Button";
import Card from "../Card/Card";
import Checkbox from "../Checkbox/Checkbox";
import ContentTitle from "../ContentTitle/ContentTitle";
import Form from "../Form/Form";
import { FormDate } from "../FormDate/FormDate";
import FormGroup from "../FormGroup/FormGroup";
import IconD20 from "../IconD20/IconD20";
import Input from "../Input/Input";
import Label from "../Label/Label";
import { MediaLibraryImageField } from "../MediaLibrary/MediaLibraryImageField";
import Select from "../Select/Select";
import TextEditor from "../TextEditor/TextEditor";
import FormDetails from "../FormDetails/FormDetails";
import FormRow from "../FormRow/FormRow";

export const AdminSystemForm: React.FC<AdminSystemFormProps> = ({
  system,
  isUpdating,
  optimisticData,
  onSubmit,
  formatAbilitiesForForm,
  formatSkillsForForm,
  systemSlug,
  onDelete,
  isDeleting = false,
}) => {
  // Form setup
  const { register, handleSubmit, control, reset, setValue } =
    useForm<SystemFormData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "abilities",
  });
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  // Watch mental field to conditionally show mental-related fields
  const mentalEnabled = useWatch({
    control,
    name: "mental",
    defaultValue: system.mental || false,
  });

  // Form initialization
  React.useEffect(() => {
    if (system && system.name && !optimisticData) {
      reset(
        createSystemFormData(
          system,
          formatAbilitiesForForm,
          formatSkillsForForm,
        ),
      );
    }
  }, [
    system,
    optimisticData,
    reset,
    formatAbilitiesForForm,
    formatSkillsForForm,
  ]);

  // Event handlers
  const handleFormSubmit: SubmitHandler<SystemFormData> = (data) => {
    onSubmit(data);
  };

  // Computed values
  const showDeleteButton = onDelete && systemSlug && system.name;
  const isNewSystem = !system.name;
  const title = isNewSystem ? "Create New System" : `Edit ${system.name}`;
  const submitButtonText = isUpdating
    ? isNewSystem
      ? "Creating..."
      : "Saving..."
    : isNewSystem
      ? "Create System"
      : "Save Changes";

  // Sort skills alphabetically by name
  const sortedSkillFields = React.useMemo(() => {
    return [...skillFields].sort((a, b) => {
      const nameA = a.name || "";
      const nameB = b.name || "";
      return nameA.localeCompare(nameB);
    });
  }, [skillFields]);

  // Create ability options for the select dropdown
  const abilityOptions = React.useMemo(() => {
    // For existing systems, use the actual system abilities (with real ObjectIds)
    if (
      system.abilities &&
      Array.isArray(system.abilities) &&
      system.abilities.length > 0
    ) {
      return system.abilities.map((ability: any) => ({
        value: ability.id,
        label: ability.name,
      }));
    }

    // For new systems or when system.abilities is empty, use form fields
    if (fields && Array.isArray(fields) && fields.length > 0) {
      return fields.map((ability: any, index: number) => ({
        value: ability.id || `temp-${index}`,
        label: ability.name || `Ability ${index + 1}`,
      }));
    }

    return [];
  }, [system.abilities, fields]);

  return (
    <div className="content-wrap">
      <ContentTitle
        systemSlug={system.slug}
        onDelete={showDeleteButton ? onDelete : undefined}
        isDeleting={isDeleting}
        entityName={system.name}
        entityType="system"
      >
        {title}
      </ContentTitle>
      <Form
        className="content"
        onSubmit={handleSubmit(handleFormSubmit)}
        style={{
          opacity: isUpdating ? 0.8 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        <div className="content__main">
          {/* Basic Information */}
          <Input
            type="text"
            placeholder="Enter system name..."
            label="System Name"
            variant="lg"
            {...register("name", { required: "System name is required" })}
          />

          <TextEditor
            control={control}
            defaultValue={system.introduction}
            name="introduction"
            label="Introduction"
            placeholder="Enter system introduction..."
          />

          {/* Abilities Section */}
          <AbilityScoresSection
            fields={fields}
            register={register}
            remove={remove}
            append={append}
            move={move}
            setValue={setValue}
          />

          {/* Skills Section */}
          <div className="skills-section">
            <Label>Skills</Label>
            <Card>
              <FormDetails>
                {sortedSkillFields.map((field) => {
                  // Find the original index in skillFields for form registration
                  const originalIndex = skillFields.findIndex(
                    (f) => f.id === field.id,
                  );
                  return (
                    <FormRow key={field.id} columns={4}>
                      <Input
                        type="text"
                        placeholder="Skill name"
                        label="Skill Name"
                        {...register(`skills.${originalIndex}.name` as const, {
                          required: "Skill name is required",
                        })}
                      />
                      <Input
                        type="text"
                        placeholder="Skill description"
                        label="Description"
                        {...register(
                          `skills.${originalIndex}.description` as const,
                        )}
                      />
                      <Select
                        label="Related Ability"
                        placeholder="Select ability..."
                        options={abilityOptions}
                        {...register(
                          `skills.${originalIndex}.relatedAbility` as const,
                        )}
                      />
                      <div style={{ display: "flex", alignItems: "end" }}>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeSkill(originalIndex)}
                        >
                          <TrashIcon className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>
                    </FormRow>
                  );
                })}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendSkill({
                      name: "",
                      description: "",
                      relatedAbility: "",
                    })
                  }
                >
                  Add Skill
                </Button>
              </FormDetails>
            </Card>
          </div>
        </div>

        <aside className="content__sidebar">
          {/* System Details */}
          <FormGroup>
            <Label>System Details</Label>
            <Card>
              <FormDetails>
                {!isNewSystem && (
                  <div className="form-date-wrapper">
                    <FormDate label="Created at" date={system.createdAt} />
                    <FormDate label="Updated at" date={system.updatedAt} />
                  </div>
                )}

                <Input
                  type="number"
                  placeholder="20"
                  label="Maximum Character Level"
                  description="The highest level characters can reach in this system (1-100)"
                  {...register("maxLevel", {
                    required: "Maximum level is required",
                    min: {
                      value: 1,
                      message: "Maximum level must be at least 1"
                    },
                    max: {
                      value: 100,
                      message: "Maximum level cannot exceed 100"
                    },
                    valueAsNumber: true
                  })}
                />

                <Button disabled={isUpdating} size="lg" type="submit">
                  {submitButtonText}
                  <IconD20 className="w-5 h-5" />
                </Button>
              </FormDetails>
            </Card>
          </FormGroup>

          {/* Mental/Resilience System */}
          <FormGroup>
            <Label>Mental/Resilience System</Label>
            <Card>
              <FormDetails>
                <Checkbox
                  label="Enable Mental/Panic Mechanics"
                  {...register("mental")}
                />

                {mentalEnabled && (
                  <>
                    <Input
                      type="text"
                      placeholder="e.g., Sanity, Grit, Courage, Stress"
                      label="Mental Stat Name"
                      {...register("mentalName", {
                        required: mentalEnabled
                          ? "Mental stat name is required when mental system is enabled"
                          : false,
                      })}
                    />

                    <div className="form-field">
                      <Label>Mental Conditions</Label>
                      <p className="form-field__description">
                        Mental conditions (e.g., "Stressed", "Panicked", "Broken") will be 
                        manageable from the system's mental conditions section once created. 
                        These are separate from regular conditions like "Paralyzed" or "Poisoned".
                      </p>
                    </div>
                  </>
                )}
              </FormDetails>
            </Card>
          </FormGroup>

          {/* Media */}
          <MediaLibraryImageField
            type="background"
            label="Background Image"
            description="Single background image for this system"
            isMultiple={false}
            maxCount={1}
            fieldKey="backgroundImageId"
          />
        </aside>
      </Form>
    </div>
  );
};
