import { useState } from "react";
import { Search, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HelpTerm } from "./HelpTerm";
import { DocsFooter } from "./DocsFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { servers } from "./mcp/data";
import { ServerContent } from "./mcp/ServerContentStates";
import { PageGuide } from "./PageGuide";

export function McpToolsPage() {
  const [search, setSearch] = useState("");

  const filtered = servers.filter((s) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tools.some(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    );
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Инструменты <HelpTerm tip="Model Context Protocol. Стандарт, позволяющий нейросетям безопасно читать данные из ваших внешних сервисов (Jira, GitHub, Slack).">MCP</HelpTerm></h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Управление серверами Model Context Protocol и доступными инструментами (Tools).
          </p>
        </div>

        <PageGuide>
          <strong>Зачем это нужно:</strong> MCP-серверы дают нейросетям доступ к данным вашей компании. Авторизуйте нужные сервисы (например, Jira или GitHub), чтобы модели могли читать вашу документацию и контекст.
        </PageGuide>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск MCP серверов или инструментов..."
              className="pl-9"
            />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Всего серверов: {servers.length}
          </span>
        </div>

        {/* Servers List */}
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">Ничего не найдено</p>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-3">
            {filtered.map((server) => {
              const isError = server.status.kind === "error";
              const isAuth = server.status.kind === "auth";
              const toolCount = server.tools.length;

              return (
                <AccordionItem
                  key={server.id}
                  value={server.id}
                  className="rounded-lg border border-border bg-card overflow-hidden"
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors [&[data-state=open]]:border-b [&[data-state=open]]:border-border">
                    <div className="flex flex-col items-start gap-1.5 text-left flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-foreground">{server.name}</span>

                        {/* Auth type badge */}
                        <Badge
                          className={`text-[10px] px-2 py-0 h-[18px] font-medium border-0 ${
                            server.authType === "public"
                              ? "bg-primary/10 text-primary hover:bg-primary/10"
                              : "bg-success/10 text-success hover:bg-success/10"
                          }`}
                        >
                          {server.authType === "public" ? "Public" : "Keycloak JWT"}
                        </Badge>

                        {/* Tools count badge (only for success) */}
                        {server.status.kind === "success" && (
                          <Badge variant="secondary" className="text-[10px] px-2 py-0 h-[18px] font-medium text-muted-foreground">
                            Tools: {toolCount}
                          </Badge>
                        )}

                        {/* Status indicators */}
                        {isAuth && (
                          <Badge className="text-[10px] px-2 py-0 h-[18px] font-medium border-0 bg-[hsl(45,93%,47%)]/10 text-[hsl(45,80%,35%)] hover:bg-[hsl(45,93%,47%)]/10 gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            Требуется авторизация
                          </Badge>
                        )}
                        {isError && (
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/40" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive" />
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{server.description}</span>
                      <code className="text-xs font-mono bg-code-bg px-1.5 py-0.5 rounded text-muted-foreground">
                        {server.path}
                      </code>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-0 pb-0">
                    <ServerContent server={server} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}

        <DocsFooter text="📖 Руководство: Как безопасно подключить корпоративные базы данных через MCP" />
      </div>
    </div>
  );
}
