import { createContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNavigation } from "../services/apiSystem";
import { ContextType } from "../types/Context";

export const SystemNavigationContext = createContext<ContextType | undefined>(
  undefined,
);

export const SystemNavigationProvider: React.FC<{
  systemId: string;
  children: ReactNode;
}> = ({ systemId, children }) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["systemNavigation", systemId],
    queryFn: () => getNavigation(systemId),
    staleTime: 1000 * 60 * 10,
  });

  return (
    <SystemNavigationContext.Provider
      value={{ data, isPending, isError, error }}
    >
      {children}
    </SystemNavigationContext.Provider>
  );
};
