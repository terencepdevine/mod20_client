import { createContext, ReactNode } from "react";
import { Role } from "../types/Role";
import { useQuery } from "@tanstack/react-query";
import { getRole } from "../services/apiSystem";
import { ContextType } from "../types/Context";

export const RoleContext = createContext<ContextType<Role> | undefined>(
  undefined,
);

export const RoleProvider: React.FC<{
  systemId: string;
  roleId: string;
  children: ReactNode;
}> = ({ systemId, roleId, children }) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["race", systemId, roleId],
    queryFn: () => getRole(systemId, roleId),
  });

  return (
    <RoleContext.Provider
      value={{
        data: data || null,
        isPending,
        isError,
        error: error as Error | null,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};
