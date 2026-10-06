import Link from "next/link";

export default function CartPage() {
  return <section className="mx-auto max-w-3xl px-6 py-20"><p className="text-xs uppercase tracking-[0.3em] text-muted">Cart</p><h1 className="mt-3 text-4xl font-semibold">Your cart</h1><p className="mt-5 text-muted">Cart persistence and guest-cart support are staged behind the authenticated commerce slice. The current checkout path remains server-authoritative.</p><Link className="mt-8 inline-flex min-h-11 items-center rounded-xl border border-line px-5 text-sm" href="/products">Browse products</Link></section>;
}
