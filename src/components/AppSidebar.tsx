import { Key, MessageSquare, Box, Wrench, Cpu, ChevronDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { id: "api-keys", title: "API Ключи и Доступ", icon: Key },
  { id: "workspace", title: "Рабочее пространство", icon: MessageSquare, badge: "WIP" },
  { id: "agents", title: "Реестр Агентов", icon: Box },
  { id: "mcp", title: "Инструменты MCP", icon: Wrench },
  { id: "models", title: "LLM Модели", icon: Cpu },
];

const recentSessions = [
  "Задачи онбординга HR",
  "Разбор багов Jira",
  "Анализ отчета за Q4",
  "Сводка дайджеста Slack",
  "Обзор аудита безопасности",
];

interface AppSidebarProps {
  activeId: string;
  onNavigate: (id: string) => void;
}

export function AppSidebar({ activeId, onNavigate }: AppSidebarProps) {
  return (
    <aside className="w-[250px] min-h-screen border-r border-border bg-sidebar-bg flex flex-col shrink-0">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground tracking-tight">AI Kit</span>
        </div>
      </div>

      <div className="mx-3 mb-4">
        <button className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-sidebar-active transition-colors text-left">
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground truncate">Иван Стребков</div>
            <div className="text-xs text-muted-foreground truncate">IT Отдел</div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
        </button>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                  activeId === item.id
                    ? "bg-sidebar-active font-medium text-foreground"
                    : "text-muted-foreground hover:bg-sidebar-active hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 h-4 font-medium text-muted-foreground">
                    {item.badge}
                  </Badge>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <div className="px-2.5 mb-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-section">
            Недавние сессии
          </div>
          <ul className="space-y-0.5">
            {recentSessions.map((session) => (
              <li key={session}>
                <button className="w-full text-left px-2.5 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-active transition-colors truncate">
                  {session}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <div className="text-[11px] text-muted-foreground">AI Kit v2.4.1</div>
      </div>
    </aside>
  );
}
