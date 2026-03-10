import { useState } from "react";
import { Search, Copy, Check, Circle, FlaskConical, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

interface Agent {
  id: string;
  name: string;
  description: string;
  version?: string;
  url: string;
  active: boolean;
}

const agents: Agent[] = [
  { id: "1", name: "Hello World Agent", description: "Just a hello world agent.", version: "v1.0.0", url: "/helloworld", active: true },
  { id: "2", name: "Product Discovery", description: "Агент для поиска и рекомендаций товаров.", url: "/erc3/product_discovery", active: false },
  { id: "3", name: "Basket Manager", description: "Управление корзиной покупок.", url: "/erc3/basket_manager", active: false },
  { id: "4", name: "Store Buddy Orchestrator", description: "Основной оркестратор запросов магазина.", version: "v1.1.0", url: "/erc3/orchestrator", active: true },
];

const BASE_URL = "https://agentgateway.ai.redmadrobot.com";

function buildCurlSnippets(agentUrl: string) {
  return [
    {
      label: `GET /a2a${agentUrl}/.well-known/agent-card.json`,
      curl: `curl "${BASE_URL}/a2a${agentUrl}/.well-known/agent-card.json" \\\n     -H "Authorization: Bearer YOUR_TOKEN"`,
    },
    {
      label: `POST /a2a${agentUrl} (message/send)`,
      curl: `curl "${BASE_URL}/a2a${agentUrl}/message/send" \\\n     -H "Authorization: Bearer YOUR_TOKEN" \\\n     -H "Content-Type: application/json" \\\n     -d '{"jsonrpc":"2.0","id":"1","method":"message/send","params":{"message":{"role":"user","parts":[{"kind":"text","text":"Hello"}]}}}'`,
    },
    {
      label: `POST /a2a${agentUrl} (message/stream)`,
      curl: `curl "${BASE_URL}/a2a${agentUrl}/message/stream" \\\n     -H "Authorization: Bearer YOUR_TOKEN" \\\n     -H "Content-Type: application/json" \\\n     -d '{"jsonrpc":"2.0","id":"2","method":"message/stream","params":{"message":{"role":"user","parts":[{"kind":"text","text":"Hello"}]}}}'`,
    },
  ];
}

type Filter = "all" | "active" | "unavailable";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1 rounded hover:bg-muted transition-colors shrink-0" title="Копировать">
      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
    </button>
  );
}

export function AgentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = agents.filter((a) => {
    if (filter === "active" && !a.active) return false;
    if (filter === "unavailable" && a.active) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "active", label: "Активные" },
    { key: "unavailable", label: "Недоступные" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Реестр Агентов</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Управление, мониторинг и интеграция доступных AI-агентов платформы.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск агентов..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
          <div className="flex items-center rounded-md border border-border bg-muted p-0.5 gap-0.5">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filter === f.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filtered.map((agent) => (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground leading-tight">{agent.name}</h3>
                  {agent.active ? (
                    <Badge variant="secondary" className="shrink-0 gap-1 bg-success/10 text-success hover:bg-success/10 border-0 text-[11px]">
                      <Circle className="w-2 h-2 fill-current" />
                      Активен
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="shrink-0 gap-1 text-[11px]">
                      <Circle className="w-2 h-2 fill-current" />
                      Недоступен
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-3 space-y-2.5">
                <p className="text-sm text-muted-foreground">{agent.description}</p>
                {agent.version && (
                  <p className="text-xs text-muted-foreground">Версия: {agent.version}</p>
                )}
                <div className="flex items-center gap-1.5 rounded-md bg-code-bg border border-border px-2.5 py-1.5">
                  <code className="text-xs font-mono text-foreground flex-1 truncate">{agent.url}</code>
                  <CopyButton text={agent.url} />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                {agent.active ? (
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <FlaskConical className="w-3.5 h-3.5" />
                    Протестировать
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-destructive font-medium">Проверьте подключение</span>
                    <Button variant="outline" size="sm" className="gap-2 text-xs" disabled>
                      <FlaskConical className="w-3.5 h-3.5" />
                      Протестировать
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-sm text-muted-foreground">
              Агенты не найдены
            </div>
          )}
        </div>

        {/* API Accordion */}
        <Accordion type="single" collapsible>
          <AccordionItem value="api-spec" className="border rounded-lg px-5">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Спецификация API (A2A интеграция)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-5">
                Используйте эти эндпоинты для прямого взаимодействия с агентами (Agent-to-Agent).
                URL автоматически сгенерированы на основе зарегистрированных агентов.
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Найдено: {agents.length}
              </p>
              <div className="space-y-6">
                {agents.map((agent) => {
                  const snippets = buildCurlSnippets(agent.url);
                  return (
                    <div key={agent.id}>
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className={`text-sm font-semibold ${agent.active ? "text-foreground" : "text-destructive"}`}>
                          {agent.name}
                        </h4>
                        {!agent.active && (
                          <span className="text-xs text-destructive">Агент недоступен</span>
                        )}
                      </div>
                      <div className="space-y-3">
                        {snippets.map((s) => (
                          <div key={s.label}>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">{s.label}</p>
                            <div className="relative rounded-md bg-code-bg border border-border">
                              <pre className="p-3 pr-10 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap">
                                {s.curl}
                              </pre>
                              <div className="absolute top-2 right-2">
                                <CopyButton text={s.curl} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
