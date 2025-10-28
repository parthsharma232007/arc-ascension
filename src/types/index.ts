export type ArcType = "hero" | "villain" | "redemption" | "inter";
export type GoalType = "mental" | "physical" | "overall";

export interface Avatar {
  id: string;
  name: string;
  series: string;
  imageUrl: string;
  arc: ArcType;
}

export interface TaskPreferences {
  focusAreas: string[];
  difficulty: string;
  timeAvailable: string;
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
  tasks: Task[];
  taskPreferences: TaskPreferences;
  lastTaskGenerationDate?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  category: GoalType;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}
