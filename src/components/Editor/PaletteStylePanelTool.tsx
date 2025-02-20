import { useEditor } from "tldraw";
import { PatternShape } from "./PatternShape";

export default function PaletteStylePanelTool() {
  const editor = useEditor();
  const selectedShape = editor.getOnlySelectedShape();

  if (
    !selectedShape ||
    !editor.isShapeOfType<PatternShape>(selectedShape, "pattern")
  ) {
    return;
  }

  return <div>Pattern is selected</div>;
}
