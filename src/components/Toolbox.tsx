import { ActionIcon, FileButton, Switch, Slider } from "@mantine/core";
import {
  IconDownload,
  IconSwitchHorizontal,
  IconPhotoScan,
} from "@tabler/icons-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import client from "../db/client";
import { Color } from "../modules/palette";
import { Pattern } from "../modules/pattern";
import { coordinatesToExcel } from "../modules/excel";
import foregroundColorForBackground from "../utils/foregroundColorForBackground";

export default function Toolbox({
  pattern,
  imageOpacity,
  onChangeImageOpacity,
  onTogglePatternShift,
  isEditingPattern,
  setEditingPattern,
}: Props) {
  return (
    <ActionIcon.Group>
      <ActionIcon onClick={onTogglePatternShift}>
        <IconSwitchHorizontal />
      </ActionIcon>

      <ImageSelector
        onSelect={(file) => {
          client.storage
            .from("references")
            .upload(pattern.id, file, { upsert: true });
        }}
      />

      <OpacitySelector
        opacity={imageOpacity}
        setOpacity={onChangeImageOpacity}
      />

      <ActionIcon
        onClick={() =>
          downloadExcel(
            patternToColorGrid(pattern.pixels, pattern.palette.colors)
          )
        }
      >
        <IconDownload />
      </ActionIcon>

      <Switch
        label="Edit image"
        checked={!isEditingPattern}
        onChange={(event) => setEditingPattern(!event.currentTarget.checked)}
      />
    </ActionIcon.Group>
  );
}

type Props = {
  onTogglePatternShift: () => void;
  pattern: Pattern;
  imageOpacity: number;
  onChangeImageOpacity: (newOpacity: number) => void;
  isEditingPattern: boolean;
  setEditingPattern: (isEditingPattern: boolean) => void;
};

function ImageSelector({ onSelect }: ImageSelectorProps) {
  return (
    <FileButton
      accept=".jpg, .jpeg, .png"
      onChange={(file) => file && onSelect(file)}
    >
      {(props) => (
        <ActionIcon {...props}>
          <IconPhotoScan />
        </ActionIcon>
      )}
    </FileButton>
  );
}

type ImageSelectorProps = {
  onSelect: (image: File) => void;
};

async function downloadExcel(colorGrid: ColorGrid) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Pattern");
  sheet.properties.defaultRowHeight = 24;
  sheet.properties.defaultColWidth = 4;
  colorGrid.forEach((row, x) => {
    row.forEach((cell, y) => {
      const excelCell = sheet.getCell(coordinatesToExcel(x, y));
      excelCell.font = {
        color: { argb: foregroundColorForBackground(cell.color).toHex() },
      };
      excelCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: cell.color.toHex() },
      };

      if (cell.colorCount !== undefined) {
        excelCell.value = cell.colorCount;
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "result.xlsx");
}

function patternToColorGrid(
  pixels: Array<Array<number>>,
  palette: Array<Color>
): ColorGrid {
  return pixels.map((row) => {
    let currentColorCount = 0;

    return row.map((paletteIndex, x) => {
      currentColorCount++;
      const isLastCellInRow = x === row.length - 1;
      let isLastCellWithColor = isLastCellInRow;

      if (!isLastCellInRow) {
        isLastCellWithColor = paletteIndex !== row[x + 1];
      }

      const thisCellColorCount = currentColorCount;

      if (isLastCellWithColor) {
        currentColorCount = 0;
      }

      return {
        color: palette[paletteIndex],
        colorCount:
          isLastCellWithColor || isLastCellInRow
            ? thisCellColorCount
            : undefined,
      };
    });
  });
}

function OpacitySelector({ opacity, setOpacity }: OpacitySelectorProps) {
  return (
    <div>
      Opacity:{" "}
      <Slider
        min={0}
        max={1}
        step={0.05}
        value={opacity}
        onChange={(newOpacity) => setOpacity(newOpacity)}
      />
    </div>
  );
}

type OpacitySelectorProps = {
  opacity: number;
  setOpacity: (newOpacity: number) => void;
};

// TODO: Deduplicate
type ColorGrid = Array<
  Array<{
    color: Color;
    colorCount: number | undefined;
  }>
>;
