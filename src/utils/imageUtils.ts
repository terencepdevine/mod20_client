// Utility functions for handling different image versions

export const getImageUrl = (baseFilename: string, imageType: 'gallery' | 'background' | 'original' = 'gallery'): string => {
  if (!baseFilename) return '';
  
  const baseUrl = 'http://localhost:3000/public/img/media/';
  
  // If requesting original, return as-is
  if (imageType === 'original') {
    return `${baseUrl}${baseFilename}`;
  }
  
  // Extract base name and extension
  const ext = baseFilename.substring(baseFilename.lastIndexOf('.'));
  let baseName = baseFilename.substring(0, baseFilename.lastIndexOf('.'));
  
  // Remove existing suffix if present to get true base name
  baseName = baseName.replace(/-bg$|-gallery$/, '');
  
  // Add the appropriate suffix based on requested type
  const targetSuffix = imageType === 'background' ? '-bg' : '-gallery';
  return `${baseUrl}${baseName}${targetSuffix}${ext}`;
};

// Helper to determine the base filename from any version
export const getBaseFilename = (filename: string): string => {
  return filename.replace(/-bg\.|−gallery\.|-thumb\./, '.');
};