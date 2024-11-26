import { LoaderFunctionArgs } from "react-router-dom";
import { getNavigation } from "../services/apiSystem";
import { queryClient } from "../query/queryClient";
import { SystemNavigationType } from "../types/SystemNavigation";

export const systemNavigationQuery = (systemid: string) => ({
  queryKey: ["systemNavigation", systemid],
  queryFn: async (): Promise<SystemNavigationType> => {
    return await getNavigation(systemid);
  },
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
