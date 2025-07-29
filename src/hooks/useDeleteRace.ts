import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteRace } from "../services/apiSystem";

export const useDeleteRace = (systemSlug: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionSlug }: { sectionSlug: string }) =>
      deleteRace(systemSlug, sectionSlug),
    onSuccess: (_, { sectionSlug }) => {
      console.log("Delete race success for:", sectionSlug);
      
      // Invalidate system query to update sidebar navigation
      queryClient.invalidateQueries({
        queryKey: ["system", systemSlug],
      });
      
      toast.success("Race deleted successfully!");
      navigate(`/admin/systems/${systemSlug}`);
    },
    onError: (error: Error, { sectionSlug }) => {
      console.error("Race deletion error:", error);
      toast.error(error.message || `Failed to delete race ${sectionSlug}`);
    },
  });
};