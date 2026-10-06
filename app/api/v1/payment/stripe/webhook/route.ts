import { z } from "zod";
import { db } from "@/lib/db";
import { verifyStripeSignature } from "@/lib/payments/stripe";

const eventSchema = z.object({ id: z.string().min(1), type: z.string().min(1), data: z.object({ object: z.record(z.string(), z.unknown()) }) });

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  if (!secret || !verifyStripeSignature(raw, signature, secret)) return new Response("invalid signature", { status: 400 });
  const parsed = eventSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) return new Response("invalid payload", { status: 400 });
  const event = parsed.data;
  if (await db.paymentEvent.findFirst({ where: { provider: "STRIPE", providerEventId: event.id } })) return new Response("ok");
  await db.paymentEvent.create({ data: { provider: "STRIPE", providerEventId: event.id, eventType: event.type, verified: true, payloadJson: raw } });
  if (event.type === "checkout.session.completed") {
    const orderId = typeof event.data.object.client_reference_id === "string" ? event.data.object.client_reference_id : "";
    if (orderId) {
      const transaction = await db.transaction.findFirst({ where: { orderId, provider: "STRIPE" } });
      if (transaction) await db.$transaction(async (tx) => {
        await tx.transaction.update({ where: { id: transaction.id }, data: { status: "SUCCEEDED", providerPaymentId: typeof event.data.object.payment_intent === "string" ? event.data.object.payment_intent : null, rawResultJson: raw } });
        await tx.order.updateMany({ where: { id: orderId, status: "PENDING" }, data: { status: "PAID", version: { increment: 1 } } });
      });
    }
  }
  if (event.type === "charge.dispute.created") {
    const paymentIntentId = typeof event.data.object.payment_intent === "string" ? event.data.object.payment_intent : "";
    const transaction = await db.transaction.findFirst({ where: { providerPaymentId: paymentIntentId } });
    if (transaction) await db.order.update({ where: { id: transaction.orderId }, data: { status: "DISPUTED", version: { increment: 1 } } });
  }
  return new Response("ok");
}
