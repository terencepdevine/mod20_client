import { Ability } from './Ability';

export interface Skill {
  id: string;
  name: string;
  description?: string;
  relatedAbility?: Ability;
  system?: string;
}
