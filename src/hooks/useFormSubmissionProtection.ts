import { useState, useEffect, useRef } from 'react';
import { UseFormReset, FieldValues } from 'react-hook-form';

/**
 * Prevents form field flashing during save operations by blocking form resets
 * during the submission cycle.
 * 
 * @param entityData - The current entity data from server
 * @param isUpdating - Whether an update operation is in progress  
 * @param optimisticData - Any optimistic update data
 * @param reset - The react-hook-form reset function
 * @param createFormData - Function to create form data from entity data
 * 
 * @returns Protected submit handler and form state
 */
export function useFormSubmissionProtection<TEntity, TFormData extends FieldValues>(
  entityData: TEntity | null,
  isUpdating: boolean,
  optimisticData: any,
  reset: UseFormReset<TFormData>,
  createFormData: (entity: TEntity) => TFormData
) {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const lastResetDataRef = useRef<string | null>(null);

  // Form initialization - only reset when entity data actually changes (not on every render)
  useEffect(() => {
    if (!entityData || optimisticData || isUpdating || isFormSubmitting) {
      return;
    }

    // Create a stable identifier for the entity data to avoid unnecessary resets
    const entityId = (entityData as any)?.id || (entityData as any)?._id;
    const entityName = (entityData as any)?.name;
    const mentalName = (entityData as any)?.mentalName;
    const mental = (entityData as any)?.mental;
    const currentDataKey = `${entityId}-${entityName}-${mentalName}-${mental}`;

    // Only reset if this is genuinely new/different entity data
    if (lastResetDataRef.current !== currentDataKey) {
      lastResetDataRef.current = currentDataKey;
      reset(createFormData(entityData));
    }
  }, [
    entityData,
    optimisticData,
    isUpdating,
    isFormSubmitting,
    reset,
    createFormData,
  ]);

  // Clear form submitting state when update completes
  useEffect(() => {
    if (!isUpdating && isFormSubmitting) {
      // Small delay to ensure the new data has been processed
      const timer = setTimeout(() => {
        setIsFormSubmitting(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isUpdating, isFormSubmitting]);

  // Create protected submit handler
  const createProtectedSubmitHandler = <T>(originalOnSubmit: (data: T) => void) => {
    return (data: T) => {
      setIsFormSubmitting(true);
      originalOnSubmit(data);
    };
  };

  return {
    createProtectedSubmitHandler,
    isFormSubmitting,
  };
}