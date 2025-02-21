import { produce } from "immer";
import { times } from "remeda";
import { BaseBoxShapeUtil, HTMLContainer, T, TLBaseShape } from "tldraw";

import { PaletteStyle, paletteStyle } from "./PaletteStyle";
import Pattern from "./PatternShape/Pattern";

// Shapes are a JSON record with properties
// Probably the pattern shape should have width, height, colors and wether it's shifted or not
// Maybe it should also contain the palette?
export type PatternShape = TLBaseShape<
  "pattern",
  {
    rows: number;
    columns: number;
    shifted: boolean;
    colors: number[][];
    palette: PaletteStyle;
    isShifted: boolean;
    h: number;
    w: number;
  }
>;

export class PatternShapeUtil extends BaseBoxShapeUtil<PatternShape> {
  static override type = "pattern" as const;

  static override props = {
    rows: T.number,
    columns: T.number,
    shifted: T.boolean,
    colors: T.arrayOf(T.arrayOf(T.number)),
    palette: paletteStyle,
    isShifted: T.boolean,
    h: T.number,
    w: T.number,
  };

  canEdit(): boolean {
    return true;
  }

  getDefaultProps(): PatternShape["props"] {
    return {
      rows: 40,
      columns: 20,
      shifted: false,
      colors: times(40, () => times(20, () => 0)),
      palette: {
        colors: ["#e2e2e2", "red", "blue", "green"],
        selected: 0,
      },
      isShifted: true,
      h: 720,
      w: 240,
    };
  }

  isAspectRatioLocked(): boolean {
    return true;
  }

  component(shape: PatternShape) {
    const isEditing = this.editor.getEditingShapeId() == shape.id;

    return (
      <HTMLContainer style={{ pointerEvents: isEditing ? "all" : "none" }}>
        <Pattern
          rows={shape.props.rows}
          columns={shape.props.columns}
          colors={shape.props.colors.map((row) =>
            row.map((cell) => shape.props.palette.colors[cell])
          )}
          isShifted={shape.props.isShifted}
          onCellClicked={(x, y) => {
            this.editor.markHistoryStoppingPoint();
            this.editor.updateShape<PatternShape>({
              id: shape.id,
              type: shape.type,
              props: {
                colors: produce(shape.props.colors, (colors) => {
                  if (colors[y] === undefined) {
                    colors[y] = [];
                  }

                  colors[y][x] = shape.props.palette.selected;
                }),
              },
            });
          }}
        />
      </HTMLContainer>
    );
  }

  indicator(shape: PatternShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
