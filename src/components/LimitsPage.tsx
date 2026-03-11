import { Activity, Cpu, Bot, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const usageCards = [
  {
    title: "Токены LLM",
    icon: Cpu,
    used: 1_200_000,
    total: 5_000_000,
    label: "1.2M / 5M токенов",
    percent: 24,
  },
  {
    title: "Запросы (RPM)",
    icon: Zap,
    used: 450,
    total: 1000,
    label: "450 / 1 000 запросов в минуту",
    percent: 45,
  },
  {
    title: "Активные агенты",
    icon: Bot,
    used: 8,
    total: 20,
    label: "8 / 20 агентов запущено",
    percent: 40,
  },
];

const limitsData = [
  { model: "GPT-4o-mini", rpm: "5 000", tpm: "200 000", status: "Normal", color: "bg-emerald-500" },
  { model: "GPT-4o", rpm: "1 000", tpm: "80 000", status: "Near Limit", color: "bg-amber-500" },
  { model: "Claude 3.5 Sonnet", rpm: "2 000", tpm: "150 000", status: "Normal", color: "bg-emerald-500" },
];

export function LimitsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Лимиты и Квоты</h1>
          <p className="text-sm text-muted-foreground mt-1">Текущее использование ресурсов и ограничения</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {usageCards.map((card) => (
            <Card key={card.title} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <card.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">{card.title}</span>
              </div>
              <Progress value={card.percent} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                {card.label} ({card.percent}%)
              </p>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Детальные лимиты по моделям</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Модель / Ресурс</TableHead>
                  <TableHead className="text-xs">Лимит (RPM)</TableHead>
                  <TableHead className="text-xs">Лимит (TPM)</TableHead>
                  <TableHead className="text-xs">Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {limitsData.map((row) => (
                  <TableRow key={row.model}>
                    <TableCell className="text-sm font-medium">{row.model}</TableCell>
                    <TableCell className="text-sm">{row.rpm}</TableCell>
                    <TableCell className="text-sm">{row.tpm}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <span className={`w-2 h-2 rounded-full ${row.color}`} />
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
