import { createContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { roleQuery } from "../loaders/roleLoader";
import { RoleWithBreadcrumbs } from "../services/apiSystem";

export const RoleContext = createContext<RoleWithBreadcrumbs | undefined>(
  undefined,
);

export const RoleProvider: React.FC<{
  systemId: string;
  roleId: string;
  children: ReactNode;
}> = ({ systemId, roleId, children }) => {
  const query = roleQuery(systemId, roleId);
  const { data, isPending, isError, error } = useQuery(query);

  return (
    <RoleContext.Provider
      value={{
        data: data || null,
        isPending,
        isError,
        error: (error as Error) || null,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};
