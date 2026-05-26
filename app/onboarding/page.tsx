"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

// ── Types ──────────────────────────────────────────────────────────────────

type GoalChoice = "refine" | "discover" | "both" | null;
type MeasurementsMode = "easy" | "advanced";

interface StyleAnswers {
  goal: GoalChoice;
  measurementMode: MeasurementsMode;
  // Step 1 – Easy Mode
  clothingSize: string;
  shoeSize: string;
  braCupSize: string;
  fitPreference: string;
  // Step 1 – Advanced Mode
  bust: string;
  waist: string;
  hips: string;
  inseam: string;
  shoulderWidth: string;
  torsoLength: string;
  armLength: string;
  preferredRise: string;
  preferredSkirtLength: string;
  // Step 2 – Style quiz
  colorPalettes: string[];
  styleKeywords: string[];
  lifestyle: string[];
  sustainability: string[];
  // Step 3 – Inspiration
  pinterestUrl: string;
}

const STEP_TITLES = [
  "Your Goal",
  "Measurements",
  "Style Quiz",
  "Inspiration",
  "Your Style DNA",
];

const CLOTHING_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "1X", "2X", "3X+"];
const FIT_PREFS = ["Fitted", "Relaxed", "Oversized", "Body-skimming"];
const COLOR_PALETTES = [
  "Earthy neutrals",
  "Jewel tones",
  "Monochrome black",
  "Soft pastels",
  "Bold brights",
];
const STYLE_KEYWORDS = [
  "Romantic",
  "Vintage",
  "Bohemian",
  "Structured",
  "Gothic",
  "Cottagecore",
  "Minimalist",
  "Eclectic",
];
const LIFESTYLE_OPTIONS = [
  "Work / office",
  "Creative studio",
  "Outdoor activities",
  "Frequent events / dates",
  "Casual everyday",
  "Travel",
];
const SUSTAINABILITY_OPTIONS = [
  "Secondhand / vintage",
  "Natural fabrics",
  "Buy less / buy better",
  "Independent designers",
];

// ── Helpers ────────────────────────────────────────────────────────────────

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

// ── Shared UI primitives ───────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs uppercase tracking-widest mb-6 font-sans"
      style={{ color: "var(--muted)", letterSpacing: "0.15em" }}
    >
      {children}
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-sm font-semibold mb-2"
      style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
    >
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-shadow"
      style={{
        background: "var(--paper)",
        border: "1.5px solid var(--line)",
        color: "var(--ink)",
        fontFamily: "Georgia, serif",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
    />
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      className="flex items-center gap-3 cursor-pointer select-none"
      style={{ color: "var(--ink)" }}
    >
      <span
        className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
        style={{
          border: "1.5px solid var(--line)",
          background: checked ? "var(--accent)" : "var(--paper)",
          borderColor: checked ? "var(--accent)" : "var(--line)",
        }}
        onClick={onChange}
      >
        {checked && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path
              d="M1 4.5L4 7.5L10 1.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-sm" style={{ color: "var(--ink)" }}>
        {label}
      </span>
    </label>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm transition-colors"
      style={{
        background: active ? "var(--accent)" : "var(--paper)",
        color: active ? "white" : "var(--muted)",
        border: `1.5px solid ${active ? "var(--accent)" : "var(--line)"}`,
        fontFamily: "Georgia, serif",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

// ── Step 0: Goal ───────────────────────────────────────────────────────────

function StepGoal({
  goal,
  setGoal,
}: {
  goal: GoalChoice;
  setGoal: (g: GoalChoice) => void;
}) {
  const options: { id: GoalChoice; title: string; desc: string; icon: string }[] = [
    {
      id: "refine",
      title: "Refine my style",
      desc: "I know what I like — I want to sharpen it, fill the gaps, and get more from what I own.",
      icon: "✦",
    },
    {
      id: "discover",
      title: "Discover my style",
      desc: "I'm still exploring. Help me find my aesthetic, build a language for my taste, and start fresh.",
      icon: "◎",
    },
    {
      id: "both",
      title: "Both",
      desc: "Some pieces are certain, others aren't. I want to refine what works and discover what's missing.",
      icon: "⊹",
    },
  ];

  return (
    <div>
      <SectionLabel>Step 1 of 5</SectionLabel>
      <h2
        className="text-2xl md:text-3xl font-bold mb-2"
        style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
      >
        What brings you here?
      </h2>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        About 5–8 minutes to complete. You can always update your answers later.
      </p>

      <div className="flex flex-col gap-4">
        {options.map((opt) => {
          const active = goal === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setGoal(opt.id)}
              className="text-left rounded-2xl p-6 transition-all"
              style={{
                background: active ? "var(--accent-soft)" : "var(--paper)",
                border: `2px solid ${active ? "var(--accent)" : "var(--line)"}`,
                cursor: "pointer",
              }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="text-2xl leading-none mt-0.5 flex-shrink-0"
                  style={{ color: active ? "var(--accent)" : "var(--muted)" }}
                >
                  {opt.icon}
                </span>
                <div>
                  <p
                    className="font-semibold text-base mb-1"
                    style={{
                      color: active ? "var(--accent)" : "var(--ink)",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {opt.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {opt.desc}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 1: Measurements ───────────────────────────────────────────────────

function StepMeasurements({
  answers,
  setField,
  measurementMode,
  setMeasurementMode,
}: {
  answers: StyleAnswers;
  setField: (k: keyof StyleAnswers, v: string) => void;
  measurementMode: MeasurementsMode;
  setMeasurementMode: (m: MeasurementsMode) => void;
}) {
  return (
    <div>
      <SectionLabel>Step 2 of 5</SectionLabel>
      <h2
        className="text-2xl md:text-3xl font-bold mb-2"
        style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
      >
        Measurements &amp; Fit
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        Helps us suggest pieces that actually fit your body — not just a size chart.
      </p>

      {/* Mode toggle */}
      <div
        className="inline-flex rounded-full p-1 mb-8 gap-1"
        style={{ background: "var(--accent-soft)", border: "1px solid var(--line)" }}
      >
        {(["easy", "advanced"] as MeasurementsMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMeasurementMode(m)}
            className="px-5 py-2 rounded-full text-sm capitalize transition-all"
            style={{
              background: measurementMode === m ? "var(--accent)" : "transparent",
              color: measurementMode === m ? "white" : "var(--muted)",
              fontFamily: "Georgia, serif",
              cursor: "pointer",
              border: "none",
            }}
          >
            {m === "easy" ? "Easy Mode" : "Advanced Mode"}
          </button>
        ))}
      </div>

      {/* Easy Mode fields */}
      <div className="flex flex-col gap-6">
        <div>
          <FieldLabel>Clothing Size</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {CLOTHING_SIZES.map((sz) => (
              <Pill
                key={sz}
                active={answers.clothingSize === sz}
                onClick={() => setField("clothingSize", answers.clothingSize === sz ? "" : sz)}
              >
                {sz}
              </Pill>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Shoe Size (US)</FieldLabel>
          <div className="max-w-xs">
            <TextInput
              value={answers.shoeSize}
              onChange={(v) => setField("shoeSize", v)}
              placeholder="e.g. 8, 8.5, 9W"
            />
          </div>
        </div>

        <div>
          <FieldLabel>
            Bra / Chest Size{" "}
            <span className="text-xs font-normal" style={{ color: "var(--muted)" }}>
              (optional)
            </span>
          </FieldLabel>
          <div className="max-w-xs">
            <TextInput
              value={answers.braCupSize}
              onChange={(v) => setField("braCupSize", v)}
              placeholder="e.g. 34B, 36DD, 38C"
            />
          </div>
        </div>

        <div>
          <FieldLabel>Fit Preference</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {FIT_PREFS.map((fp) => (
              <Pill
                key={fp}
                active={answers.fitPreference === fp}
                onClick={() =>
                  setField("fitPreference", answers.fitPreference === fp ? "" : fp)
                }
              >
                {fp}
              </Pill>
            ))}
          </div>
        </div>

        {/* Advanced Mode extras */}
        {measurementMode === "advanced" && (
          <>
            <div
              className="rounded-xl px-5 py-4 mt-2"
              style={{ background: "var(--accent-soft)", border: "1px solid var(--line)" }}
            >
              <p className="text-sm" style={{ color: "var(--muted)", fontFamily: "Georgia, serif" }}>
                <strong style={{ color: "var(--ink)" }}>Guided diagrams coming soon.</strong> Enter
                measurements in inches or centimeters — just be consistent.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {(
                [
                  ["bust", "Bust / Chest (in or cm)"],
                  ["waist", "Waist (in or cm)"],
                  ["hips", "Hips (in or cm)"],
                  ["inseam", "Inseam (in or cm)"],
                  ["shoulderWidth", "Shoulder Width (in or cm)"],
                  ["torsoLength", "Torso Length (in or cm)"],
                  ["armLength", "Arm Length (in or cm)"],
                ] as [keyof StyleAnswers, string][]
              ).map(([field, label]) => (
                <div key={field}>
                  <FieldLabel>{label}</FieldLabel>
                  <TextInput
                    value={answers[field] as string}
                    onChange={(v) => setField(field, v)}
                    placeholder="e.g. 36"
                  />
                </div>
              ))}
            </div>

            <div>
              <FieldLabel>Preferred Rise</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {["Low", "Mid", "High", "Extra High"].map((r) => (
                  <Pill
                    key={r}
                    active={answers.preferredRise === r}
                    onClick={() =>
                      setField("preferredRise", answers.preferredRise === r ? "" : r)
                    }
                  >
                    {r}
                  </Pill>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>Preferred Skirt / Dress Length</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {["Mini", "Knee", "Midi", "Maxi"].map((len) => (
                  <Pill
                    key={len}
                    active={answers.preferredSkirtLength === len}
                    onClick={() =>
                      setField(
                        "preferredSkirtLength",
                        answers.preferredSkirtLength === len ? "" : len
                      )
                    }
                  >
                    {len}
                  </Pill>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Step 2: Style Quiz ─────────────────────────────────────────────────────

function StepStyleQuiz({
  answers,
  toggleArray,
}: {
  answers: StyleAnswers;
  toggleArray: (k: keyof StyleAnswers, val: string) => void;
}) {
  return (
    <div>
      <SectionLabel>Step 3 of 5</SectionLabel>
      <h2
        className="text-2xl md:text-3xl font-bold mb-2"
        style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
      >
        Your Style Signature
      </h2>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        Select everything that resonates. There are no wrong answers — this builds your Style DNA.
      </p>

      <div className="flex flex-col gap-8">
        {/* Color Palette */}
        <div>
          <FieldLabel>Favourite Color Palettes</FieldLabel>
          <div className="flex flex-col gap-3 mt-1">
            {COLOR_PALETTES.map((cp) => (
              <Checkbox
                key={cp}
                label={cp}
                checked={answers.colorPalettes.includes(cp)}
                onChange={() => toggleArray("colorPalettes", cp)}
              />
            ))}
          </div>
        </div>

        {/* Style Keywords */}
        <div>
          <FieldLabel>Style Keywords</FieldLabel>
          <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
            Select all that speak to you
          </p>
          <div className="flex flex-wrap gap-2">
            {STYLE_KEYWORDS.map((kw) => (
              <Pill
                key={kw}
                active={answers.styleKeywords.includes(kw)}
                onClick={() => toggleArray("styleKeywords", kw)}
              >
                {kw}
              </Pill>
            ))}
          </div>
        </div>

        {/* Lifestyle */}
        <div>
          <FieldLabel>Your Lifestyle</FieldLabel>
          <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
            Where do you spend most of your time?
          </p>
          <div className="flex flex-col gap-3">
            {LIFESTYLE_OPTIONS.map((lo) => (
              <Checkbox
                key={lo}
                label={lo}
                checked={answers.lifestyle.includes(lo)}
                onChange={() => toggleArray("lifestyle", lo)}
              />
            ))}
          </div>
        </div>

        {/* Sustainability */}
        <div>
          <FieldLabel>Sustainability Priorities</FieldLabel>
          <div className="flex flex-col gap-3 mt-1">
            {SUSTAINABILITY_OPTIONS.map((sp) => (
              <Checkbox
                key={sp}
                label={sp}
                checked={answers.sustainability.includes(sp)}
                onChange={() => toggleArray("sustainability", sp)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Inspiration ────────────────────────────────────────────────────

function StepInspiration({
  answers,
  setField,
}: {
  answers: StyleAnswers;
  setField: (k: keyof StyleAnswers, v: string) => void;
}) {
  return (
    <div>
      <SectionLabel>Step 4 of 5</SectionLabel>
      <h2
        className="text-2xl md:text-3xl font-bold mb-2"
        style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
      >
        Inspiration &amp; Mood
      </h2>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        Optional — but the more you share, the smarter your Style DNA becomes.
      </p>

      <div className="flex flex-col gap-8">
        {/* Pinterest */}
        <div>
          <FieldLabel>Pinterest Board URL</FieldLabel>
          <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
            Share a style board and we&apos;ll analyse your visual aesthetic automatically.
          </p>
          <TextInput
            value={answers.pinterestUrl}
            onChange={(v) => setField("pinterestUrl", v)}
            placeholder="https://pinterest.com/yourusername/style-board"
            type="url"
          />
        </div>

        {/* Image upload mock */}
        <div>
          <FieldLabel>Upload Inspiration Images</FieldLabel>
          <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
            Screenshots from your camera roll, saved looks, anything that captures your taste.
          </p>
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              border: "2px dashed var(--line)",
              background: "var(--paper)",
              cursor: "pointer",
            }}
          >
            <div className="text-3xl mb-3">📎</div>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}>
              Drag &amp; drop images here
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              or click to browse · JPG, PNG, WEBP up to 10 MB each
            </p>
            <p
              className="text-xs mt-3 italic"
              style={{ color: "var(--muted)" }}
            >
              Full upload support coming soon
            </p>
          </div>
        </div>

        {/* Upcoming sources */}
        <div>
          <FieldLabel>More Inspiration Sources — Coming Soon</FieldLabel>
          <div className="flex flex-col gap-3 mt-1">
            {[
              { icon: "🎵", name: "TikTok", desc: "Save your favourite #OOTD videos and let us extract the aesthetic" },
              { icon: "📸", name: "Instagram", desc: "Connect your saved posts for automatic style pattern detection" },
              { icon: "🧵", name: "Sewing Channels", desc: "Reference your favourite creators for fit, fabric, and construction inspiration" },
            ].map((src) => (
              <div
                key={src.name}
                className="flex items-start gap-4 rounded-xl px-4 py-3"
                style={{
                  background: "var(--accent-soft)",
                  border: "1px solid var(--line)",
                  opacity: 0.75,
                }}
              >
                <span className="text-xl flex-shrink-0">{src.icon}</span>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
                  >
                    {src.name}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {src.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Complete ───────────────────────────────────────────────────────

function StepComplete({
  answers,
  onComplete,
}: {
  answers: StyleAnswers;
  onComplete: () => void;
}) {
  const goalLabel =
    answers.goal === "refine"
      ? "Refine my style"
      : answers.goal === "discover"
      ? "Discover my style"
      : answers.goal === "both"
      ? "Refine + Discover"
      : "Not selected";

  const summaryRows = [
    { label: "Goal", value: goalLabel },
    { label: "Clothing Size", value: answers.clothingSize || "—" },
    { label: "Fit Preference", value: answers.fitPreference || "—" },
    {
      label: "Color Palettes",
      value: answers.colorPalettes.length ? answers.colorPalettes.join(", ") : "—",
    },
    {
      label: "Style Keywords",
      value: answers.styleKeywords.length ? answers.styleKeywords.join(", ") : "—",
    },
    {
      label: "Lifestyle",
      value: answers.lifestyle.length ? answers.lifestyle.join(", ") : "—",
    },
    {
      label: "Sustainability",
      value: answers.sustainability.length ? answers.sustainability.join(", ") : "—",
    },
    {
      label: "Pinterest",
      value: answers.pinterestUrl || "—",
    },
  ];

  return (
    <div>
      <SectionLabel>Step 5 of 5</SectionLabel>
      <h2
        className="text-2xl md:text-3xl font-bold mb-2"
        style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
      >
        Your Style DNA is being built…
      </h2>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        We&apos;re processing your answers and preparing your personalised wardrobe experience.
      </p>

      {/* Progress animation */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{ background: "var(--accent-soft)", border: "1px solid var(--line)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🧬</span>
          <p
            className="text-base font-semibold"
            style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
          >
            Building Style DNA profile
          </p>
        </div>

        {/* Animated progress bar */}
        <div
          className="rounded-full overflow-hidden mb-2"
          style={{ background: "var(--line)", height: "6px" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: "var(--accent)",
              width: "72%",
              transition: "width 1.5s ease",
            }}
          />
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Analysing preferences · Mapping aesthetics · Calibrating recommendations…
        </p>

        <div className="mt-5 flex flex-col gap-2">
          {[
            "✦ Style DNA profile created",
            "✦ Lifestyle context mapped",
            "◎ Connecting AI recommendation engine…",
          ].map((line, i) => (
            <p
              key={i}
              className="text-xs"
              style={{ color: i < 2 ? "var(--accent)" : "var(--muted)", fontFamily: "Georgia, serif" }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div
        className="rounded-2xl overflow-hidden mb-8"
        style={{ border: "1px solid var(--line)" }}
      >
        <div
          className="px-5 py-3"
          style={{ background: "var(--ink)" }}
        >
          <p
            className="text-xs uppercase tracking-widest font-sans"
            style={{ color: "var(--accent-soft)", letterSpacing: "0.15em" }}
          >
            Your Profile Summary
          </p>
        </div>
        <div style={{ background: "var(--paper)" }}>
          {summaryRows.map((row, i) => (
            <div
              key={row.label}
              className="flex gap-4 px-5 py-3"
              style={{
                borderBottom:
                  i < summaryRows.length - 1 ? "1px solid var(--line)" : "none",
              }}
            >
              <span
                className="text-xs w-32 flex-shrink-0 font-semibold"
                style={{ color: "var(--muted)", fontFamily: "Georgia, serif", paddingTop: "2px" }}
              >
                {row.label}
              </span>
              <span
                className="text-sm leading-relaxed"
                style={{ color: "var(--ink)", fontFamily: "Georgia, serif" }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="w-full text-center px-8 py-4 rounded-full text-white text-base font-medium transition-opacity hover:opacity-90"
        style={{ background: "var(--accent)", fontFamily: "Georgia, serif", border: "none", cursor: "pointer" }}
      >
        Go to My Closet →
      </button>

      <p className="text-xs text-center mt-4" style={{ color: "var(--muted)" }}>
        You can update your Style DNA at any time from your profile settings.
      </p>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useStore();

  const [step, setStep] = useState(0);
  const TOTAL_STEPS = 5;

  const [answers, setAnswers] = useState<StyleAnswers>({
    goal: null,
    measurementMode: "easy",
    clothingSize: "",
    shoeSize: "",
    braCupSize: "",
    fitPreference: "",
    bust: "",
    waist: "",
    hips: "",
    inseam: "",
    shoulderWidth: "",
    torsoLength: "",
    armLength: "",
    preferredRise: "",
    preferredSkirtLength: "",
    colorPalettes: [],
    styleKeywords: [],
    lifestyle: [],
    sustainability: [],
    pinterestUrl: "",
  });

  function setField(k: keyof StyleAnswers, v: string) {
    setAnswers((prev) => ({ ...prev, [k]: v }));
  }

  function setMeasurementMode(m: MeasurementsMode) {
    setAnswers((prev) => ({ ...prev, measurementMode: m }));
  }

  function toggleArray(k: keyof StyleAnswers, val: string) {
    setAnswers((prev) => ({
      ...prev,
      [k]: toggle(prev[k] as string[], val),
    }));
  }

  function handleComplete() {
    updateProfile({
      goalMode: answers.goal,
      measurementMode: answers.measurementMode,
      standardSize: answers.clothingSize,
      shoeSize: answers.shoeSize,
      braSize: answers.braCupSize,
      fitPreference: answers.fitPreference,
      bust: answers.bust,
      waist: answers.waist,
      hips: answers.hips,
      inseam: answers.inseam,
      shoulderWidth: answers.shoulderWidth,
      torsoLength: answers.torsoLength,
      armLength: answers.armLength,
      colorPalette: answers.colorPalettes,
      styleKeywords: answers.styleKeywords,
      lifestyle: answers.lifestyle,
      sustainability: answers.sustainability,
      pinterestUrl: answers.pinterestUrl,
      onboardingComplete: true,
    });
    router.push("/closet");
  }

  const progressPct = Math.round((step / (TOTAL_STEPS - 1)) * 100);

  const canAdvance =
    step === 0 ? answers.goal !== null : true;

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      {/* ── Top nav bar ── */}
      <div
        className="px-4 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--line)", background: "var(--paper)" }}
      >
        <Link
          href="/"
          className="text-sm font-semibold"
          style={{ color: "var(--accent)", fontFamily: "Georgia, serif" }}
        >
          ← Forever Closet AI
        </Link>
        <p
          className="text-xs font-sans uppercase tracking-widest"
          style={{ color: "var(--muted)", letterSpacing: "0.15em" }}
        >
          {STEP_TITLES[step]}
        </p>
        <span className="text-xs font-sans" style={{ color: "var(--muted)" }}>
          {step + 1} / {TOTAL_STEPS}
        </span>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ background: "var(--line)", height: "3px" }}>
        <div
          style={{
            height: "100%",
            width: `${progressPct}%`,
            background: "var(--accent)",
            transition: "width 0.35s ease",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="max-w-xl mx-auto px-4 py-12">
        {step === 0 && (
          <StepGoal goal={answers.goal} setGoal={(g) => setField("goal", g as string)} />
        )}
        {step === 1 && (
          <StepMeasurements
            answers={answers}
            setField={setField}
            measurementMode={answers.measurementMode}
            setMeasurementMode={setMeasurementMode}
          />
        )}
        {step === 2 && (
          <StepStyleQuiz answers={answers} toggleArray={toggleArray} />
        )}
        {step === 3 && (
          <StepInspiration answers={answers} setField={setField} />
        )}
        {step === 4 && (
          <StepComplete answers={answers} onComplete={handleComplete} />
        )}

        {/* ── Navigation ── */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-12 gap-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-6 py-3 rounded-full text-sm transition-colors"
                style={{
                  border: "1.5px solid var(--line)",
                  color: "var(--muted)",
                  background: "var(--paper)",
                  fontFamily: "Georgia, serif",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance}
              className="px-8 py-3 rounded-full text-sm font-medium transition-opacity"
              style={{
                background: canAdvance ? "var(--accent)" : "var(--line)",
                color: canAdvance ? "white" : "var(--muted)",
                fontFamily: "Georgia, serif",
                cursor: canAdvance ? "pointer" : "not-allowed",
                border: "none",
                opacity: canAdvance ? 1 : 0.6,
              }}
            >
              {step === 3 ? "Build My Style DNA →" : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
