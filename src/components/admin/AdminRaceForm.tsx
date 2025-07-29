import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import Input from "../Input/Input";
import Select from "../Select/Select";
import Form from "../forms/Form";
import IconD20 from "../icons/IconD20";
import Card from "../Card/Card";
import Button from "../Button";
import { MediaLibraryImageField } from "../MediaLibrary";
import { SIZE_OPTIONS } from "../../utils/raceUtils";
import { RaceFormData } from "../../types/adminTypes";
import { CalendarDaysIcon } from "@heroicons/react/16/solid";

interface AdminRaceFormProps {
  race: any;
  system: any;
  isUpdating: boolean;
  optimisticData: { name: string } | null;
  onSubmit: (data: RaceFormData) => void;
}

export const AdminRaceForm: React.FC<AdminRaceFormProps> = ({
  race,
  system,
  isUpdating,
  optimisticData,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RaceFormData>();

  React.useEffect(() => {
    if (race && !optimisticData) {
      reset({
        name: race.name || "",
        speedWalking: race.speedWalking ?? "",
        speedFlying: race.speedFlying ?? "",
        speedSwimming: race.speedSwimming ?? "",
        speedClimbing: race.speedClimbing ?? "",
        speedBurrowing: race.speedBurrowing ?? "",
        age: race.age ?? "",
        size: race.size || "",
        languages: race.languages || "",
      });
    }
  }, [race, optimisticData, reset]);

  const handleFormSubmit: SubmitHandler<RaceFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="content-wrap">
      <Form className="content" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="content__main">
          <h1>{race.name ? `Edit Race: ${race.name}` : "Create New Race"}</h1>

          <Input
            type="text"
            placeholder="Enter race name..."
            label="Race Name"
            variant="large"
            {...register("name", { required: "Race name is required" })}
          />

          <div className="form-row">
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
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row">
            <Input
              type="number"
              placeholder="Burrowing speed..."
              label="Burrowing Speed"
              {...register("speedBurrowing", { valueAsNumber: true })}
            />
            <Input
              type="number"
              placeholder="Age..."
              label="Age"
              {...register("age", { valueAsNumber: true })}
            />
          </div>

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
        </div>

        <aside className="content__sidebar">
          <Card>
            <div className="form-date">
              <CalendarDaysIcon className="w-4 h-4" />
              <p>
                Created at:{" "}
                {race.createdAt
                  ? new Date(race.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
            <div className="form-date">
              <CalendarDaysIcon className="w-4 h-4" />
              <p>
                Updated at:{" "}
                {race.updatedAt
                  ? new Date(race.updatedAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
            <Button disabled={isUpdating} variant="full" type="submit">
              {isUpdating
                ? race.name
                  ? "Saving..."
                  : "Creating..."
                : race.name
                  ? "Save Race"
                  : "Create Race"}
              <IconD20 />
            </Button>
          </Card>

          <MediaLibraryImageField
            type="gallery"
            label="Featured Images"
            description="Multiple images that represent this race"
            isMultiple={true}
            maxCount={9}
            fieldKey="images"
          />
          <MediaLibraryImageField
            type="background"
            label="Background Image"
            description="Single background image for this race"
            isMultiple={false}
            maxCount={1}
            fieldKey="backgroundImageId"
          />
        </aside>
      </Form>
    </div>
  );
};
