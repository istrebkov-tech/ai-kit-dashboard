import { useOnboarding, type GuideId } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const guideContent: Record<string, { title: string; text: string }> = {
  keys: {
    title: "🔑 Шаг 1: Получите API-ключ",
    text: "Начните с авторизации. Нажмите «Получить токен» для временного доступа (удобно для тестов в Cursor/Postman) или создайте постоянный ключ для продакшена. Обязательно скопируйте значение — оно передаётся в заголовке Authorization: Bearer.",
  },
  models: {
    title: "🧠 Шаг 2: Выберите LLM-модель",
    text: "У нас единый API для разных провайдеров. Найдите модель под вашу задачу (обратите внимание на квоты RPM) и скопируйте её системное имя. Вы будете использовать его в параметре 'model' при отправке запросов к шлюзу.",
  },
  mcp: {
    title: "🛠 Шаг 3: Подключите MCP-инструменты",
    text: "MCP (Model Context Protocol) — это «руки» вашего агента. Выберите нужную систему (например, Text2SQL или DeepWiki). Внутри карточки вы найдёте готовую конфигурацию, которую нужно просто вставить в настройки вашего MCP-клиента.",
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
