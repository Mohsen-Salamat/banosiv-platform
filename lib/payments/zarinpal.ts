import { ApiError } from "../errors";
import { PaymentProvider, PaymentRequest, PaymentResponse } from "./provider";
import { z } from "zod";

const responseSchema = z.object({ data: z.object({ authority: z.string().optional(), ref_id: z.union([z.string(), z.number()]).optional() }).passthrough().optional() }).passthrough();

export class ZarinpalProvider implements PaymentProvider {
  private base = process.env.ZARINPAL_API_URL ?? "https://sandbox.zarinpal.com/pg/v4/payment";
  private merchant = process.env.ZARINPAL_MERCHANT_ID ?? "";

  private async post(path: string, body: object) {
    if (!this.merchant) throw new ApiError(503, "PAYMENT_CONFIG_MISSING", "Zarinpal is not configured.");
    const r = await fetch(`${this.base}/${path}.json`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) throw new ApiError(503, "PAYMENT_PROVIDER_ERROR", "Payment provider unavailable.");
    return responseSchema.parse(await r.json());
  }

  async request(i: PaymentRequest): Promise<PaymentResponse> {
    const d = await this.post("request", { merchant_id: this.merchant, amount: i.amountMinor, callback_url: i.callbackUrl, description: i.description });
    const authority = d.data?.authority;
    if (!authority) throw new ApiError(502, "PAYMENT_REQUEST_REJECTED", "Payment request was rejected.");
    return { authority, redirectUrl: `${this.base.replace(/\/pg\/v4\/payment$/, "/StartPay")}/${authority}` };
  }

  async verify(i: { authority: string; amountMinor: number }) {
    const d = await this.post("verify", { merchant_id: this.merchant, amount: i.amountMinor, authority: i.authority });
    const ref = d.data?.ref_id;
    if (ref === undefined) throw new ApiError(402, "PAYMENT_VERIFY_FAILED", "Payment verification failed.");
    return { referenceId: String(ref) };
  }

  async refund(i: { referenceId?: string; amountMinor: number }) {
    if (!this.merchant || !i.referenceId) throw new ApiError(400, "REFERENCE_REQUIRED", "Zarinpal refund requires ref_id.");
    await this.post("refund", { merchant_id: this.merchant, amount: i.amountMinor, ref_id: i.referenceId });
    return { providerReference: i.referenceId };
  }
}
