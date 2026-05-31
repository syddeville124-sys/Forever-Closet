"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ── Seeded conversation ───────────────────────────────────────────────────────

const SEED_MESSAGES: Message[] = [
  {
    role: "assistant",
    content:
      "Welcome to Woven. I know your wardrobe, your style profile, and your goals. Ask me anything — what to wear today, whether to keep a piece, how to build an outfit, or whether a purchase makes sense for your closet.",
  },
  {
    role: "user",
    content:
      "I have a wedding in two weeks in late October. I want to feel like a romantic gothic fairy without being inappropriate.",
  },
  {
    role: "assistant",
    content:
      "That is such a beautiful direction — and late October is honestly the perfect season to pull it off with genuine depth rather than costume energy. My first instinct is your Empire Waist Dress in that dusty mocha tone paired with the Lace Insert Blouse layered underneath. The empire waist creates an ethereal, almost pre-Raphaelite silhouette, and having the lace peek through at the neckline and sleeves adds that fairy-tale dimension without reading as theatrical. You already own both pieces, which means you're working with a foundation that's harmonious rather than thrown together.\n\nFor colour palette, I'd anchor everything in deep earth tones — think midnight burgundy, smoked plum, and the warm near-black of your ankle boots. Avoid anything with a hard blue-black or cool grey undertone, which can read gothic-costume rather than gothic-romantic. Warm, slightly desaturated hues keep the aesthetic feeling like a painting. Your beaded scarf could work as a wrist wrap or tucked into a low chignon rather than worn traditionally — it would add just enough eccentricity.",
  },
];

const QUICK_ACTIONS = [
  "What should I wear today?",
  "Help me style this piece",
  "Should I keep or release?",
  "Plan a capsule wardrobe",
  "Shopping decision help",
  "What's missing in my closet?",
];

// ── Sub-components ────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 0" }} aria-label="typing">
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", opacity: 0.5, display: "inline-block", animation: `fcPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes fcPulse { 0%,80%,100% { opacity:.25; transform:scale(.85) } 40% { opacity:1; transform:scale(1.1) } }`}</style>
    </span>
  );
}

function FCAvatar() {
  return (
    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 4px rgba(111,79,63,0.18)" }}>
      <span style={{ fontSize: "0.58rem", fontWeight: 700, color: "var(--paper)", letterSpacing: "0.05em", fontFamily: "Georgia, serif" }}>FC</span>
    </div>
  );
}

function AssistantMessage({ content, isStreaming }: { content: string; isStreaming?: boolean }) {
  const paragraphs = content.split(/\n\n+/).map((p) => p.replace(/\n/g, " ").trim()).filter(Boolean);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", maxWidth: "84%" }}>
      <FCAvatar />
      <div style={{ background: "var(--accent-soft)", border: "1px solid var(--line)", borderRadius: "4px 18px 18px 18px", padding: "0.9rem 1.1rem", boxShadow: "0 1px 3px rgba(111,79,63,0.07)" }}>
        {paragraphs.map((para, i) => (
          <p key={i} style={{ fontSize: "0.875rem", color: "var(--ink)", lineHeight: 1.8, margin: i < paragraphs.length - 1 ? "0 0 0.8rem" : 0, fontFamily: "Georgia, serif" }}>
            {para}
          </p>
        ))}
        {isStreaming && <span style={{ display: "inline-block", marginTop: paragraphs.length > 0 ? "0.6rem" : 0 }}><TypingDots /></span>}
      </div>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ background: "var(--accent)", borderRadius: "18px 4px 18px 18px", padding: "0.8rem 1.1rem", maxWidth: "72%", boxShadow: "0 1px 4px rgba(111,79,63,0.15)" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--paper)", lineHeight: 1.7, margin: 0, fontFamily: "Georgia, serif" }}>{content}</p>
      </div>
    </div>
  );
}

function StyleDnaCard({ styleKeywords, colorPalette }: { styleKeywords: string[]; colorPalette: string[] }) {
  const hasData = styleKeywords.length > 0 || colorPalette.length > 0;
  return (
    <div style={{ padding: "0.9rem 1rem", borderRadius: 12, background: "var(--accent-soft)", border: "1px solid var(--line)" }}>
      <p style={{ fontSize: "0.67rem", fontWeight: 700, color: "var(--accent)", margin: "0 0 0.6rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>
        Your Style DNA
      </p>
      {!hasData ? (
        <>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.55, margin: "0 0 0.65rem" }}>Complete onboarding to build your Style DNA.</p>
          <Link href="/onboarding" style={{ fontSize: "0.75rem", color: "var(--accent)", textDecoration: "underline", fontFamily: "Georgia, serif" }}>Start onboarding →</Link>
        </>
      ) : (
        <>
          {styleKeywords.length > 0 && (
            <div style={{ marginBottom: "0.55rem" }}>
              <p style={{ fontSize: "0.67rem", color: "var(--muted)", margin: "0 0 0.3rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Aesthetic</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {styleKeywords.slice(0, 5).map((kw) => (
                  <span key={kw} style={{ fontSize: "0.7rem", color: "var(--ink)", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 999, padding: "2px 8px", fontFamily: "Georgia, serif" }}>{kw}</span>
                ))}
              </div>
            </div>
          )}
          {colorPalette.length > 0 && (
            <div>
              <p style={{ fontSize: "0.67rem", color: "var(--muted)", margin: "0 0 0.3rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Palette</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {colorPalette.slice(0, 3).map((c) => (
                  <span key={c} style={{ fontSize: "0.7rem", color: "var(--ink)", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 999, padding: "2px 8px", fontFamily: "Georgia, serif" }}>{c}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Sidebar content (shared between drawer + desktop panel) ───────────────────

function SidebarContent({
  profile,
  closetCount,
  onActionClick,
  onClose,
}: {
  profile: ReturnType<typeof useStore>["profile"];
  closetCount: number;
  onActionClick: (a: string) => void;
  onClose?: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", height: "100%", overflowY: "auto" }}>
      {/* Close button — mobile only */}
      {onClose && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.25rem" }}>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 8, color: "var(--muted)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Closet awareness pill */}
      {closetCount > 0 && (
        <div style={{ marginBottom: "0.65rem", padding: "0.45rem 0.75rem", borderRadius: 8, background: "var(--accent-soft)", border: "1px solid var(--line)", fontSize: "0.72rem", color: "var(--accent)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4C2.9 7 2 7.9 2 9v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/><path d="M16 7V5c0-1.1-.9-2-2-2h-4C8.9 3 8 3.9 8 5v2"/></svg>
          Knows your {closetCount} closet items
        </div>
      )}

      <p style={{ fontSize: "0.67rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", margin: "0 0 0.4rem" }}>
        Quick Actions
      </p>

      {QUICK_ACTIONS.map((action) => (
        <button
          key={action}
          onClick={() => { onActionClick(action); onClose?.(); }}
          style={{ textAlign: "left", padding: "0.55rem 0.85rem", borderRadius: 10, border: "1px solid var(--line)", background: "transparent", color: "var(--muted)", fontSize: "0.78rem", cursor: "pointer", fontFamily: "Georgia, serif", lineHeight: 1.45, transition: "background 0.12s, color 0.12s, border-color 0.12s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-soft)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--line)"; }}
        >
          {action}
        </button>
      ))}

      <div style={{ height: 1, background: "var(--line)", margin: "0.85rem 0" }} />

      <StyleDnaCard styleKeywords={profile.styleKeywords} colorPalette={profile.colorPalette} />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { profile, closet } = useStore();
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showNoKeyBanner, setShowNoKeyBanner] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Close drawer on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setDrawerOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (drawerOpen) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 92) + "px";
  }

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setInputValue("");
    setShowNoKeyBanner(false);

    const userMessage: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setStreamingContent("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          profile,
          closet: closet.map((i) => ({
            name: i.name,
            category: i.category,
            tags: i.tags,
            badge: i.badge,
            worn: i.worn,
            fabric: i.fabric,
            silhouette: i.silhouette,
            eraInfluence: i.eraInfluence,
            colorName: i.colorName,
          })),
        }),
        signal: controller.signal,
      });

      if (response.status === 503) {
        const json = await response.json();
        if (json.error === "no_api_key") {
          setShowNoKeyBanner(true);
          setIsStreaming(false);
          setMessages((prev) => [...prev, { role: "assistant", content: "AI responses are currently unavailable — please configure your API key to continue." }]);
          return;
        }
      }

      if (!response.ok || !response.body) throw new Error(`API error: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setStreamingContent(accumulated);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: accumulated.trim() }]);
      setStreamingContent("");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong — please try again in a moment." }]);
      setStreamingContent("");
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, profile, isStreaming]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(inputValue); }
  }

  function handleQuickAction(action: string) {
    setInputValue(action);
    textareaRef.current?.focus();
  }

  const canSend = inputValue.trim().length > 0 && !isStreaming;

  return (
    <>
      {/* ── Mobile drawer backdrop ──────────────────────────────────────────── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(47,42,37,0.35)", zIndex: 40, backdropFilter: "blur(2px)" }}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile slide-in drawer ──────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          background: "var(--paper)",
          borderRight: "1px solid var(--line)",
          padding: "1.5rem 1.15rem",
          zIndex: 50,
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          overflowY: "auto",
          boxShadow: drawerOpen ? "4px 0 24px rgba(47,42,37,0.12)" : "none",
        }}
        className="lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Stylist menu"
      >
        <SidebarContent profile={profile} closetCount={closet.length} onActionClick={handleQuickAction} onClose={() => setDrawerOpen(false)} />
      </div>

      {/* ── Main layout ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--bg)",
          display: "flex",
          // On mobile: fill available space between top nav and bottom nav
          // On desktop: fill below top nav only
          height: "calc(100dvh - 56px)",
          overflow: "hidden",
        }}
      >
        {/* ── Desktop persistent sidebar ──────────────────────────────────── */}
        <aside
          style={{ width: 240, flexShrink: 0, background: "var(--paper)", borderRight: "1px solid var(--line)", padding: "1.75rem 1.15rem", display: "flex", flexDirection: "column" }}
          className="hidden lg:flex"
        >
          <SidebarContent profile={profile} closetCount={closet.length} onActionClick={handleQuickAction} />
        </aside>

        {/* ── Chat column ─────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>

          {/* Header */}
          <div style={{ padding: "0.9rem 1rem 0.9rem 1rem", borderBottom: "1px solid var(--line)", background: "var(--paper)", display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0 }}>
            {/* Menu button — mobile only */}
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open stylist menu"
              className="lg:hidden"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 8, color: "var(--muted)", marginRight: "0.1rem", flexShrink: 0, WebkitTapHighlightColor: "transparent" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>

            <FCAvatar />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--ink)", margin: 0, fontFamily: "Georgia, serif" }}>AI Stylist</p>
              <p style={{ fontSize: "0.73rem", color: isStreaming ? "var(--rose)" : "var(--sage)", margin: 0, fontFamily: "Georgia, serif" }}>
                {isStreaming ? "Thinking…" : "Online · knows your wardrobe"}
              </p>
            </div>
          </div>

          {/* No-key banner */}
          {showNoKeyBanner && (
            <div style={{ margin: "0.75rem 1rem 0", padding: "0.85rem 1rem", borderRadius: 10, border: "1.5px solid var(--gold)", background: "#fdf8ee" }}>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#7a6030", lineHeight: 1.6, fontFamily: "Georgia, serif" }}>
                🔑 Add your <code style={{ background: "#f3e9d2", padding: "1px 5px", borderRadius: 4 }}>ANTHROPIC_API_KEY</code> to <code style={{ background: "#f3e9d2", padding: "1px 5px", borderRadius: 4 }}>.env.local</code> to enable real AI.
              </p>
            </div>
          )}

          {/* Messages area */}
          <div
            style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1rem 0.75rem", display: "flex", flexDirection: "column", gap: "1rem",
              // extra bottom padding on mobile so input doesn't overlap bottom nav
              paddingBottom: "0.75rem",
            }}
            className="pb-2 md:pb-3"
          >
            <div style={{ textAlign: "center" }}>
              <span style={{ display: "inline-block", fontSize: "0.68rem", color: "var(--muted)", padding: "0.2rem 1rem", borderRadius: 999, background: "var(--paper)", border: "1px solid var(--line)", fontFamily: "Georgia, serif", letterSpacing: "0.03em" }}>
                Woven · AI Stylist
              </span>
            </div>

            {messages.map((msg, i) =>
              msg.role === "assistant"
                ? <AssistantMessage key={i} content={msg.content} />
                : <UserMessage key={i} content={msg.content} />
            )}

            {isStreaming && <AssistantMessage content={streamingContent} isStreaming={true} />}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div
            style={{ padding: "0.75rem 0.85rem", borderTop: "1px solid var(--line)", background: "var(--paper)", display: "flex", gap: "0.6rem", alignItems: "flex-end", flexShrink: 0 }}
            // On mobile add extra bottom padding to clear the bottom nav
            className="pb-3 md:pb-2"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              placeholder="Ask your stylist anything…"
              style={{ flex: 1, padding: "0.65rem 1rem", borderRadius: 14, border: "1.5px solid var(--line)", background: "var(--bg)", color: "var(--ink)", fontSize: "0.875rem", fontFamily: "Georgia, serif", outline: "none", resize: "none", lineHeight: "1.5", minHeight: 42, maxHeight: 92, overflowY: "auto", transition: "border-color 0.15s", opacity: isStreaming ? 0.6 : 1 }}
              onFocus={(e) => { if (!isStreaming) e.currentTarget.style.borderColor = "var(--accent)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!canSend}
              aria-label="Send"
              style={{ width: 42, height: 42, borderRadius: 12, background: canSend ? "var(--accent)" : "var(--line)", color: canSend ? "var(--paper)" : "var(--muted)", border: "none", cursor: canSend ? "pointer" : "default", transition: "background 0.15s", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ transform: "rotate(90deg)" }}>
                <path d="M10 2L10 18M10 2L4 8M10 2L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
