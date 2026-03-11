import type { McpServer } from "./types";

export const servers: McpServer[] = [
  {
    id: "deepwiki",
    name: "deepwiki",
    authType: "public",
    description: "DeepWiki - AI documentation for GitHub repos",
    path: "/mcp/dev/deepwiki",
    status: { kind: "success" },
    mcpCommand: {
      command: "npx",
      args: ["-y", "@anthropic/deepwiki-mcp"],
      env: { "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN_HERE" },
    },
    tools: [
      { name: "read_wiki_structure", description: "Получить список тем документации для GitHub-репозитория. Args: `repoName` — репозиторий GitHub в формате owner/repo.", category: "Чтение" },
      { name: "read_wiki_contents", description: "Просмотреть документацию GitHub-репозитория. Args: `repoName` — репозиторий GitHub в формате owner/repo.", category: "Чтение" },
      { name: "ask_question", description: "Задать вопрос о GitHub-репозитории и получить ответ на основе контекста с помощью ИИ. Args: `repoName` — репозиторий GitHub в формате owner/repo, `question` — текст вопроса.", category: "Генерация" },
    ],
  },
  {
    id: "test",
    name: "test",
    authType: "keycloak",
    description: "MCP Server Everything - демонстрационные инструменты",
    path: "/mcp/test",
    status: { kind: "success" },
    mcpCommand: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-everything"],
    },
    tools: [
      { name: "echo", description: "Возвращает входное сообщение обратно. Args: `message`.", category: "Утилиты" },
      { name: "get-annotated-message", description: "Возвращает аннотированное сообщение с метаданными. Args: `messageType`, `includeImage`.", category: "Генерация" },
      { name: "get-env", description: "Выводит переменные окружения сервера.", category: "Утилиты" },
      { name: "get-resource-links", description: "Возвращает ссылку на ресурс. Args: `resourceId`.", category: "Ресурсы" },
      { name: "get-sum", description: "Складывает два числа. Args: `a`, `b`.", category: "Утилиты" },
    ],
  },
  {
    id: "atlassian",
    name: "atlassian",
    authType: "keycloak",
    description: "Atlassian MCP - Jira and Confluence",
    path: "/mcp/atlassian",
    status: {
      kind: "auth",
      fields: [
        { label: "Atlassian Username", placeholder: "Atlassian Username" },
        { label: "Jira API Token", placeholder: "Jira API Token", type: "password" },
        { label: "Confluence API Token", placeholder: "Confluence API Token", type: "password" },
      ],
    },
    tools: [],
  },
  {
    id: "speechcore",
    name: "speechcore",
    authType: "keycloak",
    description: "SpeechCore AI STT MCP (SSE) - transcription tools and resources",
    path: "/mcp/speechcore",
    status: { kind: "error", message: "Ошибка запроса" },
    tools: [],
  },
  {
    id: "google-workspace",
    name: "google-workspace",
    authType: "keycloak",
    description: "Google Workspace MCP - интеграция с Google API",
    path: "/mcp/google-workspace",
    status: { kind: "error", message: "Ошибка запроса" },
    tools: [],
  },
  {
    id: "erc3-store",
    name: "erc3-store",
    authType: "keycloak",
    description: "ERC3 Store MCP - управление хранилищем данных",
    path: "/mcp/erc3/store",
    status: { kind: "error", message: "Ошибка запроса" },
    tools: [],
  },
];
