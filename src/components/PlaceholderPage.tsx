import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
}

export function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-12 flex flex-col items-center justify-center text-center">
          <Construction className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-sm font-medium text-foreground">Раздел в разработке</p>
          <p className="mt-1 text-sm text-muted-foreground">Эта страница скоро будет доступна</p>
        </div>
      </div>
    </div>
  );
}
