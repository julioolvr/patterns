import { createFileRoute } from "@tanstack/react-router";

import { listPatterns } from "../queries/patterns";

export const Route = createFileRoute("/")({
  component: Index,
  loader: () => listPatterns(),
});

function Index() {
  const data = Route.useLoaderData();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
