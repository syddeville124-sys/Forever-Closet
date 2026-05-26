"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Home",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={active ? "var(--accent)" : "none"}
        stroke={active ? "var(--accent)" : "var(--muted)"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: "/closet",
    label: "Closet",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "var(--accent)" : "var(--muted)"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H5v10a2 2 0 002 2h10a2 2 0 002-2V10h1.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "AI Stylist",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={active ? "var(--accent)" : "none"}
        stroke={active ? "var(--accent)" : "var(--muted)"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    href: "/outfits",
    label: "Outfits",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? "var(--accent)" : "var(--muted)"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2l2.09 6.26H21l-5.47 3.97 2.09 6.26L12 14.52l-5.62 4.07 2.09-6.26L3 8.26h6.91z" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "More",
    icon: (active: boolean) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={active ? "var(--accent)" : "none"}
        stroke={active ? "var(--accent)" : "var(--muted)"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "var(--paper)",
        borderTop: "1px solid var(--line)",
        height: 60,
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {tabs.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              textDecoration: "none",
              color: active ? "var(--accent)" : "var(--muted)",
              WebkitTapHighlightColor: "transparent",
            }}
            aria-label={tab.label}
            aria-current={active ? "page" : undefined}
          >
            {tab.icon(active)}
            <span
              style={{
                fontSize: "0.6rem",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.02em",
                lineHeight: 1,
                color: active ? "var(--accent)" : "var(--muted)",
                fontWeight: active ? 600 : 400,
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
