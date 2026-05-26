"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useStore } from "@/lib/store";
import type { ClosetItem } from "@/lib/store";

// ── Constants ─────────────────────────────────────────────────────────────────

const FILTERS = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Layering", "Shoes", "Accessories"];
const CATEGORIES = ["Tops", "Bottoms", "Dresses", "Outerwear", "Layering", "Shoes", "Accessories"];

const BADGE_OPTIONS = [
  { label: "Keep",       color: "var(--sage)",   value: "keep" },
  { label: "Style More", color: "var(--gold)",   value: "style_more" },
  { label: "Alter",      color: "var(--rose)",   value: "alter" },
  { label: "Archive",    color: "var(--muted)",  value: "archive" },
  { label: "Sell",       color: "#b08b57",       value: "sell" },
  { label: "Donate",     color: "#79806c",       value: "donate" },
  { label: "Release",    color: "#a9796d",       value: "release" },
];

function getBadgeForValue(value: string) {
  return BADGE_OPTIONS.find((b) => b.value === value) ?? BADGE_OPTIONS[0];
}

function calcHealthScore(closet: ClosetItem[]): number {
  if (closet.length === 0) return 60;
  const penaltyItems = closet.filter((i) =>
    ["release", "donate", "sell"].some((v) => i.badge.toLowerCase().replace(/\s+/g, "_") === v || i.badge.toLowerCase() === v)
  ).length;
  const raw = 60 + Math.max(0, 40 - penaltyItems * 10);
  return Math.min(100, raw);
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ClosetPage() {
  const { closet, addClosetItem, removeClosetItem, updateClosetItem } = useStore();

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived
  const filtered = activeFilter === "All"
    ? closet
    : closet.filter((i) => i.category === activeFilter);

  const categoryCount = new Set(closet.map((i) => i.category)).size;
  const healthScore = calcHealthScore(closet);

  // Keep selectedItem in sync with store mutations
  useEffect(() => {
    if (selectedItem) {
      const updated = closet.find((i) => i.id === selectedItem.id);
      if (updated) setSelectedItem(updated);
      else setSelectedItem(null);
    }
  }, [closet]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toast ─────────────────────────────────────────────────────────────────

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(msg);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
      setTimeout(() => setToast(null), 400);
    }, 2500);
  }, []);

  // ── File handling ─────────────────────────────────────────────────────────

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(file: File) {
    if (!file.type.startsWith("image/")) return;
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShowUploadModal(true);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
    e.target.value = "";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  }

  function handleModalClose() {
    setShowUploadModal(false);
    setPendingFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  function handleItemAdded() {
    setShowUploadModal(false);
    setPendingFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    showToast("Added to your closet");
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "2rem 1.5rem", fontFamily: "Georgia, serif" }}>
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
            <Stat label="Items" value={String(closet.length)} />
            <div style={{ width: 1, height: 28, background: "var(--line)" }} />
            <Stat label="Categories" value={String(categoryCount)} />
            <div style={{ width: 1, height: 28, background: "var(--line)" }} />
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Closet Health
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div style={{ width: 120, height: 6, background: "var(--line)", borderRadius: 3, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${healthScore}%`,
                      height: "100%",
                      background: healthScore >= 75 ? "var(--sage)" : healthScore >= 50 ? "var(--gold)" : "var(--rose)",
                      borderRadius: 3,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--sage)" }}>{healthScore}%</span>
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

        {/* Upload Zone */}
        <div
          onClick={openFilePicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center gap-2 mb-8 rounded-2xl py-8 px-4 text-center"
          style={{
            border: `2px dashed ${dragOver ? "var(--accent)" : "var(--line)"}`,
            background: dragOver ? "var(--accent-soft)" : "var(--paper)",
            cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: dragOver ? "var(--accent)" : "var(--accent-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.25rem",
              transition: "background 0.15s",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 13V4M10 4L7 7M10 4L13 7" stroke={dragOver ? "white" : "var(--accent)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 14v1.5A1.5 1.5 0 004.5 17h11A1.5 1.5 0 0017 15.5V14" stroke={dragOver ? "white" : "var(--accent)"} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: "0.95rem" }}>
            {dragOver ? "Drop to upload" : "Upload a closet item"}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.82rem", maxWidth: 320 }}>
            Drag & drop a photo here, or click to browse
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); openFilePicker(); }}
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleInputChange}
        />

        {/* Empty State */}
        {closet.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl mb-10"
            style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4C2.9 7 2 7.9 2 9v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16 7V5c0-1.1-.9-2-2-2h-4C8.9 3 8 3.9 8 5v2" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>
              Your closet is empty
            </p>
            <p style={{ fontSize: "0.88rem", color: "var(--muted)", maxWidth: 280, textAlign: "center" }}>
              Start by uploading your first item using the area above.
            </p>
          </div>
        )}

        {/* Closet Grid */}
        {closet.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {filtered.map((item) => (
              <ClosetCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
                onRemove={() => removeClosetItem(item.id)}
              />
            ))}
          </div>
        )}

        {/* Item Detail Panel */}
        {selectedItem && (
          <ItemDetailPanel
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onMarkWorn={() => updateClosetItem(selectedItem.id, { worn: selectedItem.worn + 1 })}
            onBadgeChange={(badge, badgeColor) => updateClosetItem(selectedItem.id, { badge, badgeColor })}
            onRemove={() => { removeClosetItem(selectedItem.id); setSelectedItem(null); showToast("Item removed"); }}
          />
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && pendingFile && previewUrl && (
        <UploadModal
          file={pendingFile}
          previewUrl={previewUrl}
          onAdd={(data) => {
            addClosetItem(data);
            handleItemAdded();
          }}
          onCancel={handleModalClose}
        />
      )}

      {/* Success Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: "var(--ink)",
            color: "var(--paper)",
            padding: "0.75rem 1.25rem",
            borderRadius: 10,
            fontSize: "0.85rem",
            fontFamily: "Georgia, serif",
            boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
            opacity: toastVisible ? 1 : 0,
            transform: toastVisible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Closet Card ───────────────────────────────────────────────────────────────

function ClosetCard({
  item,
  onClick,
  onRemove,
}: {
  item: ClosetItem;
  onClick: () => void;
  onRemove: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        transition: "box-shadow 0.18s ease",
        boxShadow: hovered ? "0 6px 22px rgba(47,42,37,0.12)" : "none",
      }}
    >
      {/* Remove button */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        style={{
          position: "absolute",
          top: 7,
          right: 7,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "rgba(47,42,37,0.62)",
          color: "white",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "0.8rem",
          lineHeight: 1,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.15s",
          zIndex: 10,
        }}
        aria-label={`Remove ${item.name}`}
      >
        ×
      </button>

      {/* Image or color swatch */}
      {item.imageDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageDataUrl}
          alt={item.name}
          style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
        />
      ) : (
        <div style={{ height: 130, background: item.color, opacity: 0.85 }} />
      )}

      <div style={{ padding: "0.7rem 0.85rem 0.85rem" }}>
        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink)", marginBottom: "0.35rem", lineHeight: 1.3 }}>
          {item.name}
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags.slice(0, 3).map((t) => (
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
  );
}

// ── Item Detail Panel ─────────────────────────────────────────────────────────

function ItemDetailPanel({
  item,
  onClose,
  onMarkWorn,
  onBadgeChange,
  onRemove,
}: {
  item: ClosetItem;
  onClose: () => void;
  onMarkWorn: () => void;
  onBadgeChange: (badge: string, badgeColor: string) => void;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 18,
        padding: "2rem",
        marginBottom: "2rem",
      }}
    >
      {/* Panel header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          {item.imageDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageDataUrl}
              alt={item.name}
              style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                background: item.color,
                opacity: 0.85,
                flexShrink: 0,
              }}
            />
          )}
          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--ink)" }}>{item.name}</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{item.category} · worn {item.worn}×</p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: "1.3rem",
            cursor: "pointer",
            lineHeight: 1,
            padding: "0.25rem",
            flexShrink: 0,
          }}
          aria-label="Close detail panel"
        >
          ×
        </button>
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {item.tags.map((t) => (
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
      )}

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 mb-6">
        <DetailRow label="Category" value={item.category} />
        <DetailRow label="Times Worn" value={`${item.worn}×`} />
        <DetailRow label="Added" value={item.addedAt > 0 ? new Date(item.addedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Demo item"} />
        {item.garmentType && <DetailRow label="Garment Type" value={item.garmentType} />}
        {item.silhouette && <DetailRow label="Silhouette" value={item.silhouette} />}
        {item.fabric && <DetailRow label="Fabric" value={item.fabric} />}
        {item.eraInfluence && <DetailRow label="Era Influence" value={item.eraInfluence} />}
        {item.fitStatus && <DetailRow label="Fit Status" value={item.fitStatus} />}
        {item.seasonality && <DetailRow label="Seasonality" value={item.seasonality} />}
        {item.closetRole && <DetailRow label="Closet Role" value={item.closetRole} />}
        {item.notes && <DetailRow label="Notes" value={item.notes} />}
      </div>

      {/* Badge / optimization status */}
      <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.25rem", marginBottom: "1.25rem" }}>
        <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "0.6rem" }}>
          Optimization Status
        </p>
        <div className="flex flex-wrap gap-2">
          {BADGE_OPTIONS.map((opt) => {
            const active = item.badge.toLowerCase() === opt.label.toLowerCase() || item.badge.toLowerCase().replace(/\s+/g, "_") === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onBadgeChange(opt.label, opt.color)}
                style={{
                  padding: "0.3rem 0.9rem",
                  borderRadius: 999,
                  border: `1.5px solid ${active ? opt.color : "var(--line)"}`,
                  background: active ? opt.color : "transparent",
                  color: active ? "white" : "var(--muted)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  fontFamily: "Georgia, serif",
                  transition: "all 0.15s",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onMarkWorn}
          style={{
            padding: "0.55rem 1.4rem",
            borderRadius: 999,
            background: "var(--accent)",
            color: "var(--paper)",
            border: "none",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "Georgia, serif",
          }}
        >
          Mark as Worn
        </button>
        <button
          onClick={onRemove}
          style={{
            padding: "0.55rem 1.4rem",
            borderRadius: 999,
            background: "transparent",
            color: "var(--rose)",
            border: "1.5px solid var(--rose)",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "Georgia, serif",
          }}
        >
          Remove from Closet
        </button>
      </div>
    </div>
  );
}

// ── Upload Modal ──────────────────────────────────────────────────────────────

function UploadModal({
  file,
  previewUrl,
  onAdd,
  onCancel,
}: {
  file: File;
  previewUrl: string;
  onAdd: (data: Omit<ClosetItem, "id" | "addedAt">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
  const [category, setCategory] = useState("Tops");
  const [tagsRaw, setTagsRaw] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);

    // Convert file to base64 data URL
    const imageDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    onAdd({
      name: name.trim(),
      category,
      color: "var(--accent-soft)",
      imageDataUrl,
      tags,
      badge: "Keep",
      badgeColor: "var(--sage)",
      worn: 0,
    });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(47,42,37,0.45)",
          zIndex: 1000,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Modal card */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "var(--paper)",
          borderRadius: 20,
          padding: "2rem",
          width: "min(92vw, 520px)",
          maxHeight: "90vh",
          overflowY: "auto",
          zIndex: 1001,
          boxShadow: "0 20px 60px rgba(47,42,37,0.22)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--ink)" }}>Add to Closet</h2>
          <button
            onClick={onCancel}
            style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1 }}
            aria-label="Cancel"
          >
            ×
          </button>
        </div>

        {/* Image preview */}
        <div
          style={{
            width: "100%",
            height: 200,
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: "1.5rem",
            background: "var(--accent-soft)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* AI tagging note */}
        <div
          style={{
            background: "var(--accent-soft)",
            border: "1px solid var(--line)",
            borderRadius: 10,
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            fontSize: "0.8rem",
            color: "var(--accent)",
            lineHeight: 1.5,
          }}
        >
          <strong>AI Tagging:</strong> In the full version, AI will automatically identify and label your garment. For now, add details manually.
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Ivory Linen Blouse"
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem",
                borderRadius: 10,
                border: "1px solid var(--line)",
                background: "var(--bg)",
                color: "var(--ink)",
                fontSize: "0.9rem",
                fontFamily: "Georgia, serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem",
                borderRadius: 10,
                border: "1px solid var(--line)",
                background: "var(--bg)",
                color: "var(--ink)",
                fontSize: "0.9rem",
                fontFamily: "Georgia, serif",
                outline: "none",
                appearance: "none",
                cursor: "pointer",
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", display: "block", marginBottom: "0.4rem" }}>
              Tags <span style={{ textTransform: "none", letterSpacing: 0, fontStyle: "italic" }}>(comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="e.g. romantic, vintage, feminine"
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem",
                borderRadius: 10,
                border: "1px solid var(--line)",
                background: "var(--bg)",
                color: "var(--ink)",
                fontSize: "0.9rem",
                fontFamily: "Georgia, serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              style={{
                flex: 1,
                padding: "0.65rem 1rem",
                borderRadius: 999,
                background: "var(--accent)",
                color: "var(--paper)",
                border: "none",
                fontSize: "0.9rem",
                cursor: submitting || !name.trim() ? "default" : "pointer",
                fontFamily: "Georgia, serif",
                opacity: submitting || !name.trim() ? 0.6 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {submitting ? "Adding…" : "Add to Closet"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "0.65rem 1.25rem",
                borderRadius: 999,
                background: "transparent",
                color: "var(--muted)",
                border: "1px solid var(--line)",
                fontSize: "0.9rem",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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
