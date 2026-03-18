import { useOnboarding, type GuideId } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const guideContent: Record<string, { title: string; text: string }> = {
  keys: {
    title: "🔑 Шаг 1: Создание ключа",
    text: "Сгенерируйте Временный JWT-токен для быстрых тестов или создайте Постоянный API-ключ для вашего бэкенда. Скопируйте его — он понадобится для авторизации запросов.",
  },
  models: {
    title: "🧠 Шаг 2: Выбор модели",
    text: "Здесь собраны доступные LLM. Обратите внимание на лимиты RPM (запросов в минуту). Скопируйте ID нужной модели (например, gpt-4o), чтобы использовать её в коде.",
  },
  mcp: {
    title: "🛠 Шаг 3: Настройка MCP",
    text: "Выберите интеграцию (например, Google Workspace). Скопируйте npx-команду и добавьте её в конфигурацию вашего MCP-клиента или агента. Это даст нейросети доступ к реальным данным.",
  },
};

export function ContextualGuide() {
  const ob = useOnboarding();

  if (!ob.activeGuide || !guideContent[ob.activeGuide]) return null;

  const guide = guideContent[ob.activeGuide];
  const currentGuide = ob.activeGuide;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-foreground text-background p-5 rounded-xl shadow-2xl animate-fade-in">
      <button
        onClick={() => ob.setActiveGuide(null)}
        className="absolute top-3 right-3 p-1 rounded-md text-background/50 hover:text-background transition-colors"
        aria-label="Закрыть"
      >
        <X className="w-4 h-4" />
      </button>

      <h3 className="text-sm font-semibold mb-2 pr-6">{guide.title}</h3>
      <p className="text-xs leading-relaxed text-background/70 mb-4">
        {guide.text}
      </p>

      <Button
        size="sm"
        variant="secondary"
        className="w-full"
        onClick={() => ob.completeGuide(currentGuide)}
      >
        Понятно ✓
      </Button>
    </div>
  );
}
