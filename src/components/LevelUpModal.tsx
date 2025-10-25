import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ArcType } from "@/types";
import { getArcTheme } from "@/lib/arcTheme";
import { cn } from "@/lib/utils";

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  arc: ArcType;
  onClose: () => void;
}

export const LevelUpModal = ({ isOpen, level, arc, onClose }: LevelUpModalProps) => {
  const theme = getArcTheme(arc);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className={cn(
              "relative p-12 rounded-2xl border-2",
              `border-${theme.color}`,
              theme.glow,
              "bg-card"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className={cn("w-20 h-20 mx-auto", `text-${theme.color}`)} />
              </motion.div>
              
              <div>
                <motion.h2
                  className={cn("text-6xl font-bold mb-4", theme.textGlow)}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  LEVEL UP!
                </motion.h2>
                <p className="text-4xl font-bold text-foreground">Level {level}</p>
              </div>
              
              <p className="text-muted-foreground">
                Click anywhere to continue
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
