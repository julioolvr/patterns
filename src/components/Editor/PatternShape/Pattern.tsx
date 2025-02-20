import classNames from "classnames";
import { times } from "remeda";

import "./Pattern.css";

export default function Pattern({
  rows,
  columns,
  colors,
  isShifted,
  onCellClicked,
}: Props) {
  // TODO: Collapse borders
  return (
    <div className="pattern">
      {times(rows, (y) => (
        <div
          key={y}
          className={classNames("pattern__row", {
            "pattern__row--shifted": isShifted,
          })}
        >
          {times(columns, (x) => (
            <div
              key={x}
              className="pattern__cell"
              style={{
                backgroundColor: colors[y]?.[x] ?? "white",
                transform: isShifted
                  ? `translateX(${y % 2 === 0 ? 25 : -25}%)`
                  : undefined,
              }}
              onClick={(e) => {
                onCellClicked(x, y);
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
  isShifted: boolean;
  onCellClicked: (x: number, y: number) => void;
};
