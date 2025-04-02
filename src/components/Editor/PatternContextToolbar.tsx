import { times } from "remeda";
import { TldrawUiIcon, track, useEditor } from "tldraw";

import { PatternShape } from "@/components/Editor/PatternShape";
import { downloadExcel } from "@/utils/export";

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
    <>
      {/* Add / remove rows */}
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
              cursor: "pointer",
            }}
            onClick={() => {
              editor.markHistoryStoppingPoint();

              if (selectedShape.props.rows > 1) {
                editor.updateShape<PatternShape>({
                  id: selectedShape.id,
                  type: "pattern",
                  props: {
                    colors: selectedShape.props.colors.slice(0, -1),
                    rows: selectedShape.props.rows - 1,
                    h:
                      (selectedShape.props.h / selectedShape.props.rows) *
                      (selectedShape.props.rows - 1),
                  },
                });
              } else {
                editor.deleteShape(selectedShape.id);
              }
            }}
          >
            <TldrawUiIcon icon="minus" />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 32,
              width: 32,
              cursor: "pointer",
            }}
            onClick={() => {
              editor.markHistoryStoppingPoint();
              editor.updateShape<PatternShape>({
                id: selectedShape.id,
                type: "pattern",
                props: {
                  colors: [
                    ...selectedShape.props.colors,
                    times(selectedShape.props.columns, () => 0),
                  ],
                  rows: selectedShape.props.rows + 1,
                  h:
                    (selectedShape.props.h / selectedShape.props.rows) *
                    (selectedShape.props.rows + 1),
                },
              });
            }}
          >
            <TldrawUiIcon icon="plus" />
          </div>
        </div>
      </div>

      {/* Shift / download */}
      <div
        style={{
          position: "absolute",
          pointerEvents: "all",
          top: pageCoordinates.y + selectionRotatedPageBounds.height * editor.getZoomLevel() + 20,
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
              cursor: "pointer",
              background: selectedShape.props.isShifted
                ? "var(--color-muted-2)"
                : "transparent",
            }}
            onClick={() =>
              editor.updateShape<PatternShape>({
                id: selectedShape.id,
                type: "pattern",
                props: { isShifted: !selectedShape.props.isShifted },
              })
            }
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
              cursor: "pointer",
            }}
            onClick={() =>
              downloadExcel(
                selectedShape.props.colors.map((row) =>
                  row.map((cell) => selectedShape.props.palette.colors[cell])
                )
              )
            }
          >
            <TldrawUiIcon icon="geo-arrow-down" />
          </div>
        </div>
      </div>

      {/* Add / remove columns */}
      <div
        style={{
          position: "absolute",
          pointerEvents: "all",
          top: pageCoordinates.y,
          left:
            pageCoordinates.x +
            selectionRotatedPageBounds.width * editor.getZoomLevel() +
            20,
          height: selectionRotatedPageBounds.height * editor.getZoomLevel(),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div
          style={{
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
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
              cursor: "pointer",
            }}
            onClick={() => {
              editor.markHistoryStoppingPoint();
              editor.updateShape<PatternShape>({
                id: selectedShape.id,
                type: "pattern",
                props: {
                  colors: selectedShape.props.colors.map((row) => [...row, 0]),
                  columns: selectedShape.props.columns + 1,
                  w:
                    (selectedShape.props.w / selectedShape.props.columns) *
                    (selectedShape.props.columns + 1),
                },
              });
            }}
          >
            <TldrawUiIcon icon="plus" />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 32,
              width: 32,
              cursor: "pointer",
            }}
            onClick={() => {
              editor.markHistoryStoppingPoint();

              if (selectedShape.props.columns > 1) {
                editor.updateShape<PatternShape>({
                  id: selectedShape.id,
                  type: "pattern",
                  props: {
                    colors: selectedShape.props.colors.map((row) =>
                      row.slice(0, -1)
                    ),
                    columns: selectedShape.props.columns - 1,
                    w:
                      (selectedShape.props.w / selectedShape.props.columns) *
                      (selectedShape.props.columns - 1),
                  },
                });
              } else {
                editor.deleteShape(selectedShape.id);
              }
            }}
          >
            <TldrawUiIcon icon="minus" />
          </div>
        </div>
      </div>
    </>
  );
});

export default PatternContextToolbar;
