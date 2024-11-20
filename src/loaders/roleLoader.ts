import { LoaderFunctionArgs } from "react-router-dom";
import { getRole } from "../services/apiSystem";
import { queryClient } from "../query/queryClient";

const roleQuery = (stringId: string, roleId: string) => ({
  queryKey: ["role", roleId],
  queryFn: async () => getRole(stringId, roleId),
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
