import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

import { PatternShapeUtil } from "./Editor/PatternShape";
import StylePanel from "./Editor/StylePanel";
import PaintingTool from "./Editor/PaintingTool";
import PatternContextToolbar from "./Editor/PatternShape/PatternContextToolbar";

export default function App() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        shapeUtils={[PatternShapeUtil]}
        components={{
          StylePanel,
          InFrontOfTheCanvas: PatternContextToolbar,
        }}
        onMount={(editor) => {
          editor.createShapes([{ type: "pattern" }]);
        }}
        tools={[PaintingTool]}
      />
    </div>
  );
}
