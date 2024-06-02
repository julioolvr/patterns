import * as R from "remeda";
import { makeAutoObservable } from "mobx";

import { Palette } from "./palette";
import { PatternRow } from "../queries/patterns";

export class Pattern {
  constructor(
    public id: string,
    public name: string,
    public height: number,
    public width: number,
    public pixels: Array<Array<number>>,
    public palette: Palette
  ) {
    makeAutoObservable(this);
    this.id = id;
    this.name = name;
    this.height = height;
    this.width = width;
    this.pixels = withDefaultPixels(pixels, width, height);
    this.palette = palette;
  }

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

  setPixelColor(colorIndex: number, x: number, y: number) {
    this.pixels[y][x] = colorIndex;
  }
}

function pixelsToMatrix(
  pixels: Array<number>,
  width: number
): Array<Array<number>> {
  const height = pixels.length / width;
  return R.times(height, (row) => pixels.slice(width * row, width));
}

function withDefaultPixels(
  pixels: Array<Array<number>>,
  width: number,
  height: number
): Array<Array<number>> {
  if (pixels.length > 0) {
    return pixels;
  }

  return R.times(height, () => R.times(width, R.constant(0)));
}
