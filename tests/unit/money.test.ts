import { describe, expect, it } from "vitest";
import { calcTotal } from "@/lib/money";

describe("money calculations", () => {
  it("calculates totals using integer minor units", () => {
    expect(calcTotal(1000, 175, 250, 100)).toBe(1325);
  });

  it("rejects negative totals", () => {
    expect(() => calcTotal(100, 0, 0, 101)).toThrow();
  });
});
