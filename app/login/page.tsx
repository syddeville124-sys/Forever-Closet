"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Screen = "email" | "sent" | "promo";

export default function LoginPage() {
  const [screen, setScreen] = useState<Screen>("email");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=/closet`
        : "/auth/callback?next=/closet";

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: redirectTo },
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setScreen("sent");
    }
  }

  async function handlePromoCode(e: React.FormEvent) {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setLoading(true);
    setPromoError("");

    const code = promoCode.trim().toUpperCase();
    const { data, error: promoErr } = await supabase
      .from("woven_promo_codes")
      .select("code, grants_lifetime_access, is_active")
      .eq("code", code)
      .single();

    if (promoErr || !data) {
      setPromoError("Code not found. Check for typos and try again.");
      setLoading(false);
      return;
    }

    // Get current user and record redemption
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("woven_promo_redemptions")
        .upsert({ user_id: user.id, code }, { onConflict: "user_id,code" });
    }

    setPromoSuccess(true);
    setLoading(false);
  }

  // ── Email input screen ─────────────────────────────────────────────────────

  if (screen === "email") {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", fontFamily: "Georgia, serif" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--accent)", marginBottom: "0.25rem" }}>Woven</h1>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Forever Closet</p>
            </Link>
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.4rem" }}>Sign in</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Enter your email and we'll send you a magic link — no password needed.
            </p>

            <form onSubmit={handleSendLink} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: 10, border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)", fontSize: "0.95rem", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}
                />
              </div>

              {error && (
                <p style={{ fontSize: "0.8rem", color: "var(--rose)", margin: 0 }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                style={{ padding: "0.75rem", borderRadius: 999, background: loading || !email.trim() ? "var(--line)" : "var(--accent)", color: loading || !email.trim() ? "var(--muted)" : "var(--paper)", border: "none", fontSize: "0.95rem", cursor: loading || !email.trim() ? "default" : "pointer", fontFamily: "Georgia, serif", transition: "background 0.15s" }}
              >
                {loading ? "Sending…" : "Send magic link"}
              </button>
            </form>

            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)" }}>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
                Have a promo code?{" "}
                <button
                  onClick={() => setScreen("promo")}
                  style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.78rem", fontFamily: "Georgia, serif", textDecoration: "underline" }}
                >
                  Redeem it here
                </button>
              </p>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--muted)", marginTop: "1.25rem", lineHeight: 1.65 }}>
            By signing in you agree to use this app responsibly.<br />
            Your data is yours — we never sell it.
          </p>
        </div>
      </div>
    );
  }

  // ── Magic link sent screen ─────────────────────────────────────────────────

  if (screen === "sent") {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", fontFamily: "Georgia, serif" }}>
        <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-soft)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.5rem" }}>
            ✦
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>Check your email</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            We sent a magic link to <strong style={{ color: "var(--ink)" }}>{email}</strong>. Click the link to sign in — it expires in 1 hour.
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.65 }}>
            Check your spam folder if you don't see it within a minute.
          </p>
          <button
            onClick={() => { setScreen("email"); setError(""); }}
            style={{ marginTop: "1.5rem", background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.85rem", fontFamily: "Georgia, serif", textDecoration: "underline" }}
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  // ── Promo code screen ──────────────────────────────────────────────────────

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", fontFamily: "Georgia, serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "2rem" }}>
          <button
            onClick={() => setScreen("email")}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.82rem", fontFamily: "Georgia, serif", padding: "0 0 1rem", display: "block" }}
          >
            ← Back
          </button>

          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.4rem" }}>Redeem a promo code</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Sign in first, then enter your code below to unlock free access.
          </p>

          {promoSuccess ? (
            <div style={{ padding: "1.25rem", borderRadius: 12, background: "#f1f3ef", border: "1.5px solid var(--sage)", textAlign: "center" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>✦</p>
              <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--sage)", marginBottom: "0.3rem" }}>Code accepted!</p>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>You have lifetime free access to Woven.</p>
              <Link
                href="/closet"
                style={{ display: "inline-block", marginTop: "1rem", padding: "0.6rem 1.5rem", borderRadius: 999, background: "var(--accent)", color: "var(--paper)", textDecoration: "none", fontSize: "0.9rem" }}
              >
                Go to my closet
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePromoCode} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
                  Promo code
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                  placeholder="e.g. SYDWFF2026"
                  style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: 10, border: `1px solid ${promoError ? "var(--rose)" : "var(--line)"}`, background: "var(--bg)", color: "var(--ink)", fontSize: "0.95rem", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box", letterSpacing: "0.05em" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = promoError ? "var(--rose)" : "var(--line)"; }}
                />
                {promoError && <p style={{ fontSize: "0.78rem", color: "var(--rose)", margin: "0.3rem 0 0" }}>{promoError}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || !promoCode.trim()}
                style={{ padding: "0.75rem", borderRadius: 999, background: loading || !promoCode.trim() ? "var(--line)" : "var(--accent)", color: loading || !promoCode.trim() ? "var(--muted)" : "var(--paper)", border: "none", fontSize: "0.95rem", cursor: loading || !promoCode.trim() ? "default" : "pointer", fontFamily: "Georgia, serif" }}
              >
                {loading ? "Checking…" : "Redeem code"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
