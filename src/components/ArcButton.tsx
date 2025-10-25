import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArcType } from "@/types";
import { getArcTheme } from "@/lib/arcTheme";

interface ArcButtonProps {
  arc: ArcType;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

export const ArcButton = ({ arc, onClick, children, className, variant = "default" }: ArcButtonProps) => {
  const theme = getArcTheme(arc);
  
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={onClick}
        variant={variant}
        className={cn(
          "relative overflow-hidden font-bold text-lg",
          variant === "default" && theme.gradient,
          variant === "outline" && `border-2 border-${theme.color} hover:bg-${theme.color}/10`,
          theme.glow,
          "transition-all duration-300",
          className
        )}
      >
        <span className={theme.textGlow}>{children}</span>
      </Button>
    </motion.div>
  );
};
