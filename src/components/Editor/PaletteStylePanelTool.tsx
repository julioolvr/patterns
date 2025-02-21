import classNames from "classnames";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TldrawUiButton, TldrawUiButtonIcon, useEditor } from "tldraw";

import useSequence from "@/hooks/useSequence";

import ColorSelector from "./ColorSelector";
import NewColorButton from "./PaletteStylePanelTool/NewColorButton";
import { PatternShape } from "./PatternShape";

export default function PaletteStylePanelTool() {
  const editor = useEditor();
  // TODO: When going back and forth between two selected patterns,
  // this component does not rerender and therefore the last pattern's
  // palette is shown.
  const selectedShape = editor.getOnlySelectedShape();
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(
    null
  );

  // Not sure why updating the selected shape does not trigger a rerender
  // of this component and I don't have internet to investigate further -
  // this does the trick.
  const [, tickForceRefreshSequence] = useSequence(0);

  useEffect(() => {
    if (
      !selectedShape ||
      !editor.isShapeOfType<PatternShape>(selectedShape, "pattern")
    ) {
      setEditingColorIndex(null);
    }
  }, [editor, selectedShape]);

  if (
    !selectedShape ||
    !editor.isShapeOfType<PatternShape>(selectedShape, "pattern")
  ) {
    return;
  }

  const selectedColorIndex = selectedShape.props.selectedColor;

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
          onClick={() => {
            editor.updateShape<PatternShape>({
              id: selectedShape.id,
              type: "pattern",
              props: { selectedColor: i },
            });
            tickForceRefreshSequence();
          }}
          onDoubleClick={() => setEditingColorIndex(i)}
        >
          <TldrawUiButtonIcon icon="color" />
        </TldrawUiButton>
      ))}

      {editingColorIndex !== null &&
        createPortal(
          <ColorSelector
            value={selectedShape.props.palette[selectedColorIndex]}
            onColorSelected={(newColor) => {
              editor.markHistoryStoppingPoint();
              editor.updateShape<PatternShape>({
                id: selectedShape.id,
                type: "pattern",
                props: {
                  palette: produce(selectedShape.props.palette, (palette) => {
                    palette[selectedColorIndex] = newColor;
                  }),
                },
              });
              setEditingColorIndex(null);
            }}
            onCancel={() => setEditingColorIndex(null)}
          />,
          document.body
        )}

      <NewColorButton
        onNewColorSelected={(newColor) => {
          editor.markHistoryStoppingPoint();
          editor.updateShape<PatternShape>({
            id: selectedShape.id,
            type: "pattern",
            props: {
              palette: [...selectedShape.props.palette, newColor],
            },
          });
          tickForceRefreshSequence();
        }}
      />
    </div>
  );
}
