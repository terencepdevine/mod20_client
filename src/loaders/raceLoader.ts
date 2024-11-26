import { LoaderFunctionArgs } from "react-router-dom";
import { getRace } from "../services/apiSystem";
import { queryClient } from "../query/queryClient";

export const raceQuery = (systemId: string, raceId: string) => ({
  queryKey: ["race", systemId, raceId],
  queryFn: async () => getRace(systemId, raceId),
});

export const raceLoader = async ({ params }: LoaderFunctionArgs) => {
  const systemId = params.systemId;
  const raceId = params.raceId;

  if (!systemId || !raceId) {
    throw new Error("Missing required parameters: systemId or raceId");
  }

  const query = raceQuery(systemId, raceId);

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
