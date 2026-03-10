import { useState, useMemo, useCallback } from "react";
import { Search, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Types ---

interface LlmModel {
  name: string;
  type: string;
  provider: string;
}

// --- Data ---

const models: LlmModel[] = [
  { name: "gpt-5.2", type: "model", provider: "openai" },
  { name: "gpt-5.2-pro", type: "model", provider: "openai" },
  { name: "gpt-4o", type: "model", provider: "openai" },
  { name: "gpt-4o-mini", type: "model", provider: "openai" },
  { name: "gpt-4.1", type: "model", provider: "openai" },
  { name: "gpt-4.1-mini", type: "model", provider: "openai" },
  { name: "gpt-4.1-nano", type: "model", provider: "openai" },
  { name: "o4-mini", type: "model", provider: "openai" },
  { name: "o3", type: "model", provider: "openai" },
  { name: "o3-mini", type: "model", provider: "openai" },
  { name: "o1", type: "model", provider: "openai" },
  { name: "o1-mini", type: "model", provider: "openai" },
  { name: "sora-2", type: "video", provider: "openai" },
  { name: "veo-3.0", type: "video", provider: "google" },
  { name: "whisperx-1", type: "audio", provider: "openai" },
  { name: "dall-e-3", type: "vision", provider: "openai" },
  { name: "text-embedding-3-large", type: "embedding", provider: "openai" },
  { name: "text-embedding-3-small", type: "embedding", provider: "openai" },
  { name: "claude-3-7-sonnet-latest", type: "model", provider: "anthropic" },
  { name: "claude-sonnet-4-fallback", type: "model", provider: "anthropic" },
  { name: "claude-opus-4-1-fallback", type: "model", provider: "anthropic" },
  { name: "claude-3.5-sonnet", type: "model", provider: "anthropic" },
  { name: "claude-3.5-haiku", type: "model", provider: "anthropic" },
  { name: "gemini-2.5-pro", type: "model", provider: "google" },
  { name: "gemini-2.5-flash", type: "model", provider: "google" },
  { name: "gemini-2.0-flash", type: "model", provider: "google" },
  { name: "gemini-1.5-pro", type: "model", provider: "google" },
  { name: "llama-3-8b-instruct-8k", type: "model", provider: "meta" },
  { name: "llama-3-70b-instruct", type: "model", provider: "meta" },
  { name: "llama-3.1-405b", type: "model", provider: "meta" },
  { name: "llama-3.2-90b-vision", type: "vision", provider: "meta" },
  { name: "grok-4", type: "model", provider: "xai" },
  { name: "grok-3", type: "model", provider: "xai" },
  { name: "grok-3-mini", type: "model", provider: "xai" },
  { name: "deepseek-reasoner", type: "model", provider: "deepseek" },
  { name: "deepseek-chat", type: "model", provider: "deepseek" },
  { name: "deepseek-coder-v2", type: "model", provider: "deepseek" },
  { name: "qwen3.5-35b-a3b", type: "model", provider: "qwen" },
  { name: "qwen3-32b", type: "model", provider: "qwen" },
  { name: "qwen2.5-72b-instruct", type: "model", provider: "qwen" },
  { name: "qwq-32b", type: "model", provider: "qwen" },
  { name: "yandexgpt-5", type: "model", provider: "yandex" },
  { name: "yandexgpt-4-rc", type: "model", provider: "yandex" },
  { name: "gigachat-pro", type: "model", provider: "sber" },
  { name: "gigachat-max", type: "model", provider: "sber" },
];

const PROVIDER_STYLES: Record<string, string> = {
  openai: "bg-[hsl(0,0%,15%)] text-[hsl(0,0%,100%)]",
  anthropic: "bg-[hsl(30,90%,94%)] text-[hsl(25,80%,35%)]",
  google: "bg-[hsl(215,90%,94%)] text-[hsl(215,80%,35%)]",
  meta: "bg-[hsl(230,70%,94%)] text-[hsl(230,60%,40%)]",
  xai: "bg-[hsl(220,10%,25%)] text-[hsl(0,0%,100%)]",
  qwen: "bg-[hsl(270,70%,94%)] text-[hsl(270,60%,40%)]",
  deepseek: "bg-[hsl(220,70%,20%)] text-[hsl(0,0%,100%)]",
  yandex: "bg-[hsl(48,90%,90%)] text-[hsl(40,80%,30%)]",
  sber: "bg-[hsl(142,60%,92%)] text-[hsl(142,60%,30%)]",
};

const TYPE_LABELS: Record<string, string> = {
  model: "Текст",
  video: "Видео",
  audio: "Аудио",
  vision: "Визуал",
  embedding: "Эмбеддинг",
};

const providers = ["openai", "anthropic", "google", "meta", "xai", "deepseek", "qwen", "yandex", "sber"];
const types = ["model", "vision", "audio", "video", "embedding"];

function getCurlSnippets(model: string): Record<string, string> {
  return {
    list: `curl -s "https://agentgateway.ai/llm/models" \\
  -H "Authorization: Bearer YOUR_TOKEN" | jq .`,
    chat: `curl -s "https://agentgateway.ai/llm/chat/completions" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "messages": [
      {"role": "user", "content": "Привет!"}
    ]
  }'`,
    embeddings: `curl -s "https://agentgateway.ai/llm/embeddings" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "input": "Пример текста для эмбеддинга"
  }'`,
  };
}

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

function ModelCard({ model, isSelected, onSelect }: { model: LlmModel; isSelected: boolean; onSelect: () => void }) {
  const providerStyle = PROVIDER_STYLES[model.provider] || "bg-muted text-muted-foreground";
  const typeLabel = TYPE_LABELS[model.type] || model.type;
  const [copied, setCopied] = useState(false);

  const handleCopyName = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(model.name);
    setCopied(true);
    toast({ title: "Скопировано", description: model.name });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-lg border p-4 cursor-pointer transition-colors ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <code className="text-[13px] font-mono font-semibold text-foreground break-all">
            {model.name}
          </code>
          <button
            onClick={handleCopyName}
            className="shrink-0 p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            title="Скопировать ID модели"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded whitespace-nowrap mt-0.5">
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
  const [type, setType] = useState("all");
  const [selectedModel, setSelectedModel] = useState("gpt-5.2");

  const curlSnippets = useMemo(() => getCurlSnippets(selectedModel), [selectedModel]);

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (provider !== "all" && m.provider !== provider) return false;
      if (type !== "all" && m.type !== type) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q);
    });
  }, [search, provider, type]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Реестр LLM Моделей</h1>
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
            <TabsContent value="list"><CodeBlock code={curlSnippets.list} /></TabsContent>
            <TabsContent value="chat"><CodeBlock code={curlSnippets.chat} /></TabsContent>
            <TabsContent value="embeddings"><CodeBlock code={curlSnippets.embeddings} /></TabsContent>
          </Tabs>

          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-4">
            💡 Кликните на любую модель из списка ниже, чтобы автоматически подставить её в пример кода, или скопируйте её системное имя.
          </p>
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
              <SelectTrigger className="w-[170px]">
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
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {TYPE_LABELS[t] || t}
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
                <ModelCard key={m.name} model={m} isSelected={m.name === selectedModel} onSelect={() => setSelectedModel(m.name)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
