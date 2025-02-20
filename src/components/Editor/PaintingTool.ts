import { StateNode, TLPointerEventInfo } from "tldraw";

import { PatternShape } from "./PatternShape";

export default class PaintingTool extends StateNode {
  static override id = "patterns-painting";

  onPointerDown(info: TLPointerEventInfo): void {
    const clickedShape = info.shape;

    console.log("onPointerDown", {
      clickedShape,
      shapeId: this.editor.getEditingShapeId(),
      editingShape: this.editor.getEditingShape(),
      state: this.editor.getPath(),
      isShapeOfType:
        clickedShape &&
        this.editor.isShapeOfType<PatternShape>(clickedShape, "pattern"),
    });

    if (
      !clickedShape ||
      this.editor.getEditingShapeId() !== clickedShape.id ||
      !this.editor.isShapeOfType<PatternShape>(clickedShape, "pattern")
    ) {
      return;
    }

    console.log("painting tool pointer down", info);
  }
}
