import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";

const LIMITS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openrouter-limits`;

interface KeyData {
  label: string;
  limit: number | null;
  limit_remaining: number | null;
  limit_reset?: string | null;
  usage: number;
  usage_daily?: number;
  rate_limit?: {
    requests: number;
    interval: string;
  };
}

const modelLimits = [
  { group: "GPT-4o", rpm: "1 000", tpm: "80 000", monthly: "10M", priceIn: "$2.50", priceOut: "$10.00" },
  { group: "GPT-4o-mini", rpm: "5 000", tpm: "200 000", monthly: "50M", priceIn: "$0.15", priceOut: "$0.60" },
  { group: "Claude 3.5 Sonnet", rpm: "2 000", tpm: "150 000", monthly: "30M", priceIn: "$3.00", priceOut: "$15.00" },
  { group: "Claude 3 Haiku", rpm: "10 000", tpm: "500 000", monthly: "unlimited", priceIn: "$0.25", priceOut: "$1.25" },
  { group: "Llama 3.1 70B", rpm: "5 000", tpm: "300 000", monthly: "unlimited", priceIn: "$0.40", priceOut: "$0.40" },
  { group: "Gemini 2.5 Flash", rpm: "10 000", tpm: "500 000", monthly: "unlimited", priceIn: "$0.15", priceOut: "$0.60" },
];

function formatCredits(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toFixed(4);
}

export function LimitsPage() {
  const [data, setData] = useState<KeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLimits = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(LIMITS_URL, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });
      if (!resp.ok) throw new Error(`Ошибка ${resp.status}`);
      const json = await resp.json();
      setData(json.data ?? json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  const usageBars = data
    ? [
        {
          label: "Кредиты",
          used: data.usage ?? 0,
          total: data.limit ?? 0,
          remaining: data.limit_remaining,
          hasLimit: data.limit !== null && data.limit !== undefined,
        },
        ...(data.usage_daily !== undefined
          ? [{
              label: "Использовано сегодня (USD)",
              used: data.usage_daily,
              total: 0,
              remaining: null as number | null,
              hasLimit: false,
            }]
          : []),
      ]
    : [];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Лимиты и Квоты</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Реальные данные из OpenRouter
              {data?.label && <span className="ml-1">· ключ: <span className="font-mono">{data.label}</span></span>}
            </p>
          </div>
          <button
            onClick={fetchLimits}
            disabled={loading}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </button>
        </div>

        {/* Error */}
        {error && (
          <Card className="p-4 mb-6 border-destructive/30 bg-destructive/5">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Loading skeleton */}
        {loading && !data && (
          <Card className="p-5 mb-6 flex items-center justify-center h-24">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </Card>
        )}

        {/* Current Usage */}
        {data && (
          <Card className="p-5 mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Текущее использование</h2>
            <div className="space-y-3">
              {usageBars.map((bar) => {
                if (bar.hasLimit && bar.total > 0) {
                  const percent = Math.min(100, Math.round((bar.used / bar.total) * 100));
                  return (
                    <div key={bar.label} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-[180px] shrink-0">{bar.label}</span>
                      <Progress value={percent} className="h-1.5 flex-1" />
                      <span className="font-mono text-xs text-muted-foreground w-[180px] text-right shrink-0">
                        ${formatCredits(bar.used)} / ${formatCredits(bar.total)}{" "}
                        <span className="text-foreground font-semibold">({percent}%)</span>
                      </span>
                    </div>
                  );
                }
                return (
                  <div key={bar.label} className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-[180px] shrink-0">{bar.label}</span>
                    <div className="flex-1" />
                    <span className="font-mono text-xs text-muted-foreground w-[180px] text-right shrink-0">
                      ${typeof bar.used === "number" ? formatCredits(bar.used) : bar.used}
                      {bar.remaining !== null && bar.remaining !== undefined && (
                        <span className="ml-2 text-foreground">(ост. ${formatCredits(bar.remaining)})</span>
                      )}
                    </span>
                  </div>
                );
              })}
              {data.rate_limit && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-[180px] shrink-0">Rate Limit</span>
                  <div className="flex-1" />
                  <span className="font-mono text-xs text-muted-foreground w-[180px] text-right shrink-0">
                    {data.rate_limit.requests} req / {data.rate_limit.interval}
                  </span>
                </div>
              )}
              {data.limit_reset && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-[180px] shrink-0">Сброс лимита</span>
                  <div className="flex-1" />
                  <span className="font-mono text-xs text-muted-foreground w-[180px] text-right shrink-0">
                    {data.limit_reset}
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Limits Table */}
        <Card className="mb-6">
          <div className="px-5 pt-5 pb-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Лимиты по моделям</h2>
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[11px] font-medium w-[180px]">Модель</TableHead>
                  <TableHead className="text-[11px] font-medium text-right whitespace-nowrap">RPM</TableHead>
                  <TableHead className="text-[11px] font-medium text-right whitespace-nowrap">TPM</TableHead>
                  <TableHead className="text-[11px] font-medium text-right whitespace-nowrap">Токены/мес</TableHead>
                  <TableHead className="text-[11px] font-medium text-right whitespace-nowrap">$/1M вход</TableHead>
                  <TableHead className="text-[11px] font-medium text-right whitespace-nowrap">$/1M выход</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelLimits.map((row) => (
                  <TableRow key={row.group} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-medium py-2">{row.group}</TableCell>
                    <TableCell className="font-mono text-xs text-right py-2">{row.rpm}</TableCell>
                    <TableCell className="font-mono text-xs text-right py-2">{row.tpm}</TableCell>
                    <TableCell className="text-right py-2">
                      {row.monthly === "unlimited" ? (
                        <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">UNLIMITED</span>
                      ) : (
                        <span className="font-mono text-xs">{row.monthly}</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-right text-muted-foreground py-2">{row.priceIn}</TableCell>
                    <TableCell className="font-mono text-xs text-right text-muted-foreground py-2">{row.priceOut}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
