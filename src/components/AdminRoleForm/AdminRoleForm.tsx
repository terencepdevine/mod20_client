import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import Input from "../Input/Input";
import Select from "../Select/Select";
import Form from "../Form/Form";
import TextEditor from "../TextEditor/TextEditor";
import { FormDate } from "../FormDate/FormDate";
import IconD20 from "../IconD20/IconD20";
import Card from "../Card/Card";
import Button from "../Button/Button";
import { MediaLibraryImageField } from "../MediaLibrary";
import { HIT_DICE_OPTIONS, createAbilityOptions } from "../../utils/roleUtils";
import { RoleFormData } from "../../types/adminTypes";
import { TrashIcon } from "@heroicons/react/16/solid";

interface AdminRoleFormProps {
  role: any;
  system: any;
  isUpdating: boolean;
  optimisticData: { name: string } | null;
  onSubmit: (data: RoleFormData) => void;
  // Optional delete functionality - only provided for existing roles, not new ones
  systemSlug?: string;
  sectionSlug?: string;
  onDelete?: () => void;
  isDeleting?: boolean;
}

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
  const abilityOptions = createAbilityOptions(system?.abilities);

  React.useEffect(() => {
    if (role && !optimisticData) {
      reset({
        name: role.name,
        introduction: role.introduction || "",
        hp_dice: role.hp_dice?.toString() || "",
        primaryAbility: role.primaryAbility?._id || "",
      });
    }
  }, [role, optimisticData, reset]);

  const handleFormSubmit: SubmitHandler<RoleFormData> = (data) => {
    onSubmit(data);
  };

  const handleDelete = () => {
    if (!onDelete || !role.name) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
    );

    if (confirmDelete) {
      onDelete();
    }
  };

  // Only show delete button for existing roles (not new ones)
  const showDeleteButton = onDelete && systemSlug && sectionSlug && role.name;

  return (
    <div className="content-wrap">
      <Form className="content" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="content__main">
          <h1>{role.name ? `Edit Role: ${role.name}` : "Create New Role"}</h1>

          <Input
            type="text"
            defaultValue={role.name}
            placeholder="Enter role name..."
            label="Role Name"
            variant="large"
            {...register("name", { required: "Role name is required" })}
          />

          <TextEditor
            control={control}
            name="introduction"
            label="Introduction"
            placeholder="Enter role introduction..."
          />

          <Select
            defaultValue={role.primaryAbility?._id || ""}
            placeholder="Select Ability"
            label="Primary Ability"
            options={abilityOptions}
            {...register("primaryAbility")}
          />

          <Select
            defaultValue={role.hp_dice?.toString() || ""}
            placeholder="Select hit dice"
            label="Hit Dice"
            options={HIT_DICE_OPTIONS}
            {...register("hp_dice", { required: "Hit dice is required" })}
          />
        </div>

        <aside className="content__sidebar">
          <Card>
            <div className="flex flex-col gap-2">
              <div className="form-date-wrapper">
                <FormDate label="Created at" date={role.createdAt} />
                <FormDate label="Updated at" date={role.updatedAt} />
              </div>
              {showDeleteButton && (
                <Button
                  disabled={isDeleting || isUpdating}
                  variant="danger"
                  type="button"
                  onClick={handleDelete}
                >
                  {isDeleting ? "Deleting..." : "Delete Role"}
                  <TrashIcon className="w-4 h-4" />
                </Button>
              )}
              <Button disabled={isUpdating} variant="full" type="submit">
                {isUpdating
                  ? role.name
                    ? "Saving..."
                    : "Creating..."
                  : role.name
                    ? "Save Role"
                    : "Create Role"}
                <IconD20 />
              </Button>
            </div>
          </Card>

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
            label="Background Image"
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
