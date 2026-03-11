import { useState } from "react";
import { Search, Copy, Check, Circle, FlaskConical, ChevronDown, BookOpen, Brain, Zap, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { PageGuide } from "./PageGuide";

import { ResourcesSection } from "./ResourcesSection";
import { Network, Workflow, FileJson } from "lucide-react";

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
      label: `GET agent-card.json`,
      desc: "Получить спецификацию агента",
      curl: `curl "${BASE_URL}/a2a${agentUrl}/.well-known/agent-card.json" \\\n     -H "Authorization: Bearer YOUR_TOKEN"`,
    },
    {
      label: `POST message/send`,
      desc: "Отправить сообщение синхронно",
      curl: `curl "${BASE_URL}/a2a${agentUrl}/message/send" \\\n     -H "Authorization: Bearer YOUR_TOKEN" \\\n     -H "Content-Type: application/json" \\\n     -d '{"jsonrpc":"2.0","id":"1","method":"message/send","params":{"message":{"role":"user","parts":[{"kind":"text","text":"Hello"}]}}}'`,
    },
    {
      label: `POST message/stream`,
      desc: "Стриминг ответа от агента",
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

  const counts = {
    all: agents.filter((a) => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase())).length,
    active: agents.filter((a) => a.active && (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()))).length,
    unavailable: agents.filter((a) => !a.active && (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()))).length,
  };

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "active", label: "Активные" },
    { key: "unavailable", label: "Недоступные" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Реестр Агентов</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Управление, мониторинг и интеграция доступных AI-агентов платформы.
          </p>
        </div>

        <PageGuide>
          <strong>Что такое Агенты:</strong> В отличие от обычных чат-моделей, Агенты умеют автономно выполнять многошаговые задачи. Выберите подходящего агента и отправьте ему задачу через A2A-интерфейс.
        </PageGuide>

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
                <span className={`ml-1 text-[10px] ${filter === f.key ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {filtered.map((agent) => (
            <div key={agent.id} className="rounded-lg border border-border bg-card p-4 flex flex-col h-full">
              <div className="flex items-start gap-3 min-h-[56px]">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">{agent.name}</h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {agent.version && (
                        <Badge variant="outline" className="text-[10px] font-mono border-border text-muted-foreground px-1.5 py-0">
                          {agent.version}
                        </Badge>
                      )}
                      {agent.active ? (
                        <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10 border border-success/20 text-[10px] px-1.5 py-0">
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          Активен
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 bg-muted text-muted-foreground border-border text-[10px] px-1.5 py-0">
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          Недоступен
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{agent.description}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 rounded-md bg-code-bg border border-border px-2.5 py-1.5">
                <code className="text-xs font-mono text-foreground flex-1 truncate">{agent.url}</code>
                <CopyButton text={agent.url} />
              </div>


              <div className="flex items-center justify-between pt-2.5 mt-auto border-t border-border">
                <div>
                  <AgentEndpoints agentUrl={agent.url} disabled={!agent.active} />
                </div>
                <AgentManualButton agent={agent} />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-sm text-muted-foreground">
              Агенты не найдены
            </div>
          )}
        </div>

        <ResourcesSection description="Руководства по архитектуре, оркестрации и A2A-взаимодействию автономных агентов." items={[
          { icon: Network, title: "A2A-интеграция (Agent-to-Agent)", description: "Протокол взаимодействия между вашим кодом и автономными агентами.", readTime: "5 мин", article: [
            "A2A (Agent-to-Agent) — это открытый протокол, позволяющий вашему коду или другому ИИ-агенту взаимодействовать с агентами AI Kit программно, без участия человека.",
            "Базовый сценарий: ваш бэкенд отправляет POST-запрос на эндпоинт агента с описанием задачи. Агент обрабатывает запрос, при необходимости вызывает MCP-инструменты, и возвращает структурированный результат.",
            "Формат взаимодействия: запрос содержит поле task (описание задачи на естественном языке) и опциональный context (дополнительные данные в JSON). Ответ содержит result, status и usage (статистика токенов).",
            "Пример: ваш CI/CD пайплайн после деплоя отправляет агенту задачу «Проанализируй логи за последние 5 минут и сообщи об аномалиях». Агент читает логи через MCP, анализирует их и возвращает отчёт.",
          ] },
          { icon: Workflow, title: "Оркестрация агентов", description: "Как заставить нескольких агентов работать над одной сложной задачей.", readTime: "6 мин", article: [
            "Оркестрация — это координация нескольких агентов для решения задачи, которая слишком сложна для одного. Например: «Проанализируй баг-репорт в Jira, найди связанный код на GitHub, предложи исправление и создай PR».",
            "Подход 1 — последовательная цепочка: результат первого агента передаётся как контекст второму. Агент-аналитик → Агент-кодер → Агент-ревьюер. Просто, предсказуемо, но медленно.",
            "Подход 2 — параллельный: несколько агентов работают одновременно над разными аспектами задачи. Агент-исследователь ищет документацию, пока агент-кодер анализирует код. Результаты объединяет агент-координатор.",
            "Подход 3 — иерархический: один «главный» агент декомпозирует задачу на подзадачи и раздаёт их специализированным агентам. Он же собирает результаты и формирует итоговый ответ.",
            "AI Kit предоставляет SDK для всех трёх паттернов. Начните с последовательной цепочки — она самая простая для отладки.",
          ] },
          { icon: FileJson, title: "Структура Agent Card", description: "Разбор JSON-схемы, описывающей возможности и метаданные агента.", readTime: "4 мин", article: [
            "Agent Card — это JSON-документ, который описывает агента: его возможности, входные/выходные форматы, требования к авторизации и метаданные. Это «паспорт» агента в экосистеме A2A.",
            "Обязательные поля: name (уникальное имя), description (что делает агент), version (семантическое версионирование), url (эндпоинт для A2A-вызовов), skills (массив навыков).",
            "Поле skills — самое важное. Каждый skill описывает одну способность агента: название, описание на естественном языке, примеры запросов и ожидаемый формат ответа.",
            "Опциональные поля: auth (требования к авторизации), rateLimit (ограничения по частоте вызовов), pricing (стоимость за вызов), tags (теги для поиска в реестре).",
          ] },
        ]} />
      </div>
    </div>
  );
}

function AgentEndpoints({ agentUrl, disabled = false }: { agentUrl: string; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const snippets = buildCurlSnippets(agentUrl);

  return (
    <Collapsible open={open} onOpenChange={disabled ? undefined : setOpen}>
      <CollapsibleTrigger asChild disabled={disabled}>
        <button
          className={`flex items-center gap-1.5 text-xs py-1 transition-colors ${disabled ? "text-muted-foreground/40 cursor-not-allowed" : "text-muted-foreground hover:text-foreground"}`}
          disabled={disabled}
        >
          <FlaskConical className="w-3 h-3" />
          <span>A2A эндпоинты</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 space-y-1">
          {snippets.map((s) => (
            <Collapsible key={s.label}>
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between gap-2 rounded px-2 py-1.5 text-left hover:bg-muted/50 transition-colors group">
                  <div className="min-w-0">
                    <p className="text-[11px] font-mono font-medium text-foreground">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="relative rounded bg-code-bg border border-border mx-1 mb-1">
                  <pre className="p-2 pr-7 text-[10px] leading-relaxed font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all">
                    {s.curl}
                  </pre>
                  <div className="absolute top-1.5 right-1.5">
                    <CopyButton text={s.curl} />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function AgentManualButton({ agent }: { agent: Agent }) {
  const [open, setOpen] = useState(false);

  const examplePayload = JSON.stringify(
    { message: "Найди мне красные кроссовки 42 размера", session_id: "12345" },
    null,
    2
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <BookOpen className="w-3 h-3" />
        Как использовать
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{agent.name} — Инструкция</SheetTitle>
            <SheetDescription>Простое руководство по работе с агентом.</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-2 text-sm text-foreground">
                <Brain className="w-4 h-4 text-purple-500" />
                Что умеет агент
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Этот агент берёт на себя всю рутину. Вы просто передаёте ему задачу, а он сам решает, какие инструменты вызвать и как вернуть готовый результат.
              </p>
            </div>

            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-2 text-sm text-foreground">
                <Zap className="w-4 h-4 text-amber-500" />
                Как воспользоваться
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Отправьте обычный POST-запрос на эндпоинт агента. Вот пример того, что нужно передать в теле запроса (payload):
              </p>
              <div className="relative rounded-md bg-code-bg border border-border">
                <pre className="p-3 pr-10 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all">
                  {examplePayload}
                </pre>
                <div className="absolute top-2.5 right-2.5">
                  <CopyButton text={examplePayload} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-2 text-sm text-foreground">
                <FlaskConical className="w-4 h-4 text-muted-foreground" />
                Эндпоинт
              </h4>
              <div className="flex items-center gap-1.5 rounded-md bg-code-bg border border-border px-2.5 py-1.5">
                <code className="text-xs font-mono text-foreground flex-1 truncate">POST {agent.url}/message/send</code>
                <CopyButton text={`${agent.url}/message/send`} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
