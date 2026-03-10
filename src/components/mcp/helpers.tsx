import type { McpTool } from "./types";

export function renderDescription(desc: string) {
  const parts = desc.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="text-xs font-mono bg-code-bg px-1 py-0.5 rounded text-foreground">
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function groupToolsByCategory(tools: McpTool[]): Record<string, McpTool[]> {
  const groups: Record<string, McpTool[]> = {};
  for (const tool of tools) {
    if (!groups[tool.category]) groups[tool.category] = [];
    groups[tool.category].push(tool);
  }
  return groups;
}

export const CATEGORY_COLORS: Record<string, string> = {
  "Чтение": "bg-primary/10 text-primary",
  "Создание": "bg-success/10 text-success",
  "Генерация": "bg-[hsl(270,60%,50%)]/10 text-[hsl(270,60%,50%)]",
  "Ресурсы": "bg-[hsl(30,80%,50%)]/10 text-[hsl(30,80%,50%)]",
  "Утилиты": "bg-muted text-muted-foreground",
};
