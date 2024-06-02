import tinycolor from "tinycolor2";
import { PaletteRow } from "../queries/palettes";

export type Color = tinycolor.Instance;

export class Palette {
  constructor(
    public id: string,
    public colors: Array<Color>
  ) {}

  static fromDatabase(data: PaletteRow): Palette {
    return {
      ...data,
      colors: data.colors.map((color) => tinycolor(color)),
    };
  }
}
