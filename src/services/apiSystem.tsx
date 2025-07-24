import { RaceType, RoleType, SystemType, SystemNavigationType, ImageType } from "@mod20/types";

const API_URL = "http://127.0.0.1:3000/api/v1";

export async function getSystem(systemSlug: string): Promise<SystemType> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}`);
  if (!res.ok) throw Error(`Failed getting System ${systemSlug}`);

  const { data }: { data: SystemType } = await res.json();
  return data;
}

export async function getSystems(): Promise<SystemType[]> {
  const res = await fetch(`${API_URL}/systems/`);
  if (!res.ok) throw Error(`Failed getting Systems`);

  const { data }: { data: SystemType[] } = await res.json();
  return data;
}

export async function createEditSystem(
  newSystem: {
    name: string;
    version?: string;
    introduction?: string;
  },
  systemSlug?: string,
): Promise<SystemType> {
  let res: Response;
  
  if (!systemSlug) {
    res = await fetch(`${API_URL}/systems/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSystem),
    });
  } else {
    res = await fetch(`${API_URL}/systems/${systemSlug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSystem),
    });
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw Error(
      `Failed to create System: ${errorData.message || res.statusText}`,
    );
  }

  const { data }: { data: SystemType } = await res.json();
  return data;
}

// export async function createEditSystem(newSystem, id) {
//   const res = await fetch(`${API_URL}/systems`);
// }

// export async function updateSystem(newSystem: {
//   name: string;
//   version?: string;
//   introduction?: string;
// }): Promise<SystemType> {
//   const res = await fetch(`${API_URL}/systems/:id`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(newSystem),
//   });

//   if (!res.ok) {
//     const errorData = await res.json();
//     throw Error(
//       `Failed to update System: ${errorData.message || res.statusText}`,
//     );
//   }

//   const { data }: { data: System } = await res.json();
//   return data;
// }

export async function getRoles(systemSlug: string): Promise<unknown> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}/roles`);
  if (!res.ok) throw Error(`Failed getting Roles for System #${systemSlug}`);

  const { data }: { data: RoleType[] } = await res.json();
  return data;
}

export interface RoleWithBreadcrumbs {
  breadcrumbs: Array<{ name: string; slug: string }>;
  role: RoleType;
}

export async function getRole(
  systemSlug: string,
  sectionSlug: string,
): Promise<RoleWithBreadcrumbs> {
  const res = await fetch(
    `${API_URL}/systems/${systemSlug}/roles/${sectionSlug}`,
  );

  if (!res.ok) throw new Error(`Failed getting Role #${sectionSlug}`);

  const { data }: { data: RoleWithBreadcrumbs } = await res.json();
  return data;
}

export async function getRace(
  systemSlug: string,
  sectionSlug: string,
): Promise<RaceType> {
  const res = await fetch(
    `${API_URL}/systems/${systemSlug}/races/${sectionSlug}`,
  );
  if (!res.ok) throw Error(`Failed getting Race #${sectionSlug}`);

  const { data }: { data: RaceType } = await res.json();
  return data;
}

export async function getNavigation(systemSlug: string): Promise<SystemNavigationType> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}/navigation`);
  if (!res.ok) throw Error(`Failed getting System ${systemSlug}`);

  const { data }: { data: SystemNavigationType } = await res.json();
  return data;
}

export async function updateRole(
  systemSlug: string,
  sectionSlug: string,
  roleData: { 
    name: string; 
    introduction?: string; 
    hp_dice?: string;
    backgroundImageId?: string | null; 
    images?: Array<{ imageId: string; orderby: number }> 
  }
): Promise<RoleType> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}/roles/${sectionSlug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(roleData),
  });
  
  if (!res.ok) throw Error(`Failed updating Role ${sectionSlug}`);

  const { data }: { data: RoleType } = await res.json();
  return data;
}


// Media Library API Functions
export async function getImages(): Promise<ImageType[]> {
  try {
    const res = await fetch(`${API_URL}/images`);
    
    if (!res.ok) {
      if (res.status === 404) {
        console.warn("Media library endpoint not found, returning empty array");
        return [];
      }
      throw Error(`Failed getting images from media library: ${res.status} ${res.statusText}`);
    }

    const responseData = await res.json();
    
    // Handle different response structures
    if (responseData.data && responseData.data.images && Array.isArray(responseData.data.images)) {
      // Structure: { data: { images: [...] } }
      return responseData.data.images;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      // Structure: { data: [...] }
      return responseData.data;
    } else if (Array.isArray(responseData)) {
      // Direct array structure
      return responseData;
    } else {
      return [];
    }
  } catch (error) {
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
}

export async function getImage(imageId: string): Promise<ImageType> {
  const res = await fetch(`${API_URL}/images/${imageId}`);
  if (!res.ok) throw Error(`Failed getting image ${imageId}`);

  const { data }: { data: ImageType } = await res.json();
  return data;
}

export async function uploadImage(formData: FormData): Promise<ImageType> {
  const res = await fetch(`${API_URL}/images`, {
    method: "POST",
    body: formData,
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw Error(`Failed uploading image: ${res.status} ${res.statusText} - ${errorText}`);
  }

  const responseData = await res.json();
  
  // Handle different response structures
  if (responseData.data) {
    return responseData.data;
  } else if (responseData.id) {
    return responseData;
  } else {
    throw Error('Unexpected response format from upload API');
  }
}

export async function updateImage(imageId: string, imageData: Partial<ImageType>): Promise<ImageType> {
  const res = await fetch(`${API_URL}/images/${imageId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(imageData),
  });
  
  if (!res.ok) throw Error(`Failed updating image ${imageId}`);

  const { data }: { data: ImageType } = await res.json();
  return data;
}

export async function deleteImage(imageId: string): Promise<void> {
  const res = await fetch(`${API_URL}/images/${imageId}`, {
    method: "DELETE",
  });
  
  if (!res.ok) throw Error(`Failed deleting image ${imageId}`);
}

// Generic Role Image Management with Image IDs
export async function addImageToRoleField(
  systemSlug: string,
  sectionSlug: string,
  imageId: string,
  fieldType: 'images' | 'backgroundImageId' = 'images'
): Promise<RoleType> {
  // First, get the current role data
  const currentRoleRes = await fetch(`${API_URL}/systems/${systemSlug}/roles/${sectionSlug}`);
  
  if (!currentRoleRes.ok) {
    throw Error(`Failed to get current role data: ${currentRoleRes.status}`);
  }

  const currentRoleData = await currentRoleRes.json();
  const currentRole = currentRoleData.data.role || currentRoleData.data;
  
  let requestBody: any = {};
  
  if (fieldType === 'images') {
    // Handle multiple images (gallery)
    // Check both imageIds (new) and images (legacy) fields for compatibility
    const currentImageIds = currentRole.imageIds || currentRole.images || [];
    const updatedImageIds = currentImageIds.includes(imageId) 
      ? currentImageIds  // Already exists, don't add duplicate
      : [...currentImageIds, imageId];  // Add new imageId
    
    requestBody = {
      imageIds: updatedImageIds,  // New field name
      images: updatedImageIds     // Legacy field name (backend might still use this)
    };
  } else if (fieldType === 'backgroundImageId') {
    // Handle single background image
    requestBody = {
      backgroundImageId: imageId
    };
  }
  
  // Update the role with the new image data
  const url = `${API_URL}/systems/${systemSlug}/roles/${sectionSlug}`;
  
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw Error(`Failed updating role with image: ${res.status} ${errorText}`);
  }

  const responseData = await res.json();
  
  let roleData;
  if (responseData.data && responseData.data.role) {
    roleData = responseData.data.role;
  } else if (responseData.data) {
    roleData = responseData.data;
  } else {
    roleData = responseData;
  }
  
  return roleData;
}

export async function removeImageFromRoleField(
  systemSlug: string,
  sectionSlug: string,
  imageId: string,
  fieldType: 'images' | 'backgroundImageId' = 'images'
): Promise<RoleType> {
  // First, get the current role data
  const currentRoleRes = await fetch(`${API_URL}/systems/${systemSlug}/roles/${sectionSlug}`);
  
  if (!currentRoleRes.ok) {
    throw Error(`Failed to get current role data: ${currentRoleRes.status}`);
  }

  const currentRoleData = await currentRoleRes.json();
  const currentRole = currentRoleData.data.role || currentRoleData.data;
  
  let requestBody: any = {};
  
  if (fieldType === 'images') {
    // Handle multiple images (gallery) - remove from array
    // Check both imageIds (new) and images (legacy) fields for compatibility
    const currentImageIds = currentRole.imageIds || currentRole.images || [];
    const updatedImageIds = currentImageIds.filter(id => id !== imageId);
    
    requestBody = {
      imageIds: updatedImageIds,  // New field name
      images: updatedImageIds     // Legacy field name (backend might still use this)
    };
  } else if (fieldType === 'backgroundImageId') {
    // Handle single background image - set to null/empty
    requestBody = {
      backgroundImageId: null
    };
  }
  
  // Update the role with the new image data
  const url = `${API_URL}/systems/${systemSlug}/roles/${sectionSlug}`;
  
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw Error(`Failed removing image from role: ${res.status} ${errorText}`);
  }

  const responseData = await res.json();
  
  if (responseData.data && responseData.data.role) {
    return responseData.data.role;
  } else if (responseData.data) {
    return responseData.data;
  } else {
    return responseData;
  }
}

// Backward compatibility functions
export async function addImageToRole(
  systemSlug: string,
  sectionSlug: string,
  imageId: string
): Promise<RoleType> {
  return addImageToRoleField(systemSlug, sectionSlug, imageId, 'images');
}

export async function removeImageFromRole(
  systemSlug: string,
  sectionSlug: string,
  imageId: string
): Promise<RoleType> {
  return removeImageFromRoleField(systemSlug, sectionSlug, imageId, 'images');
}
