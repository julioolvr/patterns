import { createFileRoute } from "@tanstack/react-router";
import { Button, Modal, NumberInput, Stack, TextInput } from "@mantine/core";
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
        <Stack>
          <TextInput label="Name" required />
          <NumberInput label="Width" min={10} max={100} defaultValue={15} />
          <NumberInput label="Height" min={10} max={100} defaultValue={30} />
          <Button>Create</Button>
        </Stack>
      </Modal>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Stack>
  );
}
