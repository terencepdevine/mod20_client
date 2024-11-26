import { createContext, ReactNode } from "react";
import { Role } from "../types/Role";
import { useQuery } from "@tanstack/react-query";
import { ContextType } from "../types/Context";
import { roleQuery } from "../loaders/roleLoader";

export const RoleContext = createContext<ContextType<Role> | undefined>(
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
