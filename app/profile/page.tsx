import Link from "next/link";

export default function ProfilePage() {
  return <section className="mx-auto max-w-3xl px-6 py-20"><p className="text-xs uppercase tracking-[0.3em] text-muted">Account</p><h1 className="mt-3 text-4xl font-semibold">Profile</h1><p className="mt-5 text-muted">Account management is available through the authenticated API. The visual owner-facing profile surface is part of the next auth slice.</p><Link className="mt-8 inline-flex min-h-11 items-center rounded-xl border border-line px-5 text-sm" href="/products">Continue shopping</Link></section>;
}
