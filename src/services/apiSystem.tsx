import { Race } from "../types/Race";
import { Role } from "../types/Role";
import { SystemType } from "../types/System";

const API_URL = "http://127.0.0.1:3000/api/v1";

export async function getSystem(systemSlug: string): Promise<SystemType> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}`);
  if (!res.ok) throw Error(`Failed getting System ${systemSlug}`);

  const { data }: { data: SystemType } = await res.json();
  return data;
}

export async function getSystems(): Promise<SystemType> {
  const res = await fetch(`${API_URL}/systems/`);
  if (!res.ok) throw Error(`Failed getting Systems`);

  const { data }: { data: SystemType } = await res.json();
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
  let res;
  if (!systemSlug) {
    res = await fetch(`${API_URL}/systems/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSystem),
    });
  }

  if (systemSlug) {
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

  const { data }: { data: Role[] } = await res.json();
  return data;
}

export interface RoleWithBreadcrumbs {
  breadcrumbs: Array<{ name: string; slug: string }>;
  role: Role;
}

export async function getRole(
  systemSlug: string,
  sectionSlug: string,
): Promise<RoleWithBreadcrumbs> {
  console.log(systemSlug, sectionSlug);

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
): Promise<Race> {
  const res = await fetch(
    `${API_URL}/systems/${systemSlug}/races/${sectionSlug}`,
  );
  if (!res.ok) throw Error(`Failed getting Race #${sectionSlug}`);

  const { data }: { data: Race } = await res.json();
  return data;
}

export async function getNavigation(systemSlug: string): Promise<SystemType> {
  const res = await fetch(`${API_URL}/systems/${systemSlug}/navigation`);
  if (!res.ok) throw Error(`Failed getting System ${systemSlug}`);

  const { data }: { data: SystemType } = await res.json();
  return data;
}
