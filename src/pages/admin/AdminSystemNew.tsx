import React, { useState } from "react";

import { MediaLibraryProvider } from "../../components/MediaLibrary/MediaLibraryProvider";
import { AdminSystemForm } from "../../components/AdminSystemForm/AdminSystemForm";
import { useCreateSystem } from "../../hooks/useCreateSystem";
import { SystemFormData } from "../../types/adminTypes";

const AdminSystemNew: React.FC = () => {
  const { mutate: createSystem, isPending: isCreating } = useCreateSystem();

  // Form submission handler
  const handleFormSubmit = (formData: SystemFormData) => {
    const finalSystemData = {
      ...formData,
      // Include current image data
      backgroundImageId: systemData.backgroundImageId,
      images: systemData.images,
    };
    console.log("Creating system with data:", finalSystemData);
    createSystem(finalSystemData);
  };

  // Create stable system object for the form with image fields
  const [systemData] = useState(() => ({
    id: "",
    slug: "",
    name: "",
    version: "",
    introduction: "",
    createdAt: undefined,
    updatedAt: undefined,
    abilities: [],
    character: {} as any, // Empty object as placeholder
    isNew: true,
    // Image fields - these will be mutated directly
    backgroundImageId: null,
    images: [],
  }));

  // Update function for MediaLibrary - directly mutate the object to avoid re-renders
  const updateField = async (fieldKey: string, value: any) => {
    // Directly mutate the object to avoid triggering useEffect in AdminSystemForm
    (systemData as any)[fieldKey] = value;
    return Promise.resolve({ [fieldKey]: value });
  };

  // Simple format function for abilities (empty array for new system)
  const formatAbilitiesForForm = (abilities: any[]) => {
    return abilities || [];
  };

  // Show loading state while creating to prevent flash
  if (isCreating) {
    return <div className="loading-state">Creating system...</div>;
  };

  return (
    <MediaLibraryProvider
      entityType="system"
      entityData={systemData}
      queryKey={["system", "new"]}
      updateEntity={updateField}
      isUpdating={isCreating}
      systemId={undefined} // No system ID for new system creation
    >
      <AdminSystemForm
        system={systemData}
        isUpdating={isCreating}
        optimisticData={null}
        onSubmit={handleFormSubmit}
        formatAbilitiesForForm={formatAbilitiesForForm}
      />
    </MediaLibraryProvider>
  );
};

export default AdminSystemNew;
