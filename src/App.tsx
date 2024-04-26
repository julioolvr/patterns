import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/spotlight/styles.css";

import "./App.css";
import PatternUi from "./Pattern";

function App() {
  return (
    <MantineProvider>
      <PatternUi />
    </MantineProvider>
  );
}

export default App;
