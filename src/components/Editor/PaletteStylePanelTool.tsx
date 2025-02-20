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

  return (
    <ul>
      {selectedShape.props.palette.map((color) => (
        <li>{color}</li>
      ))}
    </ul>
  );
}
