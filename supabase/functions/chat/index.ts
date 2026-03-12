// v5 - Context-aware AI assistant
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildSystemPrompt(currentPage: string): string {
  return `Ты — встроенный AI-помощник платформы "AI Kit Console". Твоя задача — помогать разработчикам и инженерам использовать платформу, понимать её концепции и находить нужные разделы.

ОПИСАНИЕ ПЛАТФОРМЫ И НАВИГАЦИЯ:
1. "API Ключи и Доступ" (путь /keys): Здесь пользователи создают временные JWT-токены (живут 1 час, для тестов) или постоянные API-ключи (для бэкенда). Ключ вставляется в заголовок запроса: Authorization: Bearer <KEY>.
2. "Реестр Агентов -> Доступные агенты" (путь /agents): Каталог готовых ИИ-агентов. Пользователь может открыть агента, скопировать эндпоинт (например, /helloworld) и cURL-команду для отправки запроса к ИИ.
3. "Инструменты MCP" (путь /mcp): Здесь лежат серверы Model Context Protocol (интеграции с Jira, GitHub, БД). Чтобы использовать MCP, нужно скопировать команду "npx -y @anthropic/..." и добавить её в конфигурацию своего клиента (например, Claude Desktop).
4. "Лимиты и Квоты" (путь /limits): Страница с информацией о доступных токенах, ограничениях RPM (запросов в минуту) и TPM (токенов в минуту) для разных моделей.

ТЕКУЩИЙ КОНТЕКСТ:
Пользователь сейчас находится на странице: ${currentPage}
Учитывай это! Если пользователь спрашивает "что делать с этим ключом?", а он на странице /keys, подскажи ему перейти в "Реестр Агентов" для отправки первого запроса.

ПРАВИЛА ОТВЕТОВ:
- Будь кратким, технически точным и дружелюбным.
- Используй Markdown для форматирования (жирный шрифт, блоки кода).
- Не выдумывай функционал, которого нет в описании выше.
- Если юзер просит "перейти", объясни ему, куда кликнуть в левом меню.

ПРАВИЛА ОФОРМЛЕНИЯ ОТВЕТОВ (СТРОГО):
- Отвечай ТОЛЬКО в формате Markdown.
- Всегда используй нумерованные списки (1., 2., 3.).
- Перед каждым пунктом списка и после него ДОЛЖЕН БЫТЬ перенос строки (\\n\\n).
- Никогда не пиши вводные слова. Начинай ответ сразу с пункта 1.
- Пиши короткими предложениями в повелительном наклонении (Откройте, Скопируйте, Нажмите).
- Обязательно выделяй жирным шрифтом (**bold**) названия разделов, кнопок и карточек.
- Команды и код оборачивай в markdown-блоки (\\\`code\\\` или \\\`\\\`\\\`block\\\`\\\`\\\`).

ПРИМЕР ИДЕАЛЬНОГО ОТВЕТА:

1. Откройте раздел **Инструменты MCP** в левом меню.

2. Найдите карточку сервера **Atlassian**.

3. Скопируйте команду запуска: \`npx -y @anthropic/atlassian-mcp\`.

4. Вставьте эту команду в конфигурационный файл вашего клиента (например, Claude Desktop).`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, currentPage } = await req.json();

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      console.error("v5: LOVABLE_API_KEY not found");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = buildSystemPrompt(currentPage || "/");
    console.log("v5: calling Lovable AI gateway, page:", currentPage);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    console.log("v5: gateway status", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("v5: gateway error", response.status, errorText);
      return new Response(JSON.stringify({ error: `AI error ${response.status}` }), {
        status: response.status >= 400 && response.status < 500 ? response.status : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("v5: exception", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});