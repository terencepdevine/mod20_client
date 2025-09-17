import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

// Hooks
import { useSystem } from "../../hooks/useProvider";
import { useSystemMutation } from "../../hooks/useSystemMutation";
import { useFormSubmissionProtection } from "../../hooks/useFormSubmissionProtection";

// Components
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Checkbox from "../../components/Checkbox/Checkbox";
import ContentTitle from "../../components/ContentTitle/ContentTitle";
import Form from "../../components/Form/Form";
import FormGroup from "../../components/FormGroup/FormGroup";
import IconD20 from "../../components/IconD20/IconD20";
import Input from "../../components/Input/Input";
import Label from "../../components/Label/Label";
import FormDetails from "../../components/FormDetails/FormDetails";
import MentalConditionsSection from "../../components/MentalConditionsSection/MentalConditionsSection";

interface MentalConditionFormData {
  id?: string;
  name: string;
  description?: string;
  severity?: number;
  minPercentage?: number;
  maxPercentage?: number;
  order?: number;
}

interface PanicFormData {
  panicEnabled: boolean;
  panicName: string;
  mentalConditions: MentalConditionFormData[];
}

const AdminSystemPanic: React.FC = () => {
  const { systemSlug } = useParams();
  const { data: system, isPending, isError, error } = useSystem();

  // Create form data from system
  const createPanicFormData = (systemData: any): PanicFormData => ({
    panicEnabled: systemData?.mental || false,
    panicName: systemData?.mentalName || "",
    mentalConditions: systemData?.mentalConditions?.map((condition: any, index: number) => ({
      id: condition.id,
      name: condition.name || "",
      description: condition.description || "",
      severity: condition.severity,
      minPercentage: condition.minPercentage,
      maxPercentage: condition.maxPercentage,
      order: condition.order || index,
    })) || [],
  });

  // Form setup
  const { register, handleSubmit, reset, control, setValue } = useForm<PanicFormData>({
    defaultValues: system ? createPanicFormData(system) : {
      panicEnabled: false,
      panicName: "",
      mentalConditions: [],
    },
  });

  // Mental conditions field array for drag and drop ordering
  const {
    fields: mentalConditionsFields,
    append: appendMentalCondition,
    remove: removeMentalCondition,
    move: moveMentalCondition,
  } = useFieldArray({
    control,
    name: "mentalConditions",
  });

  // System mutation hook
  const {
    mutate,
    isUpdating,
    optimisticData,
  } = useSystemMutation(systemSlug as string);

  // Form initialization handled by useFormSubmissionProtection hook

  // Prevent form field flashing during save operations
  const { createProtectedSubmitHandler } = useFormSubmissionProtection(
    system,
    isUpdating,
    optimisticData,
    reset,
    createPanicFormData
  );

  // Loading and error states
  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null) {
    return <h1>Error: {error.message || "Something went wrong"}</h1>;
  }
  if (!system) {
    return <div>Error: System data is missing.</div>;
  }

  // Form submission handler
  const handleFormSubmit: SubmitHandler<PanicFormData> = createProtectedSubmitHandler((data) => {
    console.log("Form data received:", data);

    // Convert panic form data to system update format
    const systemUpdateData = {
      mental: data.panicEnabled,
      mentalName: data.panicName,
      mentalConditions: data.mentalConditions.map((condition, index) => ({
        ...condition,
        order: index, // Ensure order reflects current position
      })),
    };

    console.log("Sending to API:", systemUpdateData);

    // Submit using the system mutation
    mutate({
      newSystem: systemUpdateData,
      systemSlug: systemSlug as string,
    });
  });

  return (
    <div className="content-wrap">
      <ContentTitle
        systemSlug={system.slug}
        entityName={system.name}
        entityType="system panic settings"
      >
        Panic Settings - {system.name}
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
          <FormGroup>
            <Label>Panic Mechanics</Label>
            <Card>
              <FormDetails>
                <Checkbox
                  label="Enable Panic Mechanics"
                  description="Allow characters to experience panic conditions"
                  {...register("panicEnabled")}
                />

                <Input
                  type="text"
                  placeholder="e.g., Sanity, Stress, Fear, Panic"
                  label="Panic Stat Name"
                  description="What to call the mental/panic stat in this system"
                  {...register("panicName")}
                />
              </FormDetails>
            </Card>
          </FormGroup>

          {/* Mental Conditions Section */}
          <MentalConditionsSection
            fields={mentalConditionsFields}
            register={register}
            remove={removeMentalCondition}
            append={appendMentalCondition}
            move={moveMentalCondition}
            setValue={setValue}
          />
        </div>

        <aside className="content__sidebar">
          <FormGroup>
            <Label>Actions</Label>
            <Card>
              <FormDetails>
                <Button disabled={isUpdating} size="lg" type="submit">
                  Save Panic Settings
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

export default AdminSystemPanic;