import Link from "next/link";

// ── SVG icons ──────────────────────────────────────────────────────────────
function IconDNA() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3c0 5 4 5 4 10S3 18 3 21" />
      <path d="M21 3c0 5-4 5-4 10s4 5 4 8" />
      <path d="M4.5 9h15M4.5 15h15" />
    </svg>
  );
}
function IconCloset() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M8 8v2M16 8v2" />
    </svg>
  );
}
function IconOutfit() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2l-5 4v3h4v11h8V9h4V6L15 2a3 3 0 01-6 0z" />
    </svg>
  );
}
function IconCart() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.96-1.63L23 6H6" />
    </svg>
  );
}
function IconOptimize() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function IconWeather() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  );
}

// ── Feature card data ──────────────────────────────────────────────────────
const features = [
  {
    icon: <IconDNA />,
    title: "AI Style DNA Engine",
    color: "var(--accent)",
    desc: "A living profile that learns your taste, lifestyle, and body — so every recommendation feels like it was made for you.",
  },
  {
    icon: <IconCloset />,
    title: "Digital Closet",
    color: "var(--sage)",
    desc: "Log everything you own with photos, tags, and cost-per-wear tracking. Finally know what you actually have.",
  },
  {
    icon: <IconOutfit />,
    title: "Outfit Builder",
    color: "var(--rose)",
    desc: "Mix-and-match pieces from your closet with AI-guided pairings. Discover outfits hiding in plain sight.",
  },
  {
    icon: <IconCart />,
    title: "Shopping Buddy",
    color: "var(--gold)",
    desc: "Before you buy anything, check it against your Style DNA. The AI tells you if it truly fits your wardrobe — or if you already own something similar.",
  },
  {
    icon: <IconOptimize />,
    title: "Closet Optimizer",
    color: "var(--sage)",
    desc: "Identify the items you never reach for, the gaps worth filling, and the pieces earning their keep.",
  },
  {
    icon: <IconWeather />,
    title: "Weather Intelligence",
    color: "var(--rose)",
    desc: "Get outfit suggestions tuned to your local forecast and calendar — never stand in front of your closet confused again.",
  },
];

// ── Problem cards ──────────────────────────────────────────────────────────
const problems = [
  {
    emoji: "🛍️",
    title: "The Overbuy Trap",
    body: "You buy something new, wear it twice, and forget it. The average woman owns 150 pieces but feels like she has nothing to wear. The closet isn't too empty — it's misaligned.",
  },
  {
    emoji: "😶",
    title: "Closet Guilt",
    body: "Hundreds of dollars hanging unworn. Tags still attached. Pieces that seemed perfect in the store but never found their place. Sound familiar?",
  },
  {
    emoji: "⏳",
    title: "The \"Nothing to Wear\" Loop",
    body: "You spend 20 minutes deciding and still feel off. Without a system, getting dressed is guesswork. You deserve a wardrobe that works for you — automatically.",
  },
];

// ── How it works steps ─────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    title: "Build Your Style DNA",
    body: "Answer a short quiz about your lifestyle, aesthetic preferences, measurements, and goals. We create a living profile that guides every suggestion.",
  },
  {
    num: "02",
    title: "Upload Your Closet",
    body: "Photograph or log every piece you own. Tag by category, color, and occasion. Your wardrobe becomes a searchable, intelligent archive.",
  },
  {
    num: "03",
    title: "Get AI-Powered Guidance",
    body: "Outfit ideas, shopping decisions, seasonal edits, cost-per-wear analysis — your personal stylist, always on.",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ color: "var(--ink)" }}>
      {/* ── Hero ── */}
      <section
        id="hero"
        style={{
          background: "linear-gradient(160deg, var(--paper) 0%, var(--accent-soft) 100%)",
          borderBottom: "1px solid var(--line)",
        }}
        className="px-4 py-20 md:py-32"
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-xs uppercase tracking-widest mb-4 font-sans"
            style={{ color: "var(--muted)", letterSpacing: "0.18em" }}
          >
            Wardrobe Intelligence Platform
          </p>

          <h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
          >
            Forever Closet
            <span style={{ color: "var(--accent)" }}> AI</span>
          </h1>

          <p
            className="text-xl md:text-2xl mb-5 italic"
            style={{ color: "var(--muted)", fontFamily: "Georgia, serif" }}
          >
            Build less. Wear more. Shop intentionally. Feel aligned.
          </p>

          <p
            className="text-base md:text-lg max-w-xl mx-auto mb-10"
            style={{ color: "var(--muted)", lineHeight: "1.8" }}
          >
            An AI-powered wardrobe platform built for women who want personal-stylist-level guidance
            — without the stylist price tag, the trend churn, or the closet chaos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="px-8 py-4 rounded-full text-white text-base font-medium transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", fontFamily: "Georgia, serif" }}
            >
              Start My Closet
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-full text-base font-medium transition-colors"
              style={{
                border: "1.5px solid var(--accent)",
                color: "var(--accent)",
                background: "transparent",
                fontFamily: "Georgia, serif",
              }}
            >
              See How It Works
            </a>
          </div>

          <p className="mt-8 text-xs font-sans" style={{ color: "var(--muted)" }}>
            Free to start · No credit card required · 5-minute setup
          </p>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="px-4 py-20" style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs uppercase tracking-widest mb-3 font-sans"
              style={{ color: "var(--muted)", letterSpacing: "0.15em" }}
            >
              Why we built this
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
            >
              The Problem with Modern Wardrobes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl p-7"
                style={{
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                }}
              >
                <div className="text-3xl mb-4">{p.emoji}</div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
                >
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        id="how-it-works"
        className="px-4 py-20"
        style={{ background: "var(--accent-soft)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs uppercase tracking-widest mb-3 font-sans"
              style={{ color: "var(--muted)", letterSpacing: "0.15em" }}
            >
              The System
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
            >
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex flex-col">
                <div
                  className="text-5xl font-bold mb-4 leading-none"
                  style={{ color: "var(--line)", fontFamily: "Georgia, serif" }}
                >
                  {s.num}
                </div>
                <div
                  className="w-8 h-0.5 mb-5"
                  style={{ background: "var(--accent)" }}
                />
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="px-4 py-20" style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-xs uppercase tracking-widest mb-3 font-sans"
              style={{ color: "var(--muted)", letterSpacing: "0.15em" }}
            >
              What's inside
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
            >
              Every Tool You Need
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-sm" style={{ color: "var(--muted)" }}>
              Six interconnected modules that work together to build a wardrobe with intention.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 flex flex-col gap-4 transition-shadow hover:shadow-md"
                style={{
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--accent-soft)", color: f.color }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3
                    className="text-base font-semibold mb-1.5"
                    style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy Quote ── */}
      <section
        className="px-4 py-20"
        style={{
          background: "var(--ink)",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="text-4xl mb-6"
            style={{ color: "var(--line)", fontFamily: "Georgia, serif" }}
          >
            &ldquo;
          </div>
          <blockquote
            className="text-2xl md:text-3xl font-medium leading-snug italic mb-6"
            style={{ color: "var(--paper)", fontFamily: "Georgia, serif" }}
          >
            This is not a fast-fashion app.
            <br />
            It is a Forever Closet system.
          </blockquote>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Built for the woman who is done buying things she doesn&apos;t need,<br className="hidden sm:block" />
            and ready to love every single piece she owns.
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="px-4 py-20 text-center"
        style={{
          background: "linear-gradient(160deg, var(--accent-soft) 0%, var(--paper) 100%)",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <p
            className="text-xs uppercase tracking-widest mb-4 font-sans"
            style={{ color: "var(--muted)", letterSpacing: "0.15em" }}
          >
            Begin here
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-5"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
          >
            Ready to build your forever closet?
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
            Takes 5–8 minutes. Serves you for years.
          </p>
          <Link
            href="/onboarding"
            className="inline-block px-10 py-4 rounded-full text-white text-base font-medium transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", fontFamily: "Georgia, serif" }}
          >
            Start My Closet
          </Link>
        </div>
      </section>
    </div>
  );
}
