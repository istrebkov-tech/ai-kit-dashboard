import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, CornerDownLeft, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const suggestions = [
  { emoji: "✨", text: "Как интегрировать агента?" },
  { emoji: "🔑", text: "Сгенерировать тестовый JWT" },
  { emoji: "📊", text: "Почему я уперся в лимиты?" },
];

type Msg = { role: "user" | "assistant"; content: string };

function parseSuggestions(content: string): { clean: string; suggestions: string[] } {
  const lines = content.split("\n");
  const suggestionLines: string[] = [];
  const cleanLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("[SUGGESTION] ")) {
      suggestionLines.push(trimmed.slice("[SUGGESTION] ".length));
    } else {
      cleanLines.push(line);
    }
  }

  return {
    clean: cleanLines.join("\n").trimEnd(),
    suggestions: suggestionLines,
  };
}

async function streamChat({
  messages,
  currentPage,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  currentPage: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, currentPage }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || `Ошибка ${resp.status}`);
    return;
  }

  if (!resp.body) {
    onError("Нет данных от сервера");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        onDone();
        return;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  onDone();
}

export function AiOmnibox({ activeId = "api-keys" }: { activeId?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const assistantRef = useRef("");

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery("");
    setMessages([]);
    setError(null);
    assistantRef.current = "";
  }, []);

  // Scroll to bottom on new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Msg = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setQuery("");
    setIsLoading(true);
    setError(null);
    assistantRef.current = "";

    try {
      await streamChat({
        messages: newMessages,
        currentPage: activeId,
        onDelta: (chunk) => {
          assistantRef.current += chunk;
          const current = assistantRef.current;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: current } : m
              );
            }
            return [...prev, { role: "assistant", content: current }];
          });
        },
        onDone: () => setIsLoading(false),
        onError: (err) => {
          setError(err);
          setIsLoading(false);
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
      setIsLoading(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        className="pointer-events-auto flex items-center gap-2 bg-background border border-border shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] rounded-full p-2.5 transition-all active:scale-95 cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        <kbd className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
          ⌘K
        </kbd>
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
              disabled={isLoading}
            />
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
            ) : (
              query.trim() && (
                <button
                  onClick={() => handleSubmit(query)}
                  className="p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <CornerDownLeft className="w-4 h-4" />
                </button>
              )
            )}
          </div>

          {/* Results area */}
          <div ref={scrollRef} className="max-h-[400px] overflow-y-auto">
            {hasMessages ? (
              <div className="p-4 space-y-3">
                {messages.map((msg, i) => {
                  if (msg.role === "user") {
                    return (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-muted-foreground">И</span>
                        </div>
                        <p className="text-sm text-foreground pt-0.5">{msg.content}</p>
                      </div>
                    );
                  }

                  const isLast = i === messages.length - 1;
                  const { clean, suggestions: msgSuggestions } = parseSuggestions(msg.content);
                  const showSuggestions = isLast && !isLoading && msgSuggestions.length > 0;

                  return (
                    <div key={i}>
                      <div className="bg-muted/50 p-4 rounded-lg text-sm text-foreground/80 leading-relaxed w-full max-w-none space-y-3 [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:ml-5 [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-5 [&_ul]:space-y-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_code]:bg-muted [&_code]:text-foreground [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_pre]:bg-background [&_pre]:border [&_pre]:border-border [&_pre]:rounded-md [&_pre]:p-3 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_p]:leading-relaxed [&_li]:leading-relaxed">
                        <ReactMarkdown>{clean}</ReactMarkdown>
                      </div>
                      {showSuggestions && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/40">
                          {msgSuggestions.map((s, si) => (
                            <button
                              key={si}
                              onClick={() => handleSubmit(s)}
                              className="text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors border border-primary/20 text-left flex items-center gap-1.5 leading-tight shadow-sm active:scale-95"
                            >
                              <Sparkles className="w-3 h-3 shrink-0" />
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {error && (
                  <div className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
                    {error}
                  </div>
                )}
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
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>AI Kit Assistant · OpenRouter</span>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono">Esc</kbd>
              <span>закрыть</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});
