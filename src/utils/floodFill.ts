export function floodFill(
  colors: number[][],
  startX: number,
  startY: number,
  newColor: number
): number[][] {
  const rows = colors.length;
  if (rows === 0) return colors;
  
  const cols = colors[0].length;
  if (startY < 0 || startY >= rows || startX < 0 || startX >= cols) {
    return colors;
  }

  const originalColor = colors[startY][startX];
  
  // If the target color is the same as the new color, no change needed
  if (originalColor === newColor) {
    return colors;
  }

  // Create a deep copy of the colors array
  const newColors = colors.map(row => [...row]);
  
  // Stack-based flood fill to avoid recursion depth issues
  const stack: Array<[number, number]> = [[startX, startY]];
  
  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    
    // Check bounds
    if (y < 0 || y >= rows || x < 0 || x >= cols) {
      continue;
    }
    
    // Check if this cell needs to be filled
    if (newColors[y][x] !== originalColor) {
      continue;
    }
    
    // Fill this cell
    newColors[y][x] = newColor;
    
    // Add adjacent cells to stack (4-directional connectivity)
    stack.push([x + 1, y]); // right
    stack.push([x - 1, y]); // left
    stack.push([x, y + 1]); // down
    stack.push([x, y - 1]); // up
  }
  
  return newColors;
}