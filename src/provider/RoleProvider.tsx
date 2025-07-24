import { createContext, ReactNode } from "react";
import { ContextType } from "@mod20/types";
import { useQuery } from "@tanstack/react-query";
import { roleQuery } from "../loaders/roleLoader";
import { RoleWithBreadcrumbs } from "../services/apiSystem";

export const RoleContext = createContext<ContextType<RoleWithBreadcrumbs> | undefined>(
  undefined,
);

export const RoleProvider: React.FC<{
  systemSlug: string;
  sectionSlug: string;
  children: ReactNode;
}> = ({ systemSlug, sectionSlug, children }) => {
  const query = roleQuery(systemSlug, sectionSlug);
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
