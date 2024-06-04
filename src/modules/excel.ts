export function coordinatesToExcel(x: number, y: number): string {
  const row = x + 1;

  let column = "";
  while (y >= 0) {
    column = String.fromCharCode((y % 26) + 65) + column;
    y = Math.floor(y / 26) - 1;
  }

  return `${column}${row}`;
}
