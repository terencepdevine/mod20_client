import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTrait } from "../services/apiTrait";
import { TraitType } from "@mod20/types";
import { TraitFormData } from "../components/AdminTraitForm/AdminTraitForm";

export function useUpdateTrait(traitSlug: string, systemId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (traitData: TraitFormData) =>
      updateTrait(traitSlug, traitData),
    onMutate: async (newTraitData: TraitFormData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["trait", traitSlug] });

      // Snapshot the previous value
      const previousTrait = queryClient.getQueryData<TraitType>(["trait", traitSlug]);

      // Optimistically update to the new value
      if (previousTrait) {
        queryClient.setQueryData<TraitType>(["trait", traitSlug], {
          ...previousTrait,
          ...newTraitData,
        });
      }

      // Return a context object with the snapshotted value
      return { previousTrait };
    },
    onError: (err, newTrait, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTrait) {
        queryClient.setQueryData(["trait", traitSlug], context.previousTrait);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["trait", traitSlug] });
      if (systemId) {
        queryClient.invalidateQueries({ queryKey: ["traits", systemId] });
      }
    },
  });
}