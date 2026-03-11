import { useState } from "react";
import { type LucideIcon, ArrowLeft, ChevronRight, Clock, BookOpen } from "lucide-react";

export interface ResourceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  article?: string[];
  readTime?: string;
}

interface ResourcesSectionProps {
  items: ResourceItem[];
}

function ArticleView({ item, onBack }: { item: ResourceItem; onBack: () => void }) {
  return (
    <div className="mt-12 pt-8 border-t border-border animate-in fade-in slide-in-from-right-4 duration-200">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Назад к материалам
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <item.icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {item.readTime || "3 мин"}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              Гайд
            </span>
          </div>
        </div>
      </div>

      <div className="prose-custom space-y-4">
        {item.article?.map((paragraph, i) => (
          <p key={i} className="text-sm text-muted-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

export function ResourcesSection({ items }: ResourcesSectionProps) {
  const [openArticle, setOpenArticle] = useState<ResourceItem | null>(null);

  if (openArticle) {
    return <ArticleView item={openArticle} onBack={() => setOpenArticle(null)} />;
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4">📚 Полезные материалы</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <button
            key={item.title}
            onClick={() => setOpenArticle(item)}
            className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-primary/20 transition-all cursor-pointer flex items-start gap-3 group text-left"
          >
            <item.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</div>
              <span className="inline-flex items-center gap-1 text-xs text-primary/70 mt-2 group-hover:text-primary transition-colors">
                <BookOpen className="w-3 h-3" />
                Читать
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
