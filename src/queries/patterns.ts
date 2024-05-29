import { useQuery } from "@tanstack/react-query";

import client from "../db/client";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function listPatterns() {
  await sleep(5000);
  return client.from("patterns").select();
}

export function usePatternsListQuery() {
  return useQuery({
    queryKey: ["patterns"],
    queryFn: listPatterns,
  });
}
