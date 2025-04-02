import { StyleProp, T } from "tldraw";

export const paletteStyle = StyleProp.define("patterns:palette", {
  defaultValue: {
    colors: ["#F8F4EE", "red", "blue", "green"],
    selected: 0,
  },
});

export type PaletteStyle = T.TypeOf<typeof paletteStyle>;
