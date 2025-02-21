import "tldraw/tldraw.css";

import { Tldraw } from "tldraw";

import PatternContextToolbar from "./Editor/PatternContextToolbar";
import { PatternShapeUtil } from "./Editor/PatternShape";
import StylePanel from "./Editor/StylePanel";
import Toolbar from "./Editor/Toolbar";

export default function App() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        persistenceKey="patterns"
        shapeUtils={[PatternShapeUtil]}
        components={{
          StylePanel,
          Toolbar,
          InFrontOfTheCanvas: PatternContextToolbar,
        }}
        overrides={{
          tools(editor, tools) {
            tools["add-pattern"] = {
              id: "add-pattern",
              icon: "plus",
              label: "New pattern",
              onSelect: () => {
                editor.createShapes([{ type: "pattern" }]);
              },
            };

            return tools;
          },
        }}
      />
    </div>
  );
}
