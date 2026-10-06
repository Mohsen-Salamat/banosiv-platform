import Link from "next/link";

export function OrderCard({ id, status, totalMinor, currency }: { id: string; status: string; totalMinor: number; currency: string }) {
  return <article className="motion-safe:animate-[fade-in_200ms_ease-out] rounded-xl border border-line bg-panel p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-xs text-muted">{id}</p><p className="mt-1 font-medium">{status}</p></div><p>{currency} {(totalMinor / 100).toFixed(2)}</p></div><Link href={`/orders/${id}`} className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-line px-4 text-sm">View order</Link></article>;
}
