import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, ArrowRight, CornerDownLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const suggestions = [
  { emoji: "✨", text: "Как интегрировать агента?" },
  { emoji: "🔑", text: "Сгенерировать тестовый JWT" },
  { emoji: "📊", text: "Почему я уперся в лимиты?" },
];

const MOCK_RESPONSE = `**Agent-to-Agent (A2A)** — это протокол для программного взаимодействия с агентами.

### Быстрый старт

1. Получите JWT-токен на странице **API Ключи**
2. Найдите нужного агента в **Реестре Агентов**
3. Отправьте POST-запрос на его эндпоинт \`/message/send\`

\`\`\`bash
curl "https://agentgateway.ai.redmadrobot.com/a2a/helloworld/message/send" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":"1","method":"message/send","params":{"message":{"role":"user","parts":[{"kind":"text","text":"Hello"}]}}}'
\`\`\`

Агент обработает запрос и вернёт структурированный ответ.`;

export function AiOmnibox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSubmitted(null);
  }, []);

  // Global Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) setOpen(false);
        else handleOpen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleOpen]);

  // Auto-focus input
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    setSubmitted(text.trim());
    setQuery("");
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        className="pointer-events-auto flex items-center gap-2 bg-background border border-border shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] rounded-full p-2.5 transition-all active:scale-95 cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        <kbd className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
      </button>

      {/* Omnibox dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 gap-0 max-w-2xl w-full rounded-xl shadow-2xl overflow-hidden border border-border bg-card [&>button]:hidden">
          {/* Input area */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(query);
                if (e.key === "Escape") setOpen(false);
              }}
              placeholder="Спросите AI или введите команду..."
              className="flex-1 text-lg bg-transparent placeholder:text-muted-foreground/50 focus:outline-none text-foreground"
            />
            {query.trim() && (
              <button
                onClick={() => handleSubmit(query)}
                className="p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Results area */}
          <div className="max-h-[400px] overflow-y-auto">
            {submitted ? (
              <div className="p-4 space-y-3">
                {/* User prompt */}
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-muted-foreground">И</span>
                  </div>
                  <p className="text-sm text-foreground pt-0.5">{submitted}</p>
                </div>
                {/* AI response */}
                <div className="bg-muted/50 p-4 rounded-lg text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {MOCK_RESPONSE}
                </div>
              </div>
            ) : (
              <div className="p-2">
                <div className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Быстрые действия
                </div>
                {suggestions.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => handleSubmit(s.text)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted/70 transition-colors group/item"
                  >
                    <span className="text-base">{s.emoji}</span>
                    <span className="flex-1 text-left">{s.text}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover/item:text-muted-foreground transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>AI Kit Assistant</span>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono">Esc</kbd>
              <span>закрыть</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
