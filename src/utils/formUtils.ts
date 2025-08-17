/**
 * Utility functions for form data transformation
 */

/**
 * Formats abilities array for form usage
 */
export const formatAbilitiesForForm = (abilities: any[] = []) =>
  abilities.map((ability, index) => ({
    id: ability.id, // Preserve the ID for existing abilities
    name: ability.name || "",
    description: ability.description || "",
    abbr: ability.abbr || "",
    order: ability.order !== undefined ? ability.order : index,
  }));

/**
 * Formats skills array for form usage
 */
export const formatSkillsForForm = (skills: any[] = []) =>
  skills.map((skill) => ({
    id: skill.id, // Preserve the ID for existing skills
    name: skill.name || "",
    description: skill.description || "",
    relatedAbility: skill.relatedAbility?.id || skill.relatedAbility || "",
  }));

/**
 * Generates an abbreviation from a name (first 3 letters, uppercase)
 */
export const generateAbbreviation = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  return name.trim().substring(0, 3).toUpperCase();
};

/**
 * Gets the display abbreviation for an ability (uses abbr field or generates from name)
 */
export const getAbilityAbbreviation = (ability: { name?: string; abbr?: string }): string => {
  if (ability.abbr && ability.abbr.trim()) {
    return ability.abbr.trim().toUpperCase();
  }
  return generateAbbreviation(ability.name || '');
};

/**
 * Creates system data with local changes for MediaLibrary
 */
export const mergeLocalChanges = <T extends Record<string, any>>(
  entity: T | null,
  localChanges: Record<string, any>
): T | null => {
  return entity ? { ...entity, ...localChanges } : null;
};

