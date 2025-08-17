import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createRole } from "../services/apiSystem";
import { generateSlug } from "../utils/slugUtils";

interface CreateRoleData {
  name: string;
  system: string;
  hp_dice?: number;
  introduction?: string;
  primaryAbility?: string;
  images?: Array<{ imageId: string; orderby: number }>;
  backgroundImageId?: string | null;
}

export const useCreateRole = (systemSlug: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleData: CreateRoleData) => createRole(systemSlug, roleData),
    onSuccess: (createdRole) => {
      console.log("Create role success - received data:", createdRole);
      
      if (createdRole && createdRole.name) {
        const roleSlug = generateSlug(createdRole.name);
        
        // Pre-populate the query cache with the created role data
        queryClient.setQueryData(
          ["role", systemSlug, roleSlug],
          createdRole
        );
        
        // Invalidate the system query to refresh sidebar navigation
        queryClient.invalidateQueries({
          queryKey: ["system", systemSlug],
        });
        
        toast.success(`Role "${createdRole.name}" created successfully!`);
        navigate(`/admin/systems/${systemSlug}/roles/${roleSlug}`);
      } else {
        console.error("Role created but invalid response format:", createdRole);
        toast.error("Role created but response format is invalid");
      }
    },
    onError: (error: Error) => {
      console.error("Role creation error:", error);
      toast.error(error.message || "Failed to create role");
    },
  });
};