import { createFileRoute } from "@tanstack/react-router";
import { Button, Modal, NumberInput, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

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
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { name: "", height: 30, width: 15 },
  });

  const initializeAndOpenModal = () => {
    form.reset();
    openNewPatternModal();
  };

  return (
    <Stack>
      <Button onClick={initializeAndOpenModal}>New pattern</Button>
      <Modal
        opened={isNewPatternModalOpen}
        onClose={closeNewPatternModal}
        title="New pattern"
      >
        <form onSubmit={form.onSubmit(console.log)}>
          <Stack>
            <TextInput
              label="Name"
              required
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
            <NumberInput
              label="Width"
              key={form.key("width")}
              min={10}
              max={100}
              defaultValue={15}
              {...form.getInputProps("width")}
            />
            <NumberInput
              label="Height"
              key={form.key("height")}
              min={10}
              max={100}
              defaultValue={30}
              {...form.getInputProps("height")}
            />
            <Button type="submit">Create</Button>
          </Stack>
        </form>
      </Modal>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Stack>
  );
}
