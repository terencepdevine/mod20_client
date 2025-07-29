import { SelectOption } from "../components/Select/Select";

// Hit dice options for role selection
export const HIT_DICE_OPTIONS: SelectOption[] = [
  { value: "6", label: "D6" },
  { value: "8", label: "D8" },
  { value: "10", label: "D10" },
  { value: "12", label: "D12" },
];

/**
 * Creates ability options for dropdowns from system abilities
 */
export const createAbilityOptions = (abilities: any[]): SelectOption[] => {
  return abilities?.map((ability: any) => ({
    value: ability._id,
    label: ability.name,
  })) || [];
};

/**
 * Merges role data with local image changes for display
 */
export const mergeRoleWithLocalChanges = (
  role: any,
  localImageChanges: {
    backgroundImageId?: string | null;
    images?: Array<{ imageId: string; orderby: number }>;
  }
) => {
  if (!role) return null;
  
  return {
    ...role,
    ...localImageChanges,
  };
};