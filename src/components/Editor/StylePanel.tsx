import { useCallback, useRef } from "react";
import classNames from "classnames";
import {
  DefaultStylePanelContent,
  TLUiStylePanelProps,
  useEditor,
  usePassThroughWheelEvents,
  useRelevantStyles,
} from "tldraw";
import PaletteStylePanelTool from "./PaletteStylePanelTool";

// Copy-paste of the default style panel from tldraw, to be able to add tools
// that don't refer to `StyleProp`s.
export default function StylePanel({
  isMobile,
  children,
}: TLUiStylePanelProps) {
  const editor = useEditor();

  const ref = useRef<HTMLDivElement>(null);
  usePassThroughWheelEvents(ref);

  const styles = useRelevantStyles();

  const handlePointerOut = useCallback(() => {
    if (!isMobile) {
      editor.updateInstanceState({ isChangingStyle: false });
    }
  }, [editor, isMobile]);

  const content = children ?? <DefaultStylePanelContent styles={styles} />;

  return (
    <div
      ref={ref}
      className={classNames("tlui-style-panel", {
        "tlui-style-panel__wrapper": !isMobile,
      })}
      data-ismobile={isMobile}
      onPointerLeave={handlePointerOut}
    >
      <PaletteStylePanelTool />
      {content}
    </div>
  );
}
