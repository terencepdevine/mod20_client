/**
 * Generate a URL-friendly slug from a name
 * Matches backend slugify behavior with strict options
 * Converts to lowercase, handles special characters, and replaces spaces with dashes
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    // Replace & with 'and' to match slugify behavior
    .replace(/&/g, 'and')
    // Remove common special characters (matching backend remove regex)
    .replace(/[*+~.()'"!:@#]/g, '')
    // Remove any remaining special characters except spaces and dashes
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces with single dash
    .replace(/\s+/g, '-')
    // Replace multiple dashes with single dash
    .replace(/-+/g, '-')
    .trim();
};