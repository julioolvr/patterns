import { useState } from "react";
import { Slider, Affix, ActionIcon, FileButton, Switch } from "@mantine/core";
import classNames from "classnames";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { observer } from "mobx-react-lite";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  IconDownload,
  IconPhotoScan,
  IconSwitchHorizontal,
} from "@tabler/icons-react";

import foregroundColorForBackground from "../utils/foregroundColorForBackground";
import { Color } from "../modules/palette";
import PaletteSelector from "./PaletteSelector";

import "./Pattern.css";
import useStore from "../store";
import { Pattern as PatternType } from "../modules/pattern";
import client from "../db/client";
import { coordinatesToExcel } from "../modules/excel";
import { useDebouncedCallback } from "@mantine/hooks";

type ColorGrid = Array<
  Array<{
    color: Color;
    colorCount: number | undefined;
  }>
>;

async function downloadExcel(colorGrid: ColorGrid) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Pattern");
  sheet.properties.defaultRowHeight = 24;
  sheet.properties.defaultColWidth = 4;
  colorGrid.forEach((row, x) => {
    row.forEach((cell, y) => {
      const excelCell = sheet.getCell(coordinatesToExcel(x, y));
      excelCell.font = {
        color: { argb: foregroundColorForBackground(cell.color).toHex() },
      };
      excelCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: cell.color.toHex() },
      };

      if (cell.colorCount !== undefined) {
        excelCell.value = cell.colorCount;
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "result.xlsx");
}

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
                  src={imageOverlay}
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
};

function ImageSelector({ onSelect }: ImageSelectorProps) {
  return (
    <FileButton
      accept=".jpg, .jpeg, .png"
      onChange={(file) => file && onSelect(file)}
    >
      {(props) => (
        <ActionIcon {...props}>
          <IconPhotoScan />
        </ActionIcon>
      )}
    </FileButton>
  );
}

type ImageSelectorProps = {
  onSelect: (image: File) => void;
};

function OpacitySelector({ opacity, setOpacity }: OpacitySelectorProps) {
  return (
    <div>
      Opacity:{" "}
      <Slider
        min={0}
        max={1}
        step={0.05}
        value={opacity}
        onChange={(newOpacity) => setOpacity(newOpacity)}
      />
    </div>
  );
}

type OpacitySelectorProps = {
  opacity: number;
  setOpacity: (newOpacity: number) => void;
};

const Pattern = observer(({ pattern }: Props) => {
  const ui = useStore((state) => state.ui);
  const togglePatternShift = useStore((state) => state.togglePatternShift);
  const [editingPattern, setEditingPattern] = useState(true);

  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(0.5);

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
      <Affix position={{ left: "50%", bottom: "20px" }}>
        <ActionIcon.Group>
          <ActionIcon onClick={togglePatternShift}>
            <IconSwitchHorizontal />
          </ActionIcon>

          <ImageSelector
            onSelect={(file) => {
              client.storage
                .from("references")
                .upload(pattern.id, file, { upsert: true });
            }}
          />

          <OpacitySelector
            opacity={imageOpacity}
            setOpacity={setImageOpacity}
          />

          <ActionIcon
            onClick={() =>
              downloadExcel(
                patternToColorGrid(pattern.pixels, pattern.palette.colors)
              )
            }
          >
            <IconDownload />
          </ActionIcon>

          <Switch
            label="Edit image"
            checked={!editingPattern}
            onChange={(event) =>
              setEditingPattern(!event.currentTarget.checked)
            }
          />
        </ActionIcon.Group>
      </Affix>

      <PaletteSelector
        palette={pattern.palette.colors}
        selectedColorIndex={currentColorIndex}
        onSelectColorIndex={setCurrentColorIndex}
        onAddColor={(newColor) => pattern.palette.addColor(newColor)}
        onUpdateColor={(index, newColor) =>
          pattern.palette.updateColor(index, newColor)
        }
      />

      <PatternUi
        colorGrid={patternToColorGrid(pattern.pixels, pattern.palette.colors)}
        onPaint={(x, y) => pattern.setPixelColor(currentColorIndex, x, y)}
        isShifted={ui.isPatternShifted}
        imageOverlay={pattern.imageUrl}
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

function shouldShiftLeft(numberOfRows: number, rowIndex: number): boolean {
  // Last row of the pattern should be shifted left

  if (numberOfRows % 2 === 0) {
    // Even number of rows means that that the last row will be odd
    return rowIndex % 2 !== 0;
  }

  return rowIndex % 2 === 0;
}
