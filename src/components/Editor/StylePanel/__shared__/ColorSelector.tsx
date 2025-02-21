import { useState } from "react";

export default function ColorSelector({
  value,
  onColorSelected,
  onCancel,
}: Props) {
  const [newColor, setNewColor] = useState(value ?? "#000000");

  // TODO: Position w/ Popper
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        borderRadius: 8,
        zIndex: 100,
        display: "flex",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)",
        padding: 20,
        background: "white",
        width: "fit-content",
        alignItems: "center",
      }}
    >
      <input
        type="color"
        value={newColor}
        onChange={(e) => setNewColor(e.target.value)}
      />
      <button onClick={() => onColorSelected(newColor)}>Confirm</button>
      <button onClick={() => onCancel()}>Cancel</button>
    </div>
  );
}

type Props = {
  value?: string;
  onColorSelected(color: string): void;
  onCancel(): void;
};
