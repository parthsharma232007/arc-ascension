export type ArcType = "hero" | "villain" | "redemption" | "inter";
export type GoalType = "mental" | "physical" | "overall";

export interface Avatar {
  id: string;
  name: string;
  series: string;
  imageUrl: string;
  arc: ArcType;
}

export interface UserProfile {
  name: string;
  arc: ArcType;
  goal: GoalType;
  avatar: Avatar;
  level: number;
  xp: number;
  xpToNextLevel: number;
  mentalProgress: number;
  physicalProgress: number;
  overallProgress: number;
  streak: number;
  missions: Mission[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  category: GoalType;
}
