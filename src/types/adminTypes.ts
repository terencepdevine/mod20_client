import { SystemType, RoleType, RaceType, TraitType } from "@mod20/types";

// =============================================================================
// FORM DATA TYPES
// =============================================================================

/**
 * Form data for System admin components
 */
export type SystemFormData = Pick<
  SystemType,
  "name" | "introduction" | "mental" | "mentalName" | "mentalConditions"
> & {
  backgroundImageId?: string | null;
  maxLevel: number; // Maximum character level (1-100)
  abilities?: Array<{
    id?: string; // Preserve ID for existing abilities
    name: string;
    description?: string;
    abbr?: string;
    order?: number;
  }>;
  skills?: Array<{
    id?: string; // Preserve ID for existing skills
    name: string;
    description?: string;
    relatedAbility?: string;
  }>;
};

/**
 * Form data for Role admin components
 */
export type RoleFormData = Pick<RoleType, "name" | "introduction"> & {
  hp_dice: string; // Form uses string, API expects number
  primaryAbility?: string; // Form uses ID string, API expects full object
};

/**
 * Form data for Race admin components
 */
export type RaceFormData = Pick<
  RaceType,
  | "name"
  | "introduction"
  | "speedWalking" 
  | "speedFlying"
  | "speedSwimming"
  | "speedClimbing"
  | "speedBurrowing"
  | "age"
  | "size"
  | "languages"
> & {
  traits?: Array<{
    trait: string; // Trait ID
    order?: number;
  }>;
};

/**
 * Form data for Trait admin components
 */
export type TraitFormData = Pick<TraitType, "name" | "description">;

// =============================================================================
// FORM INITIALIZATION HELPERS
// =============================================================================

/**
 * Creates form data for Race from entity data
 */
export const createRaceFormData = (race: RaceType): RaceFormData => ({
  name: race.name || "",
  introduction: race.introduction || "",
  size: race.size || "",
  languages: race.languages || "",
  speedWalking: race.speedWalking,
  speedFlying: race.speedFlying,
  speedSwimming: race.speedSwimming,
  speedClimbing: race.speedClimbing,
  speedBurrowing: race.speedBurrowing,
  age: race.age,
  traits: race.traits?.map((trait, index) => ({
    trait: trait.id,
    order: trait.order ?? index,
  })) || [],
});

/**
 * Creates form data for Role from entity data
 */
export const createRoleFormData = (role: RoleType): RoleFormData => ({
  name: role.name || "",
  introduction: role.introduction || "",
  hp_dice: role.hp_dice?.toString() || "",
  primaryAbility: role.primaryAbility?.id || "",
});

/**
 * Creates form data for Trait from entity data
 */
export const createTraitFormData = (trait: TraitType): TraitFormData => ({
  name: trait.name || "",
  description: trait.description || "",
});

/**
 * Creates form data for System from entity data
 */
export const createSystemFormData = (
  system: SystemType,
  formatAbilitiesForForm: (abilities: any[]) => any[],
  formatSkillsForForm: (skills: any[]) => any[]
): SystemFormData => ({
  name: system.name || "",
  introduction: system.introduction || "",
  backgroundImageId: system.backgroundImageId,
  maxLevel: system.character?.maxLevel || 20,
  abilities: formatAbilitiesForForm(system.abilities || []),
  skills: formatSkillsForForm(system.skills || []),
  mental: system.mental || false,
  mentalName: system.mentalName || "",
  mentalConditions: system.mentalConditions || [],
});

// =============================================================================
// MUTATION DATA TYPES
// =============================================================================

export interface SystemMutationData {
  newSystem: SystemFormData;
  systemSlug: string;
}

/**
 * Base interface for all admin form components
 */
interface BaseAdminFormProps<TEntity, TFormData> {
  entity: TEntity;
  isUpdating: boolean;
  optimisticData: Partial<TFormData> | null;
  onSubmit: (data: TFormData) => void;
  // Optional delete functionality
  systemSlug?: string;
  sectionSlug?: string;
  onDelete?: () => void;
  isDeleting?: boolean;
}

/**
 * Admin form props for System components
 */
export interface AdminSystemFormProps {
  system: SystemType;
  isUpdating: boolean;
  optimisticData: Partial<SystemFormData> | null;
  onSubmit: (data: SystemFormData) => void;
  formatAbilitiesForForm: (abilities: any[]) => any[];
  formatSkillsForForm: (skills: any[]) => any[];
  // Optional delete functionality
  systemSlug?: string;
  onDelete?: () => void;
  isDeleting?: boolean;
}

/**
 * Admin form props for Role components
 */
export interface AdminRoleFormProps extends BaseAdminFormProps<RoleType, RoleFormData> {
  role: RoleType;
  system: SystemType;
}

/**
 * Admin form props for Race components
 */
export interface AdminRaceFormProps extends BaseAdminFormProps<RaceType, RaceFormData> {
  race: RaceType;
  system: SystemType;
}

/**
 * Admin form props for Trait components
 */
export interface AdminTraitFormProps extends BaseAdminFormProps<TraitType, TraitFormData> {
  trait?: TraitType | null;
  system: SystemType;
}
