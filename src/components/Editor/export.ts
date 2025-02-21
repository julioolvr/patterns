import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import tinycolor from "tinycolor2";

import { coordinatesToExcel } from "@/modules/excel";
import foregroundColorForBackground from "@/utils/foregroundColorForBackground";

export async function downloadExcel(colors: Array<Array<string>>) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Pattern");
  sheet.properties.defaultRowHeight = 24;
  sheet.properties.defaultColWidth = 4;
  colors.forEach((row, y) => {
    let colorCount = 0;

    row.forEach((color, x) => {
      colorCount++;
      const currentColorCount = colorCount;
      let lastColorInARow = false;

      if (x === row.length - 1 || colors[y][x] !== colors[y][x + 1]) {
        lastColorInARow = true;
        colorCount = 0;
      }

      const asTinycolor = tinycolor(color);
      const excelCell = sheet.getCell(coordinatesToExcel(x, y));
      excelCell.font = {
        color: { argb: foregroundColorForBackground(asTinycolor).toHex() },
      };
      excelCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: asTinycolor.toHex() },
      };

      if (lastColorInARow) {
        excelCell.value = currentColorCount;
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "pattern.xlsx");
}
