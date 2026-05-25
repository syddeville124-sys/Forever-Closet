"use client";

import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface ScanHistory {
  id: number;
  name: string;
  score: number;
  decision: "Buy" | "Pass" | "Maybe";
  swatchColor: string;
  date: string;
}

// ── Data ───────────────────────────────────────────────────────────────────
const scanHistory: ScanHistory[] = [
  { id: 1, name: "Burgundy Velvet Midi Dress",   score: 91, decision: "Buy",   swatchColor: "#7a2e3a", date: "May 20" },
  { id: 2, name: "Cream Linen Wide-Leg Trousers", score: 43, decision: "Pass",  swatchColor: "#e8dcc8", date: "May 17" },
  { id: 3, name: "Cognac Leather Shoulder Bag",   score: 72, decision: "Maybe", swatchColor: "#9a5e34", date: "May 12" },
];

const reasonsToBuy = [
  "Fills your structured outerwear gap — a genuine wardrobe need, not a want.",
  "Works with 14 existing items across dresses, trousers, and blouses.",
  "Earthy jewel-tone palette is a strong match for your established color story.",
  "Wool-blend natural fiber — excellent longevity, holds shape well over time.",
  "Silhouette is distinct from your current jackets; adds real variation.",
];

const cautions = [
  "Ask seller for shoulder width measurement before committing — blazers are notoriously hard to alter at the shoulder.",
];

const similarItems = [
  { name: "Linen Blazer",        swatch: "var(--gold)", note: "Lighter weight, seasonal — this fills a different role" },
  { name: "Wide-Leg Trousers",   swatch: "#7a6e5e",     note: "Shares tailored aesthetic — these pair beautifully together" },
];

function decisionStyle(decision: ScanHistory["decision"]): { color: string; bg: string } {
  if (decision === "Buy")   return { color: "var(--sage)", bg: "#f0f2ee" };
  if (decision === "Pass")  return { color: "var(--rose)", bg: "#faf0ee" };
  return                           { color: "var(--gold)", bg: "#faf5eb" };
}

// ── Camera Icon ────────────────────────────────────────────────────────────
function CameraIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ShoppingBuddyPage() {
  const [scanning, setScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  function handleScan() {
    setScanning(true);
    setShowResult(false);
    setTimeout(() => {
      setScanning(false);
      setShowResult(true);
    }, 1800);
  }

  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* ── Header ── */}
        <div className="mb-9">
          <p
            className="text-xs uppercase tracking-widest mb-2 font-sans"
            style={{ color: "var(--muted)", letterSpacing: "0.16em" }}
          >
            Wardrobe Intelligence
          </p>
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
          >
            Shopping Buddy
          </h1>
          <p className="text-lg italic" style={{ color: "var(--muted)", fontFamily: "Georgia, serif" }}>
            Know before you buy.
          </p>
        </div>

        {/* ── Upload / Scan Area ── */}
        <section
          className="rounded-2xl p-8 mb-8 flex flex-col items-center text-center"
          style={{
            background: "var(--paper)",
            border: "2px dashed var(--line)",
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            {scanning ? (
              <ScanningSpinner />
            ) : (
              <CameraIcon />
            )}
          </div>

          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
          >
            {scanning ? "Analysing item…" : "Take a photo while shopping or thrifting"}
          </h2>

          {!scanning && (
            <>
              <p
                className="text-sm max-w-sm leading-relaxed mb-6"
                style={{ color: "var(--muted)" }}
              >
                AI identifies the garment and checks it against your closet, Style DNA, and measurements
                — giving you a clear buy or pass recommendation in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleScan}
                  className="px-7 py-3 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ background: "var(--accent)", fontFamily: "Georgia, serif", cursor: "pointer" }}
                >
                  Scan Item
                </button>
                <button
                  className="px-7 py-3 rounded-full text-sm font-medium"
                  style={{
                    background: "transparent",
                    border: "1.5px solid var(--line)",
                    color: "var(--muted)",
                    fontFamily: "Georgia, serif",
                    cursor: "pointer",
                  }}
                >
                  Upload Photo
                </button>
              </div>
            </>
          )}

          {scanning && (
            <p className="text-sm italic mt-3" style={{ color: "var(--muted)" }}>
              Checking against your closet, Style DNA, and measurements…
            </p>
          )}
        </section>

        {/* ── Analysis Result Card ── */}
        {(showResult || true) && !scanning && (
          <section
            className="rounded-2xl overflow-hidden mb-8"
            style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
          >
            {/* Result header */}
            <div
              className="px-7 py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
              style={{ borderBottom: "1px solid var(--line)", background: "var(--accent-soft)" }}
            >
              <div>
                <p
                  className="text-xs uppercase tracking-widest font-sans mb-1"
                  style={{ color: "var(--muted)", letterSpacing: "0.1em" }}
                >
                  Item Identified
                </p>
                <h2
                  className="text-lg font-semibold leading-snug"
                  style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
                >
                  Forest green wool-blend blazer, structured, single-button, notched lapel
                </h2>
              </div>

              {/* Score badge */}
              <div
                className="shrink-0 flex flex-col items-center justify-center rounded-2xl px-5 py-3"
                style={{ background: "#faf5eb", border: "2px solid var(--gold)", minWidth: 100 }}
              >
                <span
                  className="text-3xl font-bold leading-none"
                  style={{ color: "var(--gold)", fontFamily: "Georgia, serif" }}
                >
                  87%
                </span>
                <span className="text-xs font-sans mt-1" style={{ color: "var(--muted)" }}>Match</span>
              </div>
            </div>

            <div className="px-7 py-6">
              {/* Recommendation */}
              <div
                className="flex items-center gap-3 rounded-xl px-5 py-4 mb-6"
                style={{ background: "#f0f2ee" }}
              >
                <span className="text-xl" style={{ color: "var(--sage)" }}>✓</span>
                <div>
                  <p
                    className="text-base font-semibold"
                    style={{ color: "var(--sage)", fontFamily: "Georgia, serif" }}
                  >
                    Yes — this is a strong purchase.
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    It fills a real gap, matches your style DNA, and pairs with existing pieces.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Reasons to buy */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-3 uppercase tracking-wide font-sans"
                    style={{ color: "var(--sage)", letterSpacing: "0.08em" }}
                  >
                    Reasons to Buy
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {reasonsToBuy.map((reason) => (
                      <li key={reason} className="flex items-start gap-2.5">
                        <span
                          className="shrink-0 mt-0.5 text-base leading-none"
                          style={{ color: "var(--sage)" }}
                        >
                          ✓
                        </span>
                        <span className="text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
                          {reason}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cautions + Similar items */}
                <div className="flex flex-col gap-5">
                  <div>
                    <h3
                      className="text-sm font-semibold mb-3 uppercase tracking-wide font-sans"
                      style={{ color: "var(--rose)", letterSpacing: "0.08em" }}
                    >
                      Before You Buy
                    </h3>
                    <ul className="flex flex-col gap-2.5">
                      {cautions.map((c) => (
                        <li key={c} className="flex items-start gap-2.5">
                          <span
                            className="shrink-0 mt-0.5 text-base leading-none"
                            style={{ color: "var(--rose)" }}
                          >
                            ⚠
                          </span>
                          <span className="text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
                            {c}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Similar items in closet */}
                  <div>
                    <h3
                      className="text-sm font-semibold mb-3 uppercase tracking-wide font-sans"
                      style={{ color: "var(--muted)", letterSpacing: "0.08em" }}
                    >
                      Similar Items in Your Closet
                    </h3>
                    <div className="flex flex-col gap-2">
                      {similarItems.map((s) => (
                        <div
                          key={s.name}
                          className="flex items-center gap-3 rounded-xl px-4 py-3"
                          style={{ background: "var(--accent-soft)" }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg shrink-0"
                            style={{ background: s.swatch, border: "1px solid var(--line)" }}
                          />
                          <div>
                            <p
                              className="text-sm font-medium leading-snug"
                              style={{ color: "var(--ink)" }}
                            >
                              {s.name}
                            </p>
                            <p className="text-xs" style={{ color: "var(--muted)" }}>
                              {s.note}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Recent Scan History ── */}
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
          >
            Recent Scans
          </h2>
          <div className="flex flex-col gap-3">
            {scanHistory.map((scan) => {
              const ds = decisionStyle(scan.decision);
              return (
                <div
                  key={scan.id}
                  className="flex items-center gap-4 rounded-2xl px-5 py-4"
                  style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
                >
                  {/* Thumbnail placeholder */}
                  <div
                    className="w-12 h-14 rounded-xl shrink-0"
                    style={{ background: scan.swatchColor, border: "1px solid var(--line)" }}
                  />

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold leading-snug mb-0.5 truncate"
                      style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
                    >
                      {scan.name}
                    </p>
                    <p className="text-xs font-sans" style={{ color: "var(--muted)" }}>
                      {scan.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="text-sm font-semibold font-sans"
                      style={{
                        color: scan.score >= 75 ? "var(--sage)" : scan.score >= 55 ? "var(--gold)" : "var(--rose)",
                      }}
                    >
                      {scan.score}%
                    </span>
                    <span
                      className="text-xs font-sans rounded-full px-3 py-1"
                      style={{ background: ds.bg, color: ds.color }}
                    >
                      {scan.decision}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Free Tier Notice ── */}
        <div
          className="rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ background: "var(--accent-soft)", border: "1px solid var(--line)" }}
        >
          <div>
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
            >
              3 of 5 free scans used this month
            </p>
            <div className="flex items-center gap-3">
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--line)", width: 120 }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: "60%", background: "var(--accent)" }}
                />
              </div>
              <span className="text-xs font-sans" style={{ color: "var(--muted)" }}>
                2 remaining
              </span>
            </div>
            <p className="text-xs mt-1.5 italic" style={{ color: "var(--muted)" }}>
              Upgrade to Premium for unlimited scans + full analysis history.
            </p>
          </div>
          <a
            href="/pricing"
            className="shrink-0 px-5 py-2.5 rounded-full text-sm text-white text-center font-medium transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", fontFamily: "Georgia, serif" }}
          >
            Upgrade to Premium
          </a>
        </div>

      </div>
    </div>
  );
}

// ── Scanning spinner (CSS keyframes via inline style) ──────────────────────
function ScanningSpinner() {
  return (
    <>
      <style>{`
        @keyframes fc-spin { to { transform: rotate(360deg); } }
        .fc-spin { animation: fc-spin 0.9s linear infinite; }
      `}</style>
      <svg
        className="fc-spin"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    </>
  );
}
