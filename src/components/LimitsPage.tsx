import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const usageBars = [
  { label: "Месячные кредиты", used: 1_200_000, total: 5_000_000, display: "1.2M / 5M токенов" },
  { label: "Дневные запросы", used: 3_420, total: 10_000, display: "3 420 / 10 000" },
  { label: "Активные соединения", used: 12, total: 50, display: "12 / 50" },
];

const modelLimits = [
  { group: "GPT-4o", rpm: "1 000", tpm: "80 000", monthly: "10M", priceIn: "$2.50", priceOut: "$10.00", status: "normal" },
  { group: "GPT-4o-mini", rpm: "5 000", tpm: "200 000", monthly: "50M", priceIn: "$0.15", priceOut: "$0.60", status: "normal" },
  { group: "Claude 3.5 Sonnet", rpm: "2 000", tpm: "150 000", monthly: "30M", priceIn: "$3.00", priceOut: "$15.00", status: "normal" },
  { group: "Claude 3 Haiku", rpm: "10 000", tpm: "500 000", monthly: "unlimited", priceIn: "$0.25", priceOut: "$1.25", status: "unlimited" },
  { group: "Llama 3.1 70B", rpm: "5 000", tpm: "300 000", monthly: "unlimited", priceIn: "$0.40", priceOut: "$0.40", status: "unlimited" },
  { group: "Mixtral 8x7B", rpm: "10 000", tpm: "500 000", monthly: "unlimited", priceIn: "$0.24", priceOut: "$0.24", status: "unlimited" },
];




export function LimitsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">Лимиты и Квоты</h1>
            <Badge variant="secondary" className="font-mono text-xs">Tier 3 — Professional</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5">
            Лимиты определяются вашим уровнем. Кредиты списываются за миллион токенов по ценам модели.
          </p>
        </div>

        {/* Current Usage */}
        <Card className="p-5 mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Текущее использование</h2>
          <div className="space-y-3">
            {usageBars.map((bar) => {
              const percent = Math.round((bar.used / bar.total) * 100);
              return (
                <div key={bar.label} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-[180px] shrink-0">{bar.label}</span>
                  <Progress value={percent} className="h-1.5 flex-1" />
                  <span className="font-mono text-xs text-muted-foreground w-[140px] text-right shrink-0">
                    {bar.display} <span className="text-foreground font-semibold">({percent}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Limits Table */}
        <Card className="mb-6">
          <div className="px-5 pt-5 pb-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Лимиты по моделям</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium">Модель</TableHead>
                <TableHead className="text-xs font-medium text-right">RPM</TableHead>
                <TableHead className="text-xs font-medium text-right">TPM</TableHead>
                <TableHead className="text-xs font-medium text-right">Токены / мес</TableHead>
                <TableHead className="text-xs font-medium text-right">Цена / 1M (вход)</TableHead>
                <TableHead className="text-xs font-medium text-right">Цена / 1M (выход)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelLimits.map((row) => (
                <TableRow key={row.group} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-sm font-medium">{row.group}</TableCell>
                  <TableCell className="font-mono text-sm text-right">{row.rpm}</TableCell>
                  <TableCell className="font-mono text-sm text-right">{row.tpm}</TableCell>
                  <TableCell className="text-right">
                    {row.monthly === "unlimited" ? (
                      <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">UNLIMITED</span>
                    ) : (
                      <span className="font-mono text-sm">{row.monthly}</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-right text-muted-foreground">{row.priceIn}</TableCell>
                  <TableCell className="font-mono text-sm text-right text-muted-foreground">{row.priceOut}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

      </div>
    </div>
  );
}
