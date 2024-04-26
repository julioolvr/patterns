import { useCallback, useState } from "react";
import * as R from "remeda";
import { useImmer } from "use-immer";
import classNames from "classnames";

import "./Pattern.css";

type Color = string;

class Palette {
  colors: Array<Color>;

  constructor() {
    this.colors = ["red", "black"];
  }
}

function usePattern(width: number, height: number) {
  const [palette] = useState(new Palette());
  const [pixels, setPixels] = useImmer(
    R.times(height, () => R.times(width, R.constant(0)))
  );
  const [isShifted, setIsShifted] = useState(false);

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
}: PatternUiProps) {
  return (
    <div
      className={classNames("pattern", { "pattern__is-shifted": isShifted })}
    >
      {imageOverlay && (
        <img className="pattern--image-overlay" src={imageOverlay} />
      )}
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
  );
}

type PatternUiProps = {
  colorGrid: Array<Array<Color>>;
  onPaint: (x: number, y: number) => void;
  isShifted: boolean;
  imageOverlay: string | null;
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

export default function Editor() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
      <PatternUi
        colorGrid={pattern.colorGrid()}
        onPaint={(x, y) => pattern.setColor(currentColorIndex, x, y)}
        imageOverlay={imageUrl}
        isShifted={pattern.isShifted}
      />
    </div>
  );
}
