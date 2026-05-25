"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/closet", label: "My Closet" },
  { href: "/outfits", label: "Outfits" },
  { href: "/optimize", label: "Optimize" },
  { href: "/economics", label: "Economics" },
  { href: "/seed-closet", label: "Seed Closet" },
  { href: "/shopping-buddy", label: "Shopping Buddy" },
  { href: "/chat", label: "AI Stylist" },
  { href: "/pricing", label: "Pricing" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg tracking-tight" style={{ color: "var(--accent)" }}>
          Forever Closet
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-full text-sm transition-colors"
              style={{
                color: pathname === l.href ? "var(--accent)" : "var(--muted)",
                background: pathname === l.href ? "var(--accent-soft)" : "transparent",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/onboarding"
            className="ml-2 px-4 py-1.5 rounded-full text-sm text-white"
            style={{ background: "var(--accent)" }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded"
          style={{ color: "var(--accent)" }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-1"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                color: pathname === l.href ? "var(--accent)" : "var(--muted)",
                background: pathname === l.href ? "var(--accent-soft)" : "transparent",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/onboarding"
            onClick={() => setOpen(false)}
            className="mt-2 px-4 py-2 rounded-full text-sm text-white text-center"
            style={{ background: "var(--accent)" }}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
