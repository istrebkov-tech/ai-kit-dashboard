import { Crown, Shield, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface TopModel {
  name: string;
  provider: string;
  tag: string;
  nda?: boolean;
}

const TOP_MODELS: TopModel[] = [
  { name: "gpt-5.2-pro", provider: "OpenAI", tag: "Reasoning + NDA", nda: true },
  { name: "claude-opus-4-1-fallback", provider: "Anthropic", tag: "200K ctx + Coding", nda: true },
  { name: "gemini-2.5-pro", provider: "Google", tag: "1M ctx + Multimodal" },
  { name: "gpt-5.2", provider: "OpenAI", tag: "Универсал + Fast", nda: true },
  { name: "claude-sonnet-4-fallback", provider: "Anthropic", tag: "Coding + NDA", nda: true },
  { name: "grok-4", provider: "xAI", tag: "Top reasoning" },
  { name: "deepseek-reasoner", provider: "DeepSeek", tag: "CoT reasoning" },
  { name: "llama-3.1-405b", provider: "Meta", tag: "Open-source" },
  { name: "gemini-2.5-flash", provider: "Google", tag: "Fast + 1M ctx" },
  { name: "o3", provider: "OpenAI", tag: "Math + Science" },
];

const PROVIDER_DOT: Record<string, string> = {
  OpenAI: "bg-[hsl(0,0%,15%)]",
  Anthropic: "bg-[hsl(25,80%,55%)]",
  Google: "bg-[hsl(215,80%,50%)]",
  xAI: "bg-[hsl(220,10%,30%)]",
  DeepSeek: "bg-[hsl(220,70%,30%)]",
  Meta: "bg-[hsl(230,60%,55%)]",
};

function TopModelRow({ model, rank }: { model: TopModel; rank: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(model.name);
    setCopied(true);
    toast({ title: "Скопировано", description: model.name });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors">
      <span className={`text-[10px] font-bold w-4 text-center shrink-0 ${rank <= 3 ? "text-primary" : "text-muted-foreground"}`}>
        {rank}
      </span>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PROVIDER_DOT[model.provider] || "bg-muted-foreground"}`} />
      <code className="text-[11px] font-mono font-medium text-foreground truncate">{model.name}</code>
      {model.nda && (
        <span className="text-[8px] px-1 py-px rounded bg-success/10 text-success font-semibold shrink-0">NDA</span>
      )}
      <span className="text-[10px] text-muted-foreground truncate ml-auto mr-1 hidden sm:inline">{model.tag}</span>
      <button
        onClick={handleCopy}
        className="p-0.5 rounded text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        title="Скопировать model ID"
      >
        {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
}

export function TopModelsShowcase() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Crown className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold text-foreground">Топ-10</span>
        <span className="text-[10px] text-muted-foreground">— самые мощные модели на платформе</span>
        <div className="ml-auto flex items-center gap-1">
          <Shield className="w-3 h-3 text-success" />
          <span className="text-[9px] text-muted-foreground"><span className="text-success font-medium">NDA</span> = закрытый контур</span>
        </div>
      </div>
      <div className="py-1 px-1">
        {TOP_MODELS.map((m, i) => (
          <TopModelRow key={m.name} model={m} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
