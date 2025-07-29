import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteSystem } from "../services/apiSystem";

export const useDeleteSystem = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ systemSlug }: { systemSlug: string }) =>
      deleteSystem(systemSlug),
    onSuccess: (_, { systemSlug }) => {
      console.log("Delete system success for:", systemSlug);
      
      // Invalidate systems query to update navigation
      queryClient.invalidateQueries({
        queryKey: ["systems"],
      });
      
      // Also invalidate the specific system query
      queryClient.invalidateQueries({
        queryKey: ["system", systemSlug],
      });
      
      toast.success("System deleted successfully! All related races, roles, and abilities have been removed.");
      navigate("/admin");
    },
    onError: (error: Error, { systemSlug }) => {
      console.error("System deletion error:", error);
      toast.error(error.message || `Failed to delete system ${systemSlug}`);
    },
  });
};