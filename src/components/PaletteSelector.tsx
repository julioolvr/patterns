import {
  Button,
  CheckIcon,
  ColorPicker,
  ColorSwatch,
  Group,
  Popover,
} from "@mantine/core";
import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";

import foregroundColorForBackground from "../utils/foregroundColorForBackground";
import { Color } from "../modules/palette";

export default function PaletteSelector({
  palette,
  selectedColorIndex,
  onSelectColorIndex,
  onAddColor,
  onUpdateColor,
}: PaletteSelectorProps) {
  const [newColor, setNewColor] = useState("#880055");

  return (
    <Group>
      {palette.map((color, index) => (
        <PaletteColor
          key={index}
          color={color}
          isSelected={index === selectedColorIndex}
          onSelectColor={() => onSelectColorIndex(index)}
          onUpdateColor={(newColor) => onUpdateColor(index, newColor)}
        />
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
  palette: Array<Color>;
  selectedColorIndex: number;
  onSelectColorIndex: (index: number) => void;
  onAddColor: (newColor: Color) => void;
  onUpdateColor: (index: number, newColor: Color) => void;
};

function PaletteColor({
  color,
  isSelected,
  onSelectColor,
  onUpdateColor,
}: PaletteColorProps) {
  const [isEditingColor, setIsEditingColor] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  const [newColor, setNewColor] = useState(currentColor);

  const editColor = () => {
    if (isEditingColor) {
      return false;
    }

    setNewColor(currentColor);
    setIsEditingColor(true);
  };

  const persistEdit = () => {
    setCurrentColor(newColor);
    setIsEditingColor(false);
  };

  const discardEdit = () => {
    setNewColor(currentColor);
    setIsEditingColor(false);
  };

  useEffect(() => {
    console;
    onUpdateColor(newColor);
  }, [newColor, onUpdateColor]);

  return (
    <Popover
      opened={isEditingColor}
      onChange={setIsEditingColor}
      onClose={discardEdit}
    >
      <Popover.Target>
        <ColorSwatch
          component="button"
          color={color.toHexString()}
          onClick={() => (isSelected ? editColor() : onSelectColor())}
        >
          {isSelected && (
            <CheckIcon
              style={{
                width: "30%",
                height: "30%",
                color: foregroundColorForBackground(color).toHexString(),
              }}
            />
          )}
        </ColorSwatch>
      </Popover.Target>

      <Popover.Dropdown>
        <ColorPicker
          value={newColor.toHexString()}
          onChange={(color) => setNewColor(tinycolor(color))}
        />
        <Button onClick={() => persistEdit()}>Save</Button>
      </Popover.Dropdown>
    </Popover>
  );
}

type PaletteColorProps = {
  color: Color;
  isSelected: boolean;
  onSelectColor: () => void;
  onUpdateColor: (newColor: Color) => void;
};
