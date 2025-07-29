import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteRole } from "../services/apiSystem";

export const useDeleteRole = (systemSlug: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionSlug }: { sectionSlug: string }) =>
      deleteRole(systemSlug, sectionSlug),
    onSuccess: (_, { sectionSlug }) => {
      console.log("Delete role success for:", sectionSlug);
      
      // Invalidate system query to update sidebar navigation
      queryClient.invalidateQueries({
        queryKey: ["system", systemSlug],
      });
      
      toast.success("Role deleted successfully!");
      navigate(`/admin/systems/${systemSlug}`);
    },
    onError: (error: Error, { sectionSlug }) => {
      console.error("Role deletion error:", error);
      toast.error(error.message || `Failed to delete role ${sectionSlug}`);
    },
  });
};