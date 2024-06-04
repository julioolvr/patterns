import { createFileRoute } from "@tanstack/react-router";
import { Stack, Title } from "@mantine/core";

import { getPattern } from "../../queries/patterns";
import PatternUi from "../../components/Pattern";

import "./$patternId.css";

export const Route = createFileRoute("/p/$patternId")({
  component: Pattern,
  loader: ({ params }) => getPattern(params.patternId),
});

function Pattern() {
  const data = Route.useLoaderData();

  return (
    <Stack className="pattern-page-container">
      <Title order={1}>{data.name}</Title>
      <PatternUi pattern={data} />
    </Stack>
  );
}
