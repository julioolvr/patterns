import { useMemo } from "react";
import * as R from "remeda";

import "./Pattern.css";

type Color = string;

class Palette {
  colors: Array<Color>;

  constructor() {
    this.colors = ["red", "black"];
  }
}

class Pattern {
  #palette: Palette;
  pixels: Array<Array<number>>;

  constructor(width: number, height: number, palette: Palette) {
    this.#palette = palette;
    this.pixels = R.times(height, () => R.times(width, R.constant(0)));
  }

  get colorGrid(): Array<Array<Color>> {
    return this.pixels.map((row) => {
      return row.map((paletteIndex) => this.#palette.colors[paletteIndex]);
    });
  }
}

export default function PatternUi() {
  const pattern = useMemo(() => new Pattern(10, 20, new Palette()), []);

  return (
    <div className="pattern">
      {pattern.colorGrid.map((row, y) => (
        <div key={y} className="pattern--row">
          {row.map((color, x) => (
            <div
              key={x}
              className="pattern--cell"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
