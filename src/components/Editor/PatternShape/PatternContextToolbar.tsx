import { TldrawUiIcon, track, useEditor } from "tldraw";

import { PatternShape } from "../PatternShape";

const PatternContextToolbar = track(() => {
  const editor = useEditor();
  const showToolbar = editor.isIn("select.idle");
  if (!showToolbar) {
    return null;
  }
  const selectionRotatedPageBounds = editor.getSelectionRotatedPageBounds();
  if (!selectionRotatedPageBounds) {
    return null;
  }
  const selectedShape = editor.getOnlySelectedShape();
  if (
    !selectedShape ||
    !editor.isShapeOfType<PatternShape>(selectedShape, "pattern")
  ) {
    return null;
  }
  const pageCoordinates = editor.pageToViewport(
    selectionRotatedPageBounds.point
  );

  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "all",
        top: pageCoordinates.y - 42,
        left: pageCoordinates.x,
        width: selectionRotatedPageBounds.width * editor.getZoomLevel(),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          borderRadius: 8,
          display: "flex",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)",
          background: "var(--color-panel)",
          width: "fit-content",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 32,
            width: 32,
          }}
          onClick={() => console.log("clicked toggle shift")}
        >
          <TldrawUiIcon icon="horizontal-align-middle" />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 32,
            width: 32,
          }}
          onClick={() => console.log("clicked download")}
        >
          <TldrawUiIcon icon="geo-arrow-down" />
        </div>
      </div>
    </div>
  );
});

export default PatternContextToolbar;
