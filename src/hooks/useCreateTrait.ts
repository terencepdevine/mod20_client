import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createTrait } from "../services/apiTrait";
import { TraitFormData } from "../components/AdminTraitForm/AdminTraitForm";

export function useCreateTrait(systemSlug: string, systemId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (traitData: TraitFormData) =>
      createTrait({
        ...traitData,
        system: systemId,
        order: 0,
      }),
    onSuccess: (newTrait) => {
      
      // Invalidate traits query to refetch
      queryClient.invalidateQueries({ queryKey: ["traits", systemId] });
      
      // Navigate to the new trait edit page using slug
      navigate(`/admin/systems/${systemSlug}/traits/${newTrait.slug}`);
    },
    onError: (error) => {
      alert(`Failed to create trait: ${error.message}`);
    },
  });
}