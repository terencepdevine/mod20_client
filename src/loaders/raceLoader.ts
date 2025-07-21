import { LoaderFunctionArgs } from "react-router-dom";
import { getRace } from "../services/apiSystem";
import { queryClient } from "../query/queryClient";

export const raceQuery = (systemSlug: string, sectionSlug: string) => ({
  queryKey: ["race", systemSlug, sectionSlug],
  queryFn: async () => getRace(systemSlug, sectionSlug),
});

export const raceLoader = async ({ params }: LoaderFunctionArgs) => {
  const systemSlug = params.systemSlug;
  const sectionSlug = params.sectionSlug;

  if (!systemSlug || !sectionSlug) {
    throw new Error("Missing required parameters: systemSlug or sectionSlug");
  }

  const query = raceQuery(systemSlug, sectionSlug);

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};
