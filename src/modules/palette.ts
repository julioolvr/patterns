import { makeAutoObservable } from "mobx";
import tinycolor from "tinycolor2";

import { PaletteRow } from "../queries/palettes";

export type Color = tinycolor.Instance;

export class Palette {
  constructor(
    public id: string,
    public colors: Array<Color>
  ) {
    makeAutoObservable(this);
    this.id = id;
    this.colors = colors;
  }

  static fromDatabase(data: PaletteRow): Palette {
    return new Palette(
      data.id,
      data.colors.map((color) => tinycolor(color))
    );
  }

  addColor(color: Color) {
    this.colors.push(color);
  }

  updateColor(colorIndex: number, color: Color) {
    this.colors[colorIndex] = color;
  }

  get asDatabase(): PaletteRow {
    return {
      id: this.id,
      colors: this.colors.map((color) => color.toHexString()),
    };
  }
}
