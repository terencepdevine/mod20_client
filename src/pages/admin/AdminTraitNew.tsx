import React from "react";
import { useParams } from "react-router-dom";

import { useSystem } from "../../hooks/useProvider";
import { AdminTraitForm } from "../../components/AdminTraitForm/AdminTraitForm";
import Loading from "../../components/Loading/Loading";
import { useCreateTrait } from "../../hooks/useCreateTrait";
import { TraitFormData } from "../../components/AdminTraitForm/AdminTraitForm";

const AdminTraitNew: React.FC = () => {
  const { systemSlug } = useParams<{ systemSlug: string }>();
  const {
    data: system,
    isPending: systemPending,
    isError,
    error,
  } = useSystem();
  const { mutate: createTrait, isPending: isCreating } = useCreateTrait(
    systemSlug as string,
    system?.id as string,
  );

  // Loading and error states
  if (systemPending || !system) {
    return <Loading message="Loading system..." className="content-wrap" />;
  }
  if (isError && error !== null) {
    return (
      <div className="content-wrap">
        <div className="error-message">
          Error: {error.message || "Something went wrong"}
        </div>
      </div>
    );
  }

  // Form submission handler
  const handleFormSubmit = (formData: TraitFormData) => {
    console.log("Creating trait with data:", formData);
    console.log("System ID:", system.id);
    console.log("System slug:", systemSlug);
    createTrait(formData);
  };

  return (
    <AdminTraitForm
      system={system}
      isUpdating={isCreating}
      optimisticData={null}
      onSubmit={handleFormSubmit}
      systemSlug={systemSlug}
    />
  );
};

export default AdminTraitNew;