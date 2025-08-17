import React from "react";
import { useParams } from "react-router-dom";

import { useSystem } from "../../hooks/useProvider";
import { AdminTraitForm } from "../../components/AdminTraitForm/AdminTraitForm";
import Loading from "../../components/Loading/Loading";
import { useUpdateTrait } from "../../hooks/useUpdateTrait";
import { useDeleteTrait } from "../../hooks/useDeleteTrait";
import { TraitFormData } from "../../components/AdminTraitForm/AdminTraitForm";
import { useQuery } from "@tanstack/react-query";
import { getTrait } from "../../services/apiTrait";

const AdminTrait: React.FC = () => {
  const { systemSlug, sectionSlug } = useParams<{ 
    systemSlug: string; 
    sectionSlug: string; 
  }>();
  
  const {
    data: system,
    isPending: systemPending,
    isError: systemError,
    error: systemErrorMessage,
  } = useSystem();

  const {
    data: trait,
    isPending: traitPending,
    isError: traitError,
    error: traitErrorMessage,
  } = useQuery({
    queryKey: ["trait", sectionSlug],
    queryFn: () => getTrait(sectionSlug as string),
    enabled: !!sectionSlug,
  });

  const { mutate: updateTrait, isPending: isUpdating } = useUpdateTrait(
    sectionSlug as string,
    system?.id,
  );
  
  const { mutate: deleteTrait, isPending: isDeleting } = useDeleteTrait(
    systemSlug as string,
    system?.id,
  );

  // Loading and error states
  if (systemPending || traitPending) {
    return <Loading message="Loading..." className="content-wrap" />;
  }
  
  if (systemError && systemErrorMessage !== null) {
    return (
      <div className="content-wrap">
        <div className="error-message">
          Error: {systemErrorMessage.message || "Something went wrong"}
        </div>
      </div>
    );
  }

  if (traitError && traitErrorMessage !== null) {
    return (
      <div className="content-wrap">
        <div className="error-message">
          Error: {traitErrorMessage.message || "Something went wrong"}
        </div>
      </div>
    );
  }

  if (!system || !trait) {
    return (
      <div className="content-wrap">
        <div className="error-message">System or trait not found</div>
      </div>
    );
  }

  // Form submission handler
  const handleFormSubmit = (formData: TraitFormData) => {
    console.log("Updating trait with data:", formData);
    updateTrait(formData);
  };

  // Delete handler
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${trait.name}"? This action cannot be undone.`)) {
      deleteTrait(trait.slug);
    }
  };

  return (
    <AdminTraitForm
      trait={trait}
      system={system}
      isUpdating={isUpdating}
      optimisticData={null}
      onSubmit={handleFormSubmit}
      systemSlug={systemSlug}
      sectionSlug={sectionSlug}
      onDelete={handleDelete}
      isDeleting={isDeleting}
    />
  );
};

export default AdminTrait;