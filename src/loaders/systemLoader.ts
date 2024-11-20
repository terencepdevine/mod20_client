import { LoaderFunctionArgs } from "react-router-dom";
import { queryClient } from "../query/queryClient";
import { getSystem } from "../services/apiSystem";

const systemQuery = (id: string) => ({
  queryKey: ["system", id],
  queryFn: async () => getSystem(id),
});

export const systemLoader = async ({ params }: LoaderFunctionArgs) => {
  const { systemId } = params;

  if (!systemId) {
    throw new Error("Missing required parameters: systemId");
  }

  const query = systemQuery(systemId);

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
