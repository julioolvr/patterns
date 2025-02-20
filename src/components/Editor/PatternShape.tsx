import { BaseBoxShapeUtil, HTMLContainer, TLBaseShape } from "tldraw";
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
    colors: string[][];
    palette: string[];
    h: number;
    w: number;
  }
>;

export class PatternShapeUtil extends BaseBoxShapeUtil<PatternShape> {
  static override type = "pattern" as const;

  getDefaultProps(): PatternShape["props"] {
    return {
      rows: 40,
      columns: 20,
      shifted: false,
      colors: [["blue", "red", "green"]],
      palette: ["red", "blue", "green"],
      h: 500,
      w: 250,
    };
  }

  component(shape: PatternShape) {
    return (
      <HTMLContainer>
        <Pattern
          rows={shape.props.rows}
          columns={shape.props.columns}
          colors={shape.props.colors}
        />
      </HTMLContainer>
    );
  }

  indicator(shape: PatternShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
