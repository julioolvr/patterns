import tinycolor from "tinycolor2";
import client from "../db/client";
import { Color } from "../modules/palette";

export async function createPalette(data: CreatePaletteDto): Promise<Palette> {
  const result = await client.from("palettes").insert(data).select();

  if (result.error) {
    throw result.error;
  }

  const palette = result.data[0];

  return {
    ...palette,
    colors: palette.colors.map((color) => tinycolor(color)),
  };
}

type CreatePaletteDto = {
  name: string;
  colors: Array<string>;
};

export type Palette = {
  id: string;
  colors: Array<Color>;
};
