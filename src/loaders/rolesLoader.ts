import { LoaderFunctionArgs } from "react-router-dom";
import { getRoles } from "../services/apiSystem";
import { queryClient } from "../query/queryClient";

export const rolesQuery = (systemId: string) => ({
  queryKey: ["roles", systemId],
  queryFn: async () => getRoles(systemId),
});

export const rolesLoader = async ({ params }: LoaderFunctionArgs) => {
  const systemId = params.systemId;

  if (!systemId) {
    throw new Error("Missing required parameter: systemId");
  }

  const query = rolesQuery(systemId);

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
