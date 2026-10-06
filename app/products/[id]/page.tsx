import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id, active: true } });
  if (!product) notFound();
  return <section className="mx-auto max-w-4xl px-6 py-20"><p className="text-xs uppercase tracking-[0.3em] text-muted">{product.sku}</p><h1 className="mt-4 text-5xl font-semibold">{product.name}</h1><p className="mt-6 max-w-2xl leading-8 text-muted">{product.description}</p><p className="mt-8 text-2xl">£{(product.priceMinor / 100).toFixed(2)}</p><div className="mt-10 flex gap-4"><Link className="inline-flex min-h-11 items-center rounded-xl bg-foreground px-6 text-sm font-medium text-black" href={`/checkout?product=${product.id}`}>Continue to checkout</Link><Link className="inline-flex min-h-11 items-center rounded-xl border border-line px-6 text-sm" href="/products">Back to products</Link></div></section>;
}
