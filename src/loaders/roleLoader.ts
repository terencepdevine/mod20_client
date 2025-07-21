import { LoaderFunctionArgs } from "react-router-dom";
import { getRole } from "../services/apiSystem";
import { queryClient } from "../query/queryClient";

export const roleQuery = (systemSlug: string, sectionSlug: string) => ({
  queryKey: ["role", systemSlug, sectionSlug],
  queryFn: async () => getRole(systemSlug, sectionSlug),
});

export const roleLoader = async ({ params }: LoaderFunctionArgs) => {
  const systemSlug = params.systemSlug;
  const sectionSlug = params.sectionSlug;

  if (!systemSlug || !sectionSlug) {
    throw new Error("Missing required parameters: systemSlug or sectionSlug");
  }

  const query = roleQuery(systemSlug, sectionSlug);

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
