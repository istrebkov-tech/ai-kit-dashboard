import { useState } from "react";
import { Key, Box, Wrench, Cpu, ChevronDown, ChevronRight, Sparkles, Users, UserCog, Activity } from "lucide-react";
import { AiOmnibox } from "./AiOmnibox";


interface NavItem {
  id: string;
  title: string;
  icon: React.ElementType;
  children?: { id: string; title: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { id: "api-keys", title: "API Ключи и Доступ", icon: Key },
  {
    id: "agents",
    title: "Реестр Агентов",
    icon: Box,
    children: [
      { id: "agents", title: "Доступные агенты", icon: Users },
      { id: "my-agents", title: "Мои агенты", icon: UserCog },
    ],
  },
  { id: "mcp", title: "Инструменты MCP", icon: Wrench },
  { id: "models", title: "LLM Модели", icon: Cpu },
];

interface AppSidebarProps {
  activeId: string;
  onNavigate: (id: string) => void;
  onOpenOnboarding?: () => void;
}

export function AppSidebar({ activeId, onNavigate, onOpenOnboarding }: AppSidebarProps) {
  const isAgentsSection = activeId === "agents" || activeId === "my-agents";
  const [agentsOpen, setAgentsOpen] = useState(isAgentsSection);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <aside className="w-[250px] min-h-screen border-r border-border bg-sidebar-bg flex flex-col shrink-0">
      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto relative flex flex-col">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold text-foreground tracking-tight">AI Kit</span>
          </div>
        </div>

        <div className="mx-3 mb-4">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-sidebar-active transition-colors text-left"
          >
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground truncate">Иван Стребков</div>
              <div className="text-xs text-muted-foreground truncate">IT Отдел</div>
            </div>
            {profileOpen ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
            )}
          </button>
          {profileOpen && (
            <div className="mt-0.5 ml-2 border-l border-border pl-3">
              <button
                onClick={() => { onNavigate("limits"); setProfileOpen(true); }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                  activeId === "limits"
                    ? "text-foreground font-medium bg-sidebar-active"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-active"
                }`}
              >
                <Activity className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Лимиты и Квоты</span>
              </button>
            </div>
          )}
        </div>

        <nav className="px-3">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.id}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setAgentsOpen(!agentsOpen)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                        isAgentsSection
                          ? "bg-sidebar-active font-medium text-foreground"
                          : "text-muted-foreground hover:bg-sidebar-active hover:text-foreground"
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate flex-1 text-left">{item.title}</span>
                      {agentsOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                    {agentsOpen && (
                      <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <button
                              onClick={() => onNavigate(child.id)}
                              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                                activeId === child.id
                                  ? "text-foreground font-medium bg-sidebar-active"
                                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-active"
                              }`}
                            >
                              <child.icon className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{child.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
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
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sticky FAB */}
        <div className="sticky bottom-0 pb-3 pt-4 flex justify-end px-3 z-10 bg-gradient-to-t from-sidebar-bg via-sidebar-bg to-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <AiOmnibox />
          </div>
        </div>
      </div>

      {/* Static footer */}
      <div className="border-t border-border px-5 py-4">
        <div className="text-[11px] text-muted-foreground">AI Kit v2.4.1</div>
      </div>
    </aside>
  );
}
