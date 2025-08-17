import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { RoleType, SystemType } from "@mod20/types";
import {
  RoleFormData,
  AdminRoleFormProps,
  createRoleFormData,
} from "../../types/adminTypes";
import { HIT_DICE_OPTIONS, createAbilityOptions } from "../../utils/roleUtils";

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
import { MediaLibraryImageField } from "../MediaLibrary";
import Select from "../Select/Select";
import TextEditor from "../TextEditor/TextEditor";
import FormDetails from "../FormDetails/FormDetails";

export const AdminRoleForm: React.FC<AdminRoleFormProps> = ({
  role,
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
  } = useForm<RoleFormData>();

  // Create ability options for the dropdown from the system's abilities
  const abilityOptions = createAbilityOptions(system?.abilities || []);

  React.useEffect(() => {
    if (role && !optimisticData) {
      reset(createRoleFormData(role));
    }
  }, [role, optimisticData, reset]);

  const handleFormSubmit: SubmitHandler<RoleFormData> = (data) => {
    onSubmit(data);
  };

  // Computed values
  const showDeleteButton = onDelete && systemSlug && sectionSlug && role.name;
  const isNewRole = !role.name;
  const title = isNewRole ? "Create New Role" : `Edit ${role.name}`;
  const submitButtonText = isUpdating
    ? isNewRole
      ? "Creating..."
      : "Saving..."
    : isNewRole
      ? "Create Role"
      : "Save Role";

  return (
    <div className="content-wrap">
      <ContentTitle
        systemSlug={system?.slug}
        sectionSlug={role?.slug}
        sectionType="roles"
        onDelete={showDeleteButton ? onDelete : undefined}
        isDeleting={isDeleting}
        entityName={role?.name}
        entityType="role"
      >
        {title}
      </ContentTitle>
      <Form 
        className="content" 
        onSubmit={handleSubmit(handleFormSubmit)}
        style={{ 
          opacity: isUpdating ? 0.8 : 1,
          transition: 'opacity 0.2s ease'
        }}
      >
        <div className="content__main">
          <Input
            type="text"
            placeholder="Enter role name..."
            label="Role Name"
            variant="lg"
            {...register("name", { required: "Role name is required" })}
          />

          <TextEditor
            control={control}
            defaultValue={role.introduction}
            name="introduction"
            label="Introduction"
            placeholder="Enter role introduction..."
          />
          {/* Role Attributes */}
          <FormRow columns={3}>
            <Select
              placeholder="Select primary ability"
              label="Primary Ability"
              options={abilityOptions}
              {...register("primaryAbility")}
            />
            <Select
              placeholder="Select hit dice"
              label="Hit Dice"
              options={HIT_DICE_OPTIONS}
              {...register("hp_dice", { required: "Hit dice is required" })}
            />
          </FormRow>
        </div>

        <aside className="content__sidebar">
          <FormGroup>
            <Label>Role Details</Label>
            <Card>
              <FormDetails>
                {!isNewRole && (
                  <div className="form-date-wrapper">
                    <FormDate label="Created at" date={role.createdAt} />
                    <FormDate label="Updated at" date={role.updatedAt} />
                  </div>
                )}

                {/* Actions */}
                <Button disabled={isUpdating} variant="full" type="submit">
                  {submitButtonText}
                  <IconD20 className="w-5 h-5" />
                </Button>
              </FormDetails>
            </Card>
          </FormGroup>

          {/* Media */}
          <MediaLibraryImageField
            type="gallery"
            label="Featured Images"
            description="Multiple images that represent this role"
            isMultiple={true}
            maxCount={9}
            fieldKey="images"
          />

          <MediaLibraryImageField
            type="background"
            label="Background"
            description="Single background image for this role"
            isMultiple={false}
            maxCount={1}
            fieldKey="backgroundImageId"
          />
        </aside>
      </Form>
    </div>
  );
};
