import Link from "next/link";

export default function CheckoutPage({ searchParams }: { searchParams: Promise<{ product?: string; payment?: string }> }) {
  return <section className="mx-auto max-w-3xl px-6 py-20"><p className="text-xs uppercase tracking-[0.3em] text-muted">Checkout</p><h1 className="mt-3 text-4xl font-semibold">Secure checkout</h1><p className="mt-5 text-muted">{searchParams ? "Order totals are calculated and persisted server-side before payment initiation." : ""}</p><div className="mt-8 rounded-xl border border-line bg-panel p-6"><p className="text-sm">Authentication is required for the current Thin Slice purchase flow.</p><div className="mt-6 flex gap-4"><Link href="/profile" className="inline-flex min-h-11 items-center rounded-xl border border-line px-5 text-sm">Open profile</Link><Link href="/products" className="inline-flex min-h-11 items-center rounded-xl bg-foreground px-5 text-sm text-black">Return to products</Link></div></div></section>;
}
