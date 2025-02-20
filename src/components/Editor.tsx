import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

import { PatternShapeUtil } from "./Editor/PatternShape";
import StylePanel from "./Editor/StylePanel";
import PaintingTool from "./Editor/PaintingTool";
import PatternContextToolbar from "./Editor/PatternShape/PatternContextToolbar";
import Toolbar from "./Editor/Toolbar";

export default function App() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
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
        tools={[PaintingTool]}
      />
    </div>
  );
}
