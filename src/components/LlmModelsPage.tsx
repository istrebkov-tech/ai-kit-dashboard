import { useState, useMemo } from "react";
import { Search, Copy, Check, Terminal, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageGuide } from "./PageGuide";
import { ResourcesSection } from "./ResourcesSection";
import { TopModelsShowcase } from "./TopModelsShowcase";
import { Image, MessageSquare, SquareActivity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Constants ---

const CHAT_CURL = `curl "https://agentgateway.ai.redmadrobot.com/llm/chat/completions" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
  "model": "gpt-4.1",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Привет! Расскажи о себе."}
  ],
  "temperature": 0.7
}'`;

const EMBED_CURL = `curl "https://agentgateway.ai.redmadrobot.com/llm/embeddings" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
  "model": "text-embedding-3-small",
  "input": "Текст для получения эмбеддинга"
}'`;

const VISION_CURL = `curl "https://agentgateway.ai.redmadrobot.com/llm/chat/completions" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Что изображено на этой картинке?"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "https://example.com/image.jpg"
          }
        }
      ]
    }
  ]
}'`;

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

function buildCurl(modelName: string): string {
  return `curl "https://agentgateway.ai.redmadrobot.com/llm/chat/completions" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "${modelName}", "messages": [{"role": "user", "content": "Hello"}]}'`;
}

// --- Components ---

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({ title: "Скопировано!" });
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={handleCopy}>
      {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
      {copied ? "Готово" : "Копировать"}
    </Button>
  );
}

function ApiCodeExamples() {
  return (
    <Tabs defaultValue="chat" className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="chat">Генерация текста</TabsTrigger>
        <TabsTrigger value="embed">Эмбеддинги</TabsTrigger>
        <TabsTrigger value="vision">Vision (Изображения)</TabsTrigger>
      </TabsList>
      <TabsContent value="chat">
        <div className="relative rounded-md bg-[hsl(0,0%,8%)] text-[hsl(0,0%,85%)] p-4 overflow-x-auto">
          <div className="absolute top-2 right-2">
            <CopyCodeButton code={CHAT_CURL} />
          </div>
          <div className="text-xs text-muted-foreground mb-2 font-mono">POST /llm/chat/completions</div>
          <pre className="text-xs font-mono whitespace-pre leading-relaxed">{CHAT_CURL}</pre>
        </div>
      </TabsContent>
      <TabsContent value="embed">
        <div className="relative rounded-md bg-[hsl(0,0%,8%)] text-[hsl(0,0%,85%)] p-4 overflow-x-auto">
          <div className="absolute top-2 right-2">
            <CopyCodeButton code={EMBED_CURL} />
          </div>
          <div className="text-xs text-muted-foreground mb-2 font-mono">POST /llm/embeddings</div>
          <pre className="text-xs font-mono whitespace-pre leading-relaxed">{EMBED_CURL}</pre>
        </div>
      </TabsContent>
      <TabsContent value="vision">
        <div className="relative rounded-md bg-[hsl(0,0%,8%)] text-[hsl(0,0%,85%)] p-4 overflow-x-auto">
          <div className="absolute top-2 right-2">
            <CopyCodeButton code={VISION_CURL} />
          </div>
          <div className="text-xs text-muted-foreground mb-2 font-mono">POST /llm/chat/completions</div>
          <pre className="text-xs font-mono whitespace-pre leading-relaxed">{VISION_CURL}</pre>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function ModelCard({ model }: { model: LlmModel }) {
  const providerStyle = PROVIDER_STYLES[model.provider] || "bg-muted text-muted-foreground";
  const typeLabel = TYPE_LABELS[model.type] || model.type;
  const [copied, setCopied] = useState(false);

  const handleCopyName = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(model.name);
    toast({ title: "Скопировано", description: model.name });
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(buildCurl(model.name));
    setCopied(true);
    toast({ title: "Готовый cURL скопирован!", description: model.name });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group rounded-md border border-border bg-card px-3 py-2.5 flex items-center gap-3 hover:border-primary/40 transition-colors">
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <Badge className={`text-[10px] px-1.5 py-0 h-[18px] font-medium border-0 rounded shrink-0 ${providerStyle}`}>
          {model.provider}
        </Badge>
        <code className="text-[13px] font-mono font-medium text-foreground truncate">
          {model.name}
        </code>
        <span className="text-[10px] text-muted-foreground/70 hidden sm:inline">
          {typeLabel}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleCopyName}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
          title="Скопировать имя"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopyCurl}
        >
          {copied ? <Check className="w-3 h-3 mr-1" /> : <Terminal className="w-3 h-3 mr-1" />}
          {copied ? "Готово" : "cURL"}
        </Button>
      </div>
    </div>
  );
}

// --- Page ---

export function LlmModelsPage() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("all");
  const [type, setType] = useState("all");

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (provider !== "all" && m.provider !== provider) return false;
      if (type !== "all" && m.type !== type) return false;
      if (!search) return true;
      return m.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, provider, type]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Реестр LLM Моделей</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Доступные языковые, визуальные и аудио модели для использования через единый API.
          </p>
        </div>

        {/* Top 10 */}
        <div className="mb-4">
          <TopModelsShowcase />
        </div>


        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
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

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">Ничего не найдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {filtered.map((m) => (
              <ModelCard key={m.name} model={m} />
            ))}
          </div>
        )}

        <ResourcesSection items={[
          { icon: Terminal, title: "Быстрый старт: Генерация текста", description: "Базовые примеры на Python и Node.js для работы с моделями.", readTime: "5 мин", article: [
            "Все модели в AI Kit доступны через единый OpenAI-совместимый эндпоинт /llm/chat/completions. Это значит, что вы можете использовать официальные SDK OpenAI, просто поменяв base_url на адрес AI Kit.",
            "Python-пример: установите openai (pip install openai), создайте клиент с вашим API-ключом и base_url, затем вызовите client.chat.completions.create() с нужной моделью. Весь код — 5 строк.",
            "Node.js-пример: установите openai (npm install openai), создайте экземпляр OpenAI с baseURL и apiKey, вызовите openai.chat.completions.create(). Ответ придёт в формате { choices: [{ message: { content } }] }.",
            "Важно: параметр model должен точно совпадать с названием из каталога. Используйте копирование названия модели прямо из интерфейса, чтобы избежать опечаток.",
          ] },
          { icon: SquareActivity, title: "Потоковая генерация (Streaming)", description: "Как получать ответ от модели по частям для ускорения UI.", readTime: "4 мин", article: [
            "По умолчанию API ждёт, пока модель сгенерирует весь ответ целиком, и только потом возвращает его. Для длинных ответов это может занять 10–30 секунд — пользователь всё это время видит пустой экран.",
            "Streaming решает эту проблему: ответ приходит по частям (чанками) через Server-Sent Events (SSE). Первый токен появляется через 200–500 мс, и далее текст «печатается» в реальном времени.",
            "Чтобы включить streaming, добавьте параметр stream: true в запрос. Ответ будет приходить построчно в формате data: {json}. Каждый чанк содержит delta.content — очередной фрагмент текста.",
            "Совет: в продакшене обязательно обрабатывайте событие [DONE], которое сигнализирует об окончании генерации.",
          ] },
          { icon: Image, title: "Работа с Vision моделями", description: "Как правильно передавать изображения в формате Base64 или по URL.", readTime: "4 мин", article: [
            "Vision-модели (GPT-4o, Claude 3.5 Sonnet и др.) умеют анализировать изображения: описывать содержимое, извлекать текст (OCR), отвечать на вопросы по картинке.",
            "Есть два способа передать изображение. Первый — по URL: в массиве content добавьте объект с type: 'image_url' и укажите ссылку. Изображение должно быть публично доступно.",
            "Второй способ — Base64: закодируйте файл в base64 и передайте как data:image/jpeg;base64,{data}. Это удобно для приватных изображений, но увеличивает размер запроса.",
            "Ограничения: максимальный размер изображения — 20 МБ. Поддерживаемые форматы: JPEG, PNG, GIF, WebP. Для лучших результатов используйте изображения с разрешением не менее 512×512 пикселей.",
          ] },
          { icon: MessageSquare, title: "Промпт-инжиниринг", description: "Лучшие практики по составлению системных промптов для Claude и GPT-4o.", readTime: "6 мин", article: [
            "Системный промпт (system message) — это инструкция, определяющая поведение модели. Хороший системный промпт превращает универсальную модель в специализированного ассистента для вашей задачи.",
            "Правило 1: будьте конкретны. Вместо «Ты — полезный помощник» напишите «Ты — старший Python-разработчик. Отвечай только о Python, FastAPI и SQLAlchemy. Давай примеры кода с комментариями».",
            "Правило 2: задайте формат вывода. Если вам нужен JSON — скажите об этом явно. Если нужен маркированный список — укажите. Модели отлично следуют структурным инструкциям.",
            "Правило 3: используйте few-shot примеры. Добавьте 2–3 пары «вопрос → идеальный ответ» в системный промпт. Это самый надёжный способ показать модели, чего вы хотите.",
            "Claude vs GPT-4o: Claude лучше следует длинным инструкциям и реже «забывает» контекст. GPT-4o быстрее и лучше работает с кодом. Экспериментируйте с обеими моделями.",
          ] },
        ]} />
      </div>
    </div>
  );
}
