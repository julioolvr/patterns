import { useQuery } from "@tanstack/react-query";

import client from "../db/client";

function listPalettes() {
  return client.from("palettes").select();
}

export function usePalettesList() {
  return useQuery({
    queryKey: ["palettes"],
    queryFn: listPalettes,
  });
}
