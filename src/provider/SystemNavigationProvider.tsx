import { createContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { ContextType } from "../types/Context";
import { systemNavigationQuery } from "../loaders/systemNavigationLoader";
import { SystemNavigationType } from "../types/SystemNavigation";

export const SystemNavigationContext = createContext<
  ContextType<SystemNavigationType> | undefined
>(undefined);

export const SystemNavigationProvider: React.FC<{
  systemId: string;
  children: ReactNode;
}> = ({ systemId, children }) => {
  const query = systemNavigationQuery(systemId);
  const { data, isPending, isError, error } =
    useQuery<SystemNavigationType>(query);

  return (
    <SystemNavigationContext.Provider
      value={{
        data: data ?? null,
        isPending,
        isError,
        error: (error as Error) || null,
      }}
    >
      {children}
    </SystemNavigationContext.Provider>
  );
};
