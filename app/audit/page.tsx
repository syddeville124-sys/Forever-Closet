"use client";

import { useState, useEffect, useCallback } from "react";
import { useStore } from "@/lib/store";
import type { ClosetItem } from "@/lib/store";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────────

type Verdict = "Keep" | "Style More" | "Alter" | "Archive" | "Sell" | "Donate" | "Release";

interface AuditResult {
  verdict: Verdict;
  confidence: "high" | "medium";
  reason: string;
  tip: string;
  wornScore: "low" | "medium" | "high";
}

interface AuditedItem {
  item: ClosetItem;
  result: AuditResult;
  userChoice: Verdict; // what the user actually chose (may differ from AI)
}

// ── Verdict config ─────────────────────────────────────────────────────────────

const VERDICT_CONFIG: Record<Verdict, { color: string; bg: string; icon: string }> = {
  "Keep":       { color: "var(--sage)",  bg: "#f1f3ef", icon: "♡" },
  "Style More": { color: "var(--gold)",  bg: "#faf5ea", icon: "✦" },
  "Alter":      { color: "var(--rose)",  bg: "#faf0ee", icon: "✂" },
  "Archive":    { color: "var(--muted)", bg: "var(--accent-soft)", icon: "○" },
  "Sell":       { color: "#b08b57",      bg: "#fdf7ee", icon: "$" },
  "Donate":     { color: "#79806c",      bg: "#f3f4f1", icon: "◇" },
  "Release":    { color: "#a9796d",      bg: "#faf0ee", icon: "→" },
};

const ALL_VERDICTS: Verdict[] = ["Keep", "Style More", "Alter", "Archive", "Sell", "Donate", "Release"];

// ── Components ─────────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "Georgia, serif" }}>
          Item {current} of {total}
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontFamily: "Georgia, serif" }}>
          {Math.round(pct)}% complete
        </span>
      </div>
      <div style={{ height: 5, background: "var(--line)", borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "var(--accent)",
            borderRadius: 999,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

function ItemPreview({ item }: { item: ClosetItem }) {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
      {item.imageDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageDataUrl}
          alt={item.name}
          style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: "1px solid var(--line)" }}
        />
      ) : (
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            background: item.color,
            flexShrink: 0,
            border: "1px solid var(--line)",
          }}
        />
      )}
      <div style={{ minWidth: 0 }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--ink)", margin: "0 0 0.2rem", fontFamily: "Georgia, serif", lineHeight: 1.3 }}>
          {item.name}
        </h2>
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0, fontFamily: "Georgia, serif" }}>
          {item.category}
          {item.fabric ? ` · ${item.fabric}` : ""}
          {item.colorName ? ` · ${item.colorName}` : ""}
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0.25rem 0 0", fontFamily: "Georgia, serif" }}>
          Worn {item.worn ?? 0}×
          {item.worn === 0 ? " — never reached for" : item.worn < 3 ? " — rarely worn" : item.worn >= 10 ? " — wardrobe workhorse" : ""}
        </p>
      </div>
    </div>
  );
}

function VerdictCard({ result, isLoading }: { result: AuditResult | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div
        style={{
          padding: "1.25rem",
          borderRadius: 14,
          border: "1px solid var(--line)",
          background: "var(--accent-soft)",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <span style={{ animation: "auditPulse 1.4s ease-in-out infinite", fontSize: "1.1rem" }}>✦</span>
        <p style={{ fontSize: "0.85rem", color: "var(--accent)", fontStyle: "italic", margin: 0, fontFamily: "Georgia, serif" }}>
          Reviewing this piece…
        </p>
        <style>{`@keyframes auditPulse { 0%,100%{opacity:1} 50%{opacity:0.25} }`}</style>
      </div>
    );
  }

  if (!result) return null;

  const cfg = VERDICT_CONFIG[result.verdict] ?? VERDICT_CONFIG["Keep"];

  return (
    <div
      style={{
        padding: "1.25rem",
        borderRadius: 14,
        border: `1.5px solid ${cfg.color}`,
        background: cfg.bg,
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.1rem", color: cfg.color }}>{cfg.icon}</span>
        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: cfg.color, fontFamily: "Georgia, serif" }}>
          {result.verdict}
        </span>
        {result.confidence === "high" && (
          <span style={{ fontSize: "0.68rem", color: cfg.color, background: "rgba(255,255,255,0.6)", padding: "1px 7px", borderRadius: 999, border: `1px solid ${cfg.color}` }}>
            strong signal
          </span>
        )}
      </div>
      <p style={{ fontSize: "0.875rem", color: "var(--ink)", lineHeight: 1.75, margin: "0 0 0.7rem", fontFamily: "Georgia, serif" }}>
        {result.reason}
      </p>
      {result.tip && (
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.65, margin: 0, fontStyle: "italic", fontFamily: "Georgia, serif" }}>
          Tip: {result.tip}
        </p>
      )}
    </div>
  );
}

function VerdictButtons({
  current,
  onChoose,
  disabled,
}: {
  current: Verdict | null;
  onChoose: (v: Verdict) => void;
  disabled: boolean;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
      {ALL_VERDICTS.map((v) => {
        const cfg = VERDICT_CONFIG[v];
        const active = current === v;
        return (
          <button
            key={v}
            onClick={() => onChoose(v)}
            disabled={disabled}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: 999,
              border: `1.5px solid ${active ? cfg.color : "var(--line)"}`,
              background: active ? cfg.color : "transparent",
              color: active ? "white" : "var(--muted)",
              fontSize: "0.8rem",
              cursor: disabled ? "default" : "pointer",
              fontFamily: "Georgia, serif",
              transition: "all 0.15s",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}

// ── Summary screen ─────────────────────────────────────────────────────────────

function SummaryScreen({ audited, onRestart }: { audited: AuditedItem[]; onRestart: () => void }) {
  const counts: Record<Verdict, number> = {
    "Keep": 0, "Style More": 0, "Alter": 0, "Archive": 0, "Sell": 0, "Donate": 0, "Release": 0,
  };
  audited.forEach((a) => { counts[a.userChoice] = (counts[a.userChoice] ?? 0) + 1; });

  const toRelease = (counts["Sell"] ?? 0) + (counts["Donate"] ?? 0) + (counts["Release"] ?? 0);
  const toKeep = (counts["Keep"] ?? 0) + (counts["Style More"] ?? 0);
  const pctKept = audited.length > 0 ? Math.round((toKeep / audited.length) * 100) : 0;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "Georgia, serif" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>✦</div>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>
          Audit complete
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7 }}>
          You reviewed {audited.length} items. {toRelease > 0 ? `Releasing ${toRelease} piece${toRelease > 1 ? "s" : ""} opens space for things you'll actually reach for.` : "Your closet is already well-curated."}
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "0.75rem",
          marginBottom: "1.75rem",
        }}
      >
        {ALL_VERDICTS.filter((v) => counts[v] > 0).map((v) => {
          const cfg = VERDICT_CONFIG[v];
          return (
            <div
              key={v}
              style={{
                padding: "1rem",
                borderRadius: 12,
                background: cfg.bg,
                border: `1px solid ${cfg.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: cfg.color, fontWeight: 600 }}>{v}</span>
              <span style={{ fontSize: "1.35rem", fontWeight: 700, color: cfg.color }}>{counts[v]}</span>
            </div>
          );
        })}
      </div>

      {/* Health bar */}
      <div
        style={{
          padding: "1.25rem",
          borderRadius: 14,
          background: "var(--paper)",
          border: "1px solid var(--line)",
          marginBottom: "1.75rem",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.6rem" }}>
          Closet intentionality score
        </p>
        <div style={{ height: 8, background: "var(--line)", borderRadius: 999, overflow: "hidden", marginBottom: "0.5rem" }}>
          <div style={{ width: `${pctKept}%`, height: "100%", background: "var(--sage)", borderRadius: 999, transition: "width 0.6s ease" }} />
        </div>
        <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--sage)", margin: 0 }}>{pctKept}%</p>
        <p style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0.2rem 0 0" }}>of audited items are earning their place</p>
      </div>

      {/* Release tips */}
      {toRelease > 0 && (
        <div style={{ padding: "1rem 1.25rem", borderRadius: 12, background: "var(--accent-soft)", border: "1px solid var(--line)", marginBottom: "1.75rem" }}>
          <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.5rem" }}>
            Where to release your pieces
          </p>
          <ul style={{ margin: 0, padding: "0 0 0 1.1rem", fontSize: "0.82rem", color: "var(--ink)", lineHeight: 1.8 }}>
            {counts["Sell"] > 0 && <li><strong>Sell:</strong> Depop, Poshmark, ThredUp, or local Facebook Marketplace</li>}
            {counts["Donate"] > 0 && <li><strong>Donate:</strong> Dress for Success, local shelters, or Buy Nothing groups</li>}
            {counts["Release"] > 0 && <li><strong>Release:</strong> Community clothing swaps, friends, textile recycling bins</li>}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link
          href="/closet"
          style={{
            flex: 1,
            padding: "0.7rem 1.25rem",
            borderRadius: 999,
            background: "var(--accent)",
            color: "var(--paper)",
            textAlign: "center",
            fontSize: "0.9rem",
            textDecoration: "none",
            fontFamily: "Georgia, serif",
          }}
        >
          Back to My Closet
        </Link>
        <button
          onClick={onRestart}
          style={{
            padding: "0.7rem 1.25rem",
            borderRadius: 999,
            background: "transparent",
            color: "var(--muted)",
            border: "1px solid var(--line)",
            fontSize: "0.9rem",
            cursor: "pointer",
            fontFamily: "Georgia, serif",
          }}
        >
          Audit again
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const { closet, profile, updateClosetItem } = useStore();

  const [phase, setPhase] = useState<"intro" | "audit" | "summary">("intro");
  const [queue, setQueue] = useState<ClosetItem[]>([]);
  const [index, setIndex] = useState(0);
  const [currentResult, setCurrentResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userChoice, setUserChoice] = useState<Verdict | null>(null);
  const [audited, setAudited] = useState<AuditedItem[]>([]);
  const [noKeyError, setNoKeyError] = useState(false);

  const currentItem = queue[index] ?? null;

  const fetchVerdict = useCallback(async (item: ClosetItem) => {
    setCurrentResult(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/audit-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: {
            name: item.name,
            category: item.category,
            colorName: item.colorName,
            fabric: item.fabric,
            silhouette: item.silhouette,
            garmentType: item.garmentType,
            eraInfluence: item.eraInfluence,
            tags: item.tags,
            worn: item.worn,
            badge: item.badge,
            notes: item.notes,
          },
          profile: {
            styleKeywords: profile.styleKeywords,
            lifestyle: profile.lifestyle,
            sustainability: profile.sustainability,
            goalMode: profile.goalMode,
          },
          closetSize: closet.length,
        }),
      });
      if (res.status === 503) {
        setNoKeyError(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setCurrentResult(data);
        setUserChoice(data.verdict as Verdict);
      }
    } catch {
      // silently skip — user can still manually choose
    } finally {
      setIsLoading(false);
    }
  }, [profile, closet.length]);

  function startAudit(items: ClosetItem[]) {
    setAudited([]);
    setQueue(items);
    setIndex(0);
    setCurrentResult(null);
    setUserChoice(null);
    setPhase("audit");
    // fetch verdict for first item
    if (items[0]) fetchVerdict(items[0]);
  }

  function handleNext() {
    if (!currentItem || userChoice === null) return;

    // Apply choice to store
    const verdictToStatus: Record<Verdict, string> = {
      "Keep": "Keep",
      "Style More": "Style More",
      "Alter": "Alter",
      "Archive": "Archive",
      "Sell": "Sell",
      "Donate": "Donate",
      "Release": "Release",
    };
    const badgeColors: Record<Verdict, string> = {
      "Keep": "var(--sage)",
      "Style More": "var(--gold)",
      "Alter": "var(--rose)",
      "Archive": "var(--muted)",
      "Sell": "#b08b57",
      "Donate": "#79806c",
      "Release": "#a9796d",
    };
    updateClosetItem(currentItem.id, {
      badge: verdictToStatus[userChoice],
      badgeColor: badgeColors[userChoice],
    });

    const newAudited = [
      ...audited,
      { item: currentItem, result: currentResult!, userChoice },
    ];
    setAudited(newAudited);

    const nextIndex = index + 1;
    if (nextIndex >= queue.length) {
      setPhase("summary");
    } else {
      setIndex(nextIndex);
      setCurrentResult(null);
      setUserChoice(null);
      fetchVerdict(queue[nextIndex]);
    }
  }

  function handleSkip() {
    const nextIndex = index + 1;
    if (nextIndex >= queue.length) {
      setPhase("summary");
    } else {
      setIndex(nextIndex);
      setCurrentResult(null);
      setUserChoice(null);
      fetchVerdict(queue[nextIndex]);
    }
  }

  // ── Intro screen ─────────────────────────────────────────────────────────────

  if (phase === "intro") {
    const wornZero = closet.filter((i) => i.worn === 0).length;
    const wornLow = closet.filter((i) => i.worn > 0 && i.worn <= 3).length;

    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "2rem 1.5rem", fontFamily: "Georgia, serif" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-soft)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: "1.75rem", color: "var(--accent)" }}>
              ✦
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.6rem" }}>
              Closet Audit
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.75, maxWidth: 400, margin: "0 auto" }}>
              Your AI stylist will review each item — one at a time — and tell you honestly whether it's earning its place in your wardrobe.
            </p>
          </div>

          {/* Closet stats */}
          {closet.length > 0 && (
            <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: "1.75rem" }}>
              <p style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.85rem" }}>Your closet snapshot</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>{closet.length}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "0.15rem 0 0" }}>Total items</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--rose)", margin: 0 }}>{wornZero}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "0.15rem 0 0" }}>Never worn</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--gold)", margin: 0 }}>{wornLow}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "0.15rem 0 0" }}>Rarely worn</p>
                </div>
              </div>
            </div>
          )}

          {closet.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", background: "var(--paper)", borderRadius: 16, border: "1px solid var(--line)" }}>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.25rem" }}>
                Your closet is empty. Add some items first.
              </p>
              <Link href="/closet" style={{ padding: "0.65rem 1.5rem", borderRadius: 999, background: "var(--accent)", color: "var(--paper)", textDecoration: "none", fontSize: "0.9rem" }}>
                Go to My Closet
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.75rem" }}>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: "0 0 0.25rem", textAlign: "center" }}>Choose what to audit:</p>
                <button
                  onClick={() => startAudit([...closet].sort((a, b) => a.worn - b.worn))}
                  style={{ padding: "0.9rem 1.25rem", borderRadius: 14, border: "1.5px solid var(--accent)", background: "var(--accent)", color: "var(--paper)", fontSize: "0.9rem", cursor: "pointer", fontFamily: "Georgia, serif" }}
                >
                  Full audit — all {closet.length} items
                </button>
                {wornZero + wornLow > 0 && (
                  <button
                    onClick={() => startAudit(closet.filter((i) => i.worn <= 3).sort((a, b) => a.worn - b.worn))}
                    style={{ padding: "0.9rem 1.25rem", borderRadius: 14, border: "1.5px solid var(--line)", background: "var(--paper)", color: "var(--ink)", fontSize: "0.9rem", cursor: "pointer", fontFamily: "Georgia, serif" }}
                  >
                    Quick audit — {wornZero + wornLow} low-wear items only
                  </button>
                )}
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
                Your choices update each item's status in your closet. You can override the AI's suggestion at any time.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Summary screen ────────────────────────────────────────────────────────────

  if (phase === "summary") {
    return <SummaryScreen audited={audited} onRestart={() => setPhase("intro")} />;
  }

  // ── Audit screen ──────────────────────────────────────────────────────────────

  if (!currentItem) return null;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "1.5rem 1.25rem", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <button
            onClick={() => setPhase("intro")}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.82rem", fontFamily: "Georgia, serif", padding: "4px 0" }}
          >
            ← Back
          </button>
          <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
            {index + 1} / {queue.length}
          </span>
        </div>

        <ProgressBar current={index + 1} total={queue.length} />

        {/* No-key warning */}
        {noKeyError && (
          <div style={{ marginBottom: "1.25rem", padding: "0.85rem 1rem", borderRadius: 10, border: "1.5px solid var(--gold)", background: "#fdf8ee" }}>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#7a6030", lineHeight: 1.6, fontFamily: "Georgia, serif" }}>
              AI analysis unavailable — manually choose a status for each item below.
            </p>
          </div>
        )}

        {/* Item card */}
        <div
          style={{
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: 18,
            padding: "1.5rem",
            marginBottom: "1.25rem",
          }}
        >
          <ItemPreview item={currentItem} />

          {/* Tags */}
          {currentItem.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: "1.25rem" }}>
              {currentItem.tags.map((t) => (
                <span key={t} style={{ fontSize: "0.68rem", padding: "0.15rem 0.55rem", borderRadius: 999, background: "var(--accent-soft)", color: "var(--accent)" }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          <VerdictCard result={currentResult} isLoading={isLoading} />

          <VerdictButtons
            current={userChoice}
            onChoose={setUserChoice}
            disabled={isLoading}
          />

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.65rem" }}>
            <button
              onClick={handleNext}
              disabled={userChoice === null || isLoading}
              style={{
                flex: 1,
                padding: "0.7rem 1rem",
                borderRadius: 999,
                background: userChoice !== null && !isLoading ? "var(--accent)" : "var(--line)",
                color: userChoice !== null && !isLoading ? "var(--paper)" : "var(--muted)",
                border: "none",
                fontSize: "0.9rem",
                cursor: userChoice !== null && !isLoading ? "pointer" : "default",
                fontFamily: "Georgia, serif",
                transition: "background 0.15s",
              }}
            >
              {index + 1 === queue.length ? "Finish audit" : "Save & next →"}
            </button>
            <button
              onClick={handleSkip}
              style={{
                padding: "0.7rem 1.1rem",
                borderRadius: 999,
                background: "transparent",
                color: "var(--muted)",
                border: "1px solid var(--line)",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              Skip
            </button>
          </div>
        </div>

        {/* Audited so far */}
        {audited.length > 0 && (
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", textAlign: "center" }}>
            {audited.length} reviewed · {audited.filter((a) => ["Keep", "Style More"].includes(a.userChoice)).length} keeping · {audited.filter((a) => ["Sell", "Donate", "Release"].includes(a.userChoice)).length} releasing
          </p>
        )}
      </div>
    </div>
  );
}
