import * as R from "remeda";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import tinycolor from "tinycolor2";

import { Color } from "./modules/palette";

type State = {
  pattern: {
    palette: Array<Color>;
    pixels: Array<Array<number>>;
  };
  ui: {
    isPatternShifted: boolean;
  };
};

type Actions = {
  togglePatternShift: () => void;
  setPixelColor: (colorIndex: number, x: number, y: number) => void;
  addPaletteColor: (color: Color) => void;
  updatePaletteColor: (colorIndex: number, color: Color) => void;
};

const useStore = create<State & Actions>()(
  immer((set) => ({
    pattern: {
      palette: [tinycolor("white"), tinycolor("red"), tinycolor("black")],
      pixels: R.times(20, () => R.times(10, R.constant(0))),
    },
    ui: {
      isPatternShifted: true,
    },
    togglePatternShift: () =>
      set((state) => {
        state.ui.isPatternShifted = !state.ui.isPatternShifted;
      }),
    setPixelColor: (colorIndex, x, y) =>
      set((state) => {
        state.pattern.pixels[y][x] = colorIndex;
      }),
    addPaletteColor: (color) =>
      set((state) => {
        state.pattern.palette.push(color);
      }),
    updatePaletteColor: (colorIndex, color) =>
      set((state) => {
        state.pattern.palette[colorIndex] = color;
      }),
  }))
);

export default useStore;
