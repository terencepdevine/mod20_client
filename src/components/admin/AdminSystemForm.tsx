import React from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { SystemType } from "@mod20/types";
import { SystemFormData } from "../../types/adminTypes";

import Input from "../Input/Input";
import Form from "../forms/Form";
import TextEditor from "../forms/TextEditor";
import Card from "../Card/Card";
import Button from "../Button";
import IconD20 from "../icons/IconD20";
import AbilityScoresSection from "../AbilityScoresSection";
import { MediaLibraryImageField } from "../MediaLibrary/MediaLibraryImageField";

interface AdminSystemFormProps {
  system: SystemType;
  isUpdating: boolean;
  optimisticData: Partial<SystemFormData> | null;
  onSubmit: (data: SystemFormData) => void;
  formatAbilitiesForForm: (abilities: any[]) => any[];
  newRoleLink?: string;
}

export const AdminSystemForm: React.FC<AdminSystemFormProps> = ({
  system,
  isUpdating,
  optimisticData,
  onSubmit,
  formatAbilitiesForForm,
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
            <Button disabled={isUpdating} variant="full" type="submit">
              {isUpdating ? "Saving..." : "Save Changes"}
              <IconD20 />
            </Button>
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
