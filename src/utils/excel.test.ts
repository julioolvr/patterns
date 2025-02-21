import { describe, expect, test } from "vitest";

import { coordinatesToExcel } from "./excel";

describe(coordinatesToExcel, () => {
  test("rows are 1-based, columns use letters", () => {
    expect(coordinatesToExcel(1, 0)).toEqual("B1");
  });

  test("rows can be multiple digits", () => {
    expect(coordinatesToExcel(0, 20)).toEqual("A21");
  });

  test("columns beyond Z use multiple letters", () => {
    expect(coordinatesToExcel(28, 0)).toEqual("AC1");
  });
});
