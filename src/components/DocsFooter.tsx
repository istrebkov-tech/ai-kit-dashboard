import { BookOpen } from "lucide-react";

interface DocsFooterProps {
  text: string;
}

export function DocsFooter({ text }: DocsFooterProps) {
  return (
    <div className="flex items-center gap-2 mt-12 py-6 border-t border-border/50 text-sm text-muted-foreground">
      <BookOpen className="w-4 h-4 shrink-0" />
      <span className="hover:text-primary transition-colors cursor-pointer">
        {text}
      </span>
    </div>
  );
}
