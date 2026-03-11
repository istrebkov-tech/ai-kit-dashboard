import { useState, useEffect, useRef } from "react";
import { Shield, RefreshCw, Copy, Check, Plus, Trash2, AlertTriangle } from "lucide-react";
import { PageGuide } from "./PageGuide";
import { SmartCodeBlock } from "./api-keys/SmartCodeBlock";

import { ResourcesSection } from "./ResourcesSection";
import { Shield as ShieldIcon, Clock, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";


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
  const [tokenHighlight, setTokenHighlight] = useState(false);
  const usageSectionRef = useRef<HTMLDivElement>(null);

  // JWT countdown
  const [jwtSecondsLeft, setJwtSecondsLeft] = useState(0);
  const jwtIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startJwtTimer = () => {
    if (jwtIntervalRef.current) clearInterval(jwtIntervalRef.current);
    setJwtSecondsLeft(3599);
    jwtIntervalRef.current = setInterval(() => {
      setJwtSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(jwtIntervalRef.current!);
          jwtIntervalRef.current = null;
          setJwtToken(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (jwtIntervalRef.current) clearInterval(jwtIntervalRef.current);
    };
  }, []);

  const activeToken = jwtToken || createdToken;

  const flashAndScroll = () => {
    setTokenHighlight(true);
    setTimeout(() => setTokenHighlight(false), 1500);
    setTimeout(() => {
      usageSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const generateJwt = () => {
    setJwtLoading(true);
    setTimeout(() => {
      setJwtToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzJhYjNjZDRlIiwiaXNzIjoiYWlraXQucnUiLCJpYXQiOjE3MDk4MjQ0MDAsImV4cCI6MTcwOTgyODAwMCwic2NvcGUiOiJhZ2VudHM6cmVhZCBhZ2VudHM6d3JpdGUgbW9kZWxzOnJlYWQifQ.kX9mZ2vP7qR8wN3tY6uJ");
      setJwtLoading(false);
      startJwtTimer();
      flashAndScroll();
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

        <PageGuide>
          <strong>С чего начать:</strong> Любой запрос к платформе требует авторизации. Сгенерируйте временный JWT-токен (на 1 час) для быстрых тестов в Postman/Terminal, или создайте постоянный ключ для вашего бэкенда.
        </PageGuide>

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
                    <Badge className={`${jwtSecondsLeft <= 300 ? 'bg-destructive/10 text-destructive hover:bg-destructive/10' : 'bg-success/10 text-success hover:bg-success/10'} border-0 text-xs font-medium tabular-nums`}>
                      Действителен {Math.floor(jwtSecondsLeft / 60)}мин {jwtSecondsLeft % 60}с
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
              onKeyDown={(e) => e.key === "Enter" && !creating && !!newKeyName.trim() && createKey()}
            />
            <Button onClick={createKey} disabled={creating || !newKeyName.trim()} className="gap-2 shrink-0">
              <Plus className="w-3.5 h-3.5" />
              Создать
            </Button>
          </div>

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

        {/* Section 3: Usage */}
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">Использование API</h2>
          {createdToken ? (
            <div className="mb-3 flex items-center gap-2 rounded-md bg-success/10 border border-success/20 px-3 py-2 text-xs text-success">
              <Check className="w-3.5 h-3.5 shrink-0" />
              Ваш токен подставлен в пример ниже. При перезагрузке страницы он будет сброшен.
            </div>
          ) : (
            <div className="mb-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Используйте ключ в заголовке <code className="text-xs font-mono bg-code-bg px-1 py-0.5 rounded">Authorization: Bearer &lt;TOKEN&gt;</code> при запросах к API.
              </p>
              <p className="text-xs text-muted-foreground/70 italic">
                💡 При создании API-ключа токен автоматически подставится в примеры ниже.
              </p>
            </div>
          )}

          <SmartCodeBlock token={createdToken} />
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

        <ResourcesSection items={[
          { icon: ShieldIcon, title: "Безопасность API", description: "Как безопасно хранить ключи и избегать утечек в публичных репозиториях.", readTime: "4 мин", article: [
            "API-ключи — это пароли вашего приложения. Утечка ключа означает, что злоумышленник получает полный доступ к вашим ресурсам и квотам. К сожалению, это одна из самых частых ошибок: разработчики случайно коммитят ключи в публичные GitHub-репозитории.",
            "Первое правило: никогда не храните ключи в исходном коде. Используйте переменные окружения (environment variables). В Node.js — файл .env и библиотеку dotenv, в Python — os.environ или python-dotenv. Добавьте .env в .gitignore.",
            "Второе правило: разделяйте окружения. Используйте отдельные ключи для разработки, тестирования и продакшена. Если утечёт dev-ключ, продакшен останется в безопасности.",
            "Третье правило: ротируйте ключи регулярно. AI Kit позволяет создать новый ключ, мигрировать сервисы, а затем удалить старый — без даунтайма. Рекомендуемый интервал ротации — раз в 90 дней.",
          ] },
          { icon: Clock, title: "JWT против Постоянных ключей", description: "В чем разница и что лучше использовать для вашего бэкенда.", readTime: "3 мин", article: [
            "JWT (JSON Web Token) — это временный токен, который AI Kit выдаёт на основе вашей сессии. Он действует ровно 60 минут, после чего нужно получить новый. JWT идеально подходит для быстрых тестов в Postman или терминале.",
            "Постоянный API-ключ — это долгоживущий Bearer-токен (365 дней). Он предназначен для серверных интеграций: вашего бэкенда, CI/CD пайплайнов, автоматических скриптов. Ключ не зависит от вашей пользовательской сессии.",
            "Когда что использовать? Если вы прототипируете или отлаживаете запрос — JWT. Если вы деплоите сервис в продакшен — постоянный ключ. Никогда не используйте JWT в продакшене: он истечёт, и ваш сервис перестанет работать.",
          ] },
          { icon: Activity, title: "Лимиты и квоты (Rate Limits)", description: "Ограничения на количество запросов в минуту для разных типов токенов.", readTime: "3 мин", article: [
            "Каждый тип токена имеет свои лимиты. JWT-токены ограничены 60 запросами в минуту — этого достаточно для ручного тестирования, но не для продакшен-нагрузки.",
            "Постоянные API-ключи имеют лимит в 600 запросов в минуту на ключ. Если вашему сервису нужно больше — создайте несколько ключей и распределите нагрузку между ними (round-robin).",
            "При превышении лимита API вернёт ответ 429 Too Many Requests с заголовком Retry-After, указывающим через сколько секунд можно повторить запрос. Рекомендуем реализовать exponential backoff в вашем клиенте.",
          ] },
        ]} />
      </div>
    </div>
  );
}
