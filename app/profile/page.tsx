"use client";

import { useStore } from "@/lib/store";
import Link from "next/link";

const STYLE_DNA_LABELS: Record<string, string> = {
  Romantic: "Romantic Natural",
  Vintage: "Vintage-Influenced",
  Bohemian: "Bohemian Spirit",
  Structured: "Soft Structure",
  Gothic: "Gothic Fairy Accent",
  Cottagecore: "Botanical Femininity",
  Minimalist: "Clean Minimalist",
  Eclectic: "Eclectic Curator",
};

const PALETTE_LABELS: Record<string, string> = {
  "Earthy neutrals": "Earthy Neutrals · warm beige, caramel, forest",
  "Jewel tones": "Earthy Jewel Tones · plum, teal, rust, burgundy",
  "Monochrome black": "Monochrome · deep blacks and greys",
  "Soft pastels": "Soft Pastels · blush, sage, dusty mauve",
  "Bold brights": "Bold Brights · saturated statement colours",
};

export default function ProfilePage() {
  const { profile, closet } = useStore();

  if (!profile.onboardingComplete) {
    return (
      <div
        style={{ background: "var(--bg)", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ textAlign: "center", maxWidth: 480, padding: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✦</div>
          <h1 style={{ fontSize: "1.8rem", color: "var(--ink)", marginBottom: "0.75rem", fontFamily: "Georgia, serif" }}>
            Your Style DNA is waiting
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
            Complete the onboarding questionnaire to build your personalised style profile, measurement record, and Forever Closet strategy.
          </p>
          <Link
            href="/onboarding"
            style={{
              display: "inline-block",
              background: "var(--accent)",
              color: "white",
              padding: "0.65rem 1.75rem",
              borderRadius: "999px",
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            Start Onboarding →
          </Link>
        </div>
      </div>
    );
  }

  const styleDNA = profile.styleKeywords
    .map((kw) => STYLE_DNA_LABELS[kw] ?? kw)
    .join(" · ");

  const palette = profile.colorPalette
    .map((p) => PALETTE_LABELS[p] ?? p)
    .join(", ");

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "0.5rem" }}>
            Your Wardrobe Identity
          </p>
          <h1 style={{ fontSize: "2.5rem", color: "var(--ink)", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
            Style DNA
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1rem", fontStyle: "italic" }}>
            Built from your onboarding answers. Updates as your closet evolves.
          </p>
        </div>

        {/* Style DNA Card */}
        <div
          style={{
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: "24px",
            padding: "2rem",
            marginBottom: "1.25rem",
            borderLeft: "5px solid var(--accent)",
          }}
        >
          <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "0.75rem" }}>
            Style DNA Profile
          </p>
          {styleDNA ? (
            <p style={{ fontSize: "1.25rem", color: "var(--accent)", lineHeight: 1.6, fontStyle: "italic" }}>
              {styleDNA}
            </p>
          ) : (
            <p style={{ color: "var(--muted)", fontStyle: "italic" }}>Add style keywords to build your DNA profile.</p>
          )}
        </div>

        {/* Grid: Palette + Lifestyle */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "20px", padding: "1.5rem" }}>
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "0.75rem" }}>
              Colour Palette
            </p>
            {profile.colorPalette.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {profile.colorPalette.map((p) => (
                  <span
                    key={p}
                    style={{
                      fontSize: "0.82rem",
                      padding: "0.3rem 0.85rem",
                      borderRadius: "999px",
                      background: "var(--accent-soft)",
                      color: "var(--accent)",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", fontStyle: "italic" }}>Not yet set</p>
            )}
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "20px", padding: "1.5rem" }}>
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "0.75rem" }}>
              Lifestyle
            </p>
            {profile.lifestyle.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {profile.lifestyle.map((l) => (
                  <span
                    key={l}
                    style={{
                      fontSize: "0.82rem",
                      padding: "0.3rem 0.85rem",
                      borderRadius: "999px",
                      background: "#f3f5ec",
                      color: "var(--sage)",
                      border: "1px solid #c7cfb5",
                    }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", fontStyle: "italic" }}>Not yet set</p>
            )}
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "20px", padding: "1.5rem" }}>
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "0.75rem" }}>
              Sustainability Values
            </p>
            {profile.sustainability.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {profile.sustainability.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: "0.82rem",
                      padding: "0.3rem 0.85rem",
                      borderRadius: "999px",
                      background: "#fff4ef",
                      color: "var(--rose)",
                      border: "1px solid #e2b5a8",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", fontStyle: "italic" }}>Not yet set</p>
            )}
          </div>

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "20px", padding: "1.5rem" }}>
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "0.75rem" }}>
              Goal Mode
            </p>
            <p style={{ fontSize: "1.1rem", color: "var(--ink)", fontStyle: "italic" }}>
              {profile.goalMode === "refine" && "Refining my style"}
              {profile.goalMode === "discover" && "Discovering my style"}
              {profile.goalMode === "both" && "Refining & discovering"}
              {!profile.goalMode && <span style={{ color: "var(--muted)" }}>Not set</span>}
            </p>
          </div>
        </div>

        {/* Measurements */}
        <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "20px", padding: "1.5rem", marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "1rem" }}>
            Measurements · {profile.measurementMode === "advanced" ? "Advanced Mode" : "Easy Mode"}
          </p>
          {profile.measurementMode === "easy" ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {profile.standardSize && <MeasRow label="Size" value={profile.standardSize} />}
              {profile.shoeSize && <MeasRow label="Shoe" value={profile.shoeSize} />}
              {profile.fitPreference && <MeasRow label="Fit Preference" value={profile.fitPreference} />}
              {profile.braSize && <MeasRow label="Bra / Chest" value={profile.braSize} />}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" }}>
              {profile.bust && <MeasRow label="Bust / Chest" value={`${profile.bust}"`} />}
              {profile.waist && <MeasRow label="Waist" value={`${profile.waist}"`} />}
              {profile.hips && <MeasRow label="Hips" value={`${profile.hips}"`} />}
              {profile.inseam && <MeasRow label="Inseam" value={`${profile.inseam}"`} />}
              {profile.shoulderWidth && <MeasRow label="Shoulder Width" value={`${profile.shoulderWidth}"`} />}
              {profile.torsoLength && <MeasRow label="Torso Length" value={`${profile.torsoLength}"`} />}
              {profile.armLength && <MeasRow label="Arm Length" value={`${profile.armLength}"`} />}
            </div>
          )}
        </div>

        {/* Closet Quick Stats */}
        <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "20px", padding: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "1rem" }}>
            Closet Summary
          </p>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <QuickStat label="Total Items" value={String(closet.length)} />
            <QuickStat label="Categories" value={String(new Set(closet.map((i) => i.category)).size)} />
            <QuickStat label="Most-worn" value={closet.length > 0 ? closet.reduce((a, b) => a.worn > b.worn ? a : b).name.split(" ").slice(0, 2).join(" ") : "—"} />
            <QuickStat label="Least-worn" value={closet.length > 0 ? closet.reduce((a, b) => a.worn < b.worn ? a : b).name.split(" ").slice(0, 2).join(" ") : "—"} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link
            href="/onboarding"
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: "999px",
              border: "1.5px solid var(--accent)",
              color: "var(--accent)",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            Update Profile
          </Link>
          <Link
            href="/chat"
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: "999px",
              background: "var(--accent)",
              color: "white",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            Chat with AI Stylist →
          </Link>
        </div>

      </div>
    </div>
  );
}

function MeasRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: "0.1rem" }}>
        {label}
      </p>
      <p style={{ fontSize: "0.95rem", color: "var(--ink)", fontWeight: 600 }}>{value}</p>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: "0.2rem" }}>
        {label}
      </p>
      <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1.1 }}>{value}</p>
    </div>
  );
}
