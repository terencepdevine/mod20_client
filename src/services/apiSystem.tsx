import { Race } from "../types/Race";
import { Role } from "../types/Role";
import { System } from "../types/System";

const API_URL = "http://127.0.0.1:3000/api/v1";

export async function getSystem(systemId: string): Promise<System> {
  const res = await fetch(`${API_URL}/systems/${systemId}`);
  if (!res.ok) throw Error(`Failed getting System #${systemId}`);

  const { data }: { data: System } = await res.json();
  return data;
}

export async function getSystems(): Promise<System> {
  const res = await fetch(`${API_URL}/systems/`);
  if (!res.ok) throw Error(`Failed getting Systems`);

  const { data }: { data: System } = await res.json();
  return data;
}

export async function createEditSystem(
  newSystem: {
    name: string;
    version?: string;
    introduction?: string;
  },
  id: string,
): Promise<System> {
  let res;
  if (!id) {
    res = await fetch(`${API_URL}/systems/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSystem),
    });
  }

  if (id) {
    res = await fetch(`${API_URL}/systems/${id}`, {
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

  const { data }: { data: System } = await res.json();
  return data;
}

// export async function createEditSystem(newSystem, id) {
//   const res = await fetch(`${API_URL}/systems`);
// }

// export async function updateSystem(newSystem: {
//   name: string;
//   version?: string;
//   introduction?: string;
// }): Promise<System> {
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

export async function getRoles(systemId: string): Promise<unknown> {
  const res = await fetch(`${API_URL}/systems/${systemId}/roles`);
  if (!res.ok) throw Error(`Failed getting Roles for System #${systemId}`);

  const { data }: { data: Role[] } = await res.json();
  return data;
}

export interface RoleWithBreadcrumbs {
  breadcrumbs: Array<{ name: string; slug: string }>;
  role: Role;
}

export async function getRole(
  systemId: string,
  roleId: string,
): Promise<RoleWithBreadcrumbs> {
  const res = await fetch(`${API_URL}/systems/${systemId}/roles/${roleId}`);
  if (!res.ok) throw new Error(`Failed getting Role #${roleId}`);

  const { data }: { data: RoleWithBreadcrumbs } = await res.json();
  return data;
}

export async function getRace(systemId: string, raceId: string): Promise<Race> {
  const res = await fetch(`${API_URL}/systems/${systemId}/races/${raceId}`);
  if (!res.ok) throw Error(`Failed getting Race #${raceId}`);

  const { data }: { data: Race } = await res.json();
  return data;
}

export async function getNavigation(systemId: string): Promise<System> {
  const res = await fetch(`${API_URL}/systems/${systemId}/navigation`);
  if (!res.ok) throw Error(`Failed getting System #${systemId}`);

  const { data }: { data: System } = await res.json();
  return data;
}
