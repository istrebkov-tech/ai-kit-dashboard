import { Construction } from "lucide-react";
import { Card } from "@/components/ui/card";

export function MyAgentsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-5">
          <h1 className="text-lg font-semibold text-foreground">Мои агенты</h1>
          <p className="text-xs text-muted-foreground mt-1">Персонально настроенные агенты</p>
        </div>

        <Card className="p-12 border-dashed flex flex-col items-center justify-center text-center">
          <Construction className="w-12 h-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-bold text-foreground">Раздел в разработке</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            Здесь скоро появится список ваших персонально настроенных агентов.
          </p>
        </Card>
      </div>
    </div>
  );
}
