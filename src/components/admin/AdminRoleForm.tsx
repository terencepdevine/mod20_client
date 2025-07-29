import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import Input from "../Input/Input";
import Select from "../Select/Select";
import Form from "../forms/Form";
import TextEditor from "../forms/TextEditor";
import IconD20 from "../icons/IconD20";
import Card from "../Card/Card";
import Button from "../Button";
import { MediaLibraryImageField } from "../MediaLibrary";
import { HIT_DICE_OPTIONS, createAbilityOptions } from "../../utils/roleUtils";
import { RoleFormData } from "../../types/adminTypes";
import { CalendarDaysIcon } from "@heroicons/react/16/solid";

interface AdminRoleFormProps {
  role: any;
  system: any;
  isUpdating: boolean;
  optimisticData: { name: string } | null;
  onSubmit: (data: RoleFormData) => void;
}

export const AdminRoleForm: React.FC<AdminRoleFormProps> = ({
  role,
  system,
  isUpdating,
  optimisticData,
  onSubmit,
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
            placeholder="Select primary ability (optional)"
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
            <div className="form-date">
              <CalendarDaysIcon className="w-4 h-4" />
              <p>
                Created at:{" "}
                {role.createdAt
                  ? new Date(role.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
            <div className="form-date">
              <CalendarDaysIcon className="w-4 h-4" />
              <p>
                Updated at:{" "}
                {role.updatedAt
                  ? new Date(role.updatedAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
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
