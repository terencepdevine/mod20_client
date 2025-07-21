import { SystemCharacter } from "./SystemCharacter";

export interface SystemType {
  // 1. Introduction
  id: string;
  name: string;
  version?: string;
  // - System Details
  excerpt?: string;
  introduction?: string;
  background_image?: string;
  details_featured_image?: string;
  // - Welcome to MOD20
  // - Using These Docs
  // - How to Play

  // 2. Character
  character: SystemCharacter;
  // 3. Gameplay
  // 4. Guide
}
