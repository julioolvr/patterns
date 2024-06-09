import client from "../db/client";
import { PaletteRow, createPalette } from "./palettes";
import { Pattern } from "../modules/pattern";

export async function listPatterns() {
  return await client.from("patterns").select();
}

export type PatternRow = {
  id: string;
  name: string;
  height: number;
  width: number;
  pixels: Array<number>;
  palette: PaletteRow;
  image_overlay_scale: number;
  image_overlay_position_x: number;
  image_overlay_position_y: number;
};

export async function getPattern(patternId: string): Promise<Pattern> {
  const result = await client
    .from("patterns")
    .select(
      `
    id,
    name,
    width,
    height,
    pixels,
    image_overlay_scale,
    image_overlay_position_x,
    image_overlay_position_y,
    palettes ( id, colors )
  `
    )
    .eq("id", patternId);

  if (result.error) {
    throw result.error;
  }

  const pattern = result.data[0];

  if (!pattern) {
    // TODO: Change return type to possibly null
    throw new Error("Pattern not found");
  }

  if (!pattern.palettes) {
    // TODO: Think how to handle, should not happen, maybe change DB constraints
    throw new Error("Palette not found");
  }

  return Pattern.fromDatabase({ ...pattern, palette: pattern.palettes });
}

export async function createPattern(data: CreatePatternDto) {
  // TODO: Consider what happens if creating the pattern later fails
  const palette = await createPalette({
    name: `Palette: ${data.name}`,
    colors: ["#ffffff", "#000000"],
  });
  // `await` is necessary to make the supabase library trigger the actual request
  return await client
    .from("patterns")
    .insert({ ...data, pixels: [], palette_id: palette.id });
}

type CreatePatternDto = {
  name: string;
  width: number;
  height: number;
};

export async function updatePattern(id: string, data: UpdatePatternDto) {
  // TODO: Consider updating patterns and palettes separately
  await client
    .from("palettes")
    .update({ colors: data.palette.colors })
    .eq("id", data.palette.id);

  return await client
    .from("patterns")
    .update({
      pixels: data.pixels,
      image_overlay_scale: data.imageOverlayScale,
      image_overlay_position_x: data.imageOverlayPositionX,
      image_overlay_position_y: data.imageOverlayPositionY,
    })
    .eq("id", id);
}

type UpdatePatternDto = {
  pixels: Array<number>;
  palette: PaletteRow;
  imageOverlayScale: number;
  imageOverlayPositionX: number;
  imageOverlayPositionY: number;
};
