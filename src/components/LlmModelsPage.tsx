import { useState, useMemo } from "react";
import { Search, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Types & Data ---

interface LlmModel {
  name: string;
  type: string;
  provider: string;
}

const models: LlmModel[] = [
  { name: "gpt-5.2", type: "model", provider: "openai" },
  { name: "gpt-5.2-pro", type: "model", provider: "openai" },
  { name: "gpt-4o-mini", type: "model", provider: "openai" },
  { name: "gpt-4o", type: "model", provider: "openai" },
  { name: "gpt-4.1", type: "model", provider: "openai" },
  { name: "gpt-4.1-mini", type: "model", provider: "openai" },
  { name: "gpt-4.1-nano", type: "model", provider: "openai" },
  { name: "o4-mini", type: "model", provider: "openai" },
  { name: "o3", type: "model", provider: "openai" },
  { name: "o3-mini", type: "model", provider: "openai" },
  { name: "veo-3.1", type: "video", provider: "openai" },
  { name: "whisperx-1", type: "audio", provider: "openai" },
  { name: "dall-e-3", type: "image", provider: "openai" },
  { name: "text-embedding-3-large", type: "embedding", provider: "openai" },
  { name: "text-embedding-3-small", type: "embedding", provider: "openai" },
  { name: "claude-sonnet-4-fallback", type: "model", provider: "anthropic" },
  { name: "claude-opus-4-1-fallback", type: "model", provider: "anthropic" },
  { name: "claude-3.5-sonnet", type: "model", provider: "anthropic" },
  { name: "claude-3.5-haiku", type: "model", provider: "anthropic" },
  { name: "llama-3-8b-instruct-8k", type: "model", provider: "meta" },
  { name: "llama-3-70b-instruct", type: "model", provider: "meta" },
  { name: "llama-3.1-405b", type: "model", provider: "meta" },
];

const PROVIDER_STYLES: Record<string, string> = {
  openai: "bg-foreground/8 text-foreground",
  anthropic: "bg-[hsl(30,80%,50%)]/10 text-[hsl(30,80%,50%)]",
  meta: "bg-primary/10 text-primary",
};

const TYPE_LABELS: Record<string, string> = {
  model: "Текст",
  video: "Видео",
  audio: "Аудио",
  image: "Изображение",
  embedding: "Эмбеддинг",
};

const providers = ["openai", "anthropic", "meta"];

// --- cURL snippets ---

const curlSnippets: Record<string, string> = {
  list: `curl -s "https://agentgateway.ai/llm/models" \\
  -H "Authorization: Bearer YOUR_TOKEN" | jq .`,
  chat: `curl -s "https://agentgateway.ai/llm/chat/completions" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "Привет!"}
    ]
  }'`,
  embeddings: `curl -s "https://agentgateway.ai/llm/embeddings" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "text-embedding-3-small",
    "input": "Пример текста для эмбеддинга"
  }'`,
};

// --- Components ---

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Скопировано" : "Копировать"}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative rounded-lg border border-border bg-foreground text-background overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-background/10">
        <span className="text-xs text-background/50 font-mono">bash</span>
        <CopyButton text={code} />
      </div>
      <pre className="px-4 py-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ModelCard({ model }: { model: LlmModel }) {
  const providerStyle = PROVIDER_STYLES[model.provider] || "bg-muted text-muted-foreground";
  const typeLabel = TYPE_LABELS[model.type] || model.type;

  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <code className="text-[13px] font-mono font-semibold text-foreground break-all">
          {model.name}
        </code>
        <span className="text-[11px] text-muted-foreground whitespace-nowrap mt-0.5">
          {typeLabel}
        </span>
      </div>
      <div className="mt-2.5">
        <Badge className={`text-[10px] px-2 py-0 h-[18px] font-medium border-0 rounded-md ${providerStyle}`}>
          {model.provider}
        </Badge>
      </div>
    </div>
  );
}

// --- Page ---

export function LlmModelsPage() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("all");

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (provider !== "all" && m.provider !== provider) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q);
    });
  }, [search, provider]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">LLM Модели</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Доступные языковые, визуальные и аудио модели для использования через единый API.
          </p>
        </div>

        {/* API Reference */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Справочник API (Интеграция)
          </p>
          <Tabs defaultValue="list">
            <TabsList className="mb-3">
              <TabsTrigger value="list" className="text-xs">Список моделей</TabsTrigger>
              <TabsTrigger value="chat" className="text-xs">Генерация текста</TabsTrigger>
              <TabsTrigger value="embeddings" className="text-xs">Эмбеддинги</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <CodeBlock code={curlSnippets.list} />
            </TabsContent>
            <TabsContent value="chat">
              <CodeBlock code={curlSnippets.chat} />
            </TabsContent>
            <TabsContent value="embeddings">
              <CodeBlock code={curlSnippets.embeddings} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Models Directory */}
        <div>
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию модели (например, gpt-5.2)..."
                className="pl-9"
              />
            </div>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все провайдеры</SelectItem>
                {providers.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Найдено: {filtered.length}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-sm text-muted-foreground">Ничего не найдено</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((m) => (
                <ModelCard key={m.name} model={m} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
