"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { SupabaseUser } from "@/lib/supabase";

// ── Types ────────────────────────────────────────────────────────────────────

export type OptimizationStatus =
  | "keep" | "style_more" | "alter" | "archive" | "sell" | "donate" | "release";

export interface ClosetItem {
  id: string;
  name: string;
  category: string;
  color: string;
  imageDataUrl?: string;
  tags: string[];
  badge: string;
  badgeColor: string;
  worn: number;
  addedAt: number;
  colorName?: string;
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
  topSizes: string[];
  bottomSizes: string[];
  dressSizes: string[];
  shoeSize: string;
  braSize: string;
  fitPreference: string;
  bust: string; waist: string; hips: string;
  inseam: string; shoulderWidth: string; torsoLength: string; armLength: string;
  colorPalette: string[];
  styleKeywords: string[];
  lifestyle: string[];
  sustainability: string[];
  sensoryPrefs: string[];
  pinterestUrl: string;
  onboardingComplete: boolean;
}

interface StoreState {
  profile: UserProfile;
  closet: ClosetItem[];
  savedOutfits: string[][];
}

interface StoreContext extends StoreState {
  user: SupabaseUser | null;
  updateProfile: (patch: Partial<UserProfile>) => void;
  addClosetItem: (item: Omit<ClosetItem, "id" | "addedAt">) => void;
  removeClosetItem: (id: string) => void;
  updateClosetItem: (id: string, patch: Partial<ClosetItem>) => void;
  clearCloset: () => void;
  signOut: () => Promise<void>;
}

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEMO_CLOSET: ClosetItem[] = [
  { id: "d1",  name: "Bias-cut Midi Skirt",  category: "Bottoms",     color: "var(--rose)",        tags: ["romantic","vintage","feminine"],      badge: "Keep",       badgeColor: "var(--sage)", worn: 12, addedAt: 0 },
  { id: "d2",  name: "Peasant Blouse",        category: "Tops",        color: "var(--accent-soft)", tags: ["bohemian","earthy","relaxed"],         badge: "Style More", badgeColor: "var(--gold)", worn: 4,  addedAt: 0 },
  { id: "d3",  name: "Corset Bodice",         category: "Tops",        color: "var(--accent)",      tags: ["romantic","dramatic","vintage"],       badge: "Keep",       badgeColor: "var(--sage)", worn: 7,  addedAt: 0 },
  { id: "d4",  name: "Slip Dress",            category: "Dresses",     color: "#c9b99a",            tags: ["minimal","layering","versatile"],      badge: "Style More", badgeColor: "var(--gold)", worn: 9,  addedAt: 0 },
  { id: "d5",  name: "Puff Sleeve Top",       category: "Tops",        color: "var(--sage)",        tags: ["romantic","whimsical","statement"],    badge: "Alter",      badgeColor: "var(--rose)", worn: 2,  addedAt: 0 },
  { id: "d6",  name: "Fit-and-Flare Dress",  category: "Dresses",     color: "#8b7355",            tags: ["classic","feminine","occasion"],       badge: "Keep",       badgeColor: "var(--sage)", worn: 6,  addedAt: 0 },
  { id: "d7",  name: "Bateau Neck Sweater",   category: "Tops",        color: "#b5a898",            tags: ["classic","earthy","cozy"],            badge: "Keep",       badgeColor: "var(--sage)", worn: 14, addedAt: 0 },
  { id: "d8",  name: "Wide-Leg Trousers",     category: "Bottoms",     color: "#2f2a25",            tags: ["modern","relaxed","versatile"],        badge: "Style More", badgeColor: "var(--gold)", worn: 5,  addedAt: 0 },
  { id: "d9",  name: "Empire Waist Dress",    category: "Dresses",     color: "#7a6e64",            tags: ["romantic","vintage","evening"],        badge: "Keep",       badgeColor: "var(--sage)", worn: 8,  addedAt: 0 },
  { id: "d10", name: "Linen Blazer",          category: "Outerwear",   color: "var(--gold)",        tags: ["tailored","earthy","structured"],      badge: "Keep",       badgeColor: "var(--sage)", worn: 11, addedAt: 0 },
  { id: "d11", name: "Ankle Boots",           category: "Shoes",       color: "#4a3728",            tags: ["classic","grounded","versatile"],      badge: "Keep",       badgeColor: "var(--sage)", worn: 18, addedAt: 0 },
  { id: "d12", name: "Beaded Scarf",          category: "Accessories", color: "var(--rose)",        tags: ["bohemian","vintage","statement"],      badge: "Style More", badgeColor: "var(--gold)", worn: 3,  addedAt: 0 },
];

const DEFAULT_PROFILE: UserProfile = {
  goalMode: null, measurementMode: null, standardSize: "", topSizes: [], bottomSizes: [],
  dressSizes: [], shoeSize: "", braSize: "", fitPreference: "", bust: "", waist: "", hips: "",
  inseam: "", shoulderWidth: "", torsoLength: "", armLength: "", colorPalette: [],
  styleKeywords: [], lifestyle: [], sustainability: [], sensoryPrefs: [], pinterestUrl: "",
  onboardingComplete: false,
};

const DEFAULT_STATE: StoreState = { profile: DEFAULT_PROFILE, closet: DEMO_CLOSET, savedOutfits: [] };

// ── localStorage helpers ──────────────────────────────────────────────────────

const STORAGE_KEY = "fc_store_v1";

function loadLocal(): StoreState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const p = JSON.parse(raw) as Partial<StoreState>;
    return {
      profile: { ...DEFAULT_PROFILE, ...p.profile },
      closet: p.closet?.length ? p.closet : DEMO_CLOSET,
      savedOutfits: p.savedOutfits ?? [],
    };
  } catch { return DEFAULT_STATE; }
}

function saveLocal(state: StoreState) {
  try {
    const safe: StoreState = {
      ...state,
      closet: state.closet.map((item) => ({
        ...item,
        imageDataUrl: item.imageDataUrl && item.imageDataUrl.length < 500_000
          ? item.imageDataUrl : undefined,
      })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch { /* quota exceeded — ignore */ }
}

// ── Supabase row mappers ──────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(row: any): ClosetItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    color: row.color || "var(--accent-soft)",
    colorName: row.color_name || undefined,
    imageDataUrl: undefined, // images stay in localStorage only
    tags: row.tags || [],
    badge: row.badge || "Keep",
    badgeColor: row.badge_color || "var(--sage)",
    worn: row.worn ?? 0,
    addedAt: row.added_at ?? 0,
    garmentType: row.garment_type || undefined,
    silhouette: row.silhouette || undefined,
    fabric: row.fabric || undefined,
    eraInfluence: row.era_influence || undefined,
    fitStatus: row.fit_status || undefined,
    seasonality: row.seasonality || undefined,
    closetRole: row.closet_role || undefined,
    notes: row.notes || undefined,
  };
}

function toRow(item: ClosetItem, userId: string) {
  return {
    id: item.id,
    user_id: userId,
    name: item.name,
    category: item.category,
    color: item.color,
    color_name: item.colorName ?? "",
    tags: item.tags,
    badge: item.badge,
    badge_color: item.badgeColor,
    worn: item.worn,
    added_at: item.addedAt,
    garment_type: item.garmentType ?? null,
    silhouette: item.silhouette ?? null,
    fabric: item.fabric ?? null,
    era_influence: item.eraInfluence ?? null,
    fit_status: item.fitStatus ?? null,
    seasonality: item.seasonality ?? null,
    closet_role: item.closetRole ?? null,
    notes: item.notes ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function profileFromRow(row: any): Partial<UserProfile> {
  return {
    goalMode: row.goal_mode ?? null,
    measurementMode: row.measurement_mode ?? null,
    standardSize: row.standard_size ?? "",
    topSizes: row.top_sizes ?? [],
    bottomSizes: row.bottom_sizes ?? [],
    dressSizes: row.dress_sizes ?? [],
    shoeSize: row.shoe_size ?? "",
    braSize: row.bra_size ?? "",
    fitPreference: row.fit_preference ?? "",
    bust: row.bust ?? "", waist: row.waist ?? "", hips: row.hips ?? "",
    inseam: row.inseam ?? "", shoulderWidth: row.shoulder_width ?? "",
    torsoLength: row.torso_length ?? "", armLength: row.arm_length ?? "",
    colorPalette: row.color_palette ?? [],
    styleKeywords: row.style_keywords ?? [],
    lifestyle: row.lifestyle ?? [],
    sustainability: row.sustainability ?? [],
    sensoryPrefs: row.sensory_prefs ?? [],
    pinterestUrl: row.pinterest_url ?? "",
    onboardingComplete: row.onboarding_complete ?? false,
  };
}

function profileToRow(p: UserProfile) {
  return {
    goal_mode: p.goalMode,
    measurement_mode: p.measurementMode,
    standard_size: p.standardSize,
    top_sizes: p.topSizes,
    bottom_sizes: p.bottomSizes,
    dress_sizes: p.dressSizes,
    shoe_size: p.shoeSize,
    bra_size: p.braSize,
    fit_preference: p.fitPreference,
    bust: p.bust, waist: p.waist, hips: p.hips,
    inseam: p.inseam, shoulder_width: p.shoulderWidth,
    torso_length: p.torsoLength, arm_length: p.armLength,
    color_palette: p.colorPalette,
    style_keywords: p.styleKeywords,
    lifestyle: p.lifestyle,
    sustainability: p.sustainability,
    sensory_prefs: p.sensoryPrefs,
    pinterest_url: p.pinterestUrl,
    onboarding_complete: p.onboardingComplete,
    updated_at: new Date().toISOString(),
  };
}

// ── Context ───────────────────────────────────────────────────────────────────

const Ctx = createContext<StoreContext | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(DEFAULT_STATE);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const userRef = useRef<SupabaseUser | null>(null);
  userRef.current = user;

  // Hydrate from localStorage on mount
  useEffect(() => {
    setState(loadLocal());
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    saveLocal(state);
  }, [state]);

  // ── Auth listener + Supabase sync ──────────────────────────────────────────
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) syncFromSupabase(u.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) syncFromSupabase(u.id);
      else {
        // Logged out — reload from localStorage
        setState(loadLocal());
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function syncFromSupabase(userId: string) {
    // Load profile
    const { data: profileRow } = await supabase
      .from("woven_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileRow) {
      const remoteProfile = { ...DEFAULT_PROFILE, ...profileFromRow(profileRow) };
      setState((s) => ({ ...s, profile: remoteProfile }));
    }

    // Load closet
    const { data: closetRows } = await supabase
      .from("woven_closet_items")
      .select("*")
      .eq("user_id", userId)
      .order("added_at", { ascending: false });

    if (closetRows && closetRows.length > 0) {
      // Merge: Supabase rows + local imageDataUrls (kept only in localStorage)
      const localState = loadLocal();
      const localImageMap = new Map(localState.closet.map((i) => [i.id, i.imageDataUrl]));
      const merged = closetRows.map((row) => ({
        ...fromRow(row),
        imageDataUrl: localImageMap.get(row.id),
      }));
      setState((s) => ({ ...s, closet: merged }));
    } else {
      // First login — push localStorage closet to Supabase
      const localState = loadLocal();
      const realItems = localState.closet.filter((i) => !i.id.startsWith("d"));
      if (realItems.length > 0) {
        const rows = realItems.map((item) => toRow(item, userId));
        await supabase.from("woven_closet_items").upsert(rows, { onConflict: "id" });
      }
    }
  }

  // ── Debounced profile sync ─────────────────────────────────────────────────
  const profileSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function syncProfileToSupabase(p: UserProfile, userId: string) {
    await supabase
      .from("woven_profiles")
      .upsert({ id: userId, ...profileToRow(p) }, { onConflict: "id" });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setState((s) => {
      const next = { ...s, profile: { ...s.profile, ...patch } };
      const uid = userRef.current?.id;
      if (uid) {
        if (profileSyncTimer.current) clearTimeout(profileSyncTimer.current);
        profileSyncTimer.current = setTimeout(() => {
          syncProfileToSupabase(next.profile, uid);
        }, 1500);
      }
      return next;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addClosetItem = useCallback((item: Omit<ClosetItem, "id" | "addedAt">) => {
    const full: ClosetItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      addedAt: Date.now(),
    };
    setState((s) => ({ ...s, closet: [full, ...s.closet] }));
    const uid = userRef.current?.id;
    if (uid) {
      supabase.from("woven_closet_items").upsert(toRow(full, uid), { onConflict: "id" });
    }
  }, []);

  const removeClosetItem = useCallback((id: string) => {
    setState((s) => ({ ...s, closet: s.closet.filter((i) => i.id !== id) }));
    const uid = userRef.current?.id;
    if (uid) {
      supabase.from("woven_closet_items").delete().eq("id", id).eq("user_id", uid);
    }
  }, []);

  const updateClosetItem = useCallback((id: string, patch: Partial<ClosetItem>) => {
    setState((s) => ({
      ...s,
      closet: s.closet.map((i) => {
        if (i.id !== id) return i;
        const updated = { ...i, ...patch };
        const uid = userRef.current?.id;
        if (uid) {
          supabase.from("woven_closet_items").update(toRow(updated, uid)).eq("id", id).eq("user_id", uid);
        }
        return updated;
      }),
    }));
  }, []);

  const clearCloset = useCallback(() => {
    setState((s) => ({ ...s, closet: [] }));
    const uid = userRef.current?.id;
    if (uid) {
      supabase.from("woven_closet_items").delete().eq("user_id", uid);
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <Ctx.Provider value={{ ...state, user, updateProfile, addClosetItem, removeClosetItem, updateClosetItem, clearCloset, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
