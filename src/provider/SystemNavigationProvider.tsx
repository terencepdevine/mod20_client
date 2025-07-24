import { createContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { ContextType } from "../types/Context";
import { SystemNavigationType } from "@mod20/types";
import { getNavigation } from "../services/apiSystem";

export const SystemNavigationContext = createContext<
  ContextType<SystemNavigationType> | undefined
>(undefined);

export const SystemNavigationProvider: React.FC<{
  systemSlug: string;
  children: ReactNode;
}> = ({ systemSlug, children }) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["systemNavigation", systemSlug],
    queryFn: () => getNavigation(systemSlug),
  });

  if (isPending) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <SystemNavigationContext.Provider
      value={{
        data: data || null,
        isPending,
        isError,
        error: error as Error | null,
      }}
    >
      {children}
    </SystemNavigationContext.Provider>
  );
};
