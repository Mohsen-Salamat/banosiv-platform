import type { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "BANOSIV",
  description: "A production-oriented commerce foundation.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-line">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-6">
            <Link href="/" className="tracking-[0.45em] text-sm font-semibold">
              BANOSIV
            </Link>

            <nav
              className="flex gap-6 text-sm text-muted"
              aria-label="Primary"
            >
              <Link href="/products">Shop</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/profile">Profile</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>

        <main id="main">{children}</main>
      </body>
    </html>
  );
            }
