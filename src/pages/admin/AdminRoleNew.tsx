import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { useSystem } from "../../hooks/useProvider";
import { MediaLibraryProvider } from "../../components/MediaLibrary/MediaLibraryProvider";
import { AdminRoleForm } from "../../components/admin/AdminRoleForm";
import { useCreateRole } from "../../hooks/useCreateRole";
import { RoleFormData } from "../../types/adminTypes";

const AdminRoleNew: React.FC = () => {
  const { systemSlug } = useParams<{ systemSlug: string }>();
  const { data: system, isPending: systemPending, isError, error } = useSystem();
  const { mutate: createRole, isPending: isCreating } = useCreateRole(systemSlug as string);

  // Loading and error states
  if (systemPending || !system) {
    return <div className="loading-state">Loading...</div>;
  }
  if (isError && error !== null) {
    return (
      <div className="error-message">
        Error: {error.message || "Something went wrong"}
      </div>
    );
  }

  // Form submission handler
  const handleFormSubmit = (formData: RoleFormData) => {
    const finalRoleData = {
      ...formData,
      // Include current image data
      backgroundImageId: roleData.backgroundImageId,
      images: roleData.images,
      system: system.id,
      hp_dice: parseInt(formData.hp_dice),
    };
    console.log("Creating role with data:", finalRoleData);
    console.log("System ID:", system.id);
    console.log("System slug:", systemSlug);
    createRole(finalRoleData);
  };

  // Create stable role object for the form with image fields
  const [roleData] = useState(() => ({
    name: "",
    introduction: "",
    hp_dice: 8,
    primaryAbility: undefined,
    createdAt: null,
    updatedAt: null,
    // Image fields - these will be mutated directly
    backgroundImageId: null,
    images: [],
  }));

  // Update function for MediaLibrary - directly mutate the object to avoid re-renders
  const updateField = async (fieldKey: string, value: any) => {
    // Directly mutate the object to avoid triggering useEffect in AdminRoleForm
    (roleData as any)[fieldKey] = value;
    return Promise.resolve({ [fieldKey]: value });
  };

  // Show loading state while creating to prevent flash
  if (isCreating) {
    return <div className="loading-state">Creating role...</div>;
  }

  return (
    <MediaLibraryProvider
      entityType="role"
      entityData={roleData}
      queryKey={["role", "new"]}
      updateEntity={updateField}
      isUpdating={isCreating}
    >
      <AdminRoleForm
        role={roleData}
        system={system}
        isUpdating={isCreating}
        optimisticData={null}
        onSubmit={handleFormSubmit}
      />
    </MediaLibraryProvider>
  );
};

export default AdminRoleNew;