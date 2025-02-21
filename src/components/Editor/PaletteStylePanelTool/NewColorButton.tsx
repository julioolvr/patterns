import classNames from "classnames";
import { useState } from "react";
import { createPortal } from "react-dom";
import { TldrawUiButton, TldrawUiButtonIcon } from "tldraw";

import ColorSelector from "../ColorSelector";

export default function NewColorButton({ onNewColorSelected }: Props) {
  const [showSelector, setShowSelector] = useState(false);
  return (
    <>
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
      {showSelector &&
        createPortal(
          <ColorSelector
            onColorSelected={(newColor) => {
              onNewColorSelected(newColor);
              setShowSelector(false);
            }}
            onCancel={() => setShowSelector(false)}
          />,
          document.body
        )}
    </>
  );
}

type Props = {
  onNewColorSelected: (newColor: string) => void;
};
