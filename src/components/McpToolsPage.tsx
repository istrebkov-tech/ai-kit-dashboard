import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// --- Types ---

interface McpTool {
  name: string;
  description: string;
  category: string;
}

interface McpServer {
  id: string;
  name: string;
  authType: "public" | "keycloak";
  description: string;
  path: string;
  tools: McpTool[];
}

// --- Data ---

const servers: McpServer[] = [
  {
    id: "deepwiki",
    name: "deepwiki",
    authType: "public",
    description: "DeepWiki - AI documentation for GitHub repos",
    path: "/mcp/dev/deepwiki",
    tools: [
      { name: "read_wiki_structure", description: "Получить список тем документации для GitHub-репозитория. Args: `repoName` — репозиторий GitHub в формате owner/repo.", category: "Чтение" },
      { name: "read_wiki_contents", description: "Просмотреть документацию GitHub-репозитория. Args: `repoName` — репозиторий GitHub в формате owner/repo.", category: "Чтение" },
      { name: "ask_question", description: "Задать вопрос о GitHub-репозитории и получить ответ на основе контекста с помощью ИИ. Args: `repoName` — репозиторий GitHub в формате owner/repo, `question` — текст вопроса.", category: "Генерация" },
    ],
  },
  {
    id: "test",
    name: "test",
    authType: "keycloak",
    description: "MCP Server Everything - демонстрационные инструменты",
    path: "/mcp/test",
    tools: [
      { name: "echo", description: "Возвращает входное сообщение обратно. Args: `message`.", category: "Утилиты" },
      { name: "get_time", description: "Возвращает текущее серверное время.", category: "Утилиты" },
      { name: "add", description: "Складывает два числа. Args: `a`, `b`.", category: "Утилиты" },
      { name: "longRunningOperation", description: "Демонстрирует длительную операцию с отчётом о прогрессе. Args: `duration`, `steps`.", category: "Утилиты" },
      { name: "sampleLLM", description: "Запрашивает LLM-модель для генерации текста. Args: `prompt`, `maxTokens`.", category: "Генерация" },
      { name: "getTinyImage", description: "Возвращает маленькое тестовое изображение.", category: "Ресурсы" },
      { name: "printEnv", description: "Выводит переменные окружения сервера.", category: "Утилиты" },
      { name: "annotatedMessage", description: "Возвращает аннотированное сообщение с метаданными. Args: `messageType`, `includeImage`.", category: "Генерация" },
      { name: "getResourceReference", description: "Возвращает ссылку на ресурс. Args: `resourceId`.", category: "Ресурсы" },
      { name: "createTextResource", description: "Создаёт текстовый ресурс. Args: `name`, `content`.", category: "Создание" },
      { name: "createBlobResource", description: "Создаёт бинарный ресурс. Args: `name`.", category: "Создание" },
      { name: "listResourceTemplates", description: "Возвращает список шаблонов ресурсов.", category: "Ресурсы" },
      { name: "getMultiModalContent", description: "Возвращает контент в нескольких форматах.", category: "Ресурсы" },
    ],
  },
  {
    id: "context7",
    name: "context7",
    authType: "public",
    description: "Context7 - актуальная документация и примеры кода для LLM",
    path: "/mcp/dev/context7",
    tools: [
      { name: "resolve-library-id", description: "Разрешает имя библиотеки в Context7-совместимый ID. Args: `libraryName`.", category: "Чтение" },
      { name: "get-library-docs", description: "Получает документацию библиотеки по ID. Args: `context7CompatibleLibraryID`, `topic`, `tokens`.", category: "Чтение" },
    ],
  },
  {
    id: "github",
    name: "github",
    authType: "keycloak",
    description: "GitHub MCP Server - интеграция с GitHub API",
    path: "/mcp/dev/github",
    tools: [
      { name: "list_repos", description: "Список репозиториев пользователя. Args: `owner`.", category: "Чтение" },
      { name: "get_repo", description: "Информация о репозитории. Args: `owner`, `repo`.", category: "Чтение" },
      { name: "list_issues", description: "Список issues репозитория. Args: `owner`, `repo`.", category: "Чтение" },
      { name: "create_issue", description: "Создать issue. Args: `owner`, `repo`, `title`, `body`.", category: "Создание" },
    ],
  },
  {
    id: "gitlab",
    name: "gitlab",
    authType: "keycloak",
    description: "GitLab MCP Server - интеграция с GitLab API",
    path: "/mcp/dev/gitlab",
    tools: [
      { name: "list_projects", description: "Список проектов. Args: `groupId`.", category: "Чтение" },
      { name: "get_project", description: "Информация о проекте. Args: `projectId`.", category: "Чтение" },
    ],
  },
  {
    id: "figma",
    name: "figma",
    authType: "keycloak",
    description: "Figma MCP Server - чтение дизайн-файлов Figma",
    path: "/mcp/dev/figma",
    tools: [
      { name: "get_figma_data", description: "Получить данные из Figma-файла. Args: `fileKey`, `nodeId`.", category: "Чтение" },
      { name: "download_figma_images", description: "Скачать изображения из Figma. Args: `fileKey`, `nodes`, `localPath`.", category: "Ресурсы" },
    ],
  },
  {
    id: "confluence",
    name: "confluence",
    authType: "keycloak",
    description: "Confluence MCP Server - работа с документацией Confluence",
    path: "/mcp/dev/confluence",
    tools: [
      { name: "search_pages", description: "Поиск страниц по запросу. Args: `query`, `spaceKey`.", category: "Чтение" },
      { name: "get_page", description: "Получить содержимое страницы. Args: `pageId`.", category: "Чтение" },
    ],
  },
  {
    id: "jira",
    name: "jira",
    authType: "keycloak",
    description: "Jira MCP Server - работа с задачами Jira",
    path: "/mcp/dev/jira",
    tools: [
      { name: "search_issues", description: "Поиск задач по JQL-запросу. Args: `jql`, `maxResults`.", category: "Чтение" },
      { name: "get_issue", description: "Получить данные задачи. Args: `issueKey`.", category: "Чтение" },
      { name: "create_issue", description: "Создать задачу. Args: `projectKey`, `summary`, `issueType`.", category: "Создание" },
    ],
  },
  {
    id: "yandexgpt",
    name: "yandexgpt",
    authType: "keycloak",
    description: "YandexGPT MCP Server - генерация текста через YandexGPT",
    path: "/mcp/dev/yandexgpt",
    tools: [
      { name: "generate_text", description: "Генерация текста. Args: `prompt`, `model`, `maxTokens`.", category: "Генерация" },
    ],
  },
];

// --- Helpers ---

function renderDescription(desc: string) {
  const parts = desc.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="text-xs font-mono bg-code-bg px-1 py-0.5 rounded text-foreground">
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function groupToolsByCategory(tools: McpTool[]): Record<string, McpTool[]> {
  const groups: Record<string, McpTool[]> = {};
  for (const tool of tools) {
    if (!groups[tool.category]) groups[tool.category] = [];
    groups[tool.category].push(tool);
  }
  return groups;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Чтение": "bg-primary/10 text-primary",
  "Создание": "bg-success/10 text-success",
  "Генерация": "bg-[hsl(270,60%,50%)]/10 text-[hsl(270,60%,50%)]",
  "Ресурсы": "bg-[hsl(30,80%,50%)]/10 text-[hsl(30,80%,50%)]",
  "Утилиты": "bg-muted text-muted-foreground",
};

// --- Sub-components ---

function ToolItem({ tool }: { tool: McpTool }) {
  return (
    <div className="px-4 py-2.5 flex flex-col gap-0.5">
      <code className="text-[13px] font-mono font-semibold text-foreground">{tool.name}</code>
      <p className="text-[13px] text-muted-foreground leading-relaxed">
        {renderDescription(tool.description)}
      </p>
    </div>
  );
}

function CategoryGroup({ category, tools }: { category: string; tools: McpTool[] }) {
  const [open, setOpen] = useState(false);
  const colorClass = CATEGORY_COLORS[category] || "bg-muted text-muted-foreground";

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-muted/40 transition-colors cursor-pointer">
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        )}
        <Badge className={`text-[10px] px-2 py-0 h-[18px] font-medium border-0 ${colorClass} hover:${colorClass}`}>
          {category}
        </Badge>
        <span className="text-xs text-muted-foreground">{tools.length}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="divide-y divide-border ml-5 mr-2 mb-1 rounded-md border border-border bg-card">
          {tools.map((tool) => (
            <ToolItem key={tool.name} tool={tool} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ToolsSearch({
  value,
  onChange,
  count,
}: {
  value: string;
  onChange: (v: string) => void;
  count: number;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Поиск инструментов..."
          className="h-8 pl-8 text-xs"
        />
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {count} инстр.
      </span>
    </div>
  );
}

function ServerToolsPanel({ server }: { server: McpServer }) {
  const [toolSearch, setToolSearch] = useState("");
  const showSearch = server.tools.length > 6;

  const filteredTools = useMemo(() => {
    if (!toolSearch) return server.tools;
    const q = toolSearch.toLowerCase();
    return server.tools.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }, [server.tools, toolSearch]);

  const grouped = useMemo(() => groupToolsByCategory(filteredTools), [filteredTools]);
  const categories = Object.keys(grouped).sort();

  return (
    <div className="bg-muted/30">
      {showSearch && (
        <ToolsSearch value={toolSearch} onChange={setToolSearch} count={filteredTools.length} />
      )}
      {categories.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">Ничего не найдено</p>
      ) : (
        <div className="py-1">
          {categories.map((cat) => (
            <CategoryGroup key={cat} category={cat} tools={grouped[cat]} />
          ))}
        </div>
      )}
    </div>
  );
}

// --- Main Page ---

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
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Инструменты MCP</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Управление серверами Model Context Protocol и доступными инструментами (Tools).
          </p>
        </div>

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
            {filtered.map((server) => (
              <AccordionItem
                key={server.id}
                value={server.id}
                className="rounded-lg border border-border bg-card overflow-hidden"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors [&[data-state=open]]:border-b [&[data-state=open]]:border-border">
                  <div className="flex flex-col items-start gap-1.5 text-left flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-semibold text-foreground">{server.name}</span>
                      <Badge
                        className={`text-[10px] px-2 py-0 h-[18px] font-medium border-0 ${
                          server.authType === "public"
                            ? "bg-primary/10 text-primary hover:bg-primary/10"
                            : "bg-success/10 text-success hover:bg-success/10"
                        }`}
                      >
                        {server.authType === "public" ? "Public" : "Keycloak JWT"}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] px-2 py-0 h-[18px] font-medium text-muted-foreground">
                        Tools: {server.tools.length}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{server.description}</span>
                    <code className="text-xs font-mono bg-code-bg px-1.5 py-0.5 rounded text-muted-foreground">
                      {server.path}
                    </code>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-0 pb-0">
                  <ServerToolsPanel server={server} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
