import classNames from "classnames";
import { produce } from "immer";
import { useState } from "react";
import { createPortal } from "react-dom";
import {
  TldrawUiButton,
  TldrawUiButtonIcon,
  useEditor,
  useValue,
} from "tldraw";

import { PaletteStyle } from "@/components/Editor/__shared__/PaletteStyle";
import ColorSelector from "@/components/Editor/StylePanel/__shared__/ColorSelector";

import NewColorButton from "./PaletteStylePanelTool/NewColorButton";

export default function BucketPaletteStylePanelTool({ patternShapeId }: Props) {
  const editor = useEditor();
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(
    null
  );

  // Get the current pattern shape and its palette reactively
  const currentPalette = useValue(
    "current pattern palette",
    () => {
      if (!patternShapeId) return null;
      const shape = editor.getShape(patternShapeId);
      return shape && shape.type === "pattern" ? shape.props.palette : null;
    },
    [patternShapeId]
  );

  if (!currentPalette) {
    return null;
  }

  const selectedColorIndex = currentPalette.selected;

  const updatePatternPalette = (newPalette: PaletteStyle) => {
    if (patternShapeId) {
      editor.markHistoryStoppingPoint();
      editor.updateShape({
        id: patternShapeId,
        type: "pattern",
        props: {
          palette: newPalette,
        },
      });
    }
  };

  return (
    <div className={classNames("tlui-buttons__grid")}>
      {currentPalette.colors.map((color, i) => (
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
            const newPalette = {
              ...currentPalette,
              selected: i,
            };
            updatePatternPalette(newPalette);
          }}
          onDoubleClick={() => setEditingColorIndex(i)}
        >
          <TldrawUiButtonIcon icon="color" />
        </TldrawUiButton>
      ))}

      {editingColorIndex !== null &&
        createPortal(
          <ColorSelector
            value={currentPalette.colors[selectedColorIndex]}
            onColorSelected={(newColor) => {
              editor.markHistoryStoppingPoint();
              const newPalette = {
                ...currentPalette,
                colors: produce(currentPalette.colors, (colors) => {
                  colors[selectedColorIndex] = newColor;
                }),
              };
              updatePatternPalette(newPalette);
              setEditingColorIndex(null);
            }}
            onCancel={() => setEditingColorIndex(null)}
          />,
          document.body
        )}

      <NewColorButton
        onNewColorSelected={(newColor) => {
          editor.markHistoryStoppingPoint();
          const newPalette = {
            ...currentPalette,
            colors: [...currentPalette.colors, newColor],
          };
          updatePatternPalette(newPalette);
        }}
      />
    </div>
  );
}

type Props = {
  patternShapeId: string | null;
};
