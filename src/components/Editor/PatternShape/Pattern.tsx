import "./Pattern.css";

import classNames from "classnames";
import { times } from "remeda";
import tinycolor from "tinycolor2";

import foregroundColorForBackground from "@/utils/foregroundColorForBackground";

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
      {times(rows, (y) => {
        let colorCount = 0;

        return (
          <div
            key={y}
            className={classNames("pattern__row", {
              "pattern__row--shifted": isShifted,
            })}
          >
            <div className="pattern__row-counter">{rows - y}</div>

            {times(columns, (x) => {
              colorCount++;
              const currentColorCount = colorCount;
              let lastColorInARow = false;

              if (x === columns - 1 || colors[y][x] !== colors[y][x + 1]) {
                lastColorInARow = true;
                colorCount = 0;
              }

              return (
                <div
                  key={x}
                  className="pattern__cell"
                  style={{
                    position: "relative",
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
                >
                  {lastColorInARow ? (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        fontSize: "5px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: `#${foregroundColorForBackground(
                          tinycolor(colors[y]?.[x] ?? "white")
                        ).toHex()}`,
                      }}
                    >
                      {currentColorCount}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
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
