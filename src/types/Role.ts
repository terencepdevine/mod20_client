import { ArmorTaxonomy } from "./ArmorTaxonomy";
import { WeaponTaxonomy } from "./WeaponTaxonomy";
import { Skill } from "./Skill";
import { ToolTaxonomy } from "./ToolTaxonomy";

export interface Role {
  id: string;
  name: string;
  hp_dice: number;
  introduction?: string;
  savingThrows: [string];
  armorTaxonomies?: [ArmorTaxonomy];
  weaponTaxonomies?: [WeaponTaxonomy];
  skills?: [Skill];
  tools?: [ToolTaxonomy];
}
