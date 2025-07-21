import { LoaderFunctionArgs } from "react-router-dom";
import { getNavigation } from "../services/apiSystem";
import { queryClient } from "../query/queryClient";

export const systemNavigationQuery = (systemSlug: string) => ({
  queryKey: ["systemNavigation", systemSlug],
  queryFn: async () => getNavigation(systemSlug),
});

export const systemNavigationLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  const { systemSlug } = params;

  if (!systemSlug) {
    throw new Error("Missing required parameter: systemSlug");
  }

  const query = systemNavigationQuery(systemSlug);

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
