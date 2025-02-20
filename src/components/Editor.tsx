import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

import { PatternShapeUtil } from "./Editor/PatternShape";
import StylePanel from "./Editor/StylePanel";

export default function App() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        shapeUtils={[PatternShapeUtil]}
        components={{
          StylePanel,
        }}
        onMount={(editor) => {
          editor.createShapes([{ type: "pattern" }]);
        }}
      />
    </div>
  );
}
