import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

import { PatternShapeUtil } from "./Editor/PatternShape";

export default function App() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        shapeUtils={[PatternShapeUtil]}
        onMount={(editor) => {
          editor.createShapes([{ type: "pattern" }]);
        }}
      />
    </div>
  );
}
