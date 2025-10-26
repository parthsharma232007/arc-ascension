import { ArcType } from "@/types";

export const arcThemes = {
  hero: {
    gradient: "gradient-hero",
    glow: "glow-hero",
    textGlow: "text-glow-hero",
    color: "hero",
  },
  villain: {
    gradient: "gradient-villain",
    glow: "glow-villain",
    textGlow: "text-glow-villain",
    color: "villain",
  },
  redemption: {
    gradient: "gradient-redemption",
    glow: "glow-redemption",
    textGlow: "text-glow-redemption",
    color: "redemption",
  },
  inter: {
    gradient: "gradient-inter",
    glow: "glow-inter",
    textGlow: "text-glow-inter",
    color: "inter",
  },
};

export const getArcTheme = (arc: ArcType) => arcThemes[arc];

export const arcQuotes = {
  hero: [
    "The difference between the possible and impossible lies in determination.",
    "I'll surpass my limits, right here, right now!",
    "It's not about winning or losing, it's about giving it your all!",
  ],
  villain: [
    "Power is everything. Without it, you're nothing.",
    "In this world, only the strong survive.",
    "I'll crush anyone who stands in my way.",
  ],
  redemption: [
    "The past cannot be changed, but the future is still unwritten.",
    "Every day is a chance to become better than yesterday.",
    "Forgiveness starts with forgiving yourself.",
  ],
  inter: [
    "Winter sharpens the blade. Embrace the cold.",
    "In isolation, legends are forged.",
    "Discipline in darkness, power in silence.",
  ],
};

export const getRandomQuote = (arc: ArcType): string => {
  const quotes = arcQuotes[arc];
  return quotes[Math.floor(Math.random() * quotes.length)];
};
