import { TraitType } from "@mod20/types";

const API_URL = "http://127.0.0.1:3000/api/v1";

export async function getTraits(systemId?: string): Promise<TraitType[]> {
  const url = systemId 
    ? `${API_URL}/traits?system=${systemId}`
    : `${API_URL}/traits`;
  
  const res = await fetch(url);
  if (!res.ok) throw Error(`Failed getting traits`);

  const { data }: { data: TraitType[] } = await res.json();
  return data;
}

export async function getTrait(traitSlug: string): Promise<TraitType> {
  const res = await fetch(`${API_URL}/traits/${traitSlug}`);
  if (!res.ok) throw Error(`Failed getting trait ${traitSlug}`);

  const { data }: { data: { trait: TraitType } } = await res.json();
  return data.trait;
}

export async function createTrait(
  newTrait: {
    name: string;
    description?: string;
    system: string;
    order?: number;
  }
): Promise<TraitType> {
  const res = await fetch(`${API_URL}/traits/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTrait),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
    console.error('API Error Response:', { status: res.status, statusText: res.statusText, errorData });
    
    throw new Error(`Failed to create trait: ${errorData.message || res.statusText}`);
  }

  const { data }: { data: { trait: TraitType } } = await res.json();
  return data.trait;
}

export async function updateTrait(
  traitSlug: string,
  updatedTrait: {
    name?: string;
    description?: string;
    system?: string;
    order?: number;
  }
): Promise<TraitType> {
  const res = await fetch(`${API_URL}/traits/${traitSlug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTrait),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(`Failed to update trait: ${errorData.message || res.statusText}`);
  }

  const { data }: { data: { trait: TraitType } } = await res.json();
  return data.trait;
}

export async function deleteTrait(traitSlug: string): Promise<void> {
  const res = await fetch(`${API_URL}/traits/${traitSlug}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(`Failed to delete trait: ${errorData.message || res.statusText}`);
  }
}