import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createEditSystem } from "../services/apiSystem";
import { generateSlug } from "../utils/slugUtils";

interface CreateSystemData {
  name: string;
  version?: string;
  introduction?: string;
  backgroundImageId?: string | null;
  abilities?: Array<{ name: string; description?: string }>;
  images?: Array<{ imageId: string; orderby: number }>;
}

export const useCreateSystem = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (systemData: CreateSystemData) => createEditSystem(systemData),
    onSuccess: (createdSystem) => {
      console.log("Create system success - received data:", createdSystem);
      
      if (createdSystem && createdSystem.name) {
        const systemSlug = generateSlug(createdSystem.name);
        
        // Pre-populate the query cache with the created system data
        queryClient.setQueryData(
          ["system", systemSlug],
          createdSystem
        );
        
        // Invalidate systems query to update the list
        queryClient.invalidateQueries({
          queryKey: ["systems"],
        });
        
        toast.success(`System "${createdSystem.name}" created successfully!`);
        navigate(`/admin/systems/${systemSlug}`);
      } else {
        console.error("System created but invalid response format:", createdSystem);
        toast.error("System created but response format is invalid");
      }
    },
    onError: (error: Error) => {
      console.error("System creation error:", error);
      toast.error(error.message || "Failed to create system");
    },
  });
};