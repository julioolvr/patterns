import * as R from "remeda";

import { Palette } from "./palette";
import { PatternRow } from "../queries/patterns";

export class Pattern {
  constructor(
    public id: string,
    public name: string,
    public height: number,
    public width: number,
    private _pixels: Array<Array<number>>,
    public palette: Palette
  ) {}

  static fromDatabase(row: PatternRow): Pattern {
    return new Pattern(
      row.id,
      row.name,
      row.height,
      row.width,
      pixelsToMatrix(row.pixels, row.width),
      Palette.fromDatabase(row.palette)
    );
  }

  get pixels(): Array<Array<number>> {
    if (this._pixels.length > 0) {
      return this._pixels;
    }

    return R.times(this.height, () => R.times(this.width, R.constant(0)));
  }
}

function pixelsToMatrix(
  pixels: Array<number>,
  width: number
): Array<Array<number>> {
  const height = pixels.length / width;
  return R.times(height, (row) => pixels.slice(width * row, width));
}
