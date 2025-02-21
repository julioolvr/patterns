export function coordinatesToExcel(x: number, y: number): string {
  const row = y + 1;

  let column = "";
  while (x >= 0) {
    column = String.fromCharCode((x % 26) + 65) + column;
    x = Math.floor(x / 26) - 1;
  }

  return `${column}${row}`;
}
