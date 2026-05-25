// No "use client" needed — fully static display page

// ── Types ──────────────────────────────────────────────────────────────────
type HealthStatus = "Healthy" | "Low" | "Oversaturated";

interface FoundationRow {
  category: string;
  recommended: string;
  youHave: number;
  status: HealthStatus;
  action: string;
}

interface SubScore {
  label: string;
  score: number;
}

interface HealthGroup {
  status: HealthStatus | "Underused" | "Mismatch";
  items: string[];
  color: string;
  bg: string;
  description: string;
}

interface NextPurchase {
  item: string;
  why: string;
  sourcing: string;
  color: string;
}

// ── Data ───────────────────────────────────────────────────────────────────
const overallScore = 74;

const subScores: SubScore[] = [
  { label: "Versatility",         score: 80 },
  { label: "Layering Potential",  score: 70 },
  { label: "Climate Suitability", score: 85 },
  { label: "Occasion Coverage",   score: 65 },
  { label: "Color Harmony",       score: 78 },
  { label: "Silhouette Balance",  score: 70 },
  { label: "Comfort & Fit",       score: 82 },
];

const foundationRows: FoundationRow[] = [
  { category: "Everyday Tops",      recommended: "3–4",  youHave: 5, status: "Oversaturated", action: "Review — release 1–2 redundant pieces" },
  { category: "Bottoms",            recommended: "3–4",  youHave: 3, status: "Healthy",        action: "Maintain current balance" },
  { category: "Layering Pieces",    recommended: "2–3",  youHave: 2, status: "Healthy",        action: "One more transitional cardigan recommended" },
  { category: "Dresses",            recommended: "2–3",  youHave: 5, status: "Oversaturated",  action: "Style more before adding any new dresses" },
  { category: "Shoes",              recommended: "3–4",  youHave: 2, status: "Low",            action: "Add 1 everyday flat or loafer" },
  { category: "Accessories",        recommended: "4–6",  youHave: 3, status: "Low",            action: "Priority: dark belt, lightweight scarf" },
  { category: "Outerwear",          recommended: "2–3",  youHave: 1, status: "Low",            action: "Add 1 structured all-season coat" },
  { category: "Elevated/Event",     recommended: "1–2",  youHave: 2, status: "Healthy",        action: "Well-covered for your current lifestyle" },
];

const healthGroups: HealthGroup[] = [
  {
    status: "Healthy",
    color: "var(--sage)",
    bg: "#f0f2ee",
    description: "Well-balanced coverage that serves your lifestyle.",
    items: ["Wide-Leg Wool Trousers", "Bias-cut Midi Skirt", "Ivory Linen Button-Down", "Bateau Neck Sweater", "Ankle Boots", "Fit-and-Flare Dress", "Empire Waist Dress"],
  },
  {
    status: "Low",
    color: "var(--gold)",
    bg: "#faf5eb",
    description: "Missing foundational pieces — small gaps with big impact.",
    items: ["Structured outerwear (all-season coat)", "Everyday flat shoes or loafers", "Dark grounding belt", "Lightweight neutral scarf"],
  },
  {
    status: "Oversaturated",
    color: "var(--rose)",
    bg: "#faf0ee",
    description: "More than you need — consider releasing or styling differently.",
    items: ["Blush Floral Wrap Blouse (overlaps with 3 similar tops)", "Slip Dress (similar role to Midi Skirt)", "Puff Sleeve Top (rarely worn, fits narrow occasions)"],
  },
  {
    status: "Underused",
    color: "var(--muted)",
    bg: "var(--accent-soft)",
    description: "Pieces with untapped potential — worthy of more intentional styling.",
    items: ["Vintage Denim Jacket (alter candidate)", "Beaded Scarf (could anchor 4 more looks)", "Corset Bodice (underused outside evenings)"],
  },
  {
    status: "Mismatch",
    color: "var(--accent)",
    bg: "rgba(111,79,63,0.08)",
    description: "These fall outside your current aesthetic direction.",
    items: ["Sequin Statement Blazer (high formality; low lifestyle match)", "Oversized Graphic Tee (aesthetic outlier)"],
  },
];

const nextPurchases: NextPurchase[] = [
  {
    item: "Structured All-Season Coat",
    why: "Your single highest-impact gap. A camel, slate, or dark olive mid-length coat would extend every existing outfit into cooler months and increase your total outfit combinations by an estimated 40%.",
    sourcing: "Check thrift stores and consignment first — coats hold their shape well. Look for wool or wool-blend. Avoid polyester.",
    color: "var(--sage)",
  },
  {
    item: "Simple Leather Flat or Loafer",
    why: "Ankle Boots are doing all the work. A low, polished flat in tan, cognac, or black would pair with skirts, trousers, and dresses that the boots currently can't — expanding your daily-wear range significantly.",
    sourcing: "Thrift shops regularly stock quality leather shoes in excellent condition. Focus on real leather for longevity.",
    color: "var(--gold)",
  },
  {
    item: "Dark Grounding Belt (1.5\"–2\" width)",
    why: "A dark brown or black belt in a medium-to-wide width is a force-multiplier accessory — it defines the waist, grounds soft silhouettes, and transitions fluid dresses into more daytime-appropriate territory. Under $30 at most thrift stores.",
    sourcing: "One of the best thrift finds. Look for real leather, a simple buckle, and a medium width. No logos needed.",
    color: "var(--accent)",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function statusStyle(status: HealthStatus): { color: string; bg: string } {
  if (status === "Healthy")       return { color: "var(--sage)", bg: "#f0f2ee" };
  if (status === "Low")           return { color: "var(--gold)", bg: "#faf5eb" };
  return                                 { color: "var(--rose)", bg: "#faf0ee" };
}

function subScoreColor(score: number): string {
  if (score >= 80) return "var(--sage)";
  if (score >= 70) return "var(--gold)";
  return "var(--rose)";
}

// ── Circular Progress (CSS only) ───────────────────────────────────────────
function CircularScore({ score }: { score: number }) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 168, height: 168 }}>
        <svg width="168" height="168" viewBox="0 0 168 168" style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx="84" cy="84" r={radius}
            fill="none"
            stroke="var(--accent-soft)"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="84" cy="84" r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        {/* Label */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ pointerEvents: "none" }}
        >
          <span
            className="text-4xl font-bold leading-none"
            style={{ color: "var(--accent)", fontFamily: "Georgia, serif" }}
          >
            {score}
          </span>
          <span className="text-sm mt-1 font-sans" style={{ color: "var(--muted)" }}>
            / 100
          </span>
        </div>
      </div>
      <p
        className="mt-3 text-sm italic"
        style={{ color: "var(--muted)", fontFamily: "Georgia, serif" }}
      >
        Functionality Score
      </p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function SeedClosetPage() {
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
            Seed Closet Framework
          </h1>
          <p className="text-lg italic" style={{ color: "var(--muted)", fontFamily: "Georgia, serif" }}>
            Build a functional foundation before expanding.
          </p>
        </div>

        {/* ── Score + Sub-scores ── */}
        <section
          className="rounded-2xl p-7 mb-8"
          style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <CircularScore score={overallScore} />

            <div className="flex-1">
              <h2
                className="text-xl font-semibold mb-1"
                style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
              >
                Closet Functionality Score
              </h2>
              <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
                A composite measure of how well your wardrobe covers all lifestyle and styling dimensions.
              </p>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {subScores.map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm" style={{ color: "var(--ink)" }}>{s.label}</span>
                      <span
                        className="text-sm font-semibold font-sans"
                        style={{ color: subScoreColor(s.score) }}
                      >
                        {s.score}
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: "var(--accent-soft)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.score}%`,
                          background: subScoreColor(s.score),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Foundation Coverage Table ── */}
        <section
          className="rounded-2xl overflow-hidden mb-8"
          style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        >
          <div className="px-7 py-5" style={{ borderBottom: "1px solid var(--line)" }}>
            <h2
              className="text-xl font-semibold mb-1"
              style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
            >
              Foundation Coverage
            </h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              How your closet measures against a functional seed wardrobe for your lifestyle and climate.
            </p>
          </div>

          {/* Table header */}
          <div
            className="hidden md:grid grid-cols-12 px-7 py-3 font-sans text-xs uppercase tracking-widest"
            style={{ color: "var(--muted)", borderBottom: "1px solid var(--line)", letterSpacing: "0.07em" }}
          >
            <span className="col-span-3">Category</span>
            <span className="col-span-2 text-center">Recommended</span>
            <span className="col-span-1 text-center">You Have</span>
            <span className="col-span-2 text-center">Status</span>
            <span className="col-span-4">Action</span>
          </div>

          {foundationRows.map((row, idx) => {
            const st = statusStyle(row.status);
            return (
              <div
                key={row.category}
                className="grid grid-cols-1 md:grid-cols-12 px-7 py-4 gap-2 md:gap-0 items-start md:items-center"
                style={{
                  borderBottom: idx < foundationRows.length - 1 ? "1px solid var(--line)" : "none",
                  background: idx % 2 === 0 ? "transparent" : "rgba(248,245,240,0.45)",
                }}
              >
                <div className="md:col-span-3">
                  <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                    {row.category}
                  </p>
                </div>
                <div className="md:col-span-2 md:text-center">
                  <span className="text-xs font-sans" style={{ color: "var(--muted)" }}>
                    <span className="md:hidden font-medium mr-1" style={{ color: "var(--ink)" }}>Recommended:</span>
                    {row.recommended}
                  </span>
                </div>
                <div className="md:col-span-1 md:text-center">
                  <span className="text-sm font-semibold font-sans" style={{ color: "var(--ink)" }}>
                    <span className="md:hidden font-medium mr-1" style={{ color: "var(--ink)", fontSize: "0.75rem" }}>You have:</span>
                    {row.youHave}
                  </span>
                </div>
                <div className="md:col-span-2 md:text-center">
                  <span
                    className="text-xs font-sans rounded-full px-2.5 py-0.5"
                    style={{ background: st.bg, color: st.color }}
                  >
                    {row.status}
                  </span>
                </div>
                <div className="md:col-span-4">
                  <p className="text-xs italic" style={{ color: "var(--muted)" }}>
                    {row.action}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* ── Closet Health Category Cards ── */}
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-5"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
          >
            Closet Health by Category
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthGroups.map((group) => (
              <div
                key={group.status}
                className="rounded-2xl p-5"
                style={{ background: group.bg, border: "1px solid var(--line)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: group.color }}
                  />
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: group.color, fontFamily: "Georgia, serif" }}
                  >
                    {group.status}
                  </h3>
                </div>
                <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                  {group.description}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-xs flex items-start gap-1.5"
                      style={{ color: "var(--ink)" }}
                    >
                      <span className="mt-1 shrink-0" style={{ color: group.color }}>·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI Insight Card ── */}
        <section
          className="rounded-2xl p-7 mb-8"
          style={{
            background: "#faf5eb",
            border: "1px solid var(--line)",
            borderLeftWidth: 4,
            borderLeftColor: "var(--gold)",
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl shrink-0 mt-0.5" style={{ color: "var(--gold)" }}>✦</span>
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
            >
              AI Wardrobe Insight
            </h2>
          </div>
          <p
            className="text-base italic leading-relaxed"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
          >
            Your wardrobe has strong statement dresses and a beautifully cohesive romantic-earthy
            aesthetic, but your accessory coverage is significantly low. Adding one dark belt, one
            lightweight neutral scarf, and one practical rain-friendly shoe could increase your total
            viable outfit combinations by an estimated 35–40% — without requiring major new purchases
            or compromising your existing aesthetic direction.
          </p>
          <p className="text-sm mt-4 italic" style={{ color: "var(--muted)" }}>
            These three items can all be sourced secondhand for under $60 combined.
          </p>
        </section>

        {/* ── Recommended Next Purchases ── */}
        <section>
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
          >
            Recommended Next Purchases
          </h2>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            In priority order — each fills a genuine gap in your seed foundation.
          </p>
          <div className="flex flex-col gap-4">
            {nextPurchases.map((p, idx) => (
              <div
                key={p.item}
                className="rounded-2xl p-6"
                style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)", fontFamily: "Georgia, serif" }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-base font-semibold mb-2"
                      style={{ color: p.color, fontFamily: "Georgia, serif" }}
                    >
                      {p.item}
                    </h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--ink)" }}>
                      {p.why}
                    </p>
                    <div
                      className="flex items-start gap-2 rounded-xl px-4 py-3"
                      style={{ background: "var(--accent-soft)" }}
                    >
                      <span className="text-xs font-sans font-semibold uppercase tracking-wide shrink-0 mt-0.5" style={{ color: "var(--accent)" }}>
                        Sourcing
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                        {p.sourcing}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
