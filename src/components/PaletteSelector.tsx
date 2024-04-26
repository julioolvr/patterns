import { CheckIcon, ColorSwatch, Group } from "@mantine/core";

import foregroundColorForBackground from "../utils/foregroundColorForBackground";
import Palette from "../modules/palette";

export default function PaletteSelector({
  palette,
  selectedColorIndex,
  onSelectColorIndex,
}: PaletteSelectorProps) {
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
    </Group>
  );
}

type PaletteSelectorProps = {
  palette: Palette;
  selectedColorIndex: number;
  onSelectColorIndex: (index: number) => void;
};
