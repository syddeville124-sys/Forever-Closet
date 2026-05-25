"use client";

// ── Types ──────────────────────────────────────────────────────────────────
interface CpwItem {
  name: string;
  purchasePrice: number;
  timesWorn: number;
  costPerWear: number;
}

interface CategorySaturation {
  label: string;
  count: number;
  max: number;
  status: "Oversaturated" | "Healthy" | "Low";
}

// ── Data ───────────────────────────────────────────────────────────────────
const cpwItems: CpwItem[] = [
  { name: "Bias-cut Midi Skirt",         purchasePrice: 68,  timesWorn: 34, costPerWear: 2.00 },
  { name: "Wide-Leg Wool Trousers",       purchasePrice: 110, timesWorn: 28, costPerWear: 3.93 },
  { name: "Ivory Linen Button-Down",      purchasePrice: 55,  timesWorn: 22, costPerWear: 2.50 },
  { name: "Ankle Boots",                  purchasePrice: 145, timesWorn: 30, costPerWear: 4.83 },
  { name: "Bateau Neck Sweater",          purchasePrice: 88,  timesWorn: 14, costPerWear: 6.29 },
  { name: "Fit-and-Flare Dress",          purchasePrice: 72,  timesWorn: 9,  costPerWear: 8.00 },
  { name: "Blush Floral Wrap Blouse",     purchasePrice: 58,  timesWorn: 6,  costPerWear: 9.67 },
  { name: "Sequin Statement Blazer",      purchasePrice: 220, timesWorn: 1,  costPerWear: 220.00 },
];

const saturationData: CategorySaturation[] = [
  { label: "Tops",        count: 9, max: 10, status: "Oversaturated" },
  { label: "Bottoms",     count: 3, max: 10, status: "Healthy" },
  { label: "Dresses",     count: 5, max: 10, status: "Healthy" },
  { label: "Outerwear",   count: 2, max: 10, status: "Low" },
  { label: "Accessories", count: 6, max: 10, status: "Healthy" },
  { label: "Shoes",       count: 3, max: 10, status: "Low" },
];

const insightCards = [
  {
    icon: "↑",
    headline: "You consistently buy romantic tops.",
    body: "6 of your 9 tops share the same romantic, fluid aesthetic — they're beautiful but redundant. Consider grounding bottoms or structured outerwear next to add contrast and expand your outfit range.",
    color: "var(--rose)",
    bg: "#faf0ee",
  },
  {
    icon: "✦",
    headline: "Natural fibers make up 60% of your wardrobe.",
    body: "Linen, wool, cotton, and silk-blend pieces dominate your closet. That's a strong sustainability and longevity score — natural fibers age better, feel better, and hold their value on the resale market.",
    color: "var(--sage)",
    bg: "#f0f2ee",
  },
  {
    icon: "◇",
    headline: "Your average item cost is $96.",
    body: "You tend to invest in mid-range pieces, which is a sound strategy. The outlier is the Sequin Blazer at $220 — its cost-per-wear of $220 is a reminder that occasion-specific pieces need to earn their keep.",
    color: "var(--gold)",
    bg: "#faf5eb",
  },
  {
    icon: "→",
    headline: "Your most recent 5 purchases are all in Tops.",
    body: "Recent spending is concentrated in an already saturated category. A short pause on tops and a deliberate investment in outerwear would shift this from lopsided to balanced.",
    color: "var(--muted)",
    bg: "var(--accent-soft)",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function saturationColor(status: CategorySaturation["status"]): { bar: string; text: string; bg: string } {
  if (status === "Oversaturated") return { bar: "var(--rose)",  text: "var(--rose)",  bg: "#faf0ee" };
  if (status === "Healthy")       return { bar: "var(--sage)",  text: "var(--sage)",  bg: "#f0f2ee" };
  return                                 { bar: "var(--gold)",  text: "var(--gold)",  bg: "#faf5eb" };
}

function formatCpw(val: number): string {
  return val < 10 ? `$${val.toFixed(2)}` : `$${Math.round(val)}`;
}

function cpwColor(val: number): string {
  if (val <= 5)  return "var(--sage)";
  if (val <= 15) return "var(--gold)";
  return "var(--rose)";
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function EconomicsPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-4 py-10">

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
            Closet Economics
          </h1>
          <p className="text-lg italic" style={{ color: "var(--muted)", fontFamily: "Georgia, serif" }}>
            Understand your wardrobe investment.
          </p>
        </div>

        {/* ── Key Metrics ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-11">
          <MetricCard
            label="Total Wardrobe Value"
            value="$2,400"
            sub="across 24 items"
            valueColor="var(--ink)"
          />
          <MetricCard
            label="Cost Per Wear Avg."
            value="$4.20"
            sub="across all worn pieces"
            valueColor="var(--sage)"
          />
          <MetricCard
            label="Most-Worn Piece"
            value="34×"
            sub="Bias-cut Midi Skirt"
            valueColor="var(--gold)"
          />
          <MetricCard
            label="Least-Used Piece"
            value="1×"
            sub="Sequin Statement Blazer"
            valueColor="var(--rose)"
          />
        </div>

        {/* ── Category Saturation Chart ── */}
        <section
          className="rounded-2xl p-7 mb-8"
          style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        >
          <h2
            className="text-xl font-semibold mb-1"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
          >
            Category Saturation
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            How your wardrobe investment is distributed across categories — and where it&apos;s out of balance.
          </p>

          <div className="flex flex-col gap-5">
            {saturationData.map((cat) => {
              const col = saturationColor(cat.status);
              const pct = Math.round((cat.count / cat.max) * 100);
              return (
                <div key={cat.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium w-24" style={{ color: "var(--ink)" }}>
                        {cat.label}
                      </span>
                      <span
                        className="text-xs rounded-full px-2.5 py-0.5 font-sans"
                        style={{ background: col.bg, color: col.text }}
                      >
                        {cat.status}
                      </span>
                    </div>
                    <span className="text-sm font-sans" style={{ color: "var(--muted)" }}>
                      {cat.count} {cat.count === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <div
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{ background: "var(--accent-soft)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: col.bar }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-5 mt-6 pt-5" style={{ borderTop: "1px solid var(--line)" }}>
            {(["Oversaturated", "Healthy", "Low"] as const).map((s) => {
              const col = saturationColor(s);
              return (
                <div key={s} className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: col.bar }}
                  />
                  <span className="text-xs font-sans" style={{ color: "var(--muted)" }}>{s}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Spending Pattern Insights ── */}
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-5"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
          >
            Spending Pattern Insights
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {insightCards.map((card) => (
              <div
                key={card.headline}
                className="rounded-2xl p-5"
                style={{ background: card.bg, border: `1px solid var(--line)` }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span
                    className="text-lg leading-none mt-0.5 font-sans shrink-0"
                    style={{ color: card.color }}
                  >
                    {card.icon}
                  </span>
                  <h3
                    className="text-sm font-semibold leading-snug"
                    style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
                  >
                    {card.headline}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed pl-7" style={{ color: "var(--muted)" }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cost-Per-Wear Table ── */}
        <section
          className="rounded-2xl overflow-hidden mb-8"
          style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        >
          <div className="px-7 py-5" style={{ borderBottom: "1px solid var(--line)" }}>
            <h2
              className="text-xl font-semibold mb-1"
              style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
            >
              Cost-Per-Wear Breakdown
            </h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              The true value of each item — sorted by how hard it&apos;s working for you.
            </p>
          </div>

          {/* Table header */}
          <div
            className="grid grid-cols-4 px-7 py-3 font-sans text-xs uppercase tracking-widest"
            style={{ color: "var(--muted)", borderBottom: "1px solid var(--line)", letterSpacing: "0.08em" }}
          >
            <span className="col-span-2">Item</span>
            <span className="text-right">Paid</span>
            <span className="text-right">CPW</span>
          </div>

          {cpwItems.map((item, idx) => (
            <div
              key={item.name}
              className="grid grid-cols-4 px-7 py-4 items-center"
              style={{
                borderBottom: idx < cpwItems.length - 1 ? "1px solid var(--line)" : "none",
                background: idx % 2 === 0 ? "transparent" : "rgba(248,245,240,0.5)",
              }}
            >
              <div className="col-span-2 pr-4">
                <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                  {item.name}
                </p>
                <p className="text-xs font-sans mt-0.5" style={{ color: "var(--muted)" }}>
                  worn {item.timesWorn}×
                </p>
              </div>
              <p className="text-sm text-right font-sans" style={{ color: "var(--muted)" }}>
                ${item.purchasePrice}
              </p>
              <div className="text-right">
                <span
                  className="text-sm font-semibold font-sans"
                  style={{ color: cpwColor(item.costPerWear) }}
                >
                  {formatCpw(item.costPerWear)}
                </span>
              </div>
            </div>
          ))}

          {/* CPW key */}
          <div
            className="px-7 py-4 flex flex-wrap gap-6"
            style={{ borderTop: "1px solid var(--line)", background: "var(--accent-soft)" }}
          >
            {([["Under $5", "Excellent", "var(--sage)"], ["$5–$15", "Good", "var(--gold)"], ["Over $15", "Review", "var(--rose)"]] as const).map(
              ([range, label, color]) => (
                <div key={range} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
                  <span className="text-xs font-sans" style={{ color: "var(--muted)" }}>
                    {range} — {label}
                  </span>
                </div>
              )
            )}
          </div>
        </section>

        {/* ── Gap Identification Card ── */}
        <section
          className="rounded-2xl p-7"
          style={{
            background: "var(--paper)",
            borderLeft: "4px solid var(--gold)",
            border: "1px solid var(--line)",
            borderLeftWidth: 4,
            borderLeftColor: "var(--gold)",
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl" style={{ color: "var(--gold)" }}>◈</span>
            <div>
              <h2
                className="text-xl font-semibold mb-1"
                style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
              >
                Wardrobe Gap Identification
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Based on your closet economics and usage patterns.
              </p>
            </div>
          </div>

          <p className="text-base leading-relaxed mb-5" style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}>
            Your closet has strong statement dresses and excellent romantic tops, but shows notable
            gaps in three foundational categories:
          </p>

          <div className="flex flex-col gap-3">
            {[
              { gap: "Structured outerwear", detail: "1 piece — your Linen Blazer is seasonal only; you have nothing for cooler months or rain.", urgency: "High" },
              { gap: "Versatile everyday shoes", detail: "1 pair — Ankle Boots carry too much of the load; a simple leather flat or loafer would triple your outfit options.", urgency: "Medium" },
              { gap: "Dark grounding accessories", detail: "A dark belt and a neutral scarf are missing. These are force-multiplier pieces that create definition and finish across dozens of outfits.", urgency: "Medium" },
            ].map((item) => (
              <div
                key={item.gap}
                className="flex items-start gap-4 rounded-xl px-5 py-4"
                style={{ background: "var(--accent-soft)" }}
              >
                <span
                  className="shrink-0 text-xs font-sans font-medium rounded-full px-2.5 py-0.5 mt-0.5"
                  style={{
                    background: item.urgency === "High" ? "#faf0ee" : "#faf5eb",
                    color: item.urgency === "High" ? "var(--rose)" : "var(--gold)",
                    border: `1px solid ${item.urgency === "High" ? "var(--rose)" : "var(--gold)"}`,
                  }}
                >
                  {item.urgency}
                </span>
                <div>
                  <p
                    className="text-sm font-semibold mb-0.5"
                    style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
                  >
                    {item.gap}
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  sub,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  valueColor: string;
}) {
  return (
    <div
      className="rounded-2xl px-5 py-5 flex flex-col gap-1"
      style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
    >
      <p className="text-xs uppercase tracking-widest font-sans leading-snug" style={{ color: "var(--muted)", letterSpacing: "0.09em" }}>
        {label}
      </p>
      <p className="text-3xl font-bold leading-tight" style={{ color: valueColor, fontFamily: "Georgia, serif" }}>
        {value}
      </p>
      <p className="text-xs font-sans" style={{ color: "var(--muted)" }}>
        {sub}
      </p>
    </div>
  );
}
