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
      console.log("Create race success - received data:", createdRace);
      
      // Invalidate system query to update sidebar with new race
      queryClient.invalidateQueries({
        queryKey: ["system", systemSlug],
      });
      
      if (createdRace && createdRace.name) {
        toast.success(`Race "${createdRace.name}" created successfully!`);
        const raceSlug = generateSlug(createdRace.name);
        navigate(`/admin/systems/${systemSlug}/races/${raceSlug}`);
      } else {
        console.error("Race created but invalid response format:", createdRace);
        toast.error("Race created but response format is invalid");
      }
    },
    onError: (error: Error) => {
      console.error("Race creation error:", error);
      toast.error(error.message || "Failed to create race");
    },
  });
};