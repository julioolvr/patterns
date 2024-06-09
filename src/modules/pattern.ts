import * as R from "remeda";
import { makeAutoObservable, reaction } from "mobx";

import { Palette } from "./palette";
import { PatternRow, updatePattern } from "../queries/patterns";
import client from "../db/client";

const debouncedSave = R.debounce(
  (data: PatternRow) =>
    updatePattern(data.id, {
      pixels: data.pixels,
      palette: data.palette,
      imageOverlayScale: data.image_overlay_scale,
      imageOverlayPositionX: data.image_overlay_position_x,
      imageOverlayPositionY: data.image_overlay_position_y,
    }),
  {
    waitMs: 1000,
  }
);

export class Pattern {
  public id: string;
  public name: string;
  public height: number;
  public width: number;
  public pixels: Array<Array<number>>;
  public palette: Palette;
  public imageOverlayScale: number;
  public imageOverlayPositionX: number;
  public imageOverlayPositionY: number;

  saveHandler: () => void;

  constructor(
    id: string,
    name: string,
    height: number,
    width: number,
    pixels: Array<Array<number>>,
    palette: Palette,
    imageOverlayScale: number,
    imageOverlayPositionX: number,
    imageOverlayPositionY: number
  ) {
    makeAutoObservable(this, {
      saveHandler: false,
    });
    this.id = id;
    this.name = name;
    this.height = height;
    this.width = width;
    this.pixels = withDefaultPixels(pixels, width, height);
    this.palette = palette;
    this.imageOverlayScale = imageOverlayScale;
    this.imageOverlayPositionX = imageOverlayPositionX;
    this.imageOverlayPositionY = imageOverlayPositionY;

    this.saveHandler = reaction(
      () => this.asDatabase,
      // TODO: Do not save on temporary palette change
      (data) => debouncedSave.call(data)
    );
  }

  static fromDatabase(row: PatternRow): Pattern {
    return new Pattern(
      row.id,
      row.name,
      row.height,
      row.width,
      pixelsToMatrix(row.pixels, row.width),
      Palette.fromDatabase(row.palette),
      row.image_overlay_scale,
      row.image_overlay_position_x,
      row.image_overlay_position_y
    );
  }

  setPixelColor(colorIndex: number, x: number, y: number) {
    this.pixels[y][x] = colorIndex;
  }

  get asDatabase(): PatternRow {
    return {
      id: this.id,
      name: this.name,
      height: this.height,
      width: this.width,
      pixels: this.pixels.flat(),
      palette: this.palette.asDatabase,
      image_overlay_scale: this.imageOverlayScale,
      image_overlay_position_x: this.imageOverlayPositionX,
      image_overlay_position_y: this.imageOverlayPositionY,
    };
  }

  get imageUrl(): string {
    return client.storage.from("references").getPublicUrl(this.id).data
      .publicUrl;
  }
}

function pixelsToMatrix(
  pixels: Array<number>,
  width: number
): Array<Array<number>> {
  const height = pixels.length / width;
  return R.times(height, (row) =>
    pixels.slice(width * row, width * row + width)
  );
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
