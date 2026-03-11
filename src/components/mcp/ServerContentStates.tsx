import { useState, useMemo, useCallback } from "react";
import { ChevronDown, ChevronRight, TriangleAlert, Lock, RefreshCw, Copy, Check, FileJson } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { McpServer, McpTool } from "./types";
import { groupToolsByCategory, CATEGORY_COLORS } from "./helpers";

/** Split description into main text and args with descriptions */
function parseToolDescription(desc: string): { text: string; args: { name: string; hint: string }[] } {
  const argsMatch = desc.match(/Args:\s*(.+)$/);
  if (!argsMatch) return { text: desc.trim(), args: [] };
  const text = desc.slice(0, desc.indexOf("Args:")).trim();
  const argsStr = argsMatch[1];
  // Match patterns like `argName` — description or `argName` - description
  const argParts = argsStr.split(/,\s*(?=`)/).map((s) => s.trim()).filter(Boolean);
  const args = argParts.map((part) => {
    const nameMatch = part.match(/^`([^`]+)`/);
    const name = nameMatch ? nameMatch[1] : part;
    const hint = nameMatch ? part.slice(nameMatch[0].length).replace(/^\s*[—–\-:]\s*/, "").trim() : "";
    return { name, hint: hint || name };
  });
  return { text, args };
}

// --- Tool list sub-components ---

function ToolItem({ tool }: { tool: McpTool }) {
  const { text, args } = useMemo(() => parseToolDescription(tool.description), [tool.description]);

  return (
    <div className="px-3 py-2 flex flex-col gap-1">
      <code className="text-sm font-mono font-semibold text-foreground">{tool.name}</code>
      {text && (
        <p className="text-[13px] text-muted-foreground leading-snug line-clamp-2">{text}</p>
      )}
      {args.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          <span className="text-[11px] text-muted-foreground/60 mr-0.5 uppercase tracking-wider font-semibold">Args:</span>
          {args.map((arg) => (
            <Tooltip key={arg.name}>
              <TooltipTrigger asChild>
                <span className="bg-muted/40 text-muted-foreground px-2 py-0.5 rounded border border-border/60 text-[11px] font-mono cursor-help decoration-dotted underline underline-offset-2 decoration-muted-foreground/30">
                  {arg.name}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                <span className="font-mono font-semibold">{arg.name}</span>
                <span className="text-muted-foreground ml-1">(string)</span>
                {arg.hint && <p className="mt-0.5 text-muted-foreground">{arg.hint}</p>}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryGroup({ category, tools }: { category: string; tools: McpTool[] }) {
  const [open, setOpen] = useState(false);
  const colorClass = CATEGORY_COLORS[category] || "bg-muted text-muted-foreground";

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-4 py-2.5 hover:bg-muted/40 transition-colors cursor-pointer">
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        )}
        <Badge className={`text-[10px] px-2 py-0 h-[18px] font-medium border-0 ${colorClass} hover:${colorClass}`}>
          {category}
        </Badge>
        <span className="text-xs text-muted-foreground">{tools.length}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="divide-y divide-border ml-5 mr-2 mb-1 rounded-md border border-border bg-muted/20">
          {tools.map((tool) => (
            <ToolItem key={tool.name} tool={tool} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// --- Connection Command Block ---

function ConnectionCommand({ server }: { server: McpServer }) {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const copyToClipboard = useCallback((text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  }, []);

  if (!server.mcpCommand) return null;

  const { command, args, env } = server.mcpCommand;
  const shortCommand = `${command} ${args.join(" ")}`;

  const fullConfig = JSON.stringify(
    {
      mcpServers: {
        [server.id]: {
          command,
          args,
          ...(env && Object.keys(env).length > 0 ? { env } : {}),
        },
      },
    },
    null,
    2
  );

  return (
    <div className="border-t border-border px-4 py-3 bg-muted/20">
      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-semibold">
        Command to run
      </span>
      <div className="mt-1.5 flex items-center gap-2">
        <code className="flex-1 text-xs font-mono bg-muted/50 border border-border rounded px-3 py-1.5 text-foreground truncate">
          {shortCommand}
        </code>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 shrink-0"
              onClick={() => copyToClipboard(shortCommand, setCopiedCmd)}
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">Копировать команду</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 shrink-0 gap-1 text-[11px] text-muted-foreground"
              onClick={() => copyToClipboard(fullConfig, setCopiedConfig)}
            >
              {copiedConfig ? <Check className="w-3 h-3 text-success" /> : <FileJson className="w-3 h-3" />}
              Config
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs max-w-xs">
            Копировать полный JSON-конфиг для Claude Desktop
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

// --- State A: Success ---

function SuccessContent({ server }: { server: McpServer }) {
  const grouped = useMemo(() => groupToolsByCategory(server.tools), [server.tools]);
  const categories = Object.keys(grouped).sort();

  return (
    <div>
      <div className="bg-muted/30">
        {categories.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">Нет инструментов</p>
        ) : (
          <div className="py-1">
            {categories.map((cat) => (
              <CategoryGroup key={cat} category={cat} tools={grouped[cat]} />
            ))}
          </div>
        )}
      </div>
      <ConnectionCommand server={server} />
    </div>
  );
}

// --- State B: Error ---

function ErrorContent({ message }: { message: string }) {
  return (
    <div className="p-4">
      <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Ошибка загрузки инструментов</AlertTitle>
        <AlertDescription className="mt-1">
          <span>Ошибка: {message}</span>
          <div className="mt-3">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
              <RefreshCw className="w-3 h-3" />
              Повторить запрос
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// --- State C: Auth Required ---

function AuthContent({ fields }: { fields: McpServer["status"] & { kind: "auth" } extends { fields: infer F } ? F : never }) {
  return (
    <div className="p-4">
      <Card className="bg-muted/40 border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[hsl(45,93%,47%)]/10">
              <Lock className="w-4 h-4 text-[hsl(45,93%,47%)]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Требуется авторизация</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Введите учётные данные для доступа к инструментам этого сервера.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          {(fields as { label: string; placeholder: string; type?: string }[]).map((field) => (
            <div key={field.label} className="space-y-1.5">
              <Label className="text-xs">{field.label}</Label>
              <Input
                type={field.type || "text"}
                placeholder={field.placeholder}
                className="h-8 text-xs"
              />
            </div>
          ))}
        </CardContent>
        <CardFooter className="pt-0">
          <Button size="sm" className="h-8 text-xs">
            Сохранить
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// --- Dispatcher ---

export function ServerContent({ server }: { server: McpServer }) {
  switch (server.status.kind) {
    case "success":
      return <SuccessContent server={server} />;
    case "error":
      return <ErrorContent message={server.status.message} />;
    case "auth":
      return <AuthContent fields={server.status.fields} />;
  }
}
