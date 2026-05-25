"use client";

import { useState } from "react";
import Link from "next/link";

const FILTERS = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Layering", "Accessories", "Shoes"];

const CLOSET_ITEMS = [
  {
    id: 1,
    name: "Bias-cut Midi Skirt",
    category: "Bottoms",
    color: "var(--rose)",
    tags: ["romantic", "vintage", "feminine"],
    badge: "Keep",
    badgeColor: "var(--sage)",
    worn: 12,
  },
  {
    id: 2,
    name: "Peasant Blouse",
    category: "Tops",
    color: "var(--accent-soft)",
    tags: ["bohemian", "earthy", "relaxed"],
    badge: "Style More",
    badgeColor: "var(--gold)",
    worn: 4,
  },
  {
    id: 3,
    name: "Corset Bodice",
    category: "Tops",
    color: "var(--accent)",
    tags: ["romantic", "dramatic", "vintage"],
    badge: "Keep",
    badgeColor: "var(--sage)",
    worn: 7,
  },
  {
    id: 4,
    name: "Slip Dress",
    category: "Dresses",
    color: "#c9b99a",
    tags: ["minimal", "layering", "versatile"],
    badge: "Style More",
    badgeColor: "var(--gold)",
    worn: 9,
  },
  {
    id: 5,
    name: "Puff Sleeve Top",
    category: "Tops",
    color: "var(--sage)",
    tags: ["romantic", "whimsical", "statement"],
    badge: "Alter",
    badgeColor: "var(--rose)",
    worn: 2,
  },
  {
    id: 6,
    name: "Fit-and-Flare Dress",
    category: "Dresses",
    color: "#8b7355",
    tags: ["classic", "feminine", "occasion"],
    badge: "Keep",
    badgeColor: "var(--sage)",
    worn: 6,
  },
  {
    id: 7,
    name: "Bateau Neck Sweater",
    category: "Tops",
    color: "#b5a898",
    tags: ["classic", "earthy", "cozy"],
    badge: "Keep",
    badgeColor: "var(--sage)",
    worn: 14,
  },
  {
    id: 8,
    name: "Wide-Leg Trousers",
    category: "Bottoms",
    color: "var(--ink)",
    tags: ["modern", "relaxed", "versatile"],
    badge: "Style More",
    badgeColor: "var(--gold)",
    worn: 5,
  },
  {
    id: 9,
    name: "Empire Waist Dress",
    category: "Dresses",
    color: "#7a6e64",
    tags: ["romantic", "vintage", "evening"],
    badge: "Keep",
    badgeColor: "var(--sage)",
    worn: 8,
  },
  {
    id: 10,
    name: "Linen Blazer",
    category: "Outerwear",
    color: "var(--gold)",
    tags: ["tailored", "earthy", "structured"],
    badge: "Keep",
    badgeColor: "var(--sage)",
    worn: 11,
  },
  {
    id: 11,
    name: "Ankle Boots",
    category: "Shoes",
    color: "#4a3728",
    tags: ["classic", "grounded", "versatile"],
    badge: "Keep",
    badgeColor: "var(--sage)",
    worn: 18,
  },
  {
    id: 12,
    name: "Beaded Scarf",
    category: "Accessories",
    color: "var(--rose)",
    tags: ["bohemian", "vintage", "statement"],
    badge: "Style More",
    badgeColor: "var(--gold)",
    worn: 3,
  },
];

const DETAIL_ITEM = {
  name: "Bias-cut Midi Skirt",
  garmentType: "Skirt",
  silhouette: "Bias-cut, fluid A-line",
  fabric: "Satin-backed crepe",
  color: "Dusty rose / blush",
  neckline: "N/A (skirt)",
  eraInfluence: "1930s Hollywood, 1970s bohemian revival",
  styleTags: ["romantic", "vintage", "feminine", "fluid"],
  fitStatus: "True to size — graze at natural waist",
  seasonality: "Spring, Summer, transitional Autumn",
  closetRole: "Statement bottom / anchor piece",
  optimizationStatus: "Keep — high versatility score",
  compatibilityScore: "94 / 100",
};

export default function ClosetPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? CLOSET_ITEMS
    : CLOSET_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header + Stats */}
        <div className="mb-6">
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            My Closet
          </h1>
          <div
            className="flex flex-wrap gap-6 items-center px-5 py-3 rounded-xl"
            style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
          >
            <Stat label="Items" value="24" />
            <div style={{ width: 1, height: 28, background: "var(--line)" }} />
            <Stat label="Categories" value="8" />
            <div style={{ width: 1, height: 28, background: "var(--line)" }} />
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Closet Health
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div style={{ width: 120, height: 6, background: "var(--line)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: "78%", height: "100%", background: "var(--sage)", borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--sage)" }}>78%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "0.35rem 1rem",
                borderRadius: 999,
                border: `1px solid ${activeFilter === f ? "var(--accent)" : "var(--line)"}`,
                background: activeFilter === f ? "var(--accent)" : "var(--paper)",
                color: activeFilter === f ? "var(--paper)" : "var(--muted)",
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "Georgia, serif",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <div
          className="flex flex-col items-center justify-center gap-2 mb-8 rounded-2xl py-8 px-4 text-center"
          style={{
            border: "2px dashed var(--line)",
            background: "var(--paper)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--accent-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.25rem",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 13V4M10 4L7 7M10 4L13 7" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 14v1.5A1.5 1.5 0 004.5 17h11A1.5 1.5 0 0017 15.5V14" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: "0.95rem" }}>Upload a closet item</p>
          <p style={{ color: "var(--muted)", fontSize: "0.82rem", maxWidth: 320 }}>
            AI removes background and labels garment automatically
          </p>
          <button
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem 1.5rem",
              borderRadius: 999,
              background: "var(--accent)",
              color: "var(--paper)",
              border: "none",
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
            }}
          >
            Choose Photo
          </button>
        </div>

        {/* Closet Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {filtered.map((item) => (
            <Link key={item.id} href="/closet/item" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "box-shadow 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 18px rgba(47,42,37,0.10)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                {/* Image Placeholder */}
                <div
                  style={{
                    height: 130,
                    background: item.color,
                    opacity: 0.85,
                  }}
                />
                <div style={{ padding: "0.7rem 0.85rem 0.85rem" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink)", marginBottom: "0.35rem", lineHeight: 1.3 }}>
                    {item.name}
                  </p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: "0.65rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: 999,
                          background: "var(--accent-soft)",
                          color: "var(--accent)",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {/* Badge + Worn */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        style={{
                          display: "inline-block",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: item.badgeColor,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{item.badge}</span>
                    </div>
                    <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>worn {item.worn}×</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Item Detail Panel */}
        <div
          style={{
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: 18,
            padding: "2rem",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: "var(--rose)",
                opacity: 0.85,
                flexShrink: 0,
              }}
            />
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--ink)" }}>{DETAIL_ITEM.name}</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Item detail · AI-generated taxonomy</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
            <DetailRow label="Garment Type" value={DETAIL_ITEM.garmentType} />
            <DetailRow label="Silhouette" value={DETAIL_ITEM.silhouette} />
            <DetailRow label="Fabric" value={DETAIL_ITEM.fabric} />
            <DetailRow label="Color" value={DETAIL_ITEM.color} />
            <DetailRow label="Neckline" value={DETAIL_ITEM.neckline} />
            <DetailRow label="Era Influence" value={DETAIL_ITEM.eraInfluence} />
            <DetailRow label="Fit Status" value={DETAIL_ITEM.fitStatus} />
            <DetailRow label="Seasonality" value={DETAIL_ITEM.seasonality} />
            <DetailRow label="Closet Role" value={DETAIL_ITEM.closetRole} />
            <DetailRow label="Optimization" value={DETAIL_ITEM.optimizationStatus} />
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "0.75rem", gridColumn: "1 / -1" }}>
              <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "0.35rem" }}>
                Style Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {DETAIL_ITEM.styleTags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.72rem",
                      padding: "0.2rem 0.65rem",
                      borderRadius: 999,
                      background: "var(--accent-soft)",
                      color: "var(--accent)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "0.75rem" }}>
              <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "0.25rem" }}>
                Compatibility Score
              </p>
              <div className="flex items-center gap-2">
                <div style={{ flex: 1, height: 6, background: "var(--line)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: "94%", height: "100%", background: "var(--sage)", borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--sage)" }}>94</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>{label}</p>
      <p style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1.1 }}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ borderTop: "1px solid var(--line)", paddingTop: "0.6rem" }}>
      <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "0.15rem" }}>
        {label}
      </p>
      <p style={{ fontSize: "0.85rem", color: "var(--ink)" }}>{value}</p>
    </div>
  );
}
