import React from "react";
import { useParams } from "react-router-dom";

import { RoleProvider } from "../../provider/RoleProvider";
import { useRole, useSystem } from "../../hooks/useProvider";
import { MediaLibraryProvider } from "../../components/MediaLibrary/MediaLibraryProvider";
import { AdminRoleForm } from "../../components/AdminRoleForm/AdminRoleForm";

import { useRoleMutation } from "../../hooks/useRoleMutation";
import { useDeleteRole } from "../../hooks/useDeleteRole";
import { mergeRoleWithLocalChanges } from "../../utils/roleUtils";
import { RoleFormData } from "../../types/adminTypes";

const AdminRole = () => {
  const { systemSlug, sectionSlug } = useParams<{
    systemSlug: string;
    sectionSlug: string;
  }>();

  if (!systemSlug || !sectionSlug) {
    return (
      <div className="error-message">
        Error: Missing required parameters (system or role slug)
      </div>
    );
  }

  return (
    <RoleProvider systemSlug={systemSlug} sectionSlug={sectionSlug}>
      <AdminRoleContent />
    </RoleProvider>
  );
};

const AdminRoleContent: React.FC = () => {
  const { systemSlug, sectionSlug } = useParams();
  const { data: system, isPending: systemPending } = useSystem();
  const { data: role, isPending, isError, error } = useRole();

  const {
    mutate,
    isUpdating,
    optimisticData,
    localImageChanges,
    updateRoleField,
  } = useRoleMutation(systemSlug as string, sectionSlug as string);

  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole(
    systemSlug as string
  );

  // Loading and error states
  if (isPending || systemPending || !system) {
    return <div className="loading-state">Loading...</div>;
  }
  if (isError && error !== null) {
    return (
      <div className="error-message">
        Error: {error.message || "Something went wrong"}
      </div>
    );
  }
  if (!role) {
    return <div className="error-message">Error: Role data is missing.</div>;
  }

  // Create role data with local changes for MediaLibrary
  const roleWithLocalChanges = mergeRoleWithLocalChanges(
    role,
    localImageChanges,
  );

  // Form submission handler
  const handleFormSubmit = (data: RoleFormData) => {
    const updateData = { ...data, ...localImageChanges };
    mutate(updateData);
  };

  // Delete handler
  const handleDelete = () => {
    deleteRole({ sectionSlug: sectionSlug as string });
  };

  return (
    <MediaLibraryProvider
      entityType="role"
      entityData={roleWithLocalChanges}
      queryKey={["role", systemSlug || "", sectionSlug || ""]}
      updateEntity={updateRoleField}
      isUpdating={isUpdating}
      systemId={system.id}
    >
      <AdminRoleForm
        role={role}
        system={system}
        isUpdating={isUpdating}
        optimisticData={optimisticData}
        onSubmit={handleFormSubmit}
        systemSlug={systemSlug}
        sectionSlug={sectionSlug}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </MediaLibraryProvider>
  );
};

export default AdminRole;
