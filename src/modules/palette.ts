import tinycolor from "tinycolor2";

export type Color = tinycolor.Instance;

export default class Palette {
  colors: Array<Color>;

  constructor() {
    this.colors = [tinycolor("red"), tinycolor("black")];
  }
}
