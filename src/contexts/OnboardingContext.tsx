import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface OnboardingState {
  hasGeneratedToken: boolean;
  hasViewedMCP: boolean;
  hasTalkedToAssistant: boolean;
  isWidgetDismissed: boolean;
}

interface OnboardingContextValue extends OnboardingState {
  markToken: () => void;
  markMCP: () => void;
  markAssistant: () => void;
  dismiss: () => void;
  completedCount: number;
  totalTasks: number;
}

const STORAGE_KEY = "aikit_getting_started";
const TOTAL = 3;

function load(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { hasGeneratedToken: false, hasViewedMCP: false, hasTalkedToAssistant: false, isWidgetDismissed: false };
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

  const completedCount = [state.hasGeneratedToken, state.hasViewedMCP, state.hasTalkedToAssistant].filter(Boolean).length;

  const value: OnboardingContextValue = {
    ...state,
    markToken: () => update({ hasGeneratedToken: true }),
    markMCP: () => update({ hasViewedMCP: true }),
    markAssistant: () => update({ hasTalkedToAssistant: true }),
    dismiss: () => update({ isWidgetDismissed: true }),
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
