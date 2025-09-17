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
    onMutate: async ({ systemSlug }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["systems"] });
      await queryClient.cancelQueries({ queryKey: ["system", systemSlug] });
      
      // Snapshot the previous value
      const previousSystems = queryClient.getQueryData(["systems"]);
      
      // Optimistically update the cache - remove the system immediately
      queryClient.setQueryData(["systems"], (oldSystems: any) => {
        if (!Array.isArray(oldSystems)) return oldSystems;
        return oldSystems.filter(system => system.slug !== systemSlug);
      });
      
      // Remove the specific system query from cache
      queryClient.removeQueries({
        queryKey: ["system", systemSlug],
      });
      
      return { previousSystems };
    },
    onSuccess: (_, { systemSlug }) => {
      
      // Invalidate systems query to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["systems"],
      });
      
      toast.success("System deleted successfully! All related races, roles, and abilities have been removed.");
      navigate("/admin/systems");
    },
    onError: (error, { systemSlug }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSystems) {
        queryClient.setQueryData(["systems"], context.previousSystems);
      }
      
      toast.error(error.message || `Failed to delete system ${systemSlug}`);
    },
  });
};