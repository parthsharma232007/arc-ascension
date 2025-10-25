import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArcType } from "@/types";
import { getArcTheme } from "@/lib/arcTheme";

interface ProgressBarProps {
  value: number;
  max?: number;
  arc: ArcType;
  label?: string;
  showValue?: boolean;
}

export const ProgressBar = ({ value, max = 100, arc, label, showValue = true }: ProgressBarProps) => {
  const theme = getArcTheme(arc);
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {showValue && (
            <span className="text-sm font-bold text-muted-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="relative h-3 bg-secondary rounded-full overflow-hidden border border-border">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", theme.gradient, theme.glow, "animate-pulse-glow")}
        />
      </div>
    </div>
  );
};
