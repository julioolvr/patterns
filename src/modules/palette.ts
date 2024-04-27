import tinycolor from "tinycolor2";

export type Color = tinycolor.Instance;

export type Palette = {
  colors: Array<Color>;
  addColor: (newColor: Color) => void;
  updateColor: (index: number, newColor: Color) => void;
};
