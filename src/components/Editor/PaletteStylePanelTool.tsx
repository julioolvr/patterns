import classNames from "classnames";
import { produce } from "immer";
import { useState } from "react";
import { createPortal } from "react-dom";
import {
  SharedStyle,
  TldrawUiButton,
  TldrawUiButtonIcon,
  useEditor,
} from "tldraw";

import ColorSelector from "./ColorSelector";
import { PaletteStyle, paletteStyle } from "./PaletteStyle";
import NewColorButton from "./PaletteStylePanelTool/NewColorButton";

export default function PaletteStylePanelTool({ palette }: Props) {
  const editor = useEditor();
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(
    null
  );

  if (palette.type === "mixed") {
    return null;
  }

  const selectedColorIndex = palette.value.selected;

  return (
    <div className={classNames("tlui-buttons__grid")}>
      {palette.value.colors.map((color, i) => (
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
            // TODO: Review how to avoid undo/redo for this
            editor.setStyleForSelectedShapes(paletteStyle, {
              ...palette.value,
              selected: i,
            });
          }}
          onDoubleClick={() => setEditingColorIndex(i)}
        >
          <TldrawUiButtonIcon icon="color" />
        </TldrawUiButton>
      ))}

      {editingColorIndex !== null &&
        createPortal(
          <ColorSelector
            value={palette.value.colors[selectedColorIndex]}
            onColorSelected={(newColor) => {
              editor.markHistoryStoppingPoint();
              editor.setStyleForSelectedShapes(paletteStyle, {
                ...palette.value,
                colors: produce(palette.value.colors, (colors) => {
                  colors[selectedColorIndex] = newColor;
                }),
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
          editor.setStyleForSelectedShapes(paletteStyle, {
            ...palette.value,
            colors: [...palette.value.colors, newColor],
          });
        }}
      />
    </div>
  );
}

type Props = {
  palette: SharedStyle<PaletteStyle>;
};
