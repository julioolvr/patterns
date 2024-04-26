import {
  Button,
  CheckIcon,
  ColorPicker,
  ColorSwatch,
  Group,
  Popover,
} from "@mantine/core";
import { useState } from "react";
import tinycolor from "tinycolor2";

import foregroundColorForBackground from "../utils/foregroundColorForBackground";
import { Palette, Color } from "../modules/palette";

export default function PaletteSelector({
  palette,
  selectedColorIndex,
  onSelectColorIndex,
  onAddColor,
}: PaletteSelectorProps) {
  const [newColor, setNewColor] = useState("#880055");

  return (
    <Group>
      {palette.colors.map((color, index) => (
        <ColorSwatch
          key={index}
          component="button"
          color={color.toHexString()}
          onClick={() => onSelectColorIndex(index)}
        >
          {selectedColorIndex === index && (
            <CheckIcon
              style={{
                width: "30%",
                height: "30%",
                color: foregroundColorForBackground(color).toHexString(),
              }}
            />
          )}
        </ColorSwatch>
      ))}

      <Popover>
        <Popover.Target>
          <Button>+</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker value={newColor} onChange={setNewColor} />
          <Button onClick={() => onAddColor(tinycolor(newColor))}>Add</Button>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}

type PaletteSelectorProps = {
  palette: Palette;
  selectedColorIndex: number;
  onSelectColorIndex: (index: number) => void;
  onAddColor: (newColor: Color) => void;
};
