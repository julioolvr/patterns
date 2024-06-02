import { createFileRoute } from "@tanstack/react-router";
import { Title } from "@mantine/core";

import { getPattern } from "../../queries/patterns";
import PatternUi from "../../components/Pattern";

export const Route = createFileRoute("/p/$patternId")({
  component: Pattern,
  loader: ({ params }) => getPattern(params.patternId),
});

function Pattern() {
  const data = Route.useLoaderData();

  return (
    <div>
      <Title order={1}>{data.name}</Title>
      <PatternUi pattern={data} />
    </div>
  );
}
