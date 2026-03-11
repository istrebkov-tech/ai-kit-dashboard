import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTermProps {
  children: React.ReactNode;
  tip: string;
}

export function HelpTerm({ children, tip }: HelpTermProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted underline-offset-4 decoration-muted-foreground/50 cursor-help inline-flex items-center gap-1">
          {children}
          <HelpCircle className="w-3 h-3 text-muted-foreground inline-block" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs bg-foreground text-background text-xs leading-relaxed">
        {tip}
      </TooltipContent>
    </Tooltip>
  );
}
