import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { useSystem } from "../../hooks/useProvider";
import { MediaLibraryProvider } from "../../components/MediaLibrary/MediaLibraryProvider";
import { AdminRaceForm } from "../../components/admin/AdminRaceForm";
import { useCreateRace } from "../../hooks/useCreateRace";
import { RaceFormData } from "../../types/adminTypes";

const AdminRaceNew: React.FC = () => {
  const { systemSlug } = useParams<{ systemSlug: string }>();
  const { data: system, isPending: systemPending, isError, error } = useSystem();
  const { mutate: createRace, isPending: isCreating } = useCreateRace(systemSlug as string);

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
  const handleFormSubmit = (formData: RaceFormData) => {
    const finalRaceData = {
      ...formData,
      // Include current image data
      backgroundImageId: raceData.backgroundImageId,
      images: raceData.images,
      system: system.id,
    };
    console.log("Creating race with data:", finalRaceData);
    console.log("System ID:", system.id);
    console.log("System slug:", systemSlug);
    createRace(finalRaceData);
  };

  // Create stable race object for the form with image fields
  const [raceData] = useState(() => ({
    name: "",
    speedWalking: undefined,
    speedFlying: undefined,
    speedSwimming: undefined,
    speedClimbing: undefined,
    speedBurrowing: undefined,
    age: undefined,
    size: "",
    languages: "",
    createdAt: null,
    updatedAt: null,
    // Image fields - these will be mutated directly
    backgroundImageId: null,
    images: [],
  }));

  // Update function for MediaLibrary - directly mutate the object to avoid re-renders
  const updateField = async (fieldKey: string, value: any) => {
    // Directly mutate the object to avoid triggering useEffect in AdminRaceForm
    (raceData as any)[fieldKey] = value;
    return Promise.resolve({ [fieldKey]: value });
  };

  // Show loading state while creating to prevent flash
  if (isCreating) {
    return <div className="loading-state">Creating race...</div>;
  }

  return (
    <MediaLibraryProvider
      entityType="race"
      entityData={raceData}
      queryKey={["race", "new"]}
      updateEntity={updateField}
      isUpdating={isCreating}
    >
      <AdminRaceForm
        race={raceData}
        system={system}
        isUpdating={isCreating}
        optimisticData={null}
        onSubmit={handleFormSubmit}
      />
    </MediaLibraryProvider>
  );
};

export default AdminRaceNew;