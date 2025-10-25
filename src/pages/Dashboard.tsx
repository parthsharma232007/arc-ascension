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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className={cn("text-4xl md:text-5xl font-bold", theme.textGlow)}>
              Welcome, {profile.name}
            </h1>
            <p className="text-muted-foreground italic">"{quote}"</p>
          </motion.div>
          
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={cn("p-6 border-2", `border-${theme.color}`, theme.glow)}>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={profile.avatar.imageUrl}
                  alt={profile.avatar.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-current"
                />
                <div>
                  <h3 className="text-xl font-bold">{profile.avatar.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.avatar.series}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className={cn("w-5 h-5", `text-${theme.color}`)} />
                  <span className="font-bold">Level {profile.level}</span>
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
                  <Flame className="w-8 h-8 mx-auto text-orange-500 mb-1" />
                  <p className="text-2xl font-bold">{profile.streak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
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
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Development Progress</h2>
            <div className="space-y-6">
              <ProgressBar
                value={profile.mentalProgress}
                arc={profile.arc}
                label="Mental Development"
              />
              <ProgressBar
                value={profile.physicalProgress}
                arc={profile.arc}
                label="Physical Development"
              />
              <ProgressBar
                value={profile.overallProgress}
                arc={profile.arc}
                label="Overall Development"
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
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className={`w-6 h-6 text-${theme.color}`} />
              Daily Missions
            </h2>
            <div className="space-y-4">
              {profile.missions.map((mission) => (
                <div
                  key={mission.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border transition-all",
                    mission.completed ? "bg-muted/50 border-muted" : "bg-card border-border hover:border-current"
                  )}
                >
                  <Checkbox
                    checked={mission.completed}
                    onCheckedChange={() => handleMissionToggle(mission.id)}
                    disabled={mission.completed}
                  />
                  <div className="flex-1">
                    <h3 className={cn("font-bold", mission.completed && "line-through text-muted-foreground")}>
                      {mission.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                  </div>
                  <div className={cn("text-sm font-bold", `text-${theme.color}`)}>
                    +{mission.xpReward} XP
                  </div>
                </div>
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
