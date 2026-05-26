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
      "Welcome to your Forever Closet stylist. I know your wardrobe, your style profile, and your goals. Ask me anything — what to wear today, whether to keep a piece, how to build an outfit, or whether a purchase makes sense for your closet.",
  },
  {
    role: "user",
    content:
      "I have a wedding in two weeks in late October. I want to feel like a romantic gothic fairy without being inappropriate.",
  },
  {
    role: "assistant",
    content:
      "That is such a beautiful direction — and late October is honestly the perfect season to pull it off with genuine depth rather than costume energy. My first instinct is your Empire Waist Dress in that dusty mocha tone paired with the Lace Insert Blouse layered underneath. The empire waist creates an ethereal, almost pre-Raphaelite silhouette, and having the lace peek through at the neckline and sleeves adds that fairy-tale dimension without reading as theatrical. You already own both pieces, which means you're working with a foundation that's harmonious rather than thrown together.\n\nFor colour palette, I'd anchor everything in deep earth tones — think midnight burgundy, smoked plum, and the warm near-black of your ankle boots. Avoid anything with a hard blue-black or cool grey undertone, which can read gothic-costume rather than gothic-romantic. Warm, slightly desaturated hues keep the aesthetic feeling like a painting. Your beaded scarf could work as a wrist wrap or tucked into a low chignon rather than worn traditionally — it would add just enough eccentricity. A structured velvet or satin ribbon in your hair would complete the look beautifully at essentially zero cost.",
  },
];

// ── Quick actions ─────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  "What should I wear today?",
  "Help me style this piece",
  "Should I keep or release?",
  "Plan a capsule wardrobe",
  "Shopping decision help",
  "What's missing in my closet?",
];

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 0",
      }}
      aria-label="typing"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent)",
            opacity: 0.5,
            display: "inline-block",
            animation: `fcPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes fcPulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function FCAvatar() {
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 1px 4px rgba(111,79,63,0.18)",
      }}
    >
      <span
        style={{
          fontSize: "0.58rem",
          fontWeight: 700,
          color: "var(--paper)",
          letterSpacing: "0.05em",
          fontFamily: "Georgia, serif",
        }}
      >
        FC
      </span>
    </div>
  );
}

// ── Message bubbles ───────────────────────────────────────────────────────────

function AssistantMessage({
  content,
  isStreaming,
}: {
  content: string;
  isStreaming?: boolean;
}) {
  // Split on double newlines for paragraph rendering
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        maxWidth: "80%",
      }}
    >
      <FCAvatar />
      <div
        style={{
          background: "var(--accent-soft)",
          border: "1px solid var(--line)",
          borderRadius: "4px 18px 18px 18px",
          padding: "1rem 1.2rem",
          boxShadow: "0 1px 3px rgba(111,79,63,0.07)",
        }}
      >
        {paragraphs.length > 0 ? (
          paragraphs.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: "0.875rem",
                color: "var(--ink)",
                lineHeight: 1.8,
                margin: i < paragraphs.length - 1 ? "0 0 0.85rem" : 0,
                fontFamily: "Georgia, serif",
              }}
            >
              {para}
            </p>
          ))
        ) : isStreaming ? null : null}
        {isStreaming && (
          <span
            style={{
              display: "inline-block",
              marginTop: paragraphs.length > 0 ? "0.6rem" : 0,
            }}
          >
            <TypingDots />
          </span>
        )}
      </div>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div
        style={{
          background: "var(--accent)",
          borderRadius: "18px 4px 18px 18px",
          padding: "0.8rem 1.15rem",
          maxWidth: "68%",
          boxShadow: "0 1px 4px rgba(111,79,63,0.15)",
        }}
      >
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--paper)",
            lineHeight: 1.7,
            margin: 0,
            fontFamily: "Georgia, serif",
          }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

// ── No-key banner ─────────────────────────────────────────────────────────────

function NoKeyBanner() {
  return (
    <div
      role="alert"
      style={{
        margin: "0 1.5rem 1rem",
        padding: "0.9rem 1.1rem",
        borderRadius: 10,
        border: "1.5px solid var(--gold)",
        background: "#fdf8ee",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.65rem",
      }}
    >
      <span style={{ fontSize: "1rem", flexShrink: 0 }}>🔑</span>
      <p
        style={{
          margin: 0,
          fontSize: "0.8rem",
          color: "#7a6030",
          lineHeight: 1.6,
          fontFamily: "Georgia, serif",
        }}
      >
        Add your{" "}
        <code
          style={{
            background: "#f3e9d2",
            padding: "1px 5px",
            borderRadius: 4,
            fontSize: "0.78rem",
            fontFamily: "monospace",
          }}
        >
          ANTHROPIC_API_KEY
        </code>{" "}
        to{" "}
        <code
          style={{
            background: "#f3e9d2",
            padding: "1px 5px",
            borderRadius: 4,
            fontSize: "0.78rem",
            fontFamily: "monospace",
          }}
        >
          .env.local
        </code>{" "}
        to enable real AI.{" "}
        <Link
          href="/.env.local.example"
          target="_blank"
          style={{ color: "var(--gold)", textDecoration: "underline" }}
        >
          See .env.local.example
        </Link>{" "}
        for instructions.
      </p>
    </div>
  );
}

// ── Style DNA sidebar card ────────────────────────────────────────────────────

function StyleDnaCard({
  styleKeywords,
  colorPalette,
}: {
  styleKeywords: string[];
  colorPalette: string[];
}) {
  const hasData = styleKeywords.length > 0 || colorPalette.length > 0;

  if (!hasData) {
    return (
      <div
        style={{
          padding: "0.9rem 1rem",
          borderRadius: 12,
          background: "var(--accent-soft)",
          border: "1px solid var(--line)",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--accent)",
            margin: "0 0 0.4rem",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          Style DNA
        </p>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--muted)",
            lineHeight: 1.55,
            margin: "0 0 0.65rem",
          }}
        >
          Complete onboarding to build your Style DNA.
        </p>
        <Link
          href="/onboarding"
          style={{
            fontSize: "0.75rem",
            color: "var(--accent)",
            textDecoration: "underline",
            fontFamily: "Georgia, serif",
          }}
        >
          Start onboarding →
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "0.9rem 1rem",
        borderRadius: 12,
        background: "var(--accent-soft)",
        border: "1px solid var(--line)",
      }}
    >
      <p
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          color: "var(--accent)",
          margin: "0 0 0.6rem",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        Your Style DNA
      </p>
      {styleKeywords.length > 0 && (
        <div style={{ marginBottom: "0.55rem" }}>
          <p
            style={{
              fontSize: "0.67rem",
              color: "var(--muted)",
              margin: "0 0 0.3rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Aesthetic
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {styleKeywords.slice(0, 5).map((kw) => (
              <span
                key={kw}
                style={{
                  fontSize: "0.7rem",
                  color: "var(--ink)",
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: 999,
                  padding: "2px 8px",
                  fontFamily: "Georgia, serif",
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
      {colorPalette.length > 0 && (
        <div>
          <p
            style={{
              fontSize: "0.67rem",
              color: "var(--muted)",
              margin: "0 0 0.3rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Palette
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {colorPalette.slice(0, 5).map((c) => (
              <span
                key={c}
                style={{
                  fontSize: "0.7rem",
                  color: "var(--ink)",
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  borderRadius: 999,
                  padding: "2px 8px",
                  fontFamily: "Georgia, serif",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { profile } = useStore();
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showNoKeyBanner, setShowNoKeyBanner] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll whenever messages change or streaming content updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Auto-resize textarea
  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    const lineH = 24;
    const maxH = lineH * 3 + 20; // ~3 rows
    el.style.height = Math.min(el.scrollHeight, maxH) + "px";
  }

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

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
          body: JSON.stringify({ messages: nextMessages, profile }),
          signal: controller.signal,
        });

        // Handle no-key 503
        if (response.status === 503) {
          const json = await response.json();
          if (json.error === "no_api_key") {
            setShowNoKeyBanner(true);
            setIsStreaming(false);
            setStreamingContent("");
            // Add a fallback assistant message so the thread doesn't look broken
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content:
                  "AI responses are currently unavailable — please configure your API key to continue.",
              },
            ]);
            return;
          }
        }

        if (!response.ok || !response.body) {
          throw new Error(`API error: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setStreamingContent(accumulated);
        }

        // Finalise: move streamed content into messages array
        const finalContent = accumulated.trim();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: finalContent },
        ]);
        setStreamingContent("");
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("Chat error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Something went wrong — please try again in a moment.",
          },
        ]);
        setStreamingContent("");
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, profile, isStreaming]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  }

  function handleQuickAction(action: string) {
    setInputValue(action);
    textareaRef.current?.focus();
  }

  const canSend = inputValue.trim().length > 0 && !isStreaming;

  return (
    <div
      style={{
        background: "var(--bg)",
        height: "calc(100vh - 56px)",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: "var(--paper)",
          borderRight: "1px solid var(--line)",
          padding: "1.75rem 1.15rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.45rem",
        }}
        className="hidden md:flex"
      >
        <p
          style={{
            fontSize: "0.67rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--muted)",
            margin: "0 0 0.65rem",
          }}
        >
          Quick Actions
        </p>

        {QUICK_ACTIONS.map((action) => (
          <button
            key={action}
            onClick={() => handleQuickAction(action)}
            style={{
              textAlign: "left",
              padding: "0.55rem 0.85rem",
              borderRadius: 10,
              border: "1px solid var(--line)",
              background: "transparent",
              color: "var(--muted)",
              fontSize: "0.78rem",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
              lineHeight: 1.45,
              transition: "background 0.12s, color 0.12s, border-color 0.12s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-soft)";
              e.currentTarget.style.color = "var(--accent)";
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--muted)";
              e.currentTarget.style.borderColor = "var(--line)";
            }}
          >
            {action}
          </button>
        ))}

        <div
          style={{
            height: 1,
            background: "var(--line)",
            margin: "1rem 0 0.85rem",
          }}
        />

        <StyleDnaCard
          styleKeywords={profile.styleKeywords}
          colorPalette={profile.colorPalette}
        />
      </aside>

      {/* ── Main chat column ─────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.1rem 1.5rem",
            borderBottom: "1px solid var(--line)",
            background: "var(--paper)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexShrink: 0,
          }}
        >
          <FCAvatar />
          <div>
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "var(--ink)",
                margin: 0,
                fontFamily: "Georgia, serif",
              }}
            >
              AI Stylist
            </p>
            <p
              style={{
                fontSize: "0.73rem",
                color: isStreaming ? "var(--rose)" : "var(--sage)",
                margin: 0,
                fontFamily: "Georgia, serif",
              }}
            >
              {isStreaming ? "Thinking…" : "Online · knows your wardrobe"}
            </p>
          </div>
        </div>

        {/* No-key banner */}
        {showNoKeyBanner && (
          <div style={{ paddingTop: "0.85rem" }}>
            <NoKeyBanner />
          </div>
        )}

        {/* Messages scroll area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.5rem 1.5rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.15rem",
          }}
        >
          {/* Thread start label */}
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "0.68rem",
                color: "var(--muted)",
                padding: "0.2rem 1rem",
                borderRadius: 999,
                background: "var(--paper)",
                border: "1px solid var(--line)",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.03em",
              }}
            >
              Your Forever Closet session
            </span>
          </div>

          {/* Committed messages */}
          {messages.map((msg, i) =>
            msg.role === "assistant" ? (
              <AssistantMessage key={i} content={msg.content} />
            ) : (
              <UserMessage key={i} content={msg.content} />
            )
          )}

          {/* Live streaming message */}
          {isStreaming && (
            <AssistantMessage
              content={streamingContent}
              isStreaming={true}
            />
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Mobile quick-action strip */}
        <div
          className="flex md:hidden"
          style={{
            overflowX: "auto",
            gap: "0.5rem",
            padding: "0.6rem 1rem",
            borderTop: "1px solid var(--line)",
            background: "var(--paper)",
            flexShrink: 0,
          }}
        >
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              style={{
                whiteSpace: "nowrap",
                padding: "0.3rem 0.85rem",
                borderRadius: 999,
                border: "1px solid var(--line)",
                background: "transparent",
                color: "var(--muted)",
                fontSize: "0.73rem",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
                flexShrink: 0,
              }}
            >
              {action}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div
          className="pb-4 md:pb-0"
          style={{
            padding: "0.85rem 1.25rem",
            borderTop: "1px solid var(--line)",
            background: "var(--paper)",
            display: "flex",
            gap: "0.65rem",
            alignItems: "flex-end",
            flexShrink: 0,
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder="Ask your stylist anything about your wardrobe…"
            style={{
              flex: 1,
              padding: "0.7rem 1.1rem",
              borderRadius: 14,
              border: "1.5px solid var(--line)",
              background: isStreaming ? "var(--bg)" : "var(--bg)",
              color: "var(--ink)",
              fontSize: "0.875rem",
              fontFamily: "Georgia, serif",
              outline: "none",
              resize: "none",
              lineHeight: "1.5",
              minHeight: 44,
              maxHeight: 92,
              overflowY: "auto",
              transition: "border-color 0.15s",
              opacity: isStreaming ? 0.6 : 1,
            }}
            onFocus={(e) => {
              if (!isStreaming)
                e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--line)";
            }}
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={!canSend}
            aria-label="Send message"
            style={{
              padding: "0 1.25rem",
              height: 44,
              borderRadius: 14,
              background: canSend ? "var(--accent)" : "var(--line)",
              color: canSend ? "var(--paper)" : "var(--muted)",
              border: "none",
              fontSize: "0.83rem",
              cursor: canSend ? "pointer" : "default",
              fontFamily: "Georgia, serif",
              transition: "background 0.15s, color 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              style={{ transform: "rotate(90deg)" }}
            >
              <path
                d="M10 2L10 18M10 2L4 8M10 2L16 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isStreaming ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
