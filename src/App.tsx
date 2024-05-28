import { QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/spotlight/styles.css";

import "./App.css";
import PatternUi from "./Pattern";
import queryClient from "./queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <PatternUi />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
