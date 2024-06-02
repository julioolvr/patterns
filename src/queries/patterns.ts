import client from "../db/client";
import { createPalette } from "./palettes";

export async function listPatterns() {
  return await client.from("patterns").select();
}

export async function getPattern(patternId: string) {
  const result = await client.from("patterns").select().eq("id", patternId);

  if (result.error) {
    throw result.error;
  }

  return result.data[0];
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
