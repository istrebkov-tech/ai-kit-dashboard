import { Crown, Shield, Copy, Check, ChevronDown, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TopModel {
  name: string;
  provider: string;
  tag: string;
  desc: string;
}

const TOP_MODELS: TopModel[] = [
  { name: "claude-opus-4-6", provider: "Anthropic", tag: "Coding · Deep reasoning", desc: "Флагман для сложных задач: архитектура, рефакторинг, длинные цепочки рассуждений" },
  { name: "claude-sonnet-4-5", provider: "Anthropic", tag: "Coding · Fast", desc: "Лучший баланс скорости и качества для повседневной разработки и код-ревью" },
  { name: "claude-sonnet-4", provider: "Anthropic", tag: "Coding · Affordable", desc: "Быстрая и экономичная модель для массовых запросов и автоматизации" },
  { name: "gpt-4.1", provider: "OpenAI", tag: "Universal · Instruction", desc: "Сильное следование инструкциям, хорош для структурированных выводов и API-агентов" },
  { name: "claude-opus-4-1", provider: "Anthropic", tag: "Reasoning · Analysis", desc: "Глубокий анализ и работа с конфиденциальными данными в закрытом контуре" },
  { name: "gpt-5", provider: "OpenAI", tag: "Reasoning · Multimodal", desc: "Мультимодальный флагман OpenAI: текст, изображения, сложные рассуждения" },
  { name: "gemini-2.5-flash-image", provider: "Google", tag: "Vision · Generation", desc: "Генерация и редактирование изображений по текстовому описанию" },
  { name: "gpt-5-pro", provider: "OpenAI", tag: "Max quality · Slow", desc: "Максимальное качество для research-задач, где важна точность, а не скорость" },
  { name: "gpt-4o-mini", provider: "OpenAI", tag: "Lightweight · Cheap", desc: "Ультрабюджетная модель для классификации, саммари и простых задач" },
  { name: "grok-3", provider: "xAI", tag: "Reasoning · Real-time", desc: "Быстрые рассуждения с доступом к актуальным данным в реальном времени" },
];

const NDA_MODELS: TopModel[] = [
  { name: "qwen3-30b-a3b-instruct-2507", provider: "Qwen", tag: "NDA · Reasoning", desc: "Оптимальный баланс размера и качества для продакшен-задач в закрытом контуре" },
  { name: "qwen2.5-7b-instruct", provider: "Qwen", tag: "NDA · Fast", desc: "Быстрая компактная модель для NDA-сценариев: классификация, суммаризация, чат" },
];

const PROVIDER_DOT: Record<string, string> = {
  OpenAI: "bg-[hsl(0,0%,15%)]",
  Anthropic: "bg-[hsl(25,80%,55%)]",
  Google: "bg-[hsl(215,80%,50%)]",
  xAI: "bg-[hsl(220,10%,30%)]",
  Qwen: "bg-[hsl(270,60%,50%)]",
};

function ModelRow({ model, rank, nda }: { model: TopModel; rank?: number; nda?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(model.name);
    setCopied(true);
    toast({ title: "Скопировано", description: model.name });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group flex items-start gap-2 py-2 px-2.5 rounded-md hover:bg-muted/50 transition-colors">
      {rank !== undefined && (
        <span className={`text-[10px] font-bold w-4 text-center shrink-0 mt-0.5 ${rank <= 3 ? "text-primary" : "text-muted-foreground"}`}>
          {rank}
        </span>
      )}
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${PROVIDER_DOT[model.provider] || "bg-muted-foreground"}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <code className="text-[11px] font-mono font-medium text-foreground">{model.name}</code>
          {nda && (
            <span className="text-[8px] px-1 py-px rounded bg-success/10 text-success font-semibold shrink-0">NDA</span>
          )}
          <button
            onClick={handleCopy}
            className="p-0.5 rounded text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            title="Скопировать model ID"
          >
            {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{model.desc}</p>
      </div>
      <span className="text-[9px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5 hidden sm:inline">{model.tag}</span>
    </div>
  );
}

export function TopModelsShowcase() {
  const [open, setOpen] = useState(false);
  const [ndaOpen, setNdaOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Top 10 — collapsible */}
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="rounded-lg border border-border bg-card">
          <CollapsibleTrigger className="w-full flex items-center gap-2 px-3 py-2.5 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
            <Crown className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">Топ-10</span>
            <span className="text-[10px] text-muted-foreground">— самые мощные модели на платформе</span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="py-1 px-1">
              {TOP_MODELS.map((m, i) => (
                <ModelRow key={m.name} model={m} rank={i + 1} />
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* NDA / Qwen block — collapsible */}
      <Collapsible open={ndaOpen} onOpenChange={setNdaOpen}>
        <div className="rounded-lg border border-success/30 bg-success/5">
          <CollapsibleTrigger className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-success/10 transition-colors cursor-pointer">
            <Lock className="w-3.5 h-3.5 text-success" />
            <span className="text-xs font-semibold text-foreground">NDA-модели</span>
            <span className="text-[10px] text-muted-foreground">— закрытый контур, Qwen on-premise</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-success/10 text-success font-semibold ml-1">
              {NDA_MODELS.length}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform ${ndaOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="py-1 px-1 border-t border-success/20">
              {NDA_MODELS.map((m) => (
                <ModelRow key={m.name} model={m} nda />
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
