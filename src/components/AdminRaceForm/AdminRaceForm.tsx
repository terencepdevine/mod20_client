import React from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

import {
  RaceFormData,
  AdminRaceFormProps,
  createRaceFormData,
} from "../../types/adminTypes";
import { SIZE_OPTIONS } from "../../utils/raceUtils";

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
import { TraitsSection } from "../TraitsSection/TraitsSection";
import { createTrait } from "../../services/apiTrait";

export const AdminRaceForm: React.FC<AdminRaceFormProps> = ({
  race,
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
    setValue,
    getValues,
    // formState: { errors },
  } = useForm<RaceFormData>();

  // Traits field array for drag and drop ordering
  const {
    fields: traitsFields,
    append: appendTrait,
    remove: removeTrait,
    move: moveTrait,
  } = useFieldArray({
    control,
    name: "traits",
  });

  // Form initialization
  React.useEffect(() => {
    if (race && !optimisticData) {
      reset(createRaceFormData(race));
    }
  }, [race, optimisticData, reset]);

  // Event handlers
  const handleFormSubmit: SubmitHandler<RaceFormData> = (data) => {
    onSubmit(data);
  };

  // Computed values
  const showDeleteButton = onDelete && systemSlug && sectionSlug && race.name;
  const isNewRace = !race.name;
  const title = isNewRace ? "Create New Race" : `Edit ${race.name}`;
  const submitButtonText = isUpdating
    ? isNewRace
      ? "Creating..."
      : "Updating Race..."
    : isNewRace
      ? "Create Race"
      : "Update Race";

  return (
    <div className="content-wrap">
      <ContentTitle
        systemSlug={system?.slug}
        sectionSlug={race?.slug}
        sectionType="races"
        onDelete={showDeleteButton ? onDelete : undefined}
        isDeleting={isDeleting}
        entityName={race?.name}
        entityType="race"
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
            placeholder="Enter race name..."
            label="Race Name"
            variant="lg"
            {...register("name", { required: "Race name is required" })}
          />

          <TextEditor
            control={control}
            defaultValue={race.introduction}
            name="introduction"
            label="Introduction"
            placeholder="Enter race introduction..."
          />

          {/* Movement Speeds */}
          <FormRow columns={5}>
            <Input
              type="number"
              placeholder="Walking speed..."
              label="Walking Speed"
              {...register("speedWalking", { valueAsNumber: true })}
            />
            <Input
              type="number"
              placeholder="Flying speed..."
              label="Flying Speed"
              {...register("speedFlying", { valueAsNumber: true })}
            />
            <Input
              type="number"
              placeholder="Swimming speed..."
              label="Swimming Speed"
              {...register("speedSwimming", { valueAsNumber: true })}
            />
            <Input
              type="number"
              placeholder="Climbing speed..."
              label="Climbing Speed"
              {...register("speedClimbing", { valueAsNumber: true })}
            />
            <Input
              type="number"
              placeholder="Burrowing speed..."
              label="Burrowing Speed"
              {...register("speedBurrowing", { valueAsNumber: true })}
            />
          </FormRow>

          {/* Physical Attributes */}
          <FormRow columns={5}>
            <Input
              type="number"
              placeholder="Age..."
              label="Age"
              {...register("age", { valueAsNumber: true })}
            />
            <Select
              placeholder="Select size"
              label="Size"
              options={SIZE_OPTIONS}
              {...register("size")}
            />
            <Input
              type="text"
              placeholder="Languages spoken..."
              label="Languages"
              {...register("languages")}
            />
          </FormRow>

          {/* Traits Section */}
          <TraitsSection
            fields={traitsFields}
            register={register}
            remove={removeTrait}
            append={appendTrait}
            move={moveTrait}
            setValue={setValue}
            systemId={system.id}
            control={control}
            getValues={getValues}
            onCreateTrait={async (traitData) => {
              return await createTrait({
                name: traitData.name,
                description: traitData.description,
                system: system.id,
              });
            }}
          />
        </div>

        <aside className="content__sidebar">
          <FormGroup>
            <Label>Race Details</Label>
            <Card>
              <FormDetails>
                {!isNewRace && (
                  <div className="form-date-wrapper">
                    <FormDate label="Created at" date={race.createdAt} />
                    <FormDate label="Updated at" date={race.updatedAt} />
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

          {/* Media */}
          <MediaLibraryImageField
            type="background"
            label="Background Image"
            description="Single background image for this race"
            isMultiple={false}
            maxCount={1}
            fieldKey="backgroundImageId"
          />

          <MediaLibraryImageField
            type="gallery"
            label="Featured Images"
            description="Multiple images that represent this race"
            isMultiple={true}
            maxCount={9}
            fieldKey="images"
          />
        </aside>
      </Form>
    </div>
  );
};
