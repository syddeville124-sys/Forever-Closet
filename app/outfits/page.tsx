"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface OutfitItem {
  name: string;
  color: string;
}

interface Outfit {
  id: number;
  name: string;
  items: OutfitItem[];
  why: string;
  occasion: string;
  weather: string;
}

interface LayeringCombo {
  id: number;
  base: string;
  baseColor: string;
  layer: string;
  layerColor: string;
  result: string;
  explanation: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const OUTFITS: Outfit[] = [
  {
    id: 1,
    name: "Gothic Fairy Workday",
    items: [
      { name: "Empire Waist Dress", color: "#7a6e64" },
      { name: "Lace Insert Blouse", color: "#e8ddd2" },
      { name: "Linen Blazer", color: "var(--gold)" },
      { name: "Ankle Boots", color: "#4a3728" },
    ],
    why:
      "The empire waist dress grounds the silhouette in romantic drama, while the linen blazer bridges it into office-appropriate territory. Muted earth tones keep the gothic undertone subtle and wearable under fluorescent light.",
    occasion: "Work / Creative Office",
    weather: "Perfect for 68°F · Jacket optional",
  },
  {
    id: 2,
    name: "Romantic Office Hour",
    items: [
      { name: "Bateau Neck Sweater", color: "#b5a898" },
      { name: "Wide-Leg Trousers", color: "var(--ink)" },
      { name: "Beaded Scarf", color: "var(--rose)" },
    ],
    why:
      "Wide-leg trousers lend quiet authority, while the bateau neck sweater softens the silhouette without sacrificing structure. The beaded scarf injects just enough romantic eclecticism to feel personal rather than corporate.",
    occasion: "Office / Client Meeting",
    weather: "Ideal for 65–72°F · Light layering",
  },
  {
    id: 3,
    name: "Vintage Countryside",
    items: [
      { name: "Peasant Blouse", color: "var(--accent-soft)" },
      { name: "Bias-cut Midi Skirt", color: "var(--rose)" },
      { name: "Ankle Boots", color: "#4a3728" },
    ],
    why:
      "The peasant blouse and bias-cut skirt echo 1930s pastoral romanticism — two pieces that share a relaxed, fluid quality without competing. Ankle boots add a grounded practicality that keeps the look from floating away.",
    occasion: "Casual / Weekend",
    weather: "Excellent for 68°F · No jacket needed",
  },
];

const LAYERING_COMBOS: LayeringCombo[] = [
  {
    id: 1,
    base: "Slip Dress",
    baseColor: "#c9b99a",
    layer: "Lace Insert Blouse",
    layerColor: "#e8ddd2",
    result: "Evening-ready",
    explanation:
      "Slip dress + lace layer = evening-ready. The sheer texture against the satin-adjacent slip creates dimensional depth — a classic 90s-romantic technique that still photographs beautifully.",
  },
  {
    id: 2,
    base: "Corset Bodice",
    baseColor: "var(--accent)",
    layer: "Bateau Neck Sweater",
    layerColor: "#b5a898",
    result: "Modern contrast",
    explanation:
      "Corset bodice over a fine-knit sweater inverts the expected layering order and creates a silhouette tension that reads as intentional and editorial rather than accidental.",
  },
  {
    id: 3,
    base: "Empire Waist Dress",
    baseColor: "#7a6e64",
    layer: "Linen Blazer",
    layerColor: "var(--gold)",
    result: "Day-to-evening",
    explanation:
      "A structured blazer over a fluid empire-waist dress marries two opposing silhouette languages — the result is polish without rigidity, softness without formlessness.",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function WeatherBar() {
  return (
    <div
      className="flex flex-wrap items-center gap-4 px-5 py-3 rounded-xl mb-8"
      style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
      <span style={{ fontSize: "0.9rem", color: "var(--ink)" }}>
        <strong>Today in Brooklyn, NY:</strong>{" "}
        <span style={{ color: "var(--muted)" }}>68°F · Partly cloudy · Low humidity · Comfortable for layers</span>
      </span>
    </div>
  );
}

function Swatch({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: color,
          border: "1px solid var(--line)",
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{name}</span>
    </div>
  );
}

function OutfitCard({ outfit }: { outfit: Outfit }) {
  const [saved, setSaved] = useState(false);

  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Stacked swatches */}
      <div
        className="flex gap-1.5"
        style={{ padding: "0.75rem", background: "var(--accent-soft)", borderRadius: 10 }}
      >
        {outfit.items.map((item, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 64,
              borderRadius: 8,
              background: item.color,
              border: "1px solid rgba(255,255,255,0.25)",
            }}
            title={item.name}
          />
        ))}
      </div>

      {/* Name */}
      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
        {outfit.name}
      </h3>

      {/* Items list */}
      <div className="flex flex-col gap-1.5">
        {outfit.items.map((item, i) => (
          <Swatch key={i} color={item.color} name={item.name} />
        ))}
      </div>

      {/* Why this works */}
      <div>
        <p
          style={{
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "var(--muted)",
            marginBottom: "0.35rem",
          }}
        >
          Why this works
        </p>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.7 }}>{outfit.why}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span
          style={{
            fontSize: "0.7rem",
            padding: "0.2rem 0.65rem",
            borderRadius: 999,
            background: "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          {outfit.occasion}
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            padding: "0.2rem 0.65rem",
            borderRadius: 999,
            background: "#e8f0e8",
            color: "var(--sage)",
          }}
        >
          {outfit.weather}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => setSaved((v) => !v)}
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: 999,
            border: `1px solid ${saved ? "var(--sage)" : "var(--line)"}`,
            background: saved ? "#e8f0e8" : "transparent",
            color: saved ? "var(--sage)" : "var(--muted)",
            fontSize: "0.78rem",
            cursor: "pointer",
            fontFamily: "Georgia, serif",
            transition: "all 0.15s",
          }}
        >
          {saved ? "Saved ✓" : "Save Outfit"}
        </button>
        <button
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: 999,
            border: "1px solid var(--accent)",
            background: "transparent",
            color: "var(--accent)",
            fontSize: "0.78rem",
            cursor: "pointer",
            fontFamily: "Georgia, serif",
          }}
        >
          Ask AI to Adjust
        </button>
      </div>
    </div>
  );
}

function LayeringRow({ combo }: { combo: LayeringCombo }) {
  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: "1.25rem 1.5rem",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr auto",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      {/* Before */}
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 40,
            height: 52,
            borderRadius: 8,
            background: combo.baseColor,
            border: "1px solid var(--line)",
            flexShrink: 0,
          }}
        />
        <div>
          <p style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Base</p>
          <p style={{ fontSize: "0.82rem", color: "var(--ink)", fontWeight: 600 }}>{combo.base}</p>
        </div>
      </div>

      {/* Plus */}
      <span style={{ fontSize: "1.2rem", color: "var(--line)", fontWeight: 300 }}>+</span>

      {/* Layer */}
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 40,
            height: 52,
            borderRadius: 8,
            background: combo.layerColor,
            border: "1px solid var(--line)",
            flexShrink: 0,
          }}
        />
        <div>
          <p style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Layer</p>
          <p style={{ fontSize: "0.82rem", color: "var(--ink)", fontWeight: 600 }}>{combo.layer}</p>
        </div>
      </div>

      {/* Equals + result */}
      <div className="flex items-center gap-3">
        <span style={{ fontSize: "1.2rem", color: "var(--line)", fontWeight: 300 }}>=</span>
        <div>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.72rem",
              padding: "0.2rem 0.75rem",
              borderRadius: 999,
              background: "var(--accent-soft)",
              color: "var(--accent)",
              marginBottom: "0.35rem",
            }}
          >
            {combo.result}
          </span>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.6, maxWidth: 220 }}>{combo.explanation}</p>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OutfitsPage() {
  const [mood, setMood] = useState("");

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div className="mb-5">
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
              marginBottom: "0.25rem",
            }}
          >
            Outfit Builder
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            AI-generated outfits from your closet, tuned to your mood and the weather.
          </p>
        </div>

        {/* Weather bar */}
        <WeatherBar />

        {/* Mood input */}
        <div
          className="mb-8 p-5 rounded-2xl"
          style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        >
          <label
            style={{
              display: "block",
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "var(--muted)",
              marginBottom: "0.6rem",
            }}
          >
            How do you want to feel today?
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="goth fairy, work appropriate…"
              style={{
                flex: 1,
                padding: "0.65rem 1rem",
                borderRadius: 999,
                border: "1.5px solid var(--line)",
                background: "var(--bg)",
                color: "var(--ink)",
                fontSize: "0.9rem",
                fontFamily: "Georgia, serif",
                outline: "none",
              }}
            />
            <button
              style={{
                padding: "0.65rem 1.5rem",
                borderRadius: 999,
                background: "var(--accent)",
                color: "var(--paper)",
                border: "none",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
                whiteSpace: "nowrap",
              }}
            >
              Generate Outfits
            </button>
          </div>
        </div>

        {/* Outfit boards */}
        <div className="mb-10">
          <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: "1.25rem",
            }}
          >
            Generated for Today
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {OUTFITS.map((outfit) => (
              <OutfitCard key={outfit.id} outfit={outfit} />
            ))}
          </div>
        </div>

        {/* Layering intelligence */}
        <div className="mb-10">
          <div className="mb-4">
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.2rem" }}>
              Layering Intelligence
            </h2>
            <p style={{ fontSize: "0.83rem", color: "var(--muted)" }}>
              Combinations hiding in your closet — unlocked by layering logic.
            </p>
          </div>

          {/* Desktop layout — full rows; on small screens scroll horizontally */}
          <div className="flex flex-col gap-3">
            {LAYERING_COMBOS.map((combo) => (
              <div key={combo.id} className="overflow-x-auto">
                <LayeringRow combo={combo} />
              </div>
            ))}
          </div>
        </div>

        {/* Weather note card */}
        <div
          className="flex gap-4 items-start rounded-2xl p-5"
          style={{ background: "var(--paper)", border: "1.5px solid var(--line)" }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "var(--accent-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.4rem" }}>
              Weather Note for Today
            </p>
            <p style={{ fontSize: "0.83rem", color: "var(--muted)", lineHeight: 1.7 }}>
              At 68°F with partly cloudy skies, today is excellent for mid-weight layering. However, consider avoiding{" "}
              <strong style={{ color: "var(--ink)" }}>heavy velvet, thick brocade, and double-lined wool</strong> — these fabrics
              trap heat and may feel stifling by midday. If rain is possible later, steer clear of raw silk and unwashed linen
              for an all-day look.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
