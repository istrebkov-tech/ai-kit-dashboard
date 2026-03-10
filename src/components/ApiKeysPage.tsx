import { useState } from "react";
import { Shield, RefreshCw, Copy, Check, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const BASE_URL = "https://agentgateway.ai.redmadrobot.com";

interface ApiKey {
  id: string;
  name: string;
  created: string;
}

function generateMockToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 256; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function CurlExample({ token }: { token: string | null }) {
  const t = token || "YOUR_API_KEY_TOKEN";
  const isPlaceholder = !token;
  return (
    <>
      {`curl "${BASE_URL}/llm/chat/completions" \\
  -H "Authorization: Bearer `}
      <span className={isPlaceholder ? "text-token-highlight font-semibold" : ""}>{t}</span>
      {`" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'`}
    </>
  );
}

export function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  // JWT section
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [jwtCopied, setJwtCopied] = useState(false);
  const [jwtLoading, setJwtLoading] = useState(false);

  const generateJwt = () => {
    setJwtLoading(true);
    setTimeout(() => {
      setJwtToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzJhYjNjZDRlIiwiaXNzIjoiYWlraXQucnUiLCJpYXQiOjE3MDk4MjQ0MDAsImV4cCI6MTcwOTgyODAwMCwic2NvcGUiOiJhZ2VudHM6cmVhZCBhZ2VudHM6d3JpdGUgbW9kZWxzOnJlYWQifQ.kX9mZ2vP7qR8wN3tY6uJ");
      setJwtLoading(false);
    }, 800);
  };

  const copyJwt = () => {
    if (jwtToken) {
      navigator.clipboard.writeText(jwtToken);
      setJwtCopied(true);
      setTimeout(() => setJwtCopied(false), 2000);
    }
  };

  const createKey = () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    setTimeout(() => {
      const token = generateMockToken();
      const newKey: ApiKey = {
        id: crypto.randomUUID(),
        name: newKeyName.trim(),
        created: formatDate(new Date()),
      };
      setKeys((prev) => [newKey, ...prev]);
      setCreatedToken(token);
      setNewKeyName("");
      setCreating(false);
    }, 600);
  };

  const copyToken = () => {
    if (createdToken) {
      navigator.clipboard.writeText(createdToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const deleteKey = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const dismissToken = () => {
    setCreatedToken(null);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">API Ключи и Доступ</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Управление токенами аутентификации и постоянными API ключами
          </p>
        </div>


        {/* Section 1: JWT Token */}
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Shield className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-foreground">Временный сессионный токен (JWT)</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Генерация краткосрочного JWT для доступа к API. Токены действительны 60 минут.
              </p>
              <div className="mt-4">
                <Button onClick={generateJwt} disabled={jwtLoading} size="sm" className="gap-2">
                  <RefreshCw className={`w-3.5 h-3.5 ${jwtLoading ? "animate-spin" : ""}`} />
                  Получить токен
                </Button>
              </div>

              {jwtToken && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-success/10 text-success hover:bg-success/10 border-0 text-xs font-medium">
                      Действителен 1ч 0мин
                    </Badge>
                  </div>
                  <div className="relative rounded-md bg-code-bg border border-border">
                    <pre className="p-3 pr-10 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all">
                      {jwtToken}
                    </pre>
                    <button
                      onClick={copyJwt}
                      className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-muted transition-colors"
                      title="Копировать"
                    >
                      {jwtCopied ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Create API Key */}
        {/* Section 2: Usage */}
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">Использование API</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Используйте ключ в заголовке <code className="text-xs font-mono bg-code-bg px-1 py-0.5 rounded">Authorization: Bearer &lt;TOKEN&gt;</code> при запросах к API.
          </p>

          <div className="relative rounded-md bg-code-bg border border-border">
            <pre className="p-3 pr-10 text-xs font-mono text-foreground overflow-x-auto whitespace-pre">
              <CurlExample token={createdToken} />
            </pre>
            <button
              onClick={() => {
                const t = createdToken || "YOUR_API_KEY_TOKEN";
                const text = `curl "${BASE_URL}/llm/chat/completions" \\\n  -H "Authorization: Bearer ${t}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'`;
                navigator.clipboard.writeText(text);
              }}
              className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-muted transition-colors"
              title="Копировать"
            >
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Section 3: Create API Key */}
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">Создать API ключ</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Долгосрочный ключ для межсервисной интеграции. Действует 365 дней.
          </p>

          <div className="flex gap-3">
            <Input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Название ключа (напр. мой-агент)"
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && !creating && !!jwtToken && !!newKeyName.trim() && createKey()}
              disabled={!jwtToken}
            />
            <Button onClick={createKey} disabled={creating || !newKeyName.trim() || !jwtToken} className="gap-2 shrink-0">
              <Plus className="w-3.5 h-3.5" />
              Создать
            </Button>
          </div>
          {!jwtToken && (
            <p className="mt-2 text-xs text-muted-foreground">
              Сначала получите сессионный токен (JWT) выше, чтобы создать API ключ.
            </p>
          )}

          {/* Newly created token — shown once */}
          {createdToken && (
            <div className="mt-4 rounded-lg border-2 border-success/40 bg-success/5 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Токен создан!</h3>
              <p className="text-sm text-muted-foreground">
                Bearer Token (действует 365 дней):
              </p>
              <div className="rounded-md bg-code-bg border border-border">
                <pre className="p-3 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all max-h-40">
                  {createdToken}
                </pre>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={copyToken} size="sm" className="gap-2">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Скопировано" : "Копировать токен"}
                </Button>
                <Button onClick={dismissToken} size="sm" variant="ghost" className="text-muted-foreground">
                  Закрыть
                </Button>
              </div>
              <p className="text-xs font-medium text-destructive flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Скопируйте токен сейчас — он больше не будет показан.
              </p>
            </div>
          )}
        </div>

        {/* Section 3: Existing Keys */}
        {keys.length > 0 && (
          <div className="rounded-lg border border-border bg-card">
            <div className="px-5 py-3.5 border-b border-border">
              <p className="text-xs text-muted-foreground">Найдено: {keys.length}</p>
            </div>
            <div className="divide-y divide-border">
              {keys.map((key) => (
                <div key={key.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-foreground">{key.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{key.created}</div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteKey(key.id)}
                    className="shrink-0 ml-4"
                  >
                    Удалить
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
