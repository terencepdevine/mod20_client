import { SystemType, RoleType, RaceType } from "@mod20/types";

/**
 * Form data types for admin components
 */
export type SystemFormData = Pick<
  SystemType,
  "name" | "version" | "introduction"
> & {
  backgroundImageId?: string | null;
  abilities?: Array<{
    name: string;
    description?: string;
    order?: number;
  }>;
};

export interface SystemMutationData {
  newSystem: SystemFormData;
  systemSlug: string;
}

/**
 * Form data types for role admin components - only form-specific fields
 */
export type RoleFormData = Pick<RoleType, "name" | "introduction"> & {
  hp_dice: string; // Form uses string, API expects number
  primaryAbility?: string; // Form uses ID string, API expects full object
};

/**
 * Form data types for race admin components - only form-specific fields
 */
export type RaceFormData = Pick<
  RaceType,
  | "name"
  | "speedWalking"
  | "speedFlying"
  | "speedSwimming"
  | "speedClimbing"
  | "speedBurrowing"
  | "age"
  | "size"
  | "languages"
>;
