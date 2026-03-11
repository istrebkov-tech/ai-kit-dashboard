import { useState } from "react";
import { Sparkles, Key, Cpu, Wrench, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Sparkles,
    title: "Добро пожаловать в AI Kit",
    description:
      "Единая точка входа для работы с искусственным интеллектом. Мы объединили лучшие LLM, агентов и инструменты в одном API, чтобы вы могли сфокусироваться на создании продуктов.",
    action: "Начать обзор",
  },
  {
    icon: Key,
    title: "Шаг 1. Получите ключ доступа",
    description:
      "Любое взаимодействие с платформой начинается с аутентификации. Создайте временный сессионный токен для быстрых тестов или выпустите постоянный API-ключ для ваших сервисов.",
    action: "Далее",
  },
  {
    icon: Cpu,
    title: "Шаг 2. Выберите нужную модель",
    description:
      "В разделе «LLM Модели» собрано более 100 языковых, визуальных и аудио моделей от OpenAI, Anthropic, Google и других. Просто скопируйте готовый cURL-запрос и начните генерировать контент.",
    action: "Далее",
  },
  {
    icon: Wrench,
    title: "Шаг 3. Подключите данные и Агентов",
    description:
      "Сделайте ИИ умнее! В разделе «Инструменты MCP» подключите корпоративные базы знаний (например, Jira). А в «Реестре Агентов» используйте готовых ИИ-ассистентов для автономного решения сложных задач.",
    action: "Завершить и начать работу",
  },
];

const iconBgColors = [
  "bg-primary/10",
  "bg-amber-50",
  "bg-emerald-50",
  "bg-violet-50",
];

const iconColors = [
  "text-primary",
  "text-amber-600",
  "text-emerald-600",
  "text-violet-600",
];

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onOpenChange(false);
      setStep(0);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSkip = () => {
    onOpenChange(false);
    setStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleSkip(); else onOpenChange(v); }}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Онбординг AI Kit</DialogTitle>

        <div className="flex min-h-[360px]">
          {/* Left illustration area */}
          <div className={cn(
            "hidden sm:flex w-[220px] shrink-0 flex-col items-center justify-center transition-colors duration-500",
            iconBgColors[step]
          )}>
            <div className={cn(
              "rounded-2xl p-5 transition-all duration-500",
              iconColors[step]
            )}>
              <Icon className="w-16 h-16" strokeWidth={1.5} />
            </div>
            <div className="mt-6 flex items-center gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === step ? "w-6 bg-foreground/70" : "w-1.5 bg-foreground/20"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Right content area */}
          <div className="flex-1 flex flex-col p-8">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-3 tracking-wide uppercase">
                Шаг {step + 1} из {steps.length}
              </p>
              <h2 className="text-xl font-semibold text-foreground mb-3 leading-tight">
                {current.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Bottom controls */}
            <div className="flex items-center justify-between pt-6 mt-auto">
              <button
                onClick={handleSkip}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Пропустить
              </button>

              <div className="flex items-center gap-2">
                {step > 0 && (
                  <Button variant="outline" size="sm" onClick={handleBack}>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Назад
                  </Button>
                )}
                <Button size="sm" onClick={handleNext}>
                  {current.action}
                  {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
                </Button>
              </div>
            </div>

            {/* Mobile dots */}
            <div className="flex sm:hidden items-center justify-center gap-1.5 mt-4">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === step ? "w-6 bg-foreground/70" : "w-1.5 bg-foreground/20"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
