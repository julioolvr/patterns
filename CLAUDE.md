# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite and hot module replacement
- `npm run build` - Build production version (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint with TypeScript support and strict warnings
- `npm run preview` - Preview production build locally
- `npm test` - Run tests with Vitest

## Architecture Overview

This is a React application built with TypeScript and Vite that creates an interactive pattern design tool using tldraw. The app allows users to create, edit, and export knitting/crochet patterns.

### Core Technologies
- **tldraw**: Canvas-based drawing library providing the main editor interface
- **Mantine**: UI component library for panels, dropzones, and form controls
- **TanStack Router**: File-based routing with `/patterns` base path
- **ExcelJS**: Pattern export functionality to Excel format

### Key Architecture Components

**Custom tldraw Integration:**
- `PatternShapeUtil` extends `BaseBoxShapeUtil` to create custom pattern shapes
- Pattern shapes contain a grid of colored cells with configurable rows/columns
- Shapes support shifting (alternating row offset) and color palette management
- Custom tools are added via tldraw's overrides system

**Pattern Data Structure:**
```typescript
PatternShape {
  rows: number,
  columns: number,
  colors: number[][], // 2D array of palette color indices
  palette: PaletteStyle, // color array with selected index
  isShifted: boolean,
  w: number, h: number
}
```

**Component Hierarchy:**
- `Editor.tsx` - Main tldraw wrapper with custom components
- `PatternShape/` - Custom shape implementation and rendering
- `StylePanel/` - Color palette management tools
- `Toolbar.tsx` - Custom drawing tools
- `PatternContextToolbar.tsx` - Context-sensitive pattern controls

**State Management:**
- Pattern state managed through tldraw's shape system
- Color changes use Immer for immutable updates
- Palette colors stored in custom StyleProp with tldraw

**Export System:**
- `export.ts` provides Excel export with colored cells and stitch counts
- `excel.ts` contains coordinate conversion utilities
- Color counting logic tracks consecutive cells of the same color

### Path Aliases
- `@/*` resolves to `./src/*` (configured in both tsconfig.json and vite.config.ts)

### Important Files
- `src/components/Editor/PatternShape.tsx` - Core pattern shape logic
- `src/components/Editor/__shared__/PaletteStyle.ts` - Color palette type definitions
- `src/utils/export.ts` - Pattern export functionality
- `src/utils/excel.ts` - Excel coordinate utilities

### Testing
- Tests use Vitest framework
- Test files located alongside source files (e.g., `excel.test.ts`)
- Run individual tests with `npm test -- excel.test.ts`