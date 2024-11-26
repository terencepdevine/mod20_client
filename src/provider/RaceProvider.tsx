import { createContext, ReactNode } from "react";
import { Race } from "../types/Race";
import { ContextType } from "../types/Context";
import { useQuery } from "@tanstack/react-query";
import { raceQuery } from "../loaders/raceLoader";

export const RaceContext = createContext<ContextType<Race> | undefined>(
  undefined,
);

export const RaceProvider: React.FC<{
  systemId: string;
  raceId: string;
  children: ReactNode;
}> = ({ systemId, raceId, children }) => {
  const query = raceQuery(systemId, raceId);
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
