import { useQuery } from "@tanstack/react-query";

import client from "../db/client";

function listPalettes() {
  return client.from("palettes").select();
}

export async function createPalette(data: CreatePaletteDto): Promise<Palette> {
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

type Palette = {
  id: string;
  name: string;
  colors: Array<string>;
};

export function usePalettesList() {
  return useQuery({
    queryKey: ["palettes"],
    queryFn: listPalettes,
  });
}
