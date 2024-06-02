import client from "../db/client";

export async function createPalette(
  data: CreatePaletteDto
): Promise<PaletteRow> {
  const result = await client.from("palettes").insert(data).select();

  if (result.error) {
    throw result.error;
  }

  return result.data[0];
}

type CreatePaletteDto = {
  name: string;
  colors: Array<string>;
};

export type PaletteRow = {
  id: string;
  colors: Array<string>;
};
