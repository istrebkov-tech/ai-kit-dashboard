import { CheckCircle2, Circle, ChevronRight, PartyPopper, X } from "lucide-react";
import { useOnboarding, type GuideId } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Task {
  key: "hasGeneratedToken" | "hasViewedModels" | "hasViewedMCP";
  guide: "keys" | "models" | "mcp";
  title: string;
  description: string;
  actionLabel: string;
  navTarget: string;
}

interface GettingStartedWidgetProps {
  onNavigate: (id: string) => void;
}

const tasks: Task[] = [
  {
    key: "hasGeneratedToken",
    guide: "keys",
    title: "Получите доступ (API Ключ)",
    description: "Сгенерируйте JWT-токен или создайте постоянный API-ключ.",
    actionLabel: "Перейти к ключам",
    navTarget: "api-keys",
  },
  {
    key: "hasViewedModels",
    guide: "models",
    title: "Выберите мозг агента (LLM)",
    description: "Найдите нужную модель и скопируйте её ID для запросов.",
    actionLabel: "Перейти к моделям",
    navTarget: "models",
  },
  {
    key: "hasViewedMCP",
    guide: "mcp",
    title: "Подключите интеграции (MCP)",
    description: "Выберите интеграцию и скопируйте npx-команду.",
    actionLabel: "Перейти к инструментам",
    navTarget: "mcp",
  },
];

export function GettingStartedWidget({ onNavigate }: GettingStartedWidgetProps) {
  const ob = useOnboarding();

  if (ob.isWidgetDismissed) return null;

  const allDone = ob.completedCount === ob.totalTasks;
  const progress = (ob.completedCount / ob.totalTasks) * 100;

  const handleTaskAction = (task: Task) => {
    ob.setActiveGuide(task.guide);
    onNavigate(task.navTarget);
  };

  return (
    <div className="border border-border rounded-xl bg-card shadow-sm p-5 mb-6 animate-fade-in relative">
      <button
        onClick={ob.dismiss}
        className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Скрыть"
      >
        <X className="w-4 h-4" />
      </button>

      {allDone ? (
        <div className="text-center py-4">
          <PartyPopper className="w-10 h-10 text-primary mx-auto mb-3" strokeWidth={1.5} />
          <h3 className="text-base font-semibold text-foreground mb-1">
            Вы готовы к работе! 🎉
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Теперь вы можете собрать своего первого агента.
          </p>
          <Button size="sm" variant="outline" onClick={ob.dismiss}>
            Скрыть виджет
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 pr-6">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Добро пожаловать на борт 🚀
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {ob.completedCount}/{ob.totalTasks} выполнено
              </span>
            </div>
          </div>

          <ul className="space-y-1">
            {tasks.map((task) => {
              const done = ob[task.key];
              return (
                <li
                  key={task.key}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-all duration-300",
                    done ? "opacity-60" : "hover:bg-accent/50"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium text-foreground transition-all duration-300",
                      done && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                  </div>
                  {!done && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="shrink-0 text-xs text-primary hover:text-primary"
                      onClick={() => handleTaskAction(task)}
                    >
                      {task.actionLabel}
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
