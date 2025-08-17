import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  TraitFormData,
  AdminTraitFormProps,
  createTraitFormData,
} from "../../types/adminTypes";

import Button from "../Button/Button";
import Card from "../Card/Card";
import ContentTitle from "../ContentTitle/ContentTitle";
import Form from "../Form/Form";
import { FormDate } from "../FormDate/FormDate";
import FormGroup from "../FormGroup/FormGroup";
import FormRow from "../FormRow/FormRow";
import IconD20 from "../IconD20/IconD20";
import Input from "../Input/Input";
import Label from "../Label/Label";
import TextEditor from "../TextEditor/TextEditor";
import FormDetails from "../FormDetails/FormDetails";

export const AdminTraitForm: React.FC<AdminTraitFormProps> = ({
  trait,
  system,
  isUpdating,
  optimisticData,
  onSubmit,
  systemSlug,
  sectionSlug,
  onDelete,
  isDeleting = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TraitFormData>();

  // Form initialization
  React.useEffect(() => {
    if (trait && !optimisticData) {
      reset(createTraitFormData(trait));
    }
  }, [trait, optimisticData, reset]);

  // Use optimistic data for display during updates
  const displayTrait = optimisticData || trait;

  const onSubmitHandler: SubmitHandler<TraitFormData> = (data) => {
    onSubmit(data);
  };

  // Computed values
  const showDeleteButton = onDelete && systemSlug && sectionSlug && trait?.name;
  const isNewTrait = !trait?.name;
  const title = isNewTrait ? "Create New Trait" : `Edit ${displayTrait?.name}`;
  const submitButtonText = isUpdating
    ? isNewTrait
      ? "Creating..."
      : "Saving..."
    : isNewTrait
      ? "Create Trait"
      : "Save Trait";

  return (
    <div className="content-wrap">
      <ContentTitle
        systemSlug={systemSlug}
        sectionSlug={trait?.slug}
        sectionType="traits"
        onDelete={showDeleteButton ? onDelete : undefined}
        isDeleting={isDeleting}
        entityName={trait?.name}
        entityType="trait"
      >
        {title}
      </ContentTitle>
      
      <Form 
        className="content" 
        onSubmit={handleSubmit(onSubmitHandler)}
        style={{ 
          opacity: isUpdating ? 0.8 : 1,
          transition: 'opacity 0.2s ease'
        }}
      >
        <div className="content__main">
          <Input
            type="text"
            placeholder="Trait name (e.g., Darkvision, Keen Senses)"
            label="Trait Name"
            variant="lg"
            {...register("name", {
              required: "Trait name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
              maxLength: {
                value: 40,
                message: "Name must be 40 characters or less",
              },
            })}
          />
          {errors.name && (
            <span className="error">{errors.name.message}</span>
          )}

          <TextEditor
            control={control}
            defaultValue={displayTrait?.description}
            name="description"
            label="Description"
            placeholder="Describe this trait and its effects..."
          />
          {errors.description && (
            <span className="error">{errors.description.message}</span>
          )}
        </div>

        <aside className="content__sidebar">
          <FormGroup>
            <Label>Trait Details</Label>
            <Card>
              <FormDetails>
                {!isNewTrait && (
                  <div className="form-date-wrapper">
                    <FormDate label="Created at" date={displayTrait?.createdAt} />
                    <FormDate label="Updated at" date={displayTrait?.updatedAt} />
                  </div>
                )}

                {/* Actions */}
                <Button disabled={isUpdating} variant="primary" type="submit">
                  {submitButtonText}
                  <IconD20 className="w-5 h-5" />
                </Button>
              </FormDetails>
            </Card>
          </FormGroup>
        </aside>
      </Form>
    </div>
  );
};