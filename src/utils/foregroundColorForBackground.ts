import tinycolor from "tinycolor2";

export default function foregroundColorForBackground(
  color: tinycolor.Instance
): tinycolor.Instance {
  return color.isDark() ? tinycolor("white") : tinycolor("black");
}
