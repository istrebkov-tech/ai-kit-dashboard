import { useState } from "react";
import { Lightbulb, X } from "lucide-react";

interface PageGuideProps {
  children: React.ReactNode;
}

export function PageGuide({ children }: PageGuideProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="mb-6 rounded-lg border border-primary/15 bg-primary/[0.03] px-4 py-3 flex items-start gap-3">
      <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <div className="flex-1 text-xs text-muted-foreground leading-relaxed [&>strong]:text-foreground [&>strong]:font-medium">
        {children}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="p-0.5 rounded hover:bg-muted transition-colors shrink-0 text-muted-foreground hover:text-foreground"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
