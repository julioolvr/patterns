import { BaseBoxShapeUtil, HTMLContainer, TLBaseShape } from "tldraw";

import Pattern from "./PatternShape/Pattern";
import { produce } from "immer";
import { times } from "remeda";

// Shapes are a JSON record with properties
// Probably the pattern shape should have width, height, colors and wether it's shifted or not
// Maybe it should also contain the palette?
export type PatternShape = TLBaseShape<
  "pattern",
  {
    rows: number;
    columns: number;
    shifted: boolean;
    colors: string[][];
    palette: string[];
    h: number;
    w: number;
  }
>;

export class PatternShapeUtil extends BaseBoxShapeUtil<PatternShape> {
  static override type = "pattern" as const;

  canEdit(): boolean {
    return true;
  }

  getDefaultProps(): PatternShape["props"] {
    return {
      rows: 40,
      columns: 20,
      shifted: false,
      colors: times(20, () => times(40, () => "white")),
      palette: ["red", "blue", "green"],
      h: 500,
      w: 250,
    };
  }

  component(shape: PatternShape) {
    const isEditing = this.editor.getEditingShapeId() == shape.id;

    return (
      <HTMLContainer style={{ pointerEvents: isEditing ? "all" : "none" }}>
        <Pattern
          rows={shape.props.rows}
          columns={shape.props.columns}
          colors={shape.props.colors}
          onCellClicked={(x, y) =>
            this.editor.updateShape<PatternShape>({
              id: shape.id,
              type: shape.type,
              props: {
                colors: produce(shape.props.colors, (colors) => {
                  if (colors[y] === undefined) {
                    colors[y] = [];
                  }

                  colors[y][x] = "pink";
                }),
              },
            })
          }
        />
      </HTMLContainer>
    );
  }

  indicator(shape: PatternShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
