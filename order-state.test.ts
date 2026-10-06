import { describe, expect, it } from "vitest";
import { assertTransition } from "@/lib/order-state";
import { ApiError } from "@/lib/errors";

describe("order state machine", () => {
  it("allows pending to paid", () => {
    expect(() => assertTransition("PENDING", "PAID")).not.toThrow();
  });

  it("rejects paid to delivered without fulfillment transitions", () => {
    expect(() => assertTransition("PAID", "DELIVERED")).toThrow(ApiError);
  });

  it("rejects refunded orders from re-entering fulfillment", () => {
    expect(() => assertTransition("REFUNDED", "PROCESSING")).toThrow(ApiError);
  });
});
