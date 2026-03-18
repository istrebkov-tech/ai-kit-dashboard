import { useState } from "react";
import { Copy, Check, Play, Loader2, Sparkles } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const BASE_URL = "https://agentgateway.ai.redmadrobot.com";

function getPythonCode(token: string | null, model: string, mcp: string | null) {
  const t = token ? token.slice(0, 20) + "..." : "YOUR_TOKEN_HERE";
  return `from openai import OpenAI

client = OpenAI(
    base_url="${BASE_URL}/v1",
    api_key="${t}"
)

response = client.chat.completions.create(
    model="${model}",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Привет! Расскажи о себе."}
    ],
    temperature=0.7${mcp ? `,
    # MCP: ${mcp} подключён` : ""}
)

print(response.choices[0].message.content)`;
}

function getNodeCode(token: string | null, model: string, mcp: string | null) {
  const t = token ? token.slice(0, 20) + "..." : "YOUR_TOKEN_HERE";
  return `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${BASE_URL}/v1",
  apiKey: "${t}",
});

const response = await client.chat.completions.create({
  model: "${model}",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Привет! Расскажи о себе." },
  ],
  temperature: 0.7,${mcp ? `
  // MCP: ${mcp} подключён` : ""}
});

console.log(response.choices[0].message.content);`;
}

const mockResponse = {
  id: "chatcmpl-abc123",
  object: "chat.completion",
  model: "gpt-4o",
  choices: [
    {
      index: 0,
      message: {
        role: "assistant",
        content: "Привет! Я — AI-ассистент, работающий через AI Kit. Рад помочь!",
      },
      finish_reason: "stop",
    },
  ],
  usage: { prompt_tokens: 28, completion_tokens: 18, total_tokens: 46 },
};

export function DynamicCodeBuilder() {
  const ob = useOnboarding();
  const [tab, setTab] = useState<"python" | "node">("python");
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [celebrated, setCelebrated] = useState(false);

  const allDone = ob.completedCount === ob.totalTasks;
  const hasAnyData = ob.userToken || ob.hasGeneratedToken;

  const code = tab === "python"
    ? getPythonCode(ob.userToken, ob.selectedModel, ob.selectedMCP)
    : getNodeCode(ob.userToken, ob.selectedModel, ob.selectedMCP);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      const result = { ...mockResponse, model: ob.selectedModel };
      setTestResult(JSON.stringify(result, null, 2));
      setTesting(false);

      if (!celebrated) {
        setCelebrated(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"],
        });
      }
    }, 1800);
  };

  return (
    <div className="mb-6 animate-fade-in">
      {/* Code block */}
      <div className="rounded-xl border border-border bg-foreground text-background overflow-hidden shadow-sm relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-background/10">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTab("python")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                tab === "python" ? "bg-background/15 text-background" : "text-background/50 hover:text-background/80"
              )}
            >
              Python
            </button>
            <button
              onClick={() => setTab("node")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                tab === "node" ? "bg-background/15 text-background" : "text-background/50 hover:text-background/80"
              )}
            >
              Node.js
            </button>
          </div>

          <div className="flex items-center gap-2">
            {hasAnyData && (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Данные подставлены
              </span>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-background/60 hover:text-background hover:bg-background/10 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Скопировано" : "Копировать"}
            </button>
          </div>
        </div>

        {/* Code */}
        <div className="relative">
          <pre className={cn(
            "p-4 text-xs leading-relaxed overflow-x-auto transition-all duration-500",
            !hasAnyData && "blur-[2px] select-none"
          )}>
            <code className="text-emerald-400/90">{code}</code>
          </pre>

          {!hasAnyData && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-background/60 bg-foreground/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                ✨ Выполните шаги выше, чтобы сгенерировать ваш код
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Run Test button */}
      {allDone && (
        <div className="mt-3 animate-fade-in">
          <Button
            onClick={handleRunTest}
            disabled={testing}
            className="gap-2"
            size="sm"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Отправка запроса...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Запустить тестовый запрос
              </>
            )}
          </Button>
        </div>
      )}

      {/* Test result */}
      {testResult && (
        <div className="mt-3 rounded-xl border border-emerald-500/30 bg-foreground text-background overflow-hidden animate-fade-in">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-background/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">200 OK</span>
            <span className="text-[10px] text-background/40 ml-auto">~1.2s</span>
          </div>
          <pre className="p-4 text-xs leading-relaxed overflow-x-auto">
            <code className="text-sky-300/90">{testResult}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
