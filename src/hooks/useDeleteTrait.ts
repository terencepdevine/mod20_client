import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteTrait } from "../services/apiTrait";

export function useDeleteTrait(systemSlug: string, systemId?: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteTrait, // deleteTrait now takes traitSlug
    onSuccess: () => {
      // Invalidate traits query to refetch
      if (systemId) {
        queryClient.invalidateQueries({ queryKey: ["traits", systemId] });
      }
      
      // Navigate back to traits list
      navigate(`/admin/systems/${systemSlug}/traits`);
    },
    onError: (error) => {
      console.error("Error deleting trait:", error);
    },
  });
}