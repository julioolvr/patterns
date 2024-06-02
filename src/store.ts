import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";
import tinycolor from "tinycolor2";

type State = {
  ui: {
    isPatternShifted: boolean;
  };
};

type Actions = {
  togglePatternShift: () => void;
};

const useStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      ui: {
        isPatternShifted: true,
      },
      togglePatternShift: () =>
        set((state) => {
          state.ui.isPatternShifted = !state.ui.isPatternShifted;
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
