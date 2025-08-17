import { LoaderFunctionArgs } from "react-router-dom";
import { queryClient } from "../query/queryClient";
import { getTrait } from "../services/apiTrait";

const traitQuery = (traitSlug: string) => ({
  queryKey: ["trait", traitSlug],
  queryFn: async () => getTrait(traitSlug),
});

export const traitLoader = async ({ params }: LoaderFunctionArgs) => {
  const { sectionSlug } = params;

  if (!sectionSlug) {
    throw new Error("Missing required parameters: sectionSlug");
  }

  const query = traitQuery(sectionSlug);

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};