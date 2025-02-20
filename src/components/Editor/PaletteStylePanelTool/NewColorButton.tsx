import { TldrawUiButton, TldrawUiButtonIcon } from "tldraw";
import classNames from "classnames";

export default function NewColorButton({ onNewColorSelected }: Props) {
  return (
    <TldrawUiButton
      type="icon"
      data-id="add-color"
      aria-label="Add color"
      title="Add color"
      className={classNames("tlui-button-grid__button")}
      onPointerEnter={(e) => console.log({ e })}
      onPointerDown={(e) => console.log({ e })}
      onPointerUp={(e) => console.log({ e })}
      onClick={() => onNewColorSelected(generateRandomColor())}
    >
      <TldrawUiButtonIcon icon="plus" />
    </TldrawUiButton>
  );
}

type Props = {
  onNewColorSelected: (newColor: string) => void;
};

function generateRandomColor() {
  const r = Math.floor(Math.random() * 255)
    .toString(16)
    .padStart(2, "0");
  const g = Math.floor(Math.random() * 255)
    .toString(16)
    .padStart(2, "0");
  const b = Math.floor(Math.random() * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${r}${g}${b}`;
}
