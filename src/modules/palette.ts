import tinycolor from "tinycolor2";
import { useImmer } from "use-immer";

export type Color = tinycolor.Instance;

export type Palette = {
  colors: Array<Color>;
  addColor: (newColor: Color) => void;
  updateColor: (index: number, newColor: Color) => void;
};

export default function usePalette(): Palette {
  const [colors, setColors] = useImmer([tinycolor("red"), tinycolor("black")]);

  return {
    colors,
    addColor(newColor: Color) {
      setColors((draft) => {
        draft.push(newColor);
      });
    },
    updateColor(index: number, color: Color) {
      setColors((draft) => {
        draft[index] = color;
      });
    },
  };
}
