import { LoaderFunctionArgs } from "react-router-dom";
import { queryClient } from "../query/queryClient";
import { getSystem } from "../services/apiSystem";

const systemQuery = (systemSlug: string) => ({
  queryKey: ["system", systemSlug],
  queryFn: async () => getSystem(systemSlug),
});

export const systemLoader = async ({ params }: LoaderFunctionArgs) => {
  const { systemSlug } = params;

  if (!systemSlug) {
    throw new Error("Missing required parameters: systemSlug");
  }

  const query = systemQuery(systemSlug);

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
