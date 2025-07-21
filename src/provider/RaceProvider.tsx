import { createContext, ReactNode } from "react";
import { ContextType, RaceType } from "@mod20/types";
import { useQuery } from "@tanstack/react-query";
import { raceQuery } from "../loaders/raceLoader";

export const RaceContext = createContext<ContextType<RaceType> | undefined>(
  undefined,
);

export const RaceProvider: React.FC<{
  systemSlug: string;
  sectionSlug: string;
  children: ReactNode;
}> = ({ systemSlug, sectionSlug, children }) => {
  const query = raceQuery(systemSlug, sectionSlug);
  const { data, isPending, isError, error } = useQuery(query);

  return (
    <RaceContext.Provider
      value={{
        data: data || null,
        isPending,
        isError,
        error: error as Error | null,
      }}
    >
      {children}
    </RaceContext.Provider>
  );
};
