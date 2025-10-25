import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressBar } from "@/components/ProgressBar";
import { LevelUpModal } from "@/components/LevelUpModal";
import { getUserProfile, saveUserProfile, clearUserProfile } from "@/lib/storage";
import { getRandomQuote, getArcTheme } from "@/lib/arcTheme";
import { UserProfile } from "@/types";
import { Trophy, Flame, LogOut, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const savedProfile = getUserProfile();
    if (!savedProfile) {
      navigate("/");
      return;
    }
    setProfile(savedProfile);
    setQuote(getRandomQuote(savedProfile.arc));
  }, [navigate]);

  const handleMissionToggle = (missionId: string) => {
    if (!profile) return;

    const mission = profile.missions.find((m) => m.id === missionId);
    if (!mission || mission.completed) return;

    const updatedMissions = profile.missions.map((m) =>
      m.id === missionId ? { ...m, completed: true } : m
    );

    const newXp = profile.xp + mission.xpReward;
    const leveledUp = newXp >= profile.xpToNextLevel;
    const newLevel = leveledUp ? profile.level + 1 : profile.level;
    const finalXp = leveledUp ? newXp - profile.xpToNextLevel : newXp;

    const progressIncrement = 10;
    const newMentalProgress = mission.category === "mental" ? Math.min(profile.mentalProgress + progressIncrement, 100) : profile.mentalProgress;
    const newPhysicalProgress = mission.category === "physical" ? Math.min(profile.physicalProgress + progressIncrement, 100) : profile.physicalProgress;
    const newOverallProgress = Math.min(profile.overallProgress + progressIncrement / 2, 100);

    const updatedProfile: UserProfile = {
      ...profile,
      missions: updatedMissions,
      xp: finalXp,
      level: newLevel,
      mentalProgress: newMentalProgress,
      physicalProgress: newPhysicalProgress,
      overallProgress: newOverallProgress,
    };

    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);

    toast.success(`+${mission.xpReward} XP!`, {
      description: mission.title,
    });

    if (leveledUp) {
      setShowLevelUp(true);
    }
  };

  const handleLogout = () => {
    clearUserProfile();
    navigate("/");
  };

  if (!profile) return null;

  const theme = getArcTheme(profile.arc);

  return (
    <div className="min-h-screen p-4 md:p-8 gradient-bg-dark">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h1 className={cn("text-2xl md:text-3xl font-bold pixel-text", theme.textGlow, "animate-float")}>
              {profile.name.toUpperCase()}
            </h1>
            <p className="text-muted-foreground text-xs">"{quote}"</p>
          </motion.div>
          
          <motion.button 
            onClick={handleLogout}
            className="pixel-button px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LOGOUT
          </motion.button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={cn("pixel-border p-6 border-2 bg-card/80 backdrop-blur", theme.glow, "border-primary")}>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <motion.img
                  src={profile.avatar.imageUrl}
                  alt={profile.avatar.name}
                  className="w-20 h-20 pixel-border object-cover border-2 border-primary"
                  whileHover={{ scale: 1.1 }}
                />
                <div>
                  <h3 className="text-sm font-bold pixel-text">{profile.avatar.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{profile.avatar.series}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className={cn("w-5 h-5 text-primary animate-bounce-slow")} />
                  <span className="font-bold pixel-text text-xs">LVL {profile.level}</span>
                </div>
                <ProgressBar
                  value={profile.xp}
                  max={profile.xpToNextLevel}
                  arc={profile.arc}
                  label="XP"
                />
              </div>
              
              <div className="flex items-center gap-4 justify-end">
                <div className="text-center">
                  <Flame className="w-8 h-8 mx-auto text-primary mb-1 animate-glow-pulse" />
                  <p className="text-2xl font-bold pixel-text">{profile.streak}</p>
                  <p className="text-xs text-muted-foreground">STREAK</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Progress Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="pixel-border p-6 bg-card/80 backdrop-blur border-2 border-border">
            <h2 className="text-lg font-bold mb-6 pixel-text text-glow-villain">PROGRESS</h2>
            <div className="space-y-6">
              <ProgressBar
                value={profile.mentalProgress}
                arc={profile.arc}
                label="MENTAL"
              />
              <ProgressBar
                value={profile.physicalProgress}
                arc={profile.arc}
                label="PHYSICAL"
              />
              <ProgressBar
                value={profile.overallProgress}
                arc={profile.arc}
                label="OVERALL"
              />
            </div>
          </Card>
        </motion.div>

        {/* Daily Missions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="pixel-border p-6 bg-card/80 backdrop-blur border-2 border-border">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 pixel-text text-glow-villain">
              <Zap className="w-6 h-6 text-primary animate-glow-pulse" />
              MISSIONS
            </h2>
            <div className="space-y-4">
              {profile.missions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={cn(
                    "pixel-border flex items-start gap-4 p-4 border-2 transition-all",
                    mission.completed ? "bg-muted/30 border-muted" : "bg-card/50 border-border hover:border-primary"
                  )}
                >
                  <Checkbox
                    checked={mission.completed}
                    onCheckedChange={() => handleMissionToggle(mission.id)}
                    disabled={mission.completed}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className={cn("font-bold pixel-text text-xs", mission.completed && "line-through text-muted-foreground")}>
                      {mission.title.toUpperCase()}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{mission.description}</p>
                  </div>
                  <div className="text-xs font-bold pixel-text text-primary">
                    +{mission.xpReward}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <LevelUpModal
        isOpen={showLevelUp}
        level={profile.level}
        arc={profile.arc}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  );
};

export default Dashboard;
