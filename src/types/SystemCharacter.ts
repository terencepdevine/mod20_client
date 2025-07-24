import { RaceType, RoleType } from "@mod20/types";

export interface SystemCharacter {
  id: string;
  name: string;
  races?: RaceType[];
  roles?: RoleType[];
}
