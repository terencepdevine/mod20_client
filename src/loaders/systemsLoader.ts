import { queryClient } from "../query/queryClient";
import { getSystems } from "../services/apiSystem";

const systemsQuery = () => ({
  queryKey: ["systems"],
  queryFn: async () => getSystems(),
});

export const systemsLoader = async () => {
  const query = systemsQuery();

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
