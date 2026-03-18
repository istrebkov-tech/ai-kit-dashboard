import { useState, useEffect, useCallback } from "react";
import { Key, Blocks, DatabaseZap, Bot, Sparkles, ChevronLeft, ChevronRight, Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Rocket,
    emoji: "🚀",
    title: "Добро пожаловать в AI Kit Console",
    text: "Мы создали мощный конструктор для разработчиков. Здесь есть всё, чтобы собрать своего LLM-агента и подключить его к корпоративным данным за пару минут, не разворачивая свою инфраструктуру.",
    primary: "Посмотреть за 2 минуты",
    secondary: "Пропустить, я знаю что делать",
  },
  {
    icon: Key,
    emoji: "🧠",
    title: "Шаг 1: Единая точка доступа к LLM",
    text: 'Забудьте про десятки аккаунтов. В разделе **API Ключи** вы генерируете один токен, который даёт вашему бэкенду доступ к лучшим мировым моделям (GPT-4o, Claude 3.5 и др.). Вы полностью контролируете квоты, лимиты и расходы в одном окне.',
  },
  {
    icon: Blocks,
    emoji: "🛠️",
    title: 'Шаг 2: Дайте агенту "Руки"',
    text: "Ваша нейросеть ничего не знает о вашей компании? В разделе **Инструменты MCP** вас ждут 170+ готовых интеграций. Подключите агента к Jira, Google Workspace, GitHub (DeepWiki) или базе данных (Text2SQL) просто скопировав `npx`-команду конфигурации.",
  },
  {
    icon: DatabaseZap,
    emoji: "📚",
    title: "Шаг 3: Векторный RAG Поиск",
    text: "Если базового поиска мало, используйте наш специализированный **RAG Search MCP**. Загрузите в него свою базу знаний, и ваш агент научится давать ответы, основанные строго на ваших корпоративных регламентах и документах.",
  },
  {
    icon: Bot,
    emoji: "🤖",
    title: "Шаг 4: Не начинайте с нуля",
    text: "В **Реестре Агентов** лежат готовые шаблоны (Product Discovery, Orchestrator). Вы можете использовать их как референс-архитектуру или напрямую вызывать их эндпоинты, чтобы посмотреть, как платформа работает в бою.",
  },
  {
    icon: Sparkles,
    emoji: "✨",
    title: "Шаг 5: Ваш персональный помощник",
    text: "Застряли? Нажмите `⌘K` или кликните по иконке со звёздами. Встроенный AI-ассистент знает всю архитектуру AI Kit. Он поможет собрать кукбук (Cookbook), объяснит любую ошибку API и подскажет правильную архитектуру интеграции.",
  },
];

const accentColors = [
  { bg: "bg-primary/10", text: "text-primary" },
  { bg: "bg-amber-100/60", text: "text-amber-600" },
  { bg: "bg-emerald-100/60", text: "text-emerald-600" },
  { bg: "bg-sky-100/60", text: "text-sky-600" },
  { bg: "bg-violet-100/60", text: "text-violet-600" },
  { bg: "bg-rose-100/60", text: "text-rose-500" },
];

interface OnboardingTourProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingTour({ open, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animating, setAnimating] = useState(false);

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const step = steps[currentStep];
  const Icon = step.icon;
  const accent = accentColors[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const animateStep = useCallback((next: number, dir: "forward" | "backward") => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(next);
      setAnimating(false);
    }, 150);
  }, []);

  const nextStep = useCallback(() => {
    if (isLast) {
      onComplete();
      setCurrentStep(0);
    } else {
      animateStep(currentStep + 1, "forward");
    }
  }, [currentStep, isLast, onComplete, animateStep]);

  const prevStep = useCallback(() => {
    if (!isFirst) animateStep(currentStep - 1, "backward");
  }, [currentStep, isFirst, animateStep]);

  const skip = useCallback(() => {
    onComplete();
    setCurrentStep(0);
  }, [onComplete]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
      if (e.key === "Enter") nextStep();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, skip, nextStep]);

  if (!open) return null;

  // Bold markdown helper — simple **text** → <strong>
  const renderText = (t: string) => {
    const parts = t.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((p, i) => {
      if (p.startsWith("**") && p.endsWith("**"))
        return <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
      if (p.startsWith("`") && p.endsWith("`"))
        return <code key={i} className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono text-foreground">{p.slice(1, -1)}</code>;
      return <span key={i}>{p}</span>;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="max-w-2xl w-full mx-4 bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={skip}
          className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div
          className={cn(
            "flex-1 px-8 pt-8 pb-6 transition-all duration-150 ease-out",
            animating && direction === "forward" && "opacity-0 translate-x-4",
            animating && direction === "backward" && "opacity-0 -translate-x-4",
            !animating && "opacity-100 translate-x-0"
          )}
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {currentStep + 1} / {steps.length}
            </span>
            <div className="flex gap-1 ml-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === currentStep ? "w-5 bg-primary" : i < currentStep ? "w-2 bg-primary/40" : "w-2 bg-muted-foreground/20"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Icon */}
          <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-5", accent.bg)}>
            <Icon className={cn("w-7 h-7", accent.text)} strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-foreground mb-3 leading-tight">
            {step.title}
          </h2>

          {/* Body */}
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
            {renderText(step.text)}
          </p>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 flex items-center justify-between">
          <button
            onClick={skip}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Пропустить
          </button>

          <div className="flex items-center gap-2">
            {isFirst && step.secondary && (
              <Button variant="ghost" size="sm" onClick={skip} className="text-muted-foreground">
                {step.secondary}
              </Button>
            )}
            {!isFirst && (
              <Button variant="outline" size="sm" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Назад
              </Button>
            )}
            <Button size="sm" onClick={nextStep}>
              {isFirst && step.primary
                ? step.primary
                : isLast
                ? "Начать работу"
                : "Дальше"}
              {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
