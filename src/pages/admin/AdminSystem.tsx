import React from "react";
import { useParams } from "react-router-dom";

import { useSystem } from "../../hooks/useProvider";
import { MediaLibraryProvider } from "../../components/MediaLibrary/MediaLibraryProvider";
import { AdminSystemForm } from "../../components/AdminSystemForm/AdminSystemForm";

import { useSystemMutation } from "../../hooks/useSystemMutation";
import { useDeleteSystem } from "../../hooks/useDeleteSystem";
import {
  formatAbilitiesForForm,
  formatSkillsForForm,
  mergeLocalChanges,
} from "../../utils/formUtils";
import { SystemFormData } from "../../types/adminTypes";

const AdminSystem = () => {
  return <AdminSystemContent />;
};

const AdminSystemContent: React.FC = () => {
  const { systemSlug } = useParams();
  const { data: system, isPending, isError, error } = useSystem();

  const {
    mutate,
    isUpdating,
    optimisticData,
    localImageChanges,
    updateSystemField,
  } = useSystemMutation(systemSlug as string);

  const { mutate: deleteSystem, isPending: isDeleting } = useDeleteSystem();

  // Loading and error states
  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null) {
    return <h1>Error: {error.message || "Something went wrong"}</h1>;
  }
  if (!system) {
    return <div>Error: System data is missing.</div>;
  }

  // Create system data with local changes for MediaLibrary
  const systemWithLocalChanges = mergeLocalChanges(system, localImageChanges);

  // Form submission handler
  const handleFormSubmit = (data: SystemFormData) => {
    const updateData = { ...data, ...localImageChanges };
    mutate({ newSystem: updateData, systemSlug: systemSlug as string });
  };

  // Delete handler
  const handleDelete = () => {
    deleteSystem({ systemSlug: systemSlug as string });
  };

  return (
    <MediaLibraryProvider
      entityType="system"
      entityData={systemWithLocalChanges}
      queryKey={["system", system.slug]}
      updateEntity={updateSystemField}
      isUpdating={isUpdating}
      systemId={system.id}
    >
      <AdminSystemForm
        system={system}
        isUpdating={isUpdating}
        optimisticData={optimisticData}
        onSubmit={handleFormSubmit}
        formatAbilitiesForForm={formatAbilitiesForForm}
        formatSkillsForForm={formatSkillsForForm}
        systemSlug={systemSlug}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </MediaLibraryProvider>
  );
};

export default AdminSystem;
