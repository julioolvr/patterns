import { times } from "remeda";

import "./Pattern.css";

export default function Pattern({ rows, columns, colors }: Props) {
  // TODO: Collapse borders
  return (
    <div className="pattern">
      {times(rows, (y) => (
        <div key={y} className="pattern__row">
          {times(columns, (x) => (
            <div
              key={x}
              className="pattern__cell"
              style={{ backgroundColor: colors[y]?.[x] ?? "white" }}
              onClick={(e) => {
                console.log("click cell", x, y, e);
                e.stopPropagation();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

type Props = {
  rows: number;
  columns: number;
  colors: string[][];
};
