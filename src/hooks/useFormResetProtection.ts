import { useState, useEffect, useCallback } from 'react';
import { UseFormReset, FieldValues } from 'react-hook-form';

/**
 * Custom hook to prevent form resets during update cycles that cause form field flashing.
 * 
 * This hook tracks when a form has been submitted and prevents unwanted resets until
 * the server data reflects the submitted changes.
 * 
 * @param entityData - The current entity data from the server
 * @param isUpdating - Whether an update operation is in progress
 * @param optimisticData - Any optimistic update data
 * @param reset - The react-hook-form reset function
 * @param createFormData - Function to create form data from entity data
 * @param compareFields - Function to compare submitted data with server data
 * 
 * @returns Object with submit handler and whether form should reset
 */
export function useFormResetProtection<TEntity, TFormData extends FieldValues>(
  entityData: TEntity | null,
  isUpdating: boolean,
  optimisticData: any,
  reset: UseFormReset<TFormData>,
  createFormData: (entity: TEntity) => TFormData,
  compareFields: (serverData: TEntity, submittedData: TFormData) => boolean
) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState<TFormData | null>(null);

  // Handle form resets with submission protection
  useEffect(() => {
    if (!entityData || optimisticData || isUpdating) {
      return; // Don't reset during these states
    }

    // If we just submitted, check if the server data reflects our changes
    if (hasSubmitted && lastSubmittedData) {
      const serverReflectsSubmission = compareFields(entityData, lastSubmittedData);
      
      if (serverReflectsSubmission) {
        // Server data now reflects our submission, safe to reset
        setHasSubmitted(false);
        setLastSubmittedData(null);
        reset(createFormData(entityData));
      }
      // If server doesn't reflect our submission yet, don't reset
      return;
    }

    // Normal initialization (not after a submission) - only reset if we haven't submitted recently
    if (!hasSubmitted) {
      reset(createFormData(entityData));
    }
  }, [
    entityData,
    optimisticData,
    isUpdating,
    hasSubmitted,
    lastSubmittedData,
    reset,
    createFormData,
    compareFields,
  ]);

  // Create a protected submit handler
  const createProtectedSubmitHandler = useCallback(
    (originalOnSubmit: (data: TFormData) => void) => {
      return (data: TFormData) => {
        // Track this submission to prevent form resets during update cycle
        setHasSubmitted(true);
        setLastSubmittedData(data);
        originalOnSubmit(data);
      };
    },
    []
  );

  return {
    createProtectedSubmitHandler,
    hasSubmitted,
    lastSubmittedData,
  };
}