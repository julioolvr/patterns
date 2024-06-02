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
