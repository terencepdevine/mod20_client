import React from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { SystemType } from "@mod20/types";
import { SystemFormData } from "../../types/adminTypes";

import Input from "../Input/Input";
import Form from "../Form/Form";
import TextEditor from "../TextEditor/TextEditor";
import { FormDate } from "../FormDate/FormDate";
import Card from "../Card/Card";
import Button from "../Button/Button";
import IconD20 from "../IconD20/IconD20";
import AbilityScoresSection from "../AbilityScoresSection";
import { MediaLibraryImageField } from "../MediaLibrary/MediaLibraryImageField";
import { TrashIcon } from "@heroicons/react/16/solid";

interface AdminSystemFormProps {
  system: SystemType;
  isUpdating: boolean;
  optimisticData: Partial<SystemFormData> | null;
  onSubmit: (data: SystemFormData) => void;
  formatAbilitiesForForm: (abilities: any[]) => any[];
  newRoleLink?: string;
  // Optional delete functionality
  systemSlug?: string;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export const AdminSystemForm: React.FC<AdminSystemFormProps> = ({
  system,
  isUpdating,
  optimisticData,
  onSubmit,
  formatAbilitiesForForm,
  systemSlug,
  onDelete,
  isDeleting = false,
}) => {
  const { register, handleSubmit, control, reset, setValue } =
    useForm<SystemFormData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "abilities",
  });

  // Reset form when system data loads
  React.useEffect(() => {
    if (system && !optimisticData) {
      reset({
        name: system.name,
        version: system.version,
        introduction: system.introduction,
        backgroundImageId: system.backgroundImageId,
        abilities: formatAbilitiesForForm(system.abilities || []),
      });
    }
  }, [system, optimisticData, reset, formatAbilitiesForForm]);

  const handleFormSubmit: SubmitHandler<SystemFormData> = (data) => {
    onSubmit(data);
  };

  const handleDelete = () => {
    if (!onDelete || !system.name) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the system "${system.name}"? This will permanently delete ALL races, roles, abilities, and other related data. This action cannot be undone.`,
    );

    if (confirmDelete) {
      onDelete();
    }
  };

  // Only show delete button when delete props are provided
  const showDeleteButton = onDelete && systemSlug && system.name;

  return (
    <div className="content-wrap">
      <Form className="content" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="content__main">
          <Input
            type="text"
            defaultValue={system.name}
            placeholder="Enter Name..."
            label="System Name"
            variant="large"
            {...register("name")}
          />
          <Input
            type="text"
            defaultValue={system.version}
            placeholder="Enter Version..."
            label="Version Number"
            {...register("version")}
          />
          <TextEditor
            control={control}
            name="introduction"
            label="Introduction"
            placeholder="Enter System Introduction"
          />
          <AbilityScoresSection
            fields={fields}
            register={register}
            remove={remove}
            append={append}
            move={move}
            setValue={setValue}
          />
        </div>

        <aside className="content__sidebar">
          <Card>
            <div className="flex flex-col gap-2">
              <div className="form-date-wrapper">
                <FormDate label="Created at" date={system.createdAt} />
                <FormDate label="Updated at" date={system.updatedAt} />
              </div>
              {showDeleteButton && (
                <Button
                  disabled={isDeleting || isUpdating}
                  variant="danger"
                  type="button"
                  onClick={handleDelete}
                >
                  {isDeleting ? "Deleting..." : "Delete System"}
                  <TrashIcon className="w-4 h-4" />
                </Button>
              )}
              <Button disabled={isUpdating} variant="full" type="submit">
                {isUpdating ? "Saving..." : "Save Changes"}
                <IconD20 />
              </Button>
            </div>
          </Card>
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
