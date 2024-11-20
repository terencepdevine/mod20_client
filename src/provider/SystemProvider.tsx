import { createContext, ReactNode } from "react";
import { getSystem } from "../services/apiSystem";
import { useQuery } from "@tanstack/react-query";
import { ContextType } from "../types/Context";
import { System } from "../types/System";

export const SystemContext = createContext<ContextType<System> | undefined>(
  undefined,
);

export const SystemProvider: React.FC<{
  systemId: string;
  children: ReactNode;
}> = ({ systemId, children }) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["system", systemId],
    queryFn: () => getSystem(systemId),
  });

  return (
    <SystemContext.Provider
      value={{
        data: data || null, // Handle case where data is undefined
        isPending,
        isError,
        error: error as Error | null,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};
