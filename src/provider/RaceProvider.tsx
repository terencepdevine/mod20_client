import { createContext, ReactNode } from "react";
import { Race } from "../types/Race";
import { ContextType } from "../types/Context";
import { useQuery } from "@tanstack/react-query";
import { getRace } from "../services/apiSystem";

export const RaceContext = createContext<ContextType<Race> | undefined>(
  undefined,
);

export const RaceProvider: React.FC<{
  systemId: string;
  raceId: string;
  children: ReactNode;
}> = ({ systemId, raceId, children }) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["race", systemId, raceId],
    queryFn: () => getRace(systemId, raceId),
  });

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
