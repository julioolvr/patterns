import { useState } from "react";
import { FileInput, Stack, Slider } from "@mantine/core";
import classNames from "classnames";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { observer } from "mobx-react-lite";

import foregroundColorForBackground from "../utils/foregroundColorForBackground";
import { Color } from "../modules/palette";
import PaletteSelector from "./PaletteSelector";

import "./Pattern.css";
import useStore from "../store";
import { Pattern as PatternType } from "../modules/pattern";

type ColorGrid = Array<
  Array<{
    color: Color;
    colorCount: number | undefined;
  }>
>;

function coordinatesToExcel(x: number, y: number): string {
  // TODO: Do this right
  const column = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[y % 26];
  const row = x + 1;

  return `${column}${row}`;
}

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

function PatternUi({
  colorGrid,
  onPaint,
  isShifted,
  imageOverlay,
  imageOverlayOpacity,
}: PatternUiProps) {
  return (
    <div
      className={classNames("pattern", { "pattern__is-shifted": isShifted })}
    >
      {isShifted && imageOverlay && (
        <img
          className="pattern--image-overlay"
          src={imageOverlay}
          style={{ opacity: imageOverlayOpacity }}
        />
      )}
      <div>
        {colorGrid.map((row, y) => (
          <div key={y} className="pattern--row">
            {row.map((cell, x) => (
              <button
                key={x}
                className="pattern--cell"
                style={{
                  backgroundColor: cell.color.toHexString(),
                  color: foregroundColorForBackground(cell.color).toHexString(),
                }}
                onClick={() => onPaint(x, y)}
              >
                {cell.colorCount}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type PatternUiProps = {
  colorGrid: ColorGrid;
  onPaint: (x: number, y: number) => void;
  isShifted: boolean;
  imageOverlay: string | null;
  imageOverlayOpacity: number;
};

function ImageSelector({ onSelect }: ImageSelectorProps) {
  return (
    <div>
      <FileInput
        accept=".jpg, .jpeg, .png"
        onChange={(file) => file && onSelect(URL.createObjectURL(file))}
        placeholder="Select an image"
      />
    </div>
  );
}

type ImageSelectorProps = {
  onSelect: (imageUrl: string) => void;
};

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

const Pattern = observer(({ pattern }: Props) => {
  const ui = useStore((state) => state.ui);
  const togglePatternShift = useStore((state) => state.togglePatternShift);

  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(0.5);

  return (
    <>
      <Stack>
        <button onClick={togglePatternShift}>Toggle shift</button>
        <ImageSelector
          onSelect={(imageUrl) => console.log("imageUrl", imageUrl)}
        />
        <OpacitySelector opacity={imageOpacity} setOpacity={setImageOpacity} />
        <button
          onClick={() =>
            downloadExcel(
              patternToColorGrid(pattern.pixels, pattern.palette.colors)
            )
          }
        >
          Download Excel
        </button>
      </Stack>
      <PaletteSelector
        palette={pattern.palette.colors}
        selectedColorIndex={currentColorIndex}
        onSelectColorIndex={setCurrentColorIndex}
        onAddColor={(newColor) => pattern.palette.addColor(newColor)}
        onUpdateColor={(index, newColor) =>
          pattern.palette.updateColor(index, newColor)
        }
      />

      <PatternUi
        colorGrid={patternToColorGrid(pattern.pixels, pattern.palette.colors)}
        onPaint={(x, y) => pattern.setPixelColor(currentColorIndex, x, y)}
        isShifted={ui.isPatternShifted}
        imageOverlay={pattern.imageUrl}
        imageOverlayOpacity={imageOpacity}
      />
    </>
  );
});

type Props = {
  pattern: PatternType;
};

export default Pattern;
