// Static page — no "use client" required

import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────
interface PricingTier {
  name: string;
  price: string | null;
  priceNote: string;
  tagline: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  badge?: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface Principle {
  icon: string;
  title: string;
  body: string;
}

// ── Data ───────────────────────────────────────────────────────────────────
const tiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    priceNote: "forever",
    tagline: "The intelligent essentials. A meaningful start.",
    highlighted: false,
    cta: "Get Started Free",
    ctaHref: "/onboarding",
    features: [
      "Digital closet — up to 30 items",
      "Basic Style DNA profile (quiz + preferences)",
      "3 AI outfit suggestions per day",
      "5 Shopping Buddy scans per month",
      "Basic keep / release suggestions",
      "Closet health overview",
      "Mobile-friendly photo upload",
    ],
  },
  {
    name: "Premium",
    price: "$12",
    priceNote: "/ month",
    tagline: "Your full personal stylist — always on, always improving.",
    highlighted: true,
    badge: "Most Popular",
    cta: "Start Premium",
    ctaHref: "/onboarding?plan=premium",
    features: [
      "Unlimited closet items",
      "Full AI Stylist — unlimited outfit generation",
      "Advanced Shopping Buddy (unlimited scans + fit analysis)",
      "Closet Economics dashboard",
      "Seed Closet Framework + functionality score",
      "Capsule wardrobe planning",
      "Weather-intelligent daily outfit suggestions",
      "Outfit visual mockups",
      "Advanced measurements & fit tracking",
      "Designer & independent brand discovery",
      "Full optimization audit with action plan",
      "Priority support",
    ],
  },
  {
    name: "Coming Soon",
    price: null,
    priceNote: "Notify me",
    tagline: "The full Forever Closet ecosystem — community, craft, and resale.",
    highlighted: false,
    badge: "In Development",
    cta: "Join Waitlist",
    ctaHref: "#waitlist",
    features: [
      "Stylist marketplace (book human stylists)",
      "Tailor & seamstress connections by region",
      "Resale & consignment platform integration",
      "Swap & trade community features",
      "Brand sustainability scoring",
      "Wardrobe archive & life-stage tracking",
      "Gift registry & wishlist sharing",
    ],
  },
];

const faqItems: FaqItem[] = [
  {
    q: "Is my data private?",
    a: "Completely. Your closet data, measurements, and style profile are yours alone. We never sell your data to brands, advertisers, or third parties. Our business model is your subscription — not your information. You can export or delete all your data at any time.",
  },
  {
    q: "Can men use Forever Closet?",
    a: "Absolutely. While our initial marketing has focused on women's wardrobes, the underlying system — Style DNA, closet taxonomy, outfit logic, shopping analysis — works across any wardrobe and gender expression. We're actively building richer menswear taxonomy and will expand that further based on user feedback.",
  },
  {
    q: "Does it connect to real stores or shopping sites?",
    a: "On the Free and Premium plans, the Shopping Buddy and gap identification features offer sourcing suggestions (including thrift-first recommendations), but we don't push affiliate links or partner with specific retailers. Our goal is to help you buy less and buy better — not to drive more purchasing. The future \"Connected\" tier will offer optional integrations with resale platforms and curated independent brands.",
  },
  {
    q: "What if I'm between sizes or have a non-standard fit?",
    a: "This is one of the things we're most proud of. Our measurement system captures real body proportions — not just a size number. When you log your measurements, outfit and shopping recommendations factor in your actual fit profile. The Shopping Buddy flags items where certain measurements matter (shoulder width in blazers, rise in trousers) and reminds you to check them before buying.",
  },
  {
    q: "How accurate are the AI suggestions?",
    a: "The system improves as your profile grows. In the first weeks, suggestions are good. After logging 15–20 items and confirming a few outfit reactions, they become noticeably more personal. We're transparent when the AI is reasoning from limited data and always let you override, dismiss, or teach the system your preferences.",
  },
];

const principles: Principle[] = [
  {
    icon: "I.",
    title: "We will never push you to buy more.",
    body: "Every recommendation — from outfits to Shopping Buddy scores to gap analysis — is designed to help you do more with what you already own. If we suggest a new purchase, it's because something is genuinely missing. Not because a brand paid us.",
  },
  {
    icon: "II.",
    title: "No shame. No judgment. Ever.",
    body: "We don't care how much you spent, what sizes you wear, how many impulse buys are in your closet, or how far your current wardrobe is from your ideal. Every piece has a story. We're here to help you move forward — not to audit your past.",
  },
  {
    icon: "III.",
    title: "Real bodies. Real lives.",
    body: "Fashion intelligence that only works for a narrow range of bodies, budgets, or lifestyles isn't intelligence — it's exclusion. We're building for the full spectrum: different body shapes, fit needs, budgets, climates, and occasions.",
  },
  {
    icon: "IV.",
    title: "Sustainability through longevity.",
    body: "The most sustainable garment is the one you already own and wear often. We prioritise cost-per-wear, closet longevity, and thrift-first sourcing. We celebrate the item you've had for a decade over the one you bought last week.",
  },
  {
    icon: "V.",
    title: "Your data is yours. Always.",
    body: "We will never monetise your personal information. Our business model is simple: you pay us a fair price, and we give you genuine value. No ads. No brand partnerships that compromise our advice. No hidden data flows.",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────
function CheckIcon({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, marginTop: 2 }}
    >
      <polyline points="2 7 6 11 12 3" />
    </svg>
  );
}

function FaqRow({ item, isLast }: { item: FaqItem; isLast: boolean }) {
  return (
    <div
      className="py-6"
      style={{ borderBottom: isLast ? "none" : "1px solid var(--line)" }}
    >
      <h3
        className="text-base font-semibold mb-2"
        style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
      >
        {item.q}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {item.a}
      </p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function PricingPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <section
        className="px-4 py-16 text-center"
        style={{
          background: "linear-gradient(160deg, var(--paper) 0%, var(--accent-soft) 100%)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <p
          className="text-xs uppercase tracking-widest mb-3 font-sans"
          style={{ color: "var(--muted)", letterSpacing: "0.16em" }}
        >
          Pricing
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold mb-3"
          style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
        >
          Simple, Honest Pricing
        </h1>
        <p
          className="text-lg italic max-w-md mx-auto"
          style={{ color: "var(--muted)", fontFamily: "Georgia, serif" }}
        >
          Fashion intelligence for real life.
        </p>
      </section>

      {/* ── Pricing Tiers ── */}
      <section className="px-4 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "var(--paper)",
                  border: tier.highlighted
                    ? "2px solid var(--accent)"
                    : "1px solid var(--line)",
                  position: "relative",
                }}
              >
                {/* Top badge */}
                {tier.badge && (
                  <div
                    className="text-center py-2 text-xs font-sans uppercase tracking-widest font-semibold"
                    style={{
                      background: tier.highlighted ? "var(--accent)" : "var(--accent-soft)",
                      color: tier.highlighted ? "#fff" : "var(--accent)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {tier.badge}
                  </div>
                )}

                <div className="px-7 pt-7 pb-5" style={{ borderBottom: "1px solid var(--line)" }}>
                  <h2
                    className="text-2xl font-bold mb-1"
                    style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
                  >
                    {tier.name}
                  </h2>

                  <div className="flex items-baseline gap-1.5 mb-3">
                    {tier.price ? (
                      <>
                        <span
                          className="text-4xl font-bold"
                          style={{ color: tier.highlighted ? "var(--accent)" : "var(--ink)", fontFamily: "Georgia, serif" }}
                        >
                          {tier.price}
                        </span>
                        <span className="text-sm font-sans" style={{ color: "var(--muted)" }}>
                          {tier.priceNote}
                        </span>
                      </>
                    ) : (
                      <span
                        className="text-base italic font-sans"
                        style={{ color: "var(--muted)" }}
                      >
                        {tier.priceNote}
                      </span>
                    )}
                  </div>

                  <p className="text-sm italic" style={{ color: "var(--muted)", fontFamily: "Georgia, serif" }}>
                    {tier.tagline}
                  </p>
                </div>

                <div className="px-7 py-6 flex-1 flex flex-col gap-5">
                  <ul className="flex flex-col gap-2.5 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckIcon
                          color={
                            tier.highlighted
                              ? "var(--accent)"
                              : tier.name === "Coming Soon"
                              ? "var(--muted)"
                              : "var(--sage)"
                          }
                        />
                        <span className="text-sm leading-snug" style={{ color: "var(--muted)" }}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.ctaHref}
                    className="block text-center rounded-full py-3 text-sm font-medium transition-opacity hover:opacity-90 mt-2"
                    style={{
                      background: tier.highlighted ? "var(--accent)" : "transparent",
                      color: tier.highlighted ? "#fff" : "var(--accent)",
                      border: `1.5px solid ${tier.highlighted ? "var(--accent)" : "var(--line)"}`,
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-6 text-sm italic" style={{ color: "var(--muted)" }}>
            Premium billed monthly. Cancel any time. No long-term commitment required.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        className="px-4 py-14"
        style={{ background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <p
              className="text-xs uppercase tracking-widest mb-3 font-sans"
              style={{ color: "var(--muted)", letterSpacing: "0.15em" }}
            >
              Questions
            </p>
            <h2
              className="text-3xl font-bold"
              style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
            >
              Frequently Asked
            </h2>
          </div>

          <div style={{ borderTop: "1px solid var(--line)" }}>
            {faqItems.map((item, idx) => (
              <FaqRow key={item.q} item={item} isLast={idx === faqItems.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Philosophy ── */}
      <section className="px-4 py-16" style={{ background: "var(--bg)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs uppercase tracking-widest mb-3 font-sans"
              style={{ color: "var(--muted)", letterSpacing: "0.15em" }}
            >
              How we operate
            </p>
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
            >
              Our Non-Negotiable Principles
            </h2>
            <p className="text-base italic max-w-lg mx-auto" style={{ color: "var(--muted)", fontFamily: "Georgia, serif" }}>
              These aren&apos;t marketing promises. They&apos;re the constraints we operate within — and the reason we built this platform in the first place.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {principles.map((p, idx) => (
              <div
                key={p.title}
                className="rounded-2xl px-7 py-6 flex items-start gap-5"
                style={{
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderLeft: `4px solid ${
                    [
                      "var(--accent)",
                      "var(--sage)",
                      "var(--gold)",
                      "var(--rose)",
                      "var(--muted)",
                    ][idx]
                  }`,
                }}
              >
                <span
                  className="text-sm font-bold font-sans shrink-0 mt-0.5 w-6"
                  style={{
                    color: [
                      "var(--accent)",
                      "var(--sage)",
                      "var(--gold)",
                      "var(--rose)",
                      "var(--muted)",
                    ][idx],
                  }}
                >
                  {p.icon}
                </span>
                <div>
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="px-4 py-16 text-center"
        style={{
          background: "linear-gradient(160deg, var(--accent-soft) 0%, var(--paper) 100%)",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div className="max-w-xl mx-auto">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
          >
            Ready to build your forever closet?
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
            Free to start. No credit card required. Takes about five minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="px-8 py-4 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", fontFamily: "Georgia, serif" }}
            >
              Start Free
            </Link>
            <Link
              href="/onboarding?plan=premium"
              className="px-8 py-4 rounded-full text-sm font-medium transition-colors"
              style={{
                border: "1.5px solid var(--accent)",
                color: "var(--accent)",
                background: "transparent",
                fontFamily: "Georgia, serif",
              }}
            >
              Start Premium — $12/mo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
