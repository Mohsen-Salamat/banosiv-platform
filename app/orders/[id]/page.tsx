import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const order = await db.order.findFirst({ where: { id, userId: user.id }, include: { items: true } });
  if (!order) notFound();
  return <section className="mx-auto max-w-4xl px-6 py-20"><Link href="/products" className="text-sm text-muted">Back to products</Link><h1 className="mt-4 text-4xl font-semibold">Order {order.id}</h1><p className="mt-3 text-muted">Status: {order.status}</p><div className="mt-10 space-y-3">{order.items.map((item) => <div key={item.id} className="flex justify-between rounded-xl border border-line bg-panel p-4"><span>{item.name} × {item.quantity}</span><span>{order.currency} {(item.totalMinor / 100).toFixed(2)}</span></div>)}</div><div className="mt-8 border-t border-line pt-6 text-right text-xl">Total: {order.currency} {(order.totalMinor / 100).toFixed(2)}</div></section>;
}
