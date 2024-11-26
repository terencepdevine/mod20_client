import { LoaderFunctionArgs } from "react-router-dom";
import { getRole } from "../services/apiSystem";
import { queryClient } from "../query/queryClient";

export const roleQuery = (systemId: string, roleId: string) => ({
  queryKey: ["role", systemId, roleId],
  queryFn: async () => getRole(systemId, roleId),
});

export const roleLoader = async ({ params }: LoaderFunctionArgs) => {
  const systemId = params.systemId;
  const roleId = params.roleId;

  if (!systemId || !roleId) {
    throw new Error("Missing required parameters: systemId or roleId");
  }

  const query = roleQuery(systemId, roleId);

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
