import { useEffect, useState } from "react";
import { TldrawUiButton, TldrawUiButtonIcon, useEditor } from "tldraw";
import classNames from "classnames";

import { PatternShape } from "./PatternShape";
import NewColorButton from "./PaletteStylePanelTool/NewColorButton";
import { createPortal } from "react-dom";
import ColorSelector from "./ColorSelector";
import { produce } from "immer";

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
  const [, setForceRefreshCounter] = useState(0);

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
            setForceRefreshCounter((n) => n + 1);
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
          setForceRefreshCounter((n) => n + 1);
        }}
      />
    </div>
  );
}
