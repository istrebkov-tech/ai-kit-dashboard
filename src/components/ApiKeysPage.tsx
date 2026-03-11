import { useState, useEffect, useRef } from "react";
import { Shield, RefreshCw, Copy, Check, Plus, KeyRound, ChevronDown, ChevronUp, Trash2, List } from "lucide-react";
import { PageGuide } from "./PageGuide";
import { SmartCodeBlock } from "./api-keys/SmartCodeBlock";

import { ResourcesSection } from "./ResourcesSection";
import { Shield as ShieldIcon, Clock, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";


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

interface ApiKeysPageProps {
  jwtToken: string | null;
  onJwtTokenChange: (token: string | null) => void;
}

export function ApiKeysPage({ jwtToken, onJwtTokenChange }: ApiKeysPageProps) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isKeyExpanded, setIsKeyExpanded] = useState(false);
  const [isKeysListExpanded, setIsKeysListExpanded] = useState(false);

  // JWT section
  const [jwtCopied, setJwtCopied] = useState(false);
  const [jwtLoading, setJwtLoading] = useState(false);
  const [tokenHighlight, setTokenHighlight] = useState(false);
  const [isTokenExpanded, setIsTokenExpanded] = useState(false);

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

  const generateJwt = () => {
    setJwtLoading(true);
    setTimeout(() => {
      const sig = Math.random().toString(36).substring(2, 15) + Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
      setJwtToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzJhYjNjZDRlIiwiaXNzIjoiYWlraXQucnUiLCJpYXQiOjE3MDk4MjQ0MDAsImV4cCI6MTcwOTgyODAwMCwic2NvcGUiOiJhZ2VudHM6cmVhZCBhZ2VudHM6d3JpdGUgbW9kZWxzOnJlYWQifQ." + sig);
      setJwtLoading(false);
      startJwtTimer();
      setTokenHighlight(true);
      setIsTokenExpanded(true);
      setTimeout(() => setTokenHighlight(false), 1500);
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
      setIsKeyExpanded(true);
    }, 600);
  };

  const copyToken = () => {
    if (createdToken) {
      navigator.clipboard.writeText(createdToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const dismissKeyDetails = () => {
    setIsKeyExpanded(false);
    setCreatedToken(null);
    setCopied(false);
  };


  const deleteKey = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
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
              <div className="mt-4 flex items-center gap-3">
                <Button onClick={generateJwt} disabled={jwtLoading} size="sm" className="gap-2">
                  {jwtToken ? (
                    <RefreshCw className={`w-3.5 h-3.5 ${jwtLoading ? "animate-spin" : ""}`} />
                  ) : (
                    <KeyRound className="w-3.5 h-3.5" />
                  )}
                  {jwtToken ? "Обновить токен" : "Получить токен"}
                </Button>
                {jwtToken && (
                  <>
                    <Badge className={`${jwtSecondsLeft <= 300 ? 'bg-destructive/10 text-destructive hover:bg-destructive/10' : 'bg-success/10 text-success hover:bg-success/10'} border-0 text-xs font-medium tabular-nums`}>
                      {Math.floor(jwtSecondsLeft / 60)}мин {jwtSecondsLeft % 60}с
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsTokenExpanded(!isTokenExpanded)}
                      className="gap-1.5 text-muted-foreground ml-auto"
                    >
                      {isTokenExpanded ? (
                        <><ChevronUp className="w-3.5 h-3.5" /> Скрыть детали</>
                      ) : (
                        <><ChevronDown className="w-3.5 h-3.5" /> Показать детали</>
                      )}
                    </Button>
                  </>
                )}
              </div>

              <Collapsible open={isTokenExpanded}>
                <CollapsibleContent>
                  {jwtToken && (
                    <div className="mt-3 space-y-3">
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

                      <div className="pt-2 border-t border-border">
                        <div className="mb-2 flex items-center gap-2 rounded-md bg-success/10 border border-success/20 px-3 py-2 text-xs text-success">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          Токен подставлен в примеры. При перезагрузке страницы он будет сброшен.
                        </div>
                        <SmartCodeBlock token={jwtToken} highlight={tokenHighlight} />
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* Section 2: Create API Key */}
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <KeyRound className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-foreground">Создать API ключ</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Долгосрочный ключ для межсервисной интеграции. Действует 365 дней.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Название ключа (напр. мой-агент)"
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && !creating && !!newKeyName.trim() && createKey()}
                />
                <Button onClick={createKey} disabled={creating || !newKeyName.trim()} size="sm" className="gap-2 shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                  Создать
                </Button>
                {createdToken && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsKeyExpanded(!isKeyExpanded)}
                    className="gap-1.5 text-muted-foreground ml-auto shrink-0"
                  >
                    {isKeyExpanded ? (
                      <><ChevronUp className="w-3.5 h-3.5" /> Скрыть детали</>
                    ) : (
                      <><ChevronDown className="w-3.5 h-3.5" /> Показать детали</>
                    )}
                  </Button>
                )}
              </div>

              <Collapsible open={isKeyExpanded}>
                <CollapsibleContent>
                  {createdToken && (
                    <div className="mt-3 space-y-3">
                      <div className="relative rounded-md bg-code-bg border border-border">
                        <pre className="p-3 pr-10 text-xs font-mono text-foreground whitespace-pre-wrap break-all max-h-28 overflow-y-auto">
                          {createdToken}
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

                      <div className="flex items-center gap-2 rounded-md bg-success/10 border border-success/20 px-3 py-2 text-xs text-success">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        Ключ подставлен в примеры. При перезагрузке страницы он будет сброшен.
                      </div>

                      <div className="min-w-0 max-w-full">
                        <SmartCodeBlock token={createdToken} />
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

            </div>
          </div>
        </div>

        {/* Section 3: Active Keys */}
        <div className="mb-6 rounded-lg border border-border bg-card p-5">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <List className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-foreground">Активные ключи</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Управление созданными ключами. Удалите ключ, если доступ больше не требуется.
              </p>

              <div className="mt-4">
                {keys.length === 0 ? (
                  <div className="py-4 border-2 border-dashed border-border rounded-lg text-center flex items-center justify-center gap-2">
                    <KeyRound className="w-4 h-4 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">Нет активных ключей</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative rounded-md bg-code-bg border border-border p-3 pr-10 font-mono">
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <KeyRound className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="inline-block w-28 truncate font-medium">{keys[0].name}</span>
                        <span className="text-muted-foreground">•</span>
                        <code className="text-muted-foreground w-20 shrink-0">[sk-...{keys[0].id.slice(-4)}]</code>
                        <span className="text-muted-foreground hidden sm:inline shrink-0">• {keys[0].created}</span>
                      </div>
                      <button
                        onClick={() => deleteKey(keys[0].id)}
                        className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-destructive/10 transition-colors group"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive" />
                      </button>
                    </div>

                    {keys.length > 1 && (
                      <Collapsible open={isKeysListExpanded} onOpenChange={setIsKeysListExpanded}>
                        <CollapsibleContent>
                          <div className="space-y-2">
                            {keys.slice(1).map((key) => (
                              <div key={key.id} className="relative rounded-md bg-code-bg border border-border p-3 pr-10 font-mono">
                                <div className="flex items-center gap-2 text-xs text-foreground">
                                  <KeyRound className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  <span className="inline-block w-28 truncate font-medium">{key.name}</span>
                                  <span className="text-muted-foreground">•</span>
                                  <code className="text-muted-foreground w-20 shrink-0">[sk-...{key.id.slice(-4)}]</code>
                                  <span className="text-muted-foreground hidden sm:inline shrink-0">• {key.created}</span>
                                </div>
                                <button
                                  onClick={() => deleteKey(key.id)}
                                  className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-destructive/10 transition-colors group"
                                  title="Удалить"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                        <div className="flex justify-start mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsKeysListExpanded(!isKeysListExpanded)}
                            className="text-xs text-muted-foreground hover:text-foreground gap-1 h-auto py-1 px-2"
                          >
                            {isKeysListExpanded ? (
                              <><ChevronUp className="w-3 h-3" /> Скрыть</>
                            ) : (
                              <><ChevronDown className="w-3 h-3" /> Показать остальные ({keys.length - 1})</>
                            )}
                          </Button>
                        </div>
                      </Collapsible>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
          { icon: Activity, title: "Быстрый старт с Python", description: "Готовые скрипты и примеры кода для быстрой интеграции.", readTime: "5 мин", article: [
            "Python — один из самых популярных языков для работы с AI API. Библиотека requests позволяет отправить первый запрос буквально в три строки кода.",
            "Установите requests через pip install requests, импортируйте библиотеку и передайте ваш API-ключ в заголовке Authorization: Bearer <ключ>.",
            "Для продакшен-сценариев рекомендуем использовать httpx с поддержкой async/await для параллельных запросов и автоматических ретраев.",
          ] },
          { icon: Activity, title: "Вебхуки и асинхронность", description: "Как получать результаты долгих генераций через вебхуки.", readTime: "4 мин", article: [
            "Некоторые задачи — например, генерация длинных текстов или обработка больших файлов — могут занимать десятки секунд. Вместо ожидания ответа используйте вебхуки.",
            "При создании задачи укажите callback_url. Когда результат будет готов, платформа отправит POST-запрос на ваш URL с полным результатом в теле.",
            "Для локальной разработки используйте ngrok или аналоги, чтобы получать вебхуки на localhost.",
          ] },
          { icon: Activity, title: "Промпт-инжиниринг", description: "Лучшие практики составления системных промптов для агентов.", readTime: "6 мин", article: [
            "Системный промпт задаёт контекст и правила поведения агента. Чем точнее вы опишете задачу и ограничения, тем качественнее будет результат.",
            "Используйте структурированные инструкции: роль, задача, формат вывода, ограничения. Разделяйте блоки маркерами вроде ### или XML-тегами.",
            "Тестируйте промпты итеративно. Начните с простого варианта, затем добавляйте детали и edge-cases по мере обнаружения проблем.",
          ] },
          { icon: ShieldIcon, title: "Справочник ошибок", description: "Коды HTTP-ответов API и решения частых проблем.", readTime: "3 мин", article: [
            "401 Unauthorized — невалидный или истёкший токен. Проверьте формат заголовка: Authorization: Bearer <token>.",
            "429 Too Many Requests — превышен лимит запросов. Реализуйте exponential backoff и проверьте заголовок Retry-After.",
            "500 Internal Server Error — ошибка на стороне платформы. Повторите запрос через несколько секунд. Если ошибка повторяется, обратитесь в поддержку.",
          ] },
        ]} />
      </div>
    </div>
  );
}
