"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export type OptimizationStatus =
  | "keep"
  | "style_more"
  | "alter"
  | "archive"
  | "sell"
  | "donate"
  | "release";

export interface ClosetItem {
  id: string;
  name: string;
  category: string;
  color: string;          // CSS color string (var or hex)
  imageDataUrl?: string;  // base64 data URL from real upload
  tags: string[];
  badge: string;
  badgeColor: string;
  worn: number;
  addedAt: number;        // timestamp
  garmentType?: string;
  silhouette?: string;
  fabric?: string;
  eraInfluence?: string;
  fitStatus?: string;
  seasonality?: string;
  closetRole?: string;
  notes?: string;
}

export interface UserProfile {
  goalMode: "refine" | "discover" | "both" | null;
  measurementMode: "easy" | "advanced" | null;
  standardSize: string;
  shoeSize: string;
  braSize: string;
  fitPreference: string;
  bust: string;
  waist: string;
  hips: string;
  inseam: string;
  shoulderWidth: string;
  torsoLength: string;
  armLength: string;
  colorPalette: string[];
  styleKeywords: string[];
  lifestyle: string[];
  sustainability: string[];
  pinterestUrl: string;
  onboardingComplete: boolean;
}

interface StoreState {
  profile: UserProfile;
  closet: ClosetItem[];
  savedOutfits: string[][];   // arrays of item IDs
}

interface StoreContext extends StoreState {
  updateProfile: (patch: Partial<UserProfile>) => void;
  addClosetItem: (item: Omit<ClosetItem, "id" | "addedAt">) => void;
  removeClosetItem: (id: string) => void;
  updateClosetItem: (id: string, patch: Partial<ClosetItem>) => void;
  clearCloset: () => void;
}

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEMO_CLOSET: ClosetItem[] = [
  { id: "d1", name: "Bias-cut Midi Skirt",   category: "Bottoms",     color: "var(--rose)",        tags: ["romantic","vintage","feminine"],      badge: "Keep",       badgeColor: "var(--sage)", worn: 12, addedAt: 0 },
  { id: "d2", name: "Peasant Blouse",         category: "Tops",        color: "var(--accent-soft)", tags: ["bohemian","earthy","relaxed"],         badge: "Style More", badgeColor: "var(--gold)", worn: 4,  addedAt: 0 },
  { id: "d3", name: "Corset Bodice",          category: "Tops",        color: "var(--accent)",      tags: ["romantic","dramatic","vintage"],       badge: "Keep",       badgeColor: "var(--sage)", worn: 7,  addedAt: 0 },
  { id: "d4", name: "Slip Dress",             category: "Dresses",     color: "#c9b99a",            tags: ["minimal","layering","versatile"],      badge: "Style More", badgeColor: "var(--gold)", worn: 9,  addedAt: 0 },
  { id: "d5", name: "Puff Sleeve Top",        category: "Tops",        color: "var(--sage)",        tags: ["romantic","whimsical","statement"],    badge: "Alter",      badgeColor: "var(--rose)", worn: 2,  addedAt: 0 },
  { id: "d6", name: "Fit-and-Flare Dress",   category: "Dresses",     color: "#8b7355",            tags: ["classic","feminine","occasion"],       badge: "Keep",       badgeColor: "var(--sage)", worn: 6,  addedAt: 0 },
  { id: "d7", name: "Bateau Neck Sweater",    category: "Tops",        color: "#b5a898",            tags: ["classic","earthy","cozy"],            badge: "Keep",       badgeColor: "var(--sage)", worn: 14, addedAt: 0 },
  { id: "d8", name: "Wide-Leg Trousers",      category: "Bottoms",     color: "#2f2a25",            tags: ["modern","relaxed","versatile"],        badge: "Style More", badgeColor: "var(--gold)", worn: 5,  addedAt: 0 },
  { id: "d9", name: "Empire Waist Dress",     category: "Dresses",     color: "#7a6e64",            tags: ["romantic","vintage","evening"],        badge: "Keep",       badgeColor: "var(--sage)", worn: 8,  addedAt: 0 },
  { id: "d10", name: "Linen Blazer",          category: "Outerwear",   color: "var(--gold)",        tags: ["tailored","earthy","structured"],      badge: "Keep",       badgeColor: "var(--sage)", worn: 11, addedAt: 0 },
  { id: "d11", name: "Ankle Boots",           category: "Shoes",       color: "#4a3728",            tags: ["classic","grounded","versatile"],      badge: "Keep",       badgeColor: "var(--sage)", worn: 18, addedAt: 0 },
  { id: "d12", name: "Beaded Scarf",          category: "Accessories", color: "var(--rose)",        tags: ["bohemian","vintage","statement"],      badge: "Style More", badgeColor: "var(--gold)", worn: 3,  addedAt: 0 },
];

const DEFAULT_PROFILE: UserProfile = {
  goalMode: null, measurementMode: null, standardSize: "", shoeSize: "", braSize: "",
  fitPreference: "", bust: "", waist: "", hips: "", inseam: "", shoulderWidth: "",
  torsoLength: "", armLength: "", colorPalette: [], styleKeywords: [], lifestyle: [],
  sustainability: [], pinterestUrl: "", onboardingComplete: false,
};

const DEFAULT_STATE: StoreState = {
  profile: DEFAULT_PROFILE,
  closet: DEMO_CLOSET,
  savedOutfits: [],
};

// ── Context ───────────────────────────────────────────────────────────────────

const Ctx = createContext<StoreContext | null>(null);

const STORAGE_KEY = "fc_store_v1";

function load(): StoreState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    return {
      profile: { ...DEFAULT_PROFILE, ...parsed.profile },
      closet: parsed.closet?.length ? parsed.closet : DEMO_CLOSET,
      savedOutfits: parsed.savedOutfits ?? [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function save(state: StoreState) {
  try {
    // strip large imageDataUrls from closet for quota safety — keep if small
    const safe: StoreState = {
      ...state,
      closet: state.closet.map((item) => ({
        ...item,
        imageDataUrl: item.imageDataUrl && item.imageDataUrl.length < 500_000
          ? item.imageDataUrl
          : undefined,
      })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch {
    // storage quota exceeded — silently ignore
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(DEFAULT_STATE);

  // hydrate from localStorage after mount
  useEffect(() => {
    setState(load());
  }, []);

  // persist on every change
  useEffect(() => {
    save(state);
  }, [state]);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  }, []);

  const addClosetItem = useCallback((item: Omit<ClosetItem, "id" | "addedAt">) => {
    const full: ClosetItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      addedAt: Date.now(),
    };
    setState((s) => ({ ...s, closet: [full, ...s.closet] }));
  }, []);

  const removeClosetItem = useCallback((id: string) => {
    setState((s) => ({ ...s, closet: s.closet.filter((i) => i.id !== id) }));
  }, []);

  const updateClosetItem = useCallback((id: string, patch: Partial<ClosetItem>) => {
    setState((s) => ({
      ...s,
      closet: s.closet.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    }));
  }, []);

  const clearCloset = useCallback(() => {
    setState((s) => ({ ...s, closet: [] }));
  }, []);

  return (
    <Ctx.Provider
      value={{
        ...state,
        updateProfile,
        addClosetItem,
        removeClosetItem,
        updateClosetItem,
        clearCloset,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
