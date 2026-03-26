import { Crown, Shield, Zap, Brain, Eye, Code, Globe, Cpu, Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface TopModel {
  rank: number;
  name: string;
  provider: string;
  tagline: string;
  tags: string[];
  icon: React.ElementType;
  highlight?: boolean;
}

const TOP_MODELS: TopModel[] = [
  {
    rank: 1,
    name: "gpt-5.2-pro",
    provider: "OpenAI",
    tagline: "Флагман для сложного reasoning и NDA-задач",
    tags: ["NDA-safe", "200K ctx", "Reasoning"],
    icon: Crown,
    highlight: true,
  },
  {
    rank: 2,
    name: "claude-opus-4-1-fallback",
    provider: "Anthropic",
    tagline: "Лучший для длинных документов и анализа",
    tags: ["NDA-safe", "200K ctx", "Coding"],
    icon: Brain,
  },
  {
    rank: 3,
    name: "gemini-2.5-pro",
    provider: "Google",
    tagline: "Мультимодальный лидер: текст + изображения + код",
    tags: ["1M ctx", "Vision", "Multimodal"],
    icon: Sparkles,
  },
  {
    rank: 4,
    name: "gpt-5.2",
    provider: "OpenAI",
    tagline: "Универсальный баланс мощности и скорости",
    tags: ["NDA-safe", "128K ctx", "Fast"],
    icon: Zap,
  },
  {
    rank: 5,
    name: "claude-sonnet-4-fallback",
    provider: "Anthropic",
    tagline: "Оптимален для кодинга и техдокументации",
    tags: ["NDA-safe", "200K ctx", "Coding"],
    icon: Code,
  },
  {
    rank: 6,
    name: "grok-4",
    provider: "xAI",
    tagline: "Топ в reasoning-бенчмарках, максимальный IQ",
    tags: ["Reasoning", "128K ctx"],
    icon: Cpu,
  },
  {
    rank: 7,
    name: "deepseek-reasoner",
    provider: "DeepSeek",
    tagline: "Chain-of-thought reasoning, open-weight",
    tags: ["Reasoning", "Open-weight"],
    icon: Brain,
  },
  {
    rank: 8,
    name: "llama-3.1-405b",
    provider: "Meta",
    tagline: "Крупнейшая open-source модель для on-prem",
    tags: ["Open-source", "128K ctx"],
    icon: Globe,
  },
  {
    rank: 9,
    name: "gemini-2.5-flash",
    provider: "Google",
    tagline: "Быстрый и дешёвый, но умный — идеален для масштаба",
    tags: ["Fast", "1M ctx", "Cheap"],
    icon: Zap,
  },
  {
    rank: 10,
    name: "o3",
    provider: "OpenAI",
    tagline: "Глубокий reasoning для математики и науки",
    tags: ["Reasoning", "200K ctx"],
    icon: Eye,
  },
];

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "bg-[hsl(0,0%,10%)] text-[hsl(0,0%,100%)]",
  Anthropic: "bg-[hsl(25,80%,92%)] text-[hsl(25,80%,30%)]",
  Google: "bg-[hsl(215,85%,92%)] text-[hsl(215,80%,30%)]",
  xAI: "bg-[hsl(220,10%,20%)] text-[hsl(0,0%,100%)]",
  DeepSeek: "bg-[hsl(220,70%,18%)] text-[hsl(0,0%,100%)]",
  Meta: "bg-[hsl(230,65%,92%)] text-[hsl(230,60%,35%)]",
};

function ModelRow({ model, onNavigate }: { model: TopModel; onNavigate?: () => void }) {
  const [copied, setCopied] = useState(false);
  const Icon = model.icon;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(model.name);
    setCopied(true);
    toast({ title: "Скопировано", description: model.name });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`group relative flex items-center gap-3 rounded-lg border px-4 py-3 transition-all cursor-default
        ${model.highlight
          ? "border-primary/30 bg-primary/[0.03] shadow-sm"
          : "border-border bg-card hover:border-primary/20"
        }`}
    >
      {/* Rank */}
      <div className={`flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold shrink-0
        ${model.rank <= 3
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
        }`}>
        {model.rank}
      </div>

      {/* Icon */}
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0
        ${model.highlight
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
        }`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <code className="text-sm font-mono font-semibold text-foreground">{model.name}</code>
          <Badge className={`text-[9px] px-1.5 py-0 h-4 font-medium border-0 rounded ${PROVIDER_COLORS[model.provider] || "bg-muted text-muted-foreground"}`}>
            {model.provider}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-tight truncate">{model.tagline}</p>
      </div>

      {/* Tags */}
      <div className="hidden lg:flex items-center gap-1 shrink-0">
        {model.tags.map((tag) => (
          <span
            key={tag}
            className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium
              ${tag === "NDA-safe"
                ? "bg-success/10 text-success"
                : "bg-muted text-muted-foreground"
              }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Copy */}
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all opacity-0 group-hover:opacity-100 shrink-0"
        title="Скопировать model ID"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export function TopModelsShowcase({ onNavigate }: { onNavigate?: (id: string) => void }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
            <Crown className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Топ-10 моделей</h2>
            <p className="text-[11px] text-muted-foreground">Самые мощные LLM на платформе</p>
          </div>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate("models")}
            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Все модели →
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {TOP_MODELS.map((model) => (
          <ModelRow key={model.name} model={model} />
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 px-1">
        <Shield className="w-3.5 h-3.5 text-success shrink-0" />
        <p className="text-[11px] text-muted-foreground">
          <span className="text-success font-medium">NDA-safe</span> — модели, развёрнутые на закрытом контуре. Ваши данные не покидают периметр.
        </p>
      </div>
    </div>
  );
}
