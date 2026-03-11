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
  description?: string;
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

export function ResourcesSection({ items, description = "Руководства, лимиты и лучшие практики по работе с API" }: ResourcesSectionProps) {
  const [openArticle, setOpenArticle] = useState<ResourceItem | null>(null);

  if (openArticle) {
    return <ArticleView item={openArticle} onBack={() => setOpenArticle(null)} />;
  }

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-5">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen className="w-4.5 h-4.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-foreground">Полезные материалы</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>

          <div className="flex gap-3 overflow-x-auto pb-3 mt-5 scrollbar-hide snap-x">
            {items.map((item) => (
              <button
                key={item.title}
                onClick={() => setOpenArticle(item)}
                className="group relative flex-none w-[260px] snap-start flex items-center p-4 pl-5 rounded-xl border border-border bg-background hover:bg-muted/50 hover:shadow-sm transition-all cursor-pointer text-left overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary transition-colors" />
                <div className="min-w-0 flex-1">
                  <h5 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h5>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 ml-3 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
