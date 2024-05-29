import { createFileRoute } from "@tanstack/react-router";
import { Button, Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { listPatterns } from "../queries/patterns";

export const Route = createFileRoute("/")({
  component: Index,
  loader: () => listPatterns(),
});

function Index() {
  const data = Route.useLoaderData();
  const [
    isNewPatternModalOpen,
    { open: openNewPatternModal, close: closeNewPatternModal },
  ] = useDisclosure();

  return (
    <Stack>
      <Button onClick={openNewPatternModal}>New pattern</Button>
      <Modal
        opened={isNewPatternModalOpen}
        onClose={closeNewPatternModal}
        title="New pattern"
      >
        Oh hi
      </Modal>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Stack>
  );
}
