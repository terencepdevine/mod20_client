/**
 * Utility functions for form data transformation
 */

/**
 * Formats abilities array for form usage
 */
export const formatAbilitiesForForm = (abilities: any[] = []) =>
  abilities.map((ability, index) => ({
    name: ability.name || "",
    description: ability.description || "",
    order: ability.order !== undefined ? ability.order : index,
  }));

/**
 * Creates system data with local changes for MediaLibrary
 */
export const mergeLocalChanges = <T extends Record<string, any>>(
  entity: T | null,
  localChanges: Record<string, any>
): T | null => {
  return entity ? { ...entity, ...localChanges } : null;
};