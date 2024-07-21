import { useMemo, useState } from "react";
import { Affix } from "@mantine/core";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import foregroundColorForBackground from "../utils/foregroundColorForBackground";
import { Color } from "../modules/palette";
import PaletteSelector from "./PaletteSelector";

import "./Pattern.css";
import useStore from "../store";
import { Pattern as PatternType } from "../modules/pattern";
import { useDebouncedCallback } from "@mantine/hooks";
import Toolbox from "./Toolbox";
import useSequence from "../hooks/useSequence";

type ColorGrid = Array<
  Array<{
    color: Color;
    colorCount: number | undefined;
  }>
>;

function patternToColorGrid(
  pixels: Array<Array<number>>,
  palette: Array<Color>
): ColorGrid {
  return pixels.map((row) => {
    let currentColorCount = 0;

    return row.map((paletteIndex, x) => {
      currentColorCount++;
      const isLastCellInRow = x === row.length - 1;
      let isLastCellWithColor = isLastCellInRow;

      if (!isLastCellInRow) {
        isLastCellWithColor = paletteIndex !== row[x + 1];
      }

      const thisCellColorCount = currentColorCount;

      if (isLastCellWithColor) {
        currentColorCount = 0;
      }

      return {
        color: palette[paletteIndex],
        colorCount:
          isLastCellWithColor || isLastCellInRow
            ? thisCellColorCount
            : undefined,
      };
    });
  });
}

function PatternUi({
  colorGrid,
  onPaint,
  isShifted,
  imageOverlay,
  imageOverlayVersion,
  imageOverlayOpacity,
  imageOverlayScale,
  imageOverlayPositionX,
  imageOverlayPositionY,
  onImageOverlayTransform,
  allowTransformImageOverlay,
}: PatternUiProps) {
  const onImageOverlayTransformDebounced = useDebouncedCallback(
    onImageOverlayTransform,
    1000
  );

  // TODO: Replace by last image change date
  const cacheBuster = useMemo(
    () => Math.random(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [imageOverlay, imageOverlayVersion]
  );

  return (
    <TransformComponent>
      <div
        className={classNames("pattern", { "pattern--is-shifted": isShifted })}
      >
        {isShifted && imageOverlay && (
          <TransformWrapper
            disabled={!allowTransformImageOverlay}
            wheel={{ wheelDisabled: true, smoothStep: 0.01 }}
            limitToBounds={false}
            initialPositionX={imageOverlayPositionX}
            initialPositionY={imageOverlayPositionY}
            initialScale={imageOverlayScale}
            onTransformed={(_, transform) =>
              onImageOverlayTransformDebounced(
                transform.scale,
                transform.positionX,
                transform.positionY
              )
            }
          >
            <div
              className={classNames("pattern__image-overlay-container", {
                "pattern__image-overlay-container--transform-disabled":
                  !allowTransformImageOverlay,
              })}
            >
              <TransformComponent wrapperClass="pattern__image-overlay-transform-wrapper">
                <img
                  className="pattern__image-overlay"
                  src={`${imageOverlay}?cache=${cacheBuster}`}
                  style={{ opacity: imageOverlayOpacity }}
                />
              </TransformComponent>
            </div>
          </TransformWrapper>
        )}
        <div>
          {colorGrid.map((row, y) => (
            <div
              key={y}
              className={classNames("pattern__row", {
                "pattern__row--left": shouldShiftLeft(colorGrid.length, y),
              })}
            >
              <div className="pattern__row-number pattern__row-number--left">
                {rowNumber(colorGrid.length, y)}
              </div>

              <div className="pattern__row-cells">
                {row.map((cell, x) => (
                  <button
                    key={x}
                    className="pattern__cell"
                    style={{
                      backgroundColor: cell.color.toHexString(),
                      color: foregroundColorForBackground(
                        cell.color
                      ).toHexString(),
                    }}
                    onClick={() => onPaint(x, y)}
                  >
                    {cell.colorCount}
                  </button>
                ))}
              </div>

              <div className="pattern__row-number pattern__row-number--right">
                {rowNumber(colorGrid.length, y)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TransformComponent>
  );
}

type PatternUiProps = {
  colorGrid: ColorGrid;
  onPaint: (x: number, y: number) => void;
  isShifted: boolean;
  imageOverlay: string | null;
  imageOverlayOpacity: number;
  imageOverlayScale: number;
  imageOverlayPositionX: number;
  imageOverlayPositionY: number;
  onImageOverlayTransform: (
    scale: number,
    positionX: number,
    positionY: number
  ) => void;
  allowTransformImageOverlay: boolean;
  imageOverlayVersion: number;
};

const Pattern = observer(({ pattern }: Props) => {
  const ui = useStore((state) => state.ui);
  const togglePatternShift = useStore((state) => state.togglePatternShift);
  const [editingPattern, setEditingPattern] = useState(true);

  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(0.5);
  const [imageOverlayVersion, bumpImageOverlayVersion] = useSequence();

  return (
    <TransformWrapper
      panning={{ wheelPanning: true }}
      wheel={{ wheelDisabled: true, smoothStep: 0.01 }}
      doubleClick={{ disabled: true }}
      minScale={0.2}
      centerOnInit
      disabled={!editingPattern}
      initialScale={0.2}
    >
      <Affix position={{ left: "45%", bottom: "20px" }}>
        <Toolbox
          pattern={pattern}
          imageOpacity={imageOpacity}
          onChangeImageOpacity={setImageOpacity}
          isPatternShifted={ui.isPatternShifted}
          onTogglePatternShift={togglePatternShift}
          isEditingPattern={editingPattern}
          onToggleEditingPattern={() => setEditingPattern((prev) => !prev)}
          onImageUpload={bumpImageOverlayVersion}
        />
      </Affix>

      <Affix position={{ left: "20px", top: "20px" }}>
        <PaletteSelector
          palette={pattern.palette.colors}
          selectedColorIndex={currentColorIndex}
          onSelectColorIndex={setCurrentColorIndex}
          onAddColor={(newColor) => pattern.palette.addColor(newColor)}
          onUpdateColor={(index, newColor) =>
            pattern.palette.updateColor(index, newColor)
          }
        />
      </Affix>

      <PatternUi
        colorGrid={patternToColorGrid(pattern.pixels, pattern.palette.colors)}
        onPaint={(x, y) => pattern.setPixelColor(currentColorIndex, x, y)}
        isShifted={ui.isPatternShifted}
        imageOverlay={pattern.imageUrl}
        imageOverlayVersion={imageOverlayVersion}
        imageOverlayScale={pattern.imageOverlayScale}
        imageOverlayPositionX={pattern.imageOverlayPositionX}
        imageOverlayPositionY={pattern.imageOverlayPositionY}
        onImageOverlayTransform={(scale, positionX, positionY) => {
          pattern.imageOverlayScale = scale;
          pattern.imageOverlayPositionX = positionX;
          pattern.imageOverlayPositionY = positionY;
        }}
        imageOverlayOpacity={imageOpacity}
        allowTransformImageOverlay={!editingPattern}
      />
    </TransformWrapper>
  );
});

type Props = {
  pattern: PatternType;
};

export default Pattern;

function rowNumber(numberOfRows: number, rowIndex: number): number {
  return numberOfRows - rowIndex;
}

function shouldShiftLeft(numberOfRows: number, rowIndex: number): boolean {
  return rowNumber(numberOfRows, rowIndex) % 2 !== 0;
}
