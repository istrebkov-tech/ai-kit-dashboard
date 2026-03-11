import { type LucideIcon } from "lucide-react";

export interface ResourceItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ResourcesSectionProps {
  items: ResourceItem[];
}

export function ResourcesSection({ items }: ResourcesSectionProps) {
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4">📚 Полезные материалы</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <a
            key={item.title}
            href="#"
            className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-border/80 transition-all cursor-pointer flex items-start gap-3 group"
          >
            <item.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
