import { Sparkles, Cpu, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkspacePageProps {
  onNavigate: (id: string) => void;
}

export function WorkspacePage({ onNavigate }: WorkspacePageProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Рабочее пространство</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Визуальная среда для тестирования и экспериментов
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
            <Sparkles className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Рабочее пространство
            <span className="ml-2 text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full align-middle">
              В разработке
            </span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg leading-relaxed mb-6">
            Скоро здесь появится визуальная среда для тестирования агентов и работы с инструментами MCP без написания кода. Вы сможете собирать цепочки запросов и анализировать ответы прямо в браузере.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            А пока вы можете перейти в реестр моделей или агентов, чтобы начать работу через API.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => onNavigate("models")}>
              <Cpu className="w-3.5 h-3.5" />
              Перейти к Моделям
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => onNavigate("agents")}>
              <Box className="w-3.5 h-3.5" />
              Изучить Агентов
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
