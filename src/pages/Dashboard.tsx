import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressBar } from "@/components/ProgressBar";
import { LevelUpModal } from "@/components/LevelUpModal";
import { getUserProfile, saveUserProfile, clearUserProfile } from "@/lib/storage";
import { getRandomQuote, getArcTheme } from "@/lib/arcTheme";
import { UserProfile, Task } from "@/types";
import { LogOut, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [quote, setQuote] = useState("");
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  useEffect(() => {
    const savedProfile = getUserProfile();
    if (!savedProfile) {
      navigate("/");
      return;
    }
    if (!savedProfile.tasks) {
      savedProfile.tasks = [];
    }
    setProfile(savedProfile);
    setQuote(getRandomQuote(savedProfile.arc));
    
    // Check if we need to generate new tasks
    const today = new Date().toDateString();
    const lastGenDate = savedProfile.lastTaskGenerationDate;
    
    if (!lastGenDate || lastGenDate !== today) {
      generateDailyTasks(savedProfile);
    }
  }, [navigate]);

  const generateDailyTasks = async (currentProfile: UserProfile) => {
    setIsLoadingTasks(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-daily-tasks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            preferences: currentProfile.taskPreferences,
            arc: currentProfile.arc,
            avatar: currentProfile.avatar.name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate tasks');
      }

      const data = await response.json();
      const newTasks: Task[] = data.tasks.map((task: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        title: task.title,
        completed: false,
      }));

      const updatedProfile = {
        ...currentProfile,
        tasks: newTasks,
        lastTaskGenerationDate: new Date().toDateString(),
      };

      setProfile(updatedProfile);
      saveUserProfile(updatedProfile);
      toast.success("Fresh tasks generated for today!");
    } catch (error) {
      console.error('Error generating tasks:', error);
      toast.error("Failed to generate tasks. Please try again.");
    } finally {
      setIsLoadingTasks(false);
    }
  };

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


  const handleToggleTask = (taskId: string) => {
    if (!profile) return;

    const updatedTasks = profile.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const updatedProfile = { ...profile, tasks: updatedTasks };
    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!profile) return;

    const updatedTasks = profile.tasks.filter((task) => task.id !== taskId);
    const updatedProfile = { ...profile, tasks: updatedTasks };
    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);
    toast.success("Task deleted!");
  };


  if (!profile) return null;

  const theme = getArcTheme(profile.arc);

  return (
    <div className="min-h-screen p-4 md:p-8 gradient-bg-dark">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Profile and Logout */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <motion.button
              onClick={() => toast.info("Profile settings coming soon!")}
              className="pixel-button px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-3 h-3" />
              PROFILE
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h1 className={cn("text-2xl md:text-3xl font-bold pixel-text", theme.textGlow)}>
                WELCOME {profile.name.toUpperCase()}
              </h1>
            </motion.div>
          </div>
          
          <motion.button 
            onClick={handleLogout}
            className="pixel-button px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-3 h-3" />
            LOGOUT
          </motion.button>
        </div>

        {/* Character Display with Dialogue Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative flex justify-center items-center"
        >
          {/* Dialogue Bubble */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-24 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="relative pixel-border bg-card border-2 border-primary p-4 max-w-xs">
              <p className="text-xs pixel-text text-center">{quote}</p>
              {/* Speech bubble tail */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-primary" />
            </div>
          </motion.div>

          {/* Character Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.05,
              rotate: [0, -2, 2, -2, 0],
              transition: { duration: 0.5 }
            }}
            className="relative"
          >
            <img
              src={profile.avatar.imageUrl}
              alt={profile.avatar.name}
              className={cn(
                "w-64 h-64 object-cover pixel-border border-4 border-primary",
                "shadow-2xl",
                theme.glow
              )}
            />
            {/* Character name badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 pixel-border bg-background border-2 border-primary px-4 py-1"
            >
              <p className="text-xs font-bold pixel-text whitespace-nowrap">
                {profile.avatar.name.toUpperCase()}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="pixel-border p-6 bg-card/80 backdrop-blur border-2 border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold pixel-text text-center flex-1 text-glow-villain">
                YOUR AI-GENERATED DAILY TASKS
              </h2>
              <motion.button
                onClick={() => profile && generateDailyTasks(profile)}
                disabled={isLoadingTasks}
                className="pixel-border px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs border-2 border-primary disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoadingTasks ? "GENERATING..." : "REFRESH"}
              </motion.button>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {isLoadingTasks ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"
                  />
                  <p className="text-xs pixel-text mt-4">GENERATING YOUR TASKS...</p>
                </div>
              ) : profile.tasks && profile.tasks.length > 0 ? (
                profile.tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={cn(
                      "pixel-border flex items-center gap-3 p-4 border-2 transition-all",
                      task.completed
                        ? "bg-black/50 border-muted"
                        : "bg-card/50 border-border hover:border-primary"
                    )}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                      className={cn(
                        "rounded-full w-5 h-5",
                        task.completed && "bg-primary"
                      )}
                    />
                    <div className="flex-1">
                      <h3
                        className={cn(
                          "font-bold pixel-text text-xs",
                          task.completed && "line-through opacity-50"
                        )}
                      >
                        {task.title.toUpperCase()}
                      </h3>
                    </div>
                    <motion.button
                      onClick={() => handleDeleteTask(task.id)}
                      className="pixel-border p-2 bg-destructive hover:bg-destructive/80 text-destructive-foreground border border-border"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </motion.button>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-muted-foreground text-xs py-8">
                  No tasks available. Click REFRESH to generate new tasks!
                </p>
              )}
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
