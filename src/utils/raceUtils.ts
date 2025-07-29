import { SelectOption } from "../components/Select/Select";

// Size options for race selection
export const SIZE_OPTIONS: SelectOption[] = [
  { value: "Tiny", label: "Tiny" },
  { value: "Small", label: "Small" },
  { value: "Medium", label: "Medium" },
  { value: "Large", label: "Large" },
  { value: "Huge", label: "Huge" },
  { value: "Gargantuan", label: "Gargantuan" },
];

/**
 * Merges race data with local image changes for display
 */
export const mergeRaceWithLocalChanges = (
  race: any,
  localImageChanges: {
    backgroundImageId?: string | null;
    images?: Array<{ imageId: string; orderby: number }>;
  }
) => {
  if (!race) return null;
  
  return {
    ...race,
    ...localImageChanges,
  };
};