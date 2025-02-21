import { StyleProp, T } from "tldraw";

export const paletteStyle = StyleProp.define("patterns:palette", {
  defaultValue: {
    colors: ["#e2e2e2", "red", "blue", "green"],
    selected: 0,
  },
});

export type PaletteStyle = T.TypeOf<typeof paletteStyle>;
