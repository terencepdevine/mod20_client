import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryClient } from "../query/queryClient";
import { createEditSystem } from "../services/apiSystem";
import { generateSlug } from "../utils/slugUtils";
import { SystemFormData, SystemMutationData } from "../types/adminTypes";

/**
 * Custom hook for system mutation with optimistic updates and navigation
 */
export const useSystemMutation = (systemSlug: string) => {
  const navigate = useNavigate();
  const [optimisticData, setOptimisticData] = useState<Partial<SystemFormData> | null>(null);
  const [localImageChanges, setLocalImageChanges] = useState<{
    backgroundImageId?: string | null;
  }>({});

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: ({ newSystem, systemSlug }: SystemMutationData) =>
      createEditSystem(newSystem, systemSlug),
    onMutate: async (variables) => {
      const { newSystem, systemSlug } = variables;
      
      await queryClient.cancelQueries({ queryKey: ["system", systemSlug] });
      
      const previousSystem = queryClient.getQueryData(["system", systemSlug]);
      
      queryClient.setQueryData(["system", systemSlug], (old: any) => {
        if (!old) return old;
        return { ...old, ...newSystem };
      });
      
      return { previousSystem };
    },
    onSuccess: (_data, variables) => {
      const { newSystem, systemSlug } = variables;
      toast("System Updated");
      // Don't set optimistic data on success - let the server response populate the form
      
      // Handle slug-based redirect
      if (newSystem.name) {
        const newSlug = generateSlug(newSystem.name);
        if (newSlug !== systemSlug) {
          // Replace history entry to prevent navigation to non-existent old slug
          navigate(`/admin/systems/${newSlug}`, { replace: true });
          return;
        }
      }
    },
    onError: (err: Error, variables, context) => {
      const { systemSlug } = variables;
      
      if (context?.previousSystem) {
        queryClient.setQueryData(["system", systemSlug], context.previousSystem);
      }
      toast.error(err.message);
    },
    onSettled: (_data, _error, variables) => {
      // Add a small delay before invalidating to ensure database is fully updated
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["system", variables.systemSlug],
        });
        setLocalImageChanges({});
        setOptimisticData(null);
      }, 200);
    },
  });

  // Update function for local-only changes
  const updateSystemField = async (fieldKey: string, value: any) => {
    setLocalImageChanges((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
    return Promise.resolve({ [fieldKey]: value });
  };

  return {
    mutate,
    isUpdating,
    optimisticData,
    localImageChanges,
    updateSystemField,
  };
};

