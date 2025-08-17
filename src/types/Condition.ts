// Local client type for Condition (mental/resilience system states)
export interface ConditionType {
  id: string;
  name: string; // e.g., "Stressed", "Panicked", "Broken"
  slug: string;
  description?: string; // Effect description for the condition
  severity?: number; // Optional severity level (1-10 scale)
  system?: string; // Reference to parent system
  createdAt?: string;
  updatedAt?: string;
}
