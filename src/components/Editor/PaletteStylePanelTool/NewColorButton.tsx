import { useState } from "react";
import { TldrawUiButton, TldrawUiButtonIcon } from "tldraw";
import classNames from "classnames";
import ColorSelector from "../ColorSelector";

export default function NewColorButton({ onNewColorSelected }: Props) {
  const [showSelector, setShowSelector] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <TldrawUiButton
        type="icon"
        data-id="add-color"
        aria-label="Add color"
        title="Add color"
        className={classNames("tlui-button-grid__button")}
        onClick={() => setShowSelector((prev) => !prev)}
      >
        <TldrawUiButtonIcon icon="plus" />
      </TldrawUiButton>
      {showSelector && (
        <ColorSelector
          onColorSelected={(newColor) => {
            onNewColorSelected(newColor);
            setShowSelector(false);
          }}
          onCancel={() => setShowSelector(false)}
        />
      )}
    </div>
  );
}

type Props = {
  onNewColorSelected: (newColor: string) => void;
};
