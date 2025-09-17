import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createRace } from "../services/apiSystem";
import { generateSlug } from "../utils/slugUtils";

interface CreateRaceData {
  name: string;
  system: string;
  speedWalking?: number;
  speedFlying?: number;
  speedSwimming?: number;
  speedClimbing?: number;
  speedBurrowing?: number;
  age?: number;
  size?: string;
  languages?: string;
  images?: Array<{ imageId: string; orderby: number }>;
  backgroundImageId?: string | null;
}

export const useCreateRace = (systemSlug: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (raceData: CreateRaceData) => createRace(systemSlug, raceData),
    onSuccess: (createdRace) => {
      
      if (createdRace && createdRace.name) {
        const raceSlug = generateSlug(createdRace.name);
        
        // Pre-populate the query cache with the created race data
        queryClient.setQueryData(
          ["race", systemSlug, raceSlug],
          createdRace
        );
        
        // Invalidate system query to update sidebar with new race
        queryClient.invalidateQueries({
          queryKey: ["system", systemSlug],
        });
        
        toast.success(`Race "${createdRace.name}" created successfully!`);
        navigate(`/admin/systems/${systemSlug}/races/${raceSlug}`);
      } else {
        toast.error("Race created but response format is invalid");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create race");
    },
  });
};