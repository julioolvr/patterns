import { createLazyFileRoute } from "@tanstack/react-router";
import { Alert, Loader } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

import { usePatternsListQuery } from "../queries/patterns";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const patternsQuery = usePatternsListQuery();

  if (patternsQuery.data) {
    return "Success!";
  }

  if (patternsQuery.error) {
    return (
      <Alert
        variant="light"
        color="red"
        title="Error"
        icon={<IconInfoCircle />}
      >
        Oh no
      </Alert>
    );
  }

  return <Loader />;
}
