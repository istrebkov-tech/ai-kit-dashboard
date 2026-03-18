import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type GuideId = "keys" | "models" | "mcp" | null;

interface OnboardingState {
  hasGeneratedToken: boolean;
  hasViewedModels: boolean;
  hasViewedMCP: boolean;
  isWidgetDismissed: boolean;
  activeGuide: GuideId;
  userToken: string | null;
  selectedModel: string;
  selectedMCP: string | null;
}

interface OnboardingContextValue extends OnboardingState {
  markToken: (token?: string) => void;
  markModels: (model?: string) => void;
  markMCP: (mcp?: string) => void;
  dismiss: () => void;
  setActiveGuide: (g: GuideId) => void;
  completeGuide: (g: "keys" | "models" | "mcp") => void;
  setUserToken: (t: string | null) => void;
  setSelectedModel: (m: string) => void;
  setSelectedMCP: (m: string | null) => void;
  completedCount: number;
  totalTasks: number;
}

const STORAGE_KEY = "aikit_getting_started";
const TOTAL = 3;

const defaults: OnboardingState = {
  hasGeneratedToken: false,
  hasViewedModels: false,
  hasViewedMCP: false,
  isWidgetDismissed: false,
  activeGuide: null,
  userToken: null,
  selectedModel: "gpt-4o",
  selectedMCP: null,
};

function load(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {}
  return { ...defaults };
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
    markToken: (token) => update({ hasGeneratedToken: true, ...(token ? { userToken: token } : {}) }),
    markModels: (model) => update({ hasViewedModels: true, ...(model ? { selectedModel: model } : {}) }),
    markMCP: (mcp) => update({ hasViewedMCP: true, ...(mcp ? { selectedMCP: mcp } : {}) }),
    dismiss: () => update({ isWidgetDismissed: true }),
    setActiveGuide: (g) => update({ activeGuide: g }),
    completeGuide,
    setUserToken: (t) => update({ userToken: t }),
    setSelectedModel: (m) => update({ selectedModel: m }),
    setSelectedMCP: (m) => update({ selectedMCP: m }),
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
