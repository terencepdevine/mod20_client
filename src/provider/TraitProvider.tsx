import { createContext, ReactNode } from "react";
import { ContextType, TraitType } from "@mod20/types";
import { useQuery } from "@tanstack/react-query";

const traitQuery = (traitSlug: string) => ({
  queryKey: ["trait", traitSlug],
  queryFn: async () => {
    const { getTrait } = await import("../services/apiTrait");
    return getTrait(traitSlug);
  },
});

export const TraitContext = createContext<ContextType<TraitType> | undefined>(
  undefined,
);

export const TraitProvider: React.FC<{
  systemSlug: string;
  sectionSlug: string;
  children: ReactNode;
}> = ({ systemSlug, sectionSlug, children }) => {
  const query = traitQuery(sectionSlug);
  const { data, isPending, isError, error } = useQuery(query);

  return (
    <TraitContext.Provider
      value={{
        data: data || null,
        isPending,
        isError,
        error: error as Error | null,
      }}
    >
      {children}
    </TraitContext.Provider>
  );
};