import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type GuideId = "keys" | "models" | "mcp" | null;

interface OnboardingState {
  hasGeneratedToken: boolean;
  hasViewedModels: boolean;
  hasViewedMCP: boolean;
  isWidgetDismissed: boolean;
  activeGuide: GuideId;
}

interface OnboardingContextValue extends OnboardingState {
  markToken: () => void;
  markModels: () => void;
  markMCP: () => void;
  dismiss: () => void;
  setActiveGuide: (g: GuideId) => void;
  completeGuide: (g: "keys" | "models" | "mcp") => void;
  completedCount: number;
  totalTasks: number;
}

const STORAGE_KEY = "aikit_getting_started";
const TOTAL = 3;

function load(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { hasGeneratedToken: false, hasViewedModels: false, hasViewedMCP: false, isWidgetDismissed: false, activeGuide: null, ...parsed };
    }
  } catch {}
  return { hasGeneratedToken: false, hasViewedModels: false, hasViewedMCP: false, isWidgetDismissed: false, activeGuide: null };
}

function save(s: OnboardingState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

const Ctx = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(load);

  const update = useCallback((partial: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      save(next);
      return next;
    });
  }, []);

  const completedCount = [state.hasGeneratedToken, state.hasViewedModels, state.hasViewedMCP].filter(Boolean).length;

  const completeGuide = useCallback((g: "keys" | "models" | "mcp") => {
    const map: Record<string, Partial<OnboardingState>> = {
      keys: { hasGeneratedToken: true },
      models: { hasViewedModels: true },
      mcp: { hasViewedMCP: true },
    };
    update({ ...map[g], activeGuide: null });
  }, [update]);

  const value: OnboardingContextValue = {
    ...state,
    markToken: () => update({ hasGeneratedToken: true }),
    markModels: () => update({ hasViewedModels: true }),
    markMCP: () => update({ hasViewedMCP: true }),
    dismiss: () => update({ isWidgetDismissed: true }),
    setActiveGuide: (g) => update({ activeGuide: g }),
    completeGuide,
    completedCount,
    totalTasks: TOTAL,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
