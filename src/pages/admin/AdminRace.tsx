import React from "react";
import { useParams } from "react-router-dom";

import { RaceProvider } from "../../provider/RaceProvider";
import { useRace, useSystem } from "../../hooks/useProvider";
import { MediaLibraryProvider } from "../../components/MediaLibrary/MediaLibraryProvider";
import { AdminRaceForm } from "../../components/AdminRaceForm/AdminRaceForm";

import { useRaceMutation } from "../../hooks/useRaceMutation";
import { useDeleteRace } from "../../hooks/useDeleteRace";
import { mergeRaceWithLocalChanges } from "../../utils/raceUtils";
import { RaceFormData } from "../../types/adminTypes";

const AdminRace = () => {
  const { systemSlug, sectionSlug } = useParams<{
    systemSlug: string;
    sectionSlug: string;
  }>();

  if (!systemSlug || !sectionSlug) {
    return (
      <div className="error-message">
        Error: Missing required parameters (system or race slug)
      </div>
    );
  }

  return (
    <RaceProvider systemSlug={systemSlug} sectionSlug={sectionSlug}>
      <AdminRaceContent />
    </RaceProvider>
  );
};

const AdminRaceContent: React.FC = () => {
  const { systemSlug, sectionSlug } = useParams();
  const { data: system, isPending: systemPending } = useSystem();
  const { data: race, isPending, isError, error } = useRace();

  const {
    mutate,
    isUpdating,
    optimisticData,
    localImageChanges,
    updateRaceField,
  } = useRaceMutation(systemSlug as string, sectionSlug as string);

  const { mutate: deleteRace, isPending: isDeleting } = useDeleteRace(
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
  if (!race) {
    return <div className="error-message">Error: Race data is missing.</div>;
  }

  // Create race data with local changes for MediaLibrary
  const raceWithLocalChanges = mergeRaceWithLocalChanges(
    race,
    localImageChanges,
  );

  // Form submission handler
  const handleFormSubmit = (data: RaceFormData) => {
    const updateData = { ...data, ...localImageChanges };
    mutate(updateData);
  };

  // Delete handler
  const handleDelete = () => {
    deleteRace({ sectionSlug: sectionSlug as string });
  };

  return (
    <MediaLibraryProvider
      entityType="race"
      entityData={raceWithLocalChanges}
      queryKey={["race", systemSlug || "", sectionSlug || ""]}
      updateEntity={updateRaceField}
      isUpdating={isUpdating}
      systemId={system.id}
    >
      <AdminRaceForm
        race={race}
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

export default AdminRace;
