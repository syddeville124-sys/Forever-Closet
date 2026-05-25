"use client";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type OptStatus = "Keep" | "Style More" | "Alter" | "Donate" | "Sell" | "Release";
type Category = "All" | "Tops" | "Bottoms" | "Dresses" | "Outerwear" | "Accessories";

interface ClosetItem {
  id: number;
  name: string;
  tags: string[];
  category: Exclude<Category, "All">;
  status: OptStatus;
  swatchColor: string;
  aiReason: string;
  actions: OptStatus[];
}

// ── Data ───────────────────────────────────────────────────────────────────
const summaryStats: { label: string; count: number; color: string; bg: string }[] = [
  { label: "Total Items", count: 24, color: "var(--ink)", bg: "var(--paper)" },
  { label: "Keep", count: 8, color: "var(--sage)", bg: "#f2f4f0" },
  { label: "Style More", count: 4, color: "var(--gold)", bg: "#faf5eb" },
  { label: "Alter", count: 3, color: "var(--rose)", bg: "#faf0ee" },
  { label: "Donate", count: 2, color: "var(--muted)", bg: "var(--accent-soft)" },
  { label: "Sell", count: 2, color: "var(--muted)", bg: "var(--accent-soft)" },
  { label: "Release", count: 1, color: "var(--muted)", bg: "var(--accent-soft)" },
];

const closetItems: ClosetItem[] = [
  {
    id: 1,
    name: "Ivory Linen Button-Down",
    tags: ["linen", "casual", "workwear", "neutral"],
    category: "Tops",
    status: "Keep",
    swatchColor: "#f5f0e6",
    aiReason: "Worn 22 times this season — it anchors three of your most-used outfit formulas and layers beautifully with almost everything you own.",
    actions: ["Keep", "Style More"],
  },
  {
    id: 2,
    name: "Blush Floral Wrap Blouse",
    tags: ["silk-blend", "romantic", "occasion"],
    category: "Tops",
    status: "Style More",
    swatchColor: "#f0d4cc",
    aiReason: "This overlaps with 3 similar romantic tops you reach for more often — try pairing it with your wide-leg trousers or a structured cardigan to give it a fresh context.",
    actions: ["Keep", "Style More", "Donate", "Sell"],
  },
  {
    id: 3,
    name: "Caramel Leather Belt",
    tags: ["leather", "accessory", "grounding"],
    category: "Accessories",
    status: "Keep",
    swatchColor: "#c4884a",
    aiReason: "A foundational grounding piece that adds definition to 9 items in your closet — this is earning its keep many times over.",
    actions: ["Keep"],
  },
  {
    id: 4,
    name: "Sequin Statement Blazer",
    tags: ["formal", "evening", "statement"],
    category: "Outerwear",
    status: "Sell",
    swatchColor: "#b0a88a",
    aiReason: "Worn once in 18 months — your lifestyle has shifted toward relaxed elegance. This piece may find more love with someone whose wardrobe is built for evenings out.",
    actions: ["Sell", "Donate", "Keep"],
  },
  {
    id: 5,
    name: "Wide-Leg Wool Trousers",
    tags: ["wool", "tailored", "workwear", "autumnal"],
    category: "Bottoms",
    status: "Keep",
    swatchColor: "#7a6e5e",
    aiReason: "Your most-styled bottom — worn 28 times and compatible with 11 tops in your closet. A true wardrobe workhorse.",
    actions: ["Keep", "Style More"],
  },
  {
    id: 6,
    name: "Vintage Denim Jacket",
    tags: ["denim", "casual", "layering"],
    category: "Outerwear",
    status: "Alter",
    swatchColor: "#7a8fa6",
    aiReason: "You love the piece but wear it rarely — a slight sleeve shortening and replacing the buttons could make this feel brand-new and much more wearable.",
    actions: ["Alter", "Keep", "Donate"],
  },
  {
    id: 7,
    name: "Bias-Cut Midi Skirt",
    tags: ["satin", "fluid", "romantic", "evening"],
    category: "Bottoms",
    status: "Keep",
    swatchColor: "#c4a882",
    aiReason: "Your most-worn piece at 34× — it works across casual, smart-casual, and elevated occasions with minimal effort. This is the heart of your wardrobe.",
    actions: ["Keep"],
  },
  {
    id: 8,
    name: "Oversized Graphic Tee",
    tags: ["cotton", "casual", "streetwear"],
    category: "Tops",
    status: "Release",
    swatchColor: "#d4c8b8",
    aiReason: "This sits outside your current aesthetic direction — releasing it (gift, swap, or donate) creates space and mental clarity without any real loss.",
    actions: ["Donate", "Sell", "Release", "Keep"],
  },
];

const categoryHealthData = [
  { label: "Tops", score: 72, note: "Slightly oversaturated" },
  { label: "Bottoms", score: 90, note: "Healthy balance" },
  { label: "Dresses", score: 85, note: "Strong & versatile" },
  { label: "Outerwear", score: 55, note: "Needs structured piece" },
  { label: "Accessories", score: 60, note: "Low coverage" },
  { label: "Shoes", score: 65, note: "Missing everyday option" },
];

// ── Helper: status colors ──────────────────────────────────────────────────
function statusStyle(status: OptStatus): { color: string; bg: string; border: string } {
  switch (status) {
    case "Keep":
      return { color: "var(--sage)", bg: "#f0f2ee", border: "var(--sage)" };
    case "Style More":
      return { color: "var(--gold)", bg: "#faf5eb", border: "var(--gold)" };
    case "Alter":
      return { color: "var(--rose)", bg: "#faf0ee", border: "var(--rose)" };
    default:
      return { color: "var(--muted)", bg: "var(--accent-soft)", border: "var(--line)" };
  }
}

function actionBtnStyle(action: OptStatus) {
  const s = statusStyle(action);
  return {
    color: s.color,
    border: `1px solid ${s.border}`,
    background: s.bg,
    borderRadius: "999px",
    padding: "4px 14px",
    fontSize: "0.75rem",
    fontFamily: "Georgia, serif",
    cursor: "pointer",
    transition: "opacity .15s",
  } as React.CSSProperties;
}

// ── Subcomponents ──────────────────────────────────────────────────────────
function StatCard({ label, count, color, bg }: (typeof summaryStats)[0]) {
  return (
    <div
      className="rounded-2xl px-5 py-4 flex flex-col items-center gap-1 min-w-[90px]"
      style={{ background: bg, border: "1px solid var(--line)" }}
    >
      <span className="text-2xl font-bold" style={{ color, fontFamily: "Georgia, serif" }}>
        {count}
      </span>
      <span className="text-xs font-sans uppercase tracking-wide" style={{ color: "var(--muted)" }}>
        {label}
      </span>
    </div>
  );
}

function ItemCard({ item }: { item: ClosetItem }) {
  const s = statusStyle(item.status);
  return (
    <div
      className="rounded-2xl p-5 flex gap-4 items-start"
      style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
    >
      {/* Swatch */}
      <div
        className="w-14 h-16 rounded-xl shrink-0 mt-0.5"
        style={{ background: item.swatchColor, border: "1px solid var(--line)" }}
        aria-label="Colour swatch"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
          <h3 className="text-base font-semibold" style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}>
            {item.name}
          </h3>
          {/* Status badge */}
          <span
            className="shrink-0 rounded-full px-3 py-0.5 text-xs font-sans"
            style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
          >
            {item.status}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {item.tags.map((t) => (
            <span
              key={t}
              className="rounded-full px-2.5 py-0.5 text-xs font-sans"
              style={{ background: "var(--accent-soft)", color: "var(--muted)" }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* AI reason */}
        <p className="text-sm italic mb-3" style={{ color: "var(--muted)", lineHeight: "1.6" }}>
          &ldquo;{item.aiReason}&rdquo;
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {item.actions.map((a) => (
            <button key={a} style={actionBtnStyle(a)}>
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function OptimizePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const categories: Category[] = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Accessories"];

  const filtered =
    activeCategory === "All"
      ? closetItems
      : closetItems.filter((i) => i.category === activeCategory);

  const overallHealth = 74;

  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
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
            Closet Optimization
          </h1>
          <p className="text-lg italic" style={{ color: "var(--muted)", fontFamily: "Georgia, serif" }}>
            Shop your closet first.
          </p>
        </div>

        {/* ── Summary Stats ── */}
        <div className="flex flex-wrap gap-3 mb-10">
          {summaryStats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex flex-wrap gap-2 mb-7">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full px-5 py-1.5 text-sm font-sans transition-colors"
              style={{
                background: activeCategory === cat ? "var(--accent)" : "var(--paper)",
                color: activeCategory === cat ? "#fff" : "var(--muted)",
                border: `1px solid ${activeCategory === cat ? "var(--accent)" : "var(--line)"}`,
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Item List ── */}
        <div className="flex flex-col gap-4 mb-12">
          {filtered.length > 0 ? (
            filtered.map((item) => <ItemCard key={item.id} item={item} />)
          ) : (
            <p className="py-10 text-center italic" style={{ color: "var(--muted)" }}>
              No items in this category yet.
            </p>
          )}
        </div>

        {/* ── Closet Health Score Card ── */}
        <div
          className="rounded-2xl p-7 mb-8"
          style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        >
          <h2
            className="text-xl font-semibold mb-1"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
          >
            Closet Health Score
          </h2>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            Based on versatility, frequency of wear, and coverage across categories.
          </p>

          {/* Overall bar */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className="text-4xl font-bold"
              style={{ color: "var(--accent)", fontFamily: "Georgia, serif" }}
            >
              {overallHealth}%
            </span>
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "var(--accent-soft)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${overallHealth}%`, background: "var(--accent)" }}
              />
            </div>
            <span className="text-sm font-sans" style={{ color: "var(--muted)" }}>Good</span>
          </div>

          {/* Category breakdown */}
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
            {categoryHealthData.map((cat) => (
              <div key={cat.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm" style={{ color: "var(--ink)" }}>{cat.label}</span>
                  <span className="text-sm font-sans" style={{ color: "var(--muted)" }}>
                    {cat.score}% · {cat.note}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--accent-soft)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${cat.score}%`,
                      background: cat.score >= 80 ? "var(--sage)" : cat.score >= 65 ? "var(--gold)" : "var(--rose)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Compassionate Note ── */}
        <div
          className="rounded-2xl px-7 py-6"
          style={{
            background: "var(--accent-soft)",
            borderLeft: "4px solid var(--accent)",
          }}
        >
          <p
            className="text-base italic leading-relaxed"
            style={{ color: "var(--accent)", fontFamily: "Georgia, serif" }}
          >
            No shame — every piece has a story. We&apos;re here to help you build a wardrobe that works for your life <em>today</em>.
            Letting go of something doesn&apos;t mean it wasn&apos;t worth having. It means you&apos;re growing.
          </p>
        </div>

      </div>
    </div>
  );
}
