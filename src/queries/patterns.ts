import { useQuery } from "@tanstack/react-query";

import client from "../db/client";

function listPatterns() {
  return client.from("patterns").select();
}

export function usePatternsListQuery() {
  return useQuery({
    queryKey: ["patterns"],
    queryFn: listPatterns,
  });
}
