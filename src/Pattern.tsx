import { useState } from "react";
import * as R from "remeda";
import { useImmer } from "use-immer";

import "./Pattern.css";

type Color = string;

class Palette {
  colors: Array<Color>;

  constructor() {
    this.colors = ["red", "black"];
  }
}

function usePattern(width: number, height: number, initialPalette: Palette) {
  const [palette] = useState(initialPalette);
  const [pixels, setPixels] = useImmer(
    R.times(height, () => R.times(width, R.constant(0)))
  );

  return {
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

export default function PatternUi() {
  const pattern = usePattern(10, 20, new Palette());

  return (
    <div className="pattern">
      {pattern.colorGrid().map((row, y) => (
        <div key={y} className="pattern--row">
          {row.map((color, x) => (
            <button
              key={x}
              className="pattern--cell"
              style={{ backgroundColor: color }}
              onClick={() => pattern.setColor(1, x, y)}
            ></button>
          ))}
        </div>
      ))}
    </div>
  );
}
