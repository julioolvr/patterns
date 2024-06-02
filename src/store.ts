import * as R from "remeda";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";
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
  addPaletteColor: (color: Color) => void;
  updatePaletteColor: (colorIndex: number, color: Color) => void;
};

const useStore = create<State & Actions>()(
  persist(
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
      addPaletteColor: (color) =>
        set((state) => {
          state.pattern.palette.push(color);
        }),
      updatePaletteColor: (colorIndex, color) =>
        set((state) => {
          state.pattern.palette[colorIndex] = color;
        }),
    })),
    {
      name: "pattern-storage",
      storage: createJSONStorage(() => localStorage, {
        reviver: (_key, value) => {
          if (
            value &&
            typeof value === "object" &&
            "type" in value &&
            value.type === "tinycolor" &&
            "color" in value &&
            typeof value.color === "string"
          ) {
            return tinycolor(value.color);
          }

          return value;
        },
        replacer: (_key, value) => {
          if (value instanceof tinycolor) {
            return { type: "tinycolor", color: value.toHex8String() };
          }

          return value;
        },
      }),
    }
  )
);

export default useStore;
