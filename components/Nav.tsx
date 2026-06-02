"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

const links = [
  { href: "/closet", label: "My Closet" },
  { href: "/audit", label: "Audit" },
  { href: "/outfits", label: "Outfits" },
  { href: "/optimize", label: "Optimize" },
  { href: "/economics", label: "Economics" },
  { href: "/seed-closet", label: "Seed Closet" },
  { href: "/shopping-buddy", label: "Shopping Buddy" },
  { href: "/chat", label: "AI Stylist" },
  { href: "/profile", label: "Style DNA" },
  { href: "/pricing", label: "Pricing" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useStore();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <nav
      style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg tracking-tight" style={{ color: "var(--accent)", display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
          Woven
          <span style={{ fontWeight: 400, fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.05em" }}>
            Forever Closet
          </span>
        </Link>

        {/* Desktop nav links */}
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

          {user ? (
            <button
              onClick={handleSignOut}
              className="ml-2 px-4 py-1.5 rounded-full text-sm"
              style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--line)", cursor: "pointer" }}
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="ml-2 px-4 py-1.5 rounded-full text-sm text-white"
              style={{ background: "var(--accent)" }}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
