import { useContext, Context } from "react";

import { RaceContext } from "../provider/RaceProvider";
import { RoleContext } from "../provider/RoleProvider";
import { SystemContext } from "../provider/SystemProvider";
import { SystemNavigationContext } from "../provider/SystemNavigationProvider";
import { RoleWithBreadcrumbs } from "../services/apiSystem";

export function useProvider<T>(
  context: Context<T | undefined>,
  name: string,
): T {
  const value = useContext(context);
  if (!value) {
    throw new Error(`use${name} must be used within a ${name}Provider`);
  }
  return value;
}

export const useRace = () => useProvider(RaceContext, "Race");
export const useRole = () =>
  useProvider<RoleWithBreadcrumbs>(RoleContext, "Role");

export const useSystem = () => useProvider(SystemContext, "System");
export const useSystemNavigation = () =>
  useProvider(SystemNavigationContext, "SystemNavigation");
