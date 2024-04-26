import { useCallback, useState } from "react";
import * as R from "remeda";
import { useImmer } from "use-immer";
import classNames from "classnames";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import "./Pattern.css";

type Color = string;

class Palette {
  colors: Array<Color>;

  constructor() {
    this.colors = ["#ff0000", "#000000"];
  }
}

function coordinatesToExcel(x: number, y: number): string {
  // TODO: Do this right
  const column = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[y % 26];
  const row = x + 1;

  return `${column}${row}`;
}

async function downloadExcel(colorGrid: Array<Array<Color>>) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Pattern");
  sheet.properties.defaultRowHeight = 24;
  sheet.properties.defaultColWidth = 4;
  colorGrid.forEach((row, x) => {
    row.forEach((color, y) => {
      const cell = sheet.getCell(coordinatesToExcel(x, y));
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color.slice(1) },
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "result.xlsx");
}

function usePattern(width: number, height: number) {
  const [palette] = useState(new Palette());
  const [pixels, setPixels] = useImmer(
    R.times(height, () => R.times(width, R.constant(0)))
  );
  const [isShifted, setIsShifted] = useState(true);

  return {
    palette,
    isShifted,
    toggleShift: () => setIsShifted((prev) => !prev),
    colorGrid(): Array<Array<Color>> {
      return pixels.map((row) => {
        return row.map((paletteIndex) => palette.colors[paletteIndex]);
      });
    },
    setColor(colorIndex: number, x: number, y: number) {
      setPixels((draft) => {
        draft[y][x] = colorIndex;
      });
    },
  };
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
            {row.map((color, x) => (
              <button
                key={x}
                className="pattern--cell"
                style={{ backgroundColor: color }}
                onClick={() => onPaint(x, y)}
              ></button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type PatternUiProps = {
  colorGrid: Array<Array<Color>>;
  onPaint: (x: number, y: number) => void;
  isShifted: boolean;
  imageOverlay: string | null;
  imageOverlayOpacity: number;
};

function PaletteSelector({
  palette,
  selectedColorIndex,
  onSelectColorIndex,
}: PaletteSelectorProps) {
  return (
    <div className="palette-selector">
      {palette.colors.map((color, index) => (
        <button
          key={index}
          onClick={() => onSelectColorIndex(index)}
          style={
            selectedColorIndex === index ? { border: "3px solid black" } : {}
          }
        >
          {color}
        </button>
      ))}
    </div>
  );
}

type PaletteSelectorProps = {
  palette: Palette;
  selectedColorIndex: number;
  onSelectColorIndex: (index: number) => void;
};

function ImageSelector({ onSelect }: ImageSelectorProps) {
  const onImageChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const file = event.target.files?.[0];

      if (file) {
        onSelect(URL.createObjectURL(file));
      }
    },
    [onSelect]
  );

  return (
    <div>
      <input type="file" accept=".jpg, .jpeg, .png" onChange={onImageChange} />
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
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={opacity}
        onChange={(e) => setOpacity(Number(e.target.value))}
      />
    </div>
  );
}

type OpacitySelectorProps = {
  opacity: number;
  setOpacity: (newOpacity: number) => void;
};

export default function Editor() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageOpacity, setImageOpacity] = useState(0.5);
  const pattern = usePattern(10, 20);

  return (
    <div>
      <button onClick={pattern.toggleShift}>Toggle shift</button>
      <PaletteSelector
        palette={pattern.palette}
        selectedColorIndex={currentColorIndex}
        onSelectColorIndex={setCurrentColorIndex}
      />
      <ImageSelector onSelect={(imageUrl) => setImageUrl(imageUrl)} />
      <OpacitySelector opacity={imageOpacity} setOpacity={setImageOpacity} />
      <button onClick={() => downloadExcel(pattern.colorGrid())}>
        Download
      </button>
      <PatternUi
        colorGrid={pattern.colorGrid()}
        onPaint={(x, y) => pattern.setColor(currentColorIndex, x, y)}
        isShifted={pattern.isShifted}
        imageOverlay={imageUrl}
        imageOverlayOpacity={imageOpacity}
      />
    </div>
  );
}
