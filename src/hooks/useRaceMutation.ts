import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryClient } from "../query/queryClient";
import { updateRace } from "../services/apiSystem";
import { generateSlug } from "../utils/slugUtils";

interface RaceMutationData {
  name: string;
  speedWalking?: number;
  speedFlying?: number;
  speedSwimming?: number;
  speedClimbing?: number;
  speedBurrowing?: number;
  age?: number;
  size?: string;
  languages?: string;
  backgroundImageId?: string | null;
  images?: Array<{ imageId: string; orderby: number }>;
  traits?: Array<{ trait: string; order?: number }>;
}

/**
 * Custom hook for race mutation with optimistic updates and navigation
 */
export const useRaceMutation = (systemSlug: string, sectionSlug: string) => {
  const navigate = useNavigate();
  const [optimisticData, setOptimisticData] = useState<{ name: string } | null>(null);
  const [localImageChanges, setLocalImageChanges] = useState<{
    backgroundImageId?: string | null;
    images?: Array<{ imageId: string; orderby: number }>;
  }>({});

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: (raceData: RaceMutationData) => 
      updateRace(systemSlug, sectionSlug, raceData),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["race", systemSlug, sectionSlug],
      });

      const previousRace = queryClient.getQueryData([
        "race",
        systemSlug,
        sectionSlug,
      ]);

      queryClient.setQueryData(
        ["race", systemSlug, sectionSlug],
        (old: any) => {
          if (!old) return old;
          return { ...old, ...variables };
        },
      );

      return { previousRace };
    },
    onSuccess: (_data, variables) => {
      toast("Race updated successfully");
      setOptimisticData(variables);

      // Handle slug-based redirect
      if (variables.name) {
        const newSlug = generateSlug(variables.name);
        if (newSlug !== sectionSlug) {
          // Replace history entry to prevent navigation to non-existent old slug
          navigate(`/admin/systems/${systemSlug}/races/${newSlug}`, { replace: true });
          return;
        }
      }
    },
    onError: (err: Error, _variables, context) => {
      if (context?.previousRace) {
        queryClient.setQueryData(
          ["race", systemSlug, sectionSlug],
          context.previousRace,
        );
      }
      toast.error(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["race", systemSlug, sectionSlug],
      });
      // Also invalidate system query to update sidebar with race changes
      queryClient.invalidateQueries({
        queryKey: ["system", systemSlug],
      });
      setTimeout(() => {
        setLocalImageChanges({});
        setOptimisticData(null);
      }, 100);
    },
  });

  // Update function for local-only changes
  const updateRaceField = async (fieldKey: string, value: any) => {
    setLocalImageChanges((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
    return Promise.resolve({ [fieldKey]: value });
  };

  return {
    mutate,
    isUpdating,
    optimisticData,
    localImageChanges,
    updateRaceField,
  };
};