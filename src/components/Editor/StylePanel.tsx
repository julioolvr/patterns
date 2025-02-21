import {
  DefaultStylePanel,
  DefaultStylePanelContent,
  useRelevantStyles,
} from "tldraw";

import { paletteStyle } from "@/components/Editor/__shared__/PaletteStyle";

import PaletteStylePanelTool from "./StylePanel/PaletteStylePanelTool";

export default function StylePanel() {
  const styles = useRelevantStyles();
  if (!styles) return null;

  const palette = styles.get(paletteStyle);

  return (
    <DefaultStylePanel>
      <DefaultStylePanelContent styles={styles} />
      {palette !== undefined && <PaletteStylePanelTool palette={palette} />}
    </DefaultStylePanel>
  );
}
