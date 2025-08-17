import { useQuery } from "@tanstack/react-query";
import { getTraits } from "../services/apiTrait";

export function useTraits(systemId?: string) {
  return useQuery({
    queryKey: ["traits", systemId],
    queryFn: () => getTraits(systemId),
    enabled: !!systemId,
  });
}