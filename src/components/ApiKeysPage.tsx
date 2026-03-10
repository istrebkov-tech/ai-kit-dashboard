import { useState } from "react";
import { Shield, RefreshCw, Copy, Check, Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
}

const mockKeys: ApiKey[] = [
  { id: "1", name: "Production Backend", prefix: "ak_live_...x8kQ", created: "12 фев 2025", lastUsed: "2 часа назад" },
  { id: "2", name: "Staging Environment", prefix: "ak_test_...m3Pz", created: "28 янв 2025", lastUsed: "5 дней назад" },
  { id: "3", name: "CI/CD Pipeline", prefix: "ak_live_...r7Wn", created: "3 дек 2024", lastUsed: "12 мин назад" },
];

export function ApiKeysPage() {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const generateToken = () => {
    setTokenLoading(true);
    setTimeout(() => {
      setToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzJhYjNjZDRlIiwiaXNzIjoiYWlraXQucnUiLCJpYXQiOjE3MDk4MjQ0MDAsImV4cCI6MTcwOTgyODAwMCwic2NvcGUiOiJhZ2VudHM6cmVhZCBhZ2VudHM6d3JpdGUgbW9kZWxzOnJlYWQifQ.kX9mZ2vP7qR8wN3tY6uJ");
      setTokenLoading(false);
    }, 800);
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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
                <Button
                  onClick={generateToken}
                  disabled={tokenLoading}
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${tokenLoading ? "animate-spin" : ""}`} />
                  Получить токен
                </Button>
              </div>

              {token && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-success/10 text-success hover:bg-success/10 border-0 text-xs font-medium">
                      Действителен 1ч 0мин
                    </Badge>
                  </div>
                  <div className="relative rounded-md bg-code-bg border border-border">
                    <pre className="p-3 pr-10 text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all">
                      {token}
                    </pre>
                    <button
                      onClick={copyToken}
                      className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-muted transition-colors"
                      title="Копировать"
                    >
                      {copied ? (
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

        {/* Section 2: Persistent API Keys */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Постоянные API ключи</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Долгосрочные ключи для межсервисной интеграции
              </p>
            </div>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="w-3.5 h-3.5" />
              Создать ключ
            </Button>
          </div>

          <div className="divide-y divide-border">
            {mockKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">{key.name}</div>
                  <div className="mt-0.5 text-xs font-mono text-muted-foreground">{key.prefix}</div>
                </div>
                <div className="flex items-center gap-6 shrink-0 ml-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-muted-foreground">Создан: {key.created}</div>
                    <div className="text-xs text-muted-foreground">Посл. использование: {key.lastUsed}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleReveal(key.id)}
                      className="p-1.5 rounded hover:bg-muted transition-colors"
                      title={revealedKeys.has(key.id) ? "Скрыть" : "Показать"}
                    >
                      {revealedKeys.has(key.id) ? (
                        <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                    <button className="p-1.5 rounded hover:bg-destructive/10 transition-colors" title="Удалить">
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
