import { RaceType, RoleType, SystemType, SystemNavigationType, ImageType } from "@mod20/types";
import { generateSlug } from "../utils/slugUtils";

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
    backgroundImageId?: string | null;
    abilities?: Array<{ name: string; description?: string }>;
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

export async function deleteSystem(systemSlug: string): Promise<void> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Delete system API error:", res.status, errorText);
    throw Error(`Failed deleting System ${systemSlug}: ${res.status} - ${errorText}`);
  }
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

export async function getRole(
  systemSlug: string,
  sectionSlug: string,
): Promise<RoleType> {
  const res = await fetch(
    `${API_URL}/systems/${systemSlug}/roles/${sectionSlug}`,
  );

  if (!res.ok) throw new Error(`Failed getting Role #${sectionSlug}`);

  const { data }: { data: { role: RoleType } } = await res.json();
  return data.role;
}

export async function getRace(
  systemSlug: string,
  sectionSlug: string,
): Promise<RaceType> {
  const res = await fetch(
    `${API_URL}/systems/${systemSlug}/races/${sectionSlug}`,
  );
  if (!res.ok) throw Error(`Failed getting Race #${sectionSlug}`);

  const { data }: { data: { race: RaceType } } = await res.json();
  return data.race;
}

export async function getNavigation(systemSlug: string): Promise<SystemNavigationType> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}/navigation`);
  if (!res.ok) throw Error(`Failed getting System ${systemSlug}`);

  const { data }: { data: SystemNavigationType } = await res.json();
  return data;
}

export async function createRole(
  systemSlug: string,
  roleData: {
    name: string;
    system: string;
    hp_dice?: number;
    introduction?: string;
    primaryAbility?: string;
    images?: Array<{ imageId: string; orderby: number }>;
    backgroundImageId?: string | null;
  }
): Promise<RoleType> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(roleData),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Create role API error:", res.status, errorText);
    throw Error(`Failed creating Role: ${res.status}`);
  }

  const response = await res.json();
  console.log("Create role API response:", response);
  
  if (response.data?.role) {
    return response.data.role;
  } else if (response.data) {
    return response.data;
  } else {
    console.error("Unexpected create role response:", response);
    throw new Error("Invalid response format from create role API");
  }
}

export async function updateRole(
  systemSlug: string,
  sectionSlug: string,
  roleData: { 
    name: string; 
    introduction?: string; 
    hp_dice?: string;
    primaryAbility?: string;
    backgroundImageId?: string | null; 
    images?: Array<{ imageId: string; orderby: number }> 
  }
): Promise<RoleType> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}/roles/${sectionSlug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(roleData),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Update role API error:", res.status, errorText);
    throw Error(`Failed updating Role ${sectionSlug}: ${res.status} - ${errorText}`);
  }

  const { data }: { data: { role: RoleType } } = await res.json();
  return data.role;
}

export async function deleteRole(
  systemSlug: string,
  sectionSlug: string
): Promise<void> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}/roles/${sectionSlug}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Delete role API error:", res.status, errorText);
    throw Error(`Failed deleting Role ${sectionSlug}: ${res.status} - ${errorText}`);
  }
}

export async function updateRace(
  systemSlug: string,
  sectionSlug: string,
  raceData: { 
    name: string; 
    speedWalking?: number;
    speedFlying?: number;
    speedSwimming?: number;
    speedClimbing?: number;
    speedBurrowing?: number;
    age?: number;
    size?: string;
    languages?: string;
    backgroundImageId?: string | null; 
    images?: Array<{ imageId: string; orderby: number }> 
  }
): Promise<RaceType> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}/races/${sectionSlug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raceData),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Update race API error:", res.status, errorText);
    throw Error(`Failed updating Race ${sectionSlug}: ${res.status} - ${errorText}`);
  }

  const { data }: { data: { race: RaceType } } = await res.json();
  return data.race;
}

export async function deleteRace(
  systemSlug: string,
  sectionSlug: string
): Promise<void> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}/races/${sectionSlug}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Delete race API error:", res.status, errorText);
    throw Error(`Failed deleting Race ${sectionSlug}: ${res.status} - ${errorText}`);
  }
}

export async function createRace(
  systemSlug: string,
  raceData: {
    name: string;
    system: string;
    speedWalking?: number;
    speedFlying?: number;
    speedSwimming?: number;
    speedClimbing?: number;
    speedBurrowing?: number;
    age?: number;
    size?: string;
    languages?: string;
    images?: Array<{ imageId: string; orderby: number }>;
    backgroundImageId?: string | null;
  }
): Promise<RaceType> {
  // Add slug to the race data
  const raceDataWithSlug = {
    ...raceData,
    slug: generateSlug(raceData.name),
  };

  const res = await fetch(`${API_URL}/systems/${systemSlug}/races`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raceDataWithSlug),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Create race API error:", res.status, errorText);
    throw Error(`Failed creating Race: ${res.status}`);
  }

  const response = await res.json();
  console.log("Create race API response:", response);
  
  if (response.data?.race) {
    return response.data.race;
  } else if (response.data) {
    return response.data;
  } else {
    console.error("Unexpected create race response:", response);
    throw new Error("Invalid response format from create race API");
  }
}


// Media Library API Functions
export async function getImages(systemId?: string): Promise<ImageType[]> {
  try {
    const url = systemId 
      ? `${API_URL}/images?systemId=${systemId}`
      : `${API_URL}/images`;
    console.log('getImages: Fetching images with URL:', url);
    console.log('getImages: systemId parameter:', systemId);
    const res = await fetch(url);
    
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
