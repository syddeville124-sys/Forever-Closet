import Link from "next/link";

// ── CSS injected via style tag ─────────────────────────────────────────────
// Marquee keyframes live in globals.css; we inline the animation here for
// self-containment using a <style> tag rendered server-side.

// ── SVG icons ──────────────────────────────────────────────────────────────

function IconDNA() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3c0 5 4 5 4 10S3 18 3 21" />
      <path d="M21 3c0 5-4 5-4 10s4 5 4 8" />
      <path d="M4.5 9h15M4.5 15h15" />
    </svg>
  );
}
function IconCloset() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M8 8v2M16 8v2" />
    </svg>
  );
}
function IconOutfit() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2l-5 4v3h4v11h8V9h4V6L15 2a3 3 0 01-6 0z" />
    </svg>
  );
}
function IconCart() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.96-1.63L23 6H6" />
    </svg>
  );
}
function IconOptimize() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function IconWeather() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────

const problems = [
  {
    icon: "🛍️",
    title: "The Overbuy Trap",
    body: "You buy something new, wear it twice, and forget it. The average woman owns 150 pieces but feels like she has nothing to wear. The closet isn't too empty — it's misaligned.",
  },
  {
    icon: "😶",
    title: "Closet Guilt",
    body: "Hundreds of dollars hanging unworn. Tags still attached. Pieces that seemed perfect in the store but never found their place. Sound familiar?",
  },
  {
    icon: "⏳",
    title: "The \"Nothing to Wear\" Loop",
    body: "You spend 20 minutes deciding and still feel off. Without a system, getting dressed is guesswork. You deserve a wardrobe that works for you — automatically.",
  },
];

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

const features = [
  {
    icon: <IconDNA />,
    title: "AI Style DNA Engine",
    color: "var(--accent)",
    desc: "A living profile that learns your taste, lifestyle, and body. Every recommendation feels like it was made specifically for you — because it was.",
  },
  {
    icon: <IconCloset />,
    title: "Digital Closet",
    color: "var(--sage)",
    desc: "Log everything you own with photos, tags, and cost-per-wear tracking. Finally know exactly what you actually have.",
  },
  {
    icon: <IconOutfit />,
    title: "Outfit Builder",
    color: "var(--rose)",
    desc: "Mix-and-match pieces from your closet with AI-guided pairings. Discover outfits that were hiding in plain sight.",
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
    desc: "Identify the items you never reach for, the gaps worth filling, and the pieces earning their keep season after season.",
  },
  {
    icon: <IconWeather />,
    title: "Weather Intelligence",
    color: "var(--rose)",
    desc: "Get outfit suggestions tuned to your local forecast and calendar. Never stand in front of your closet confused again.",
  },
];

const MARQUEE_PILLS = [
  "bias-cut midi skirt",
  "bateau neckline",
  "empire waist",
  "princess seam",
  "peasant blouse",
  "puff sleeve",
  "lantern sleeve",
  "fit-and-flare",
  "slip dress",
  "corset bodice",
  "Edwardian lace insert",
];

// ── Decorative hero background ─────────────────────────────────────────────

function HeroDecor() {
  // A subtle grid of pill shapes in accent-soft at low opacity
  const cols = 8;
  const rows = 5;
  const pills = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pills.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            left: `${(c / (cols - 1)) * 90 + 5}%`,
            top: `${(r / (rows - 1)) * 80 + 10}%`,
            width: "48px",
            height: "20px",
            borderRadius: "999px",
            background: "var(--accent-soft)",
            opacity: 0.35 + (((r * cols + c) % 3) * 0.1),
            transform: `rotate(${((r * cols + c) % 5) * 18 - 36}deg)`,
          }}
        />
      );
    }
  }
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {pills}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function LandingPage() {
  // Duplicate pills for seamless loop
  const allPills = [...MARQUEE_PILLS, ...MARQUEE_PILLS];

  return (
    <>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 28s linear infinite;
        }
        .feature-card {
          transition: box-shadow 0.22s ease, transform 0.22s ease;
        }
        .feature-card:hover {
          box-shadow: 0 8px 32px rgba(111,79,63,0.13);
          transform: translateY(-3px);
        }
        .hero-cta-primary {
          transition: opacity 0.18s;
        }
        .hero-cta-primary:hover {
          opacity: 0.88;
        }
        .hero-cta-secondary {
          transition: background 0.18s;
        }
        .hero-cta-secondary:hover {
          background: var(--accent-soft) !important;
        }
      `}</style>

      <div style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}>

        {/* ── Hero ── */}
        <section
          id="hero"
          style={{
            position: "relative",
            background: "linear-gradient(160deg, var(--paper) 0%, var(--accent-soft) 100%)",
            borderBottom: "1px solid var(--line)",
            overflow: "hidden",
          }}
          className="px-4 py-24 md:py-36"
        >
          <HeroDecor />

          <div className="max-w-3xl mx-auto text-center" style={{ position: "relative", zIndex: 1 }}>
            <p
              className="text-xs uppercase tracking-widest mb-5 font-sans"
              style={{ color: "var(--muted)", letterSpacing: "0.2em" }}
            >
              Wardrobe Intelligence Platform
            </p>

            <h1
              className="font-bold leading-tight mb-6"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(3rem, 8vw, 5.5rem)",
                letterSpacing: "-0.02em",
                background: "linear-gradient(135deg, var(--ink) 0%, var(--accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Forever Closet AI
            </h1>

            <p
              className="text-xl md:text-2xl mb-5 italic"
              style={{ color: "var(--muted)", fontFamily: "Georgia, serif" }}
            >
              Build less. Wear more. Shop intentionally. Feel aligned.
            </p>

            <p
              className="text-base md:text-lg max-w-xl mx-auto mb-10"
              style={{ color: "var(--muted)", lineHeight: "1.85" }}
            >
              An AI-powered wardrobe platform built for women who want personal-stylist-level
              guidance — without the stylist price tag, the trend churn, or the closet chaos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/onboarding"
                className="hero-cta-primary px-9 py-4 rounded-full text-white text-base font-medium"
                style={{
                  background: "var(--accent)",
                  fontFamily: "Georgia, serif",
                  display: "inline-block",
                }}
              >
                Start My Closet
              </Link>
              <a
                href="#how-it-works"
                className="hero-cta-secondary px-9 py-4 rounded-full text-base font-medium"
                style={{
                  border: "1.5px solid var(--accent)",
                  color: "var(--accent)",
                  background: "transparent",
                  fontFamily: "Georgia, serif",
                  display: "inline-block",
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
        <section className="px-4 py-24" style={{ background: "var(--bg)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p
                className="text-xs uppercase tracking-widest mb-3 font-sans"
                style={{ color: "var(--muted)", letterSpacing: "0.16em" }}
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

            <div className="grid md:grid-cols-3 gap-7">
              {problems.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl p-8"
                  style={{
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                    style={{ background: "var(--accent-soft)" }}
                  >
                    {p.icon}
                  </div>
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
          className="px-4 py-24"
          style={{
            background: "var(--accent-soft)",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p
                className="text-xs uppercase tracking-widest mb-3 font-sans"
                style={{ color: "var(--muted)", letterSpacing: "0.16em" }}
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

            <div className="grid md:grid-cols-3 gap-10">
              {steps.map((s) => (
                <div key={s.num} className="flex flex-col">
                  {/* Numbered circle */}
                  <div
                    className="flex items-center justify-center mb-6"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      border: "2px solid var(--gold)",
                      background: "var(--paper)",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "var(--gold)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {s.num}
                    </span>
                  </div>
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
        <section className="px-4 py-24" style={{ background: "var(--bg)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p
                className="text-xs uppercase tracking-widest mb-3 font-sans"
                style={{ color: "var(--muted)", letterSpacing: "0.16em" }}
              >
                What&apos;s inside
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
              >
                Every Tool You Need
              </h2>
              <p className="mt-4 max-w-lg mx-auto text-sm" style={{ color: "var(--muted)", lineHeight: "1.8" }}>
                Six interconnected modules that work together to build a wardrobe with intention.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="feature-card rounded-2xl p-7 flex flex-col gap-5"
                  style={{
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--accent-soft)", color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      className="text-base font-semibold mb-2"
                      style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                      {f.desc}
                    </p>
                  </div>
                  <div style={{ color: "var(--accent)", fontSize: "1.1rem", fontWeight: "600" }}>→</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Philosophy Blockquote ── */}
        <section
          className="px-4 py-24"
          style={{
            background: "var(--paper)",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <blockquote
              style={{
                borderLeft: "4px solid var(--accent)",
                paddingLeft: "2rem",
                margin: 0,
              }}
            >
              <p
                className="italic font-medium leading-snug mb-6"
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  color: "var(--ink)",
                }}
              >
                This is not a fast-fashion app.
                <br />
                It is a Forever Closet system — built for the woman who is done buying things she
                doesn&apos;t need, and ready to love every single piece she owns.
              </p>
              <footer
                className="text-sm font-sans uppercase tracking-widest"
                style={{ color: "var(--muted)", letterSpacing: "0.14em" }}
              >
                — The Forever Closet Philosophy
              </footer>
            </blockquote>
          </div>
        </section>

        {/* ── Bottom CTA Strip ── */}
        <section
          className="px-4 py-24 text-center"
          style={{
            background: "linear-gradient(135deg, var(--accent-soft) 0%, #f0e4d7 50%, var(--paper) 100%)",
            borderTop: "1px solid var(--line)",
          }}
        >
          <div className="max-w-2xl mx-auto">
            <p
              className="text-xs uppercase tracking-widest mb-5 font-sans"
              style={{ color: "var(--muted)", letterSpacing: "0.18em" }}
            >
              Begin here
            </p>
            <h2
              className="font-bold mb-5"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                color: "var(--ink)",
                lineHeight: "1.2",
              }}
            >
              Ready to build your forever closet?
            </h2>
            <p
              className="text-sm mb-10"
              style={{ color: "var(--muted)", lineHeight: "1.8" }}
            >
              Takes 5–8 minutes. Serves you for years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/onboarding"
                className="px-10 py-4 rounded-full text-white text-base font-medium"
                style={{
                  background: "var(--accent)",
                  fontFamily: "Georgia, serif",
                  display: "inline-block",
                  transition: "opacity 0.18s",
                }}
              >
                Start My Closet
              </Link>
              <Link
                href="/closet"
                className="px-10 py-4 rounded-full text-base font-medium"
                style={{
                  border: "1.5px solid var(--accent)",
                  color: "var(--accent)",
                  background: "transparent",
                  fontFamily: "Georgia, serif",
                  display: "inline-block",
                  transition: "background 0.18s",
                }}
              >
                Browse the Demo Closet
              </Link>
            </div>
          </div>
        </section>

        {/* ── Marquee Strip ── */}
        <div
          style={{
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
            background: "var(--ink)",
            overflow: "hidden",
            padding: "18px 0",
          }}
        >
          <div
            className="marquee-track"
            style={{
              display: "flex",
              gap: "12px",
              width: "max-content",
              willChange: "transform",
            }}
          >
            {allPills.map((pill, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  padding: "6px 18px",
                  borderRadius: "999px",
                  border: "1px solid var(--accent)",
                  color: "var(--accent-soft)",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.02em",
                  flexShrink: 0,
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
