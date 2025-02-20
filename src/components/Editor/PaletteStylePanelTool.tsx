import { TldrawUiButton, TldrawUiButtonIcon, useEditor } from "tldraw";
import classNames from "classnames";

import { PatternShape } from "./PatternShape";
import { useState } from "react";

export default function PaletteStylePanelTool() {
  const editor = useEditor();
  // TODO: Consider that state will persist when selecting different
  // patterns that might have different palettes
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const selectedShape = editor.getOnlySelectedShape();

  if (
    !selectedShape ||
    !editor.isShapeOfType<PatternShape>(selectedShape, "pattern")
  ) {
    return;
  }

  return (
    <div className={classNames("tlui-buttons__grid")}>
      {selectedShape.props.palette.map((color, i) => (
        <TldrawUiButton
          type="icon"
          key={color}
          data-id={color}
          aria-label={color}
          data-state={i === selectedColorIndex ? "hinted" : undefined}
          title={color}
          className={classNames("tlui-button-grid__button")}
          style={{ color }}
          onPointerEnter={(e) => console.log({ e })}
          onPointerDown={(e) => console.log({ e })}
          onPointerUp={(e) => console.log({ e })}
          onClick={() => setSelectedColorIndex(i)}
        >
          <TldrawUiButtonIcon icon="color" />
        </TldrawUiButton>
      ))}
    </div>
  );
}
