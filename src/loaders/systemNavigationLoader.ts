import { LoaderFunctionArgs } from "react-router-dom";
import { getNavigation } from "../services/apiSystem";
import { queryClient } from "../query/queryClient";

const systemNavigationQuery = (id: string) => ({
  queryKey: ["systemNavigation", id],
  queryFn: async () => getNavigation(id),
});

export const systemNavigationLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  const systemId = params.systemId;

  if (!systemId) {
    throw new Error("Missing required parameter: systemId");
  }

  const query = systemNavigationQuery(systemId);

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
