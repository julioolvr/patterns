import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Loader, MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/spotlight/styles.css";

import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  basepath: "/patterns",
  defaultPendingComponent: Loader,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
