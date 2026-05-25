"use client";

import { useState, useRef, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Role = "user" | "ai";

interface Message {
  id: number;
  role: Role;
  text: string | string[]; // string[] = paragraphs
}

// ── Initial conversation ──────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "user",
    text: "I have a wedding in two weeks in late October. I want to feel like a romantic gothic fairy without being inappropriate.",
  },
  {
    id: 2,
    role: "ai",
    text: [
      "That is such a beautiful direction — and late October is honestly the perfect season to pull it off with genuine depth rather than costume energy. My first instinct is your Empire Waist Dress in that dusty mocha tone paired with the Lace Insert Blouse layered underneath. The empire waist creates an ethereal, almost pre-Raphaelite silhouette, and having the lace peek through at the neckline and sleeves adds that fairy-tale dimension without reading as theatrical. You already own both pieces, which means you're working with a foundation that's harmonious rather than thrown together.",
      "For colour palette, I'd anchor everything in deep earth tones — think midnight burgundy, smoked plum, and the warm near-black of your ankle boots. Avoid anything with a hard blue-black or cool grey undertone, which can read gothic-costume rather than gothic-romantic. Warm, slightly desaturated hues keep the aesthetic feeling like a painting. Your beaded scarf could work as a wrist wrap or tucked into a low chignon rather than worn traditionally — it would add just enough eccentricity. A structured velvet or satin ribbon in your hair would complete the look beautifully at essentially zero cost.",
    ],
  },
  {
    id: 3,
    role: "user",
    text: "What about shoes?",
  },
  {
    id: 4,
    role: "ai",
    text: [
      "Your Ankle Boots in that deep espresso brown are genuinely ideal here — the slightly blunt toe and stacked heel carry a Victorian undertone that aligns perfectly with the romantic-gothic aesthetic. They're grounded enough not to compete with the dress's fluid movement, and the warm leather tone bridges your earth-toned palette without introducing a new colour story. If the ceremony and reception are both indoors, you could consider a low-heeled mule in velvet or brocade for a softer silhouette — but honestly, the ankle boots are the more distinctive choice and they'll be comfortable for a full evening, which matters.",
    ],
  },
  {
    id: 5,
    role: "user",
    text: "Do I need to buy anything?",
  },
  {
    id: 6,
    role: "ai",
    text: [
      "You have approximately 87% coverage for this look with what's already in your closet — which is genuinely strong. The one gap I can identify is a dark structured clutch or small evening bag. Your current accessories lean toward scarves and statement pieces, and a compact bag in black velvet, deep burgundy satin, or antique-finish leather would anchor the outfit and give you somewhere to carry essentials without a strap breaking the silhouette.",
      "Before you buy new, I'd strongly suggest checking ThredUp or Poshmark first — vintage and pre-loved evening bags in exactly this aesthetic are abundant and often dramatically underpriced. Search terms like 'velvet evening bag', 'antique brass clasp clutch', or 'satin minaudière' should surface good candidates in the $18–45 range. That's the only thing I'd add. Everything else you need is already hanging in your closet.",
    ],
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

// ── Sub-components ────────────────────────────────────────────────────────────

function FCAvatar() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          color: "var(--paper)",
          letterSpacing: "0.04em",
          fontFamily: "Georgia, serif",
        }}
      >
        FC
      </span>
    </div>
  );
}

function AiMessage({ message }: { message: Message }) {
  const paragraphs = Array.isArray(message.text) ? message.text : [message.text];

  return (
    <div className="flex items-start gap-3" style={{ maxWidth: "78%" }}>
      <FCAvatar />
      <div
        style={{
          background: "var(--accent-soft)",
          border: "1px solid var(--line)",
          borderRadius: "4px 16px 16px 16px",
          padding: "1rem 1.15rem",
        }}
      >
        {paragraphs.map((para, i) => (
          <p
            key={i}
            style={{
              fontSize: "0.88rem",
              color: "var(--ink)",
              lineHeight: 1.75,
              margin: i < paragraphs.length - 1 ? "0 0 0.85rem" : 0,
            }}
          >
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: Message }) {
  const text = Array.isArray(message.text) ? message.text.join(" ") : message.text;

  return (
    <div className="flex justify-end">
      <div
        style={{
          background: "var(--accent)",
          borderRadius: "16px 4px 16px 16px",
          padding: "0.75rem 1.1rem",
          maxWidth: "68%",
        }}
      >
        <p style={{ fontSize: "0.88rem", color: "var(--paper)", lineHeight: 1.65, margin: 0 }}>
          {text}
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(INITIAL_MESSAGES.length + 1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: nextId.current++, role: "user", text: trimmed };

    const aiMsg: Message = {
      id: nextId.current++,
      role: "ai",
      text: [
        "That's a great question. Based on your Style DNA and current closet, I'm pulling together a few thoughts for you — your wardrobe has more range than you might realise, and I want to make sure we're using every piece strategically.",
        "Let me look at your recent additions and wear patterns to give you a more tailored answer. In the meantime, feel free to share any additional context — occasion, season, or specific pieces you're thinking about.",
      ],
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  }

  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
      }}
    >
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col"
        style={{
          width: 240,
          flexShrink: 0,
          background: "var(--paper)",
          borderRight: "1px solid var(--line)",
          padding: "1.75rem 1.25rem",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--muted)",
            marginBottom: "0.75rem",
          }}
        >
          Quick Actions
        </p>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action}
            onClick={() => {
              setInputValue(action);
            }}
            style={{
              textAlign: "left",
              padding: "0.6rem 0.85rem",
              borderRadius: 10,
              border: "1px solid var(--line)",
              background: "transparent",
              color: "var(--muted)",
              fontSize: "0.8rem",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
              lineHeight: 1.4,
              transition: "all 0.12s",
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

        {/* Divider */}
        <div style={{ height: 1, background: "var(--line)", margin: "1rem 0" }} />

        <div
          style={{
            padding: "0.85rem",
            borderRadius: 12,
            background: "var(--accent-soft)",
            border: "1px solid var(--line)",
          }}
        >
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", marginBottom: "0.3rem" }}>
            Your Style DNA
          </p>
          <p style={{ fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.55 }}>
            Romantic · Vintage · Earthy<br />
            Body type: Petite hourglass<br />
            Palette: Warm earth tones
          </p>
        </div>
      </aside>

      {/* ── Chat area ────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--line)",
            background: "var(--paper)",
          }}
        >
          <div className="flex items-center gap-3">
            <FCAvatar />
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--ink)", margin: 0 }}>
                AI Stylist
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--sage)", margin: 0 }}>
                Online · 24 items in your closet
              </p>
            </div>
          </div>
        </div>

        {/* Messages scroll area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Conversation intro label */}
          <div className="text-center">
            <span
              style={{
                display: "inline-block",
                fontSize: "0.7rem",
                color: "var(--muted)",
                padding: "0.2rem 0.9rem",
                borderRadius: 999,
                background: "var(--paper)",
                border: "1px solid var(--line)",
              }}
            >
              Conversation started
            </span>
          </div>

          {/* Message thread */}
          {messages.map((msg) =>
            msg.role === "ai" ? (
              <AiMessage key={msg.id} message={msg} />
            ) : (
              <UserMessage key={msg.id} message={msg} />
            )
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid var(--line)",
            background: "var(--paper)",
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your stylist anything about your wardrobe…"
            style={{
              flex: 1,
              padding: "0.7rem 1.1rem",
              borderRadius: 999,
              border: "1.5px solid var(--line)",
              background: "var(--bg)",
              color: "var(--ink)",
              fontSize: "0.88rem",
              fontFamily: "Georgia, serif",
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim()}
            style={{
              padding: "0.7rem 1.35rem",
              borderRadius: 999,
              background: inputValue.trim() ? "var(--accent)" : "var(--line)",
              color: inputValue.trim() ? "var(--paper)" : "var(--muted)",
              border: "none",
              fontSize: "0.85rem",
              cursor: inputValue.trim() ? "pointer" : "default",
              fontFamily: "Georgia, serif",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              whiteSpace: "nowrap",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="none"
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
            Send
          </button>
        </div>

        {/* Mobile quick actions strip */}
        <div
          className="flex md:hidden overflow-x-auto gap-2 px-4 pb-3 pt-1"
          style={{ borderTop: "1px solid var(--line)", background: "var(--paper)" }}
        >
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => setInputValue(action)}
              style={{
                whiteSpace: "nowrap",
                padding: "0.35rem 0.9rem",
                borderRadius: 999,
                border: "1px solid var(--line)",
                background: "transparent",
                color: "var(--muted)",
                fontSize: "0.75rem",
                cursor: "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
