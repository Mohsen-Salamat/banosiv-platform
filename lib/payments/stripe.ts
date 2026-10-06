import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { ApiError } from "../errors";
import { PaymentProvider, PaymentRequest, PaymentResponse } from "./provider";

const checkoutResponseSchema = z.object({ id: z.string().optional(), url: z.string().url().optional() }).passthrough();
const refundResponseSchema = z.object({ id: z.string() }).passthrough();

export class StripeProvider implements PaymentProvider {
  private key = process.env.STRIPE_SECRET_KEY ?? "";

  async request(i: PaymentRequest): Promise<PaymentResponse> {
    if (!this.key) throw new ApiError(503, "PAYMENT_CONFIG_MISSING", "Stripe is not configured.");
    const b = new URLSearchParams({ mode: "payment", success_url: `${i.callbackUrl}?session_id={CHECKOUT_SESSION_ID}`, cancel_url: i.callbackUrl, client_reference_id: i.orderId });
    b.set("line_items[0][price_data][currency]", "gbp");
    b.set("line_items[0][price_data][product_data][name]", i.description);
    b.set("line_items[0][price_data][unit_amount]", String(i.amountMinor));
    b.set("line_items[0][quantity]", "1");
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Bearer ${this.key}`, "content-type": "application/x-www-form-urlencoded", "Idempotency-Key": i.idempotencyKey }, body: b });
    if (!r.ok) throw new ApiError(503, "PAYMENT_PROVIDER_ERROR", "Payment provider unavailable.");
    const d = checkoutResponseSchema.parse(await r.json());
    if (!d.url) throw new ApiError(502, "PAYMENT_REQUEST_REJECTED", "Stripe Checkout session was rejected.");
    return { redirectUrl: d.url, providerPaymentId: d.id };
  }

  async verify(
  _i: { authority: string; amountMinor: number },
): Promise<{ referenceId: string }> {
  throw new ApiError(
    400,
    "UNSUPPORTED_OPERATION",
    "Stripe uses signed webhooks for payment proof.",
  );
  }
  
  async refund(i: { referenceId?: string; amountMinor: number }) {
    if (!this.key || !i.referenceId) throw new ApiError(400, "STRIPE_REFUND_INVALID", "Stripe refund requires a PaymentIntent or Charge reference.");
    const b = new URLSearchParams({ payment_intent: i.referenceId, amount: String(i.amountMinor) });
    const r = await fetch("https://api.stripe.com/v1/refunds", { method: "POST", headers: { Authorization: `Bearer ${this.key}`, "content-type": "application/x-www-form-urlencoded" }, body: b });
    if (!r.ok) throw new ApiError(503, "PAYMENT_PROVIDER_ERROR", "Stripe refund unavailable.");
    const d = refundResponseSchema.parse(await r.json());
    return { providerReference: d.id };
  }
}

export function verifyStripeSignature(body: string, signature: string, secret: string, tolerance = 300) {
  const parts = new Map(signature.split(",").map((x) => x.split("=") as [string, string]));
  const t = Number(parts.get("t"));
  const provided = parts.get("v1");
  if (!Number.isFinite(t) || !provided || Math.abs(Date.now() / 1000 - t) > tolerance) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
