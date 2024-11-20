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

export async function getRole(systemId: string, roleId: string): Promise<Role> {
  const res = await fetch(`${API_URL}/systems/${systemId}/roles/${roleId}`);
  if (!res.ok) throw Error(`Failed getting Role #${roleId}`);

  const { data }: { data: Role } = await res.json();
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
