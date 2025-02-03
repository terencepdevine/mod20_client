import { Race } from "./Race";
import { Role } from "./Role";

export interface SystemCharacter {
  id: string;
  name: string;
  races?: Race[];
  roles?: Role[];
}
