import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryClient } from "../query/queryClient";
import { updateRole } from "../services/apiSystem";
import { generateSlug } from "../utils/slugUtils";

interface RoleMutationData {
  name: string;
  introduction?: string;
  hp_dice?: string;
  primaryAbility?: string;
  backgroundImageId?: string | null;
  images?: Array<{ imageId: string; orderby: number }>;
}

/**
 * Custom hook for role mutation with optimistic updates and navigation
 */
export const useRoleMutation = (systemSlug: string, sectionSlug: string) => {
  const navigate = useNavigate();
  const [optimisticData, setOptimisticData] = useState<{ name: string } | null>(null);
  const [localImageChanges, setLocalImageChanges] = useState<{
    backgroundImageId?: string | null;
    images?: Array<{ imageId: string; orderby: number }>;
  }>({});

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: (roleData: RoleMutationData) => 
      updateRole(systemSlug, sectionSlug, roleData),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["role", systemSlug, sectionSlug],
      });

      const previousRole = queryClient.getQueryData([
        "role",
        systemSlug,
        sectionSlug,
      ]);
      const systemData = queryClient.getQueryData(["system", systemSlug]);

      // Convert primaryAbility ID to full object for optimistic update
      const optimisticVariables = { ...variables };
      if (variables.primaryAbility && systemData?.abilities) {
        const abilityObject = systemData.abilities.find(
          (ability: any) => ability._id === variables.primaryAbility,
        );
        if (abilityObject) {
          optimisticVariables.primaryAbility = abilityObject;
        }
      }

      queryClient.setQueryData(
        ["role", systemSlug, sectionSlug],
        (old: any) => {
          if (!old) return old;
          return { ...old, ...optimisticVariables };
        },
      );

      return { previousRole };
    },
    onSuccess: (_data, variables) => {
      toast("Role updated successfully");
      setOptimisticData(variables);

      // Handle slug-based redirect
      if (variables.name) {
        const newSlug = generateSlug(variables.name);
        if (newSlug !== sectionSlug) {
          navigate(`/admin/systems/${systemSlug}/roles/${newSlug}`);
          return;
        }
      }
    },
    onError: (err: Error, _variables, context) => {
      if (context?.previousRole) {
        queryClient.setQueryData(
          ["role", systemSlug, sectionSlug],
          context.previousRole,
        );
      }
      toast.error(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["role", systemSlug, sectionSlug],
      });
      // Also invalidate system query to update sidebar with role changes
      queryClient.invalidateQueries({
        queryKey: ["system", systemSlug],
      });
      setTimeout(() => {
        setLocalImageChanges({});
        setOptimisticData(null);
      }, 100);
    },
  });

  // Update function for local-only changes
  const updateRoleField = async (fieldKey: string, value: any) => {
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
    updateRoleField,
  };
};