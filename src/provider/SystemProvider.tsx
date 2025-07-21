import { createContext, ReactNode } from "react";

import { getSystem } from "../services/apiSystem";
import { useQuery } from "@tanstack/react-query";

import { ContextType, SystemType } from "@mod20/types";

export const SystemContext = createContext<ContextType<SystemType> | undefined>(
  undefined,
);

export const SystemProvider: React.FC<{
  systemSlug: string;
  children: ReactNode;
}> = ({ systemSlug, children }) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["system", systemSlug],
    queryFn: () => getSystem(systemSlug),
  });

  return (
    <SystemContext.Provider
      value={{
        data: data || null,
        isPending,
        isError,
        error: error as Error | null,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};
