import {
  DefaultStylePanel,
  DefaultStylePanelContent,
  useEditor,
  useRelevantStyles,
} from "tldraw";

import { paletteStyle } from "@/components/Editor/__shared__/PaletteStyle";

import BucketPaletteStylePanelTool from "./StylePanel/BucketPaletteStylePanelTool";
import PaletteStylePanelTool from "./StylePanel/PaletteStylePanelTool";

export default function StylePanel() {
  const editor = useEditor();
  const styles = useRelevantStyles();
  const currentTool = editor.getCurrentToolId();
  const isBucketTool = currentTool === "bucket-fill";

  // If bucket tool is active, always show the palette
  if (isBucketTool) {
    // Get palette from selected pattern or first pattern on canvas
    const selectedShapes = editor.getSelectedShapes();
    const patternShape =
      selectedShapes.find((shape) => shape.type === "pattern") ||
      editor.getCurrentPageShapes().find((shape) => shape.type === "pattern");

    if (patternShape && patternShape.type === "pattern") {
      return (
        <DefaultStylePanel>
          <BucketPaletteStylePanelTool patternShapeId={patternShape.id} />
        </DefaultStylePanel>
      );
    } else {
      // No pattern exists, show default palette
      return (
        <DefaultStylePanel>
          <BucketPaletteStylePanelTool patternShapeId={null} />
        </DefaultStylePanel>
      );
    }
  }

  if (!styles) return null;

  const palette = styles.get(paletteStyle);

  return (
    <DefaultStylePanel>
      <DefaultStylePanelContent styles={styles} />
      {palette !== undefined && <PaletteStylePanelTool palette={palette} />}
    </DefaultStylePanel>
  );
}
