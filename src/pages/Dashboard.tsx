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
import { UserProfile, Task } from "@/types";
import { Trophy, Flame, LogOut, Zap, Plus, User, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [quote, setQuote] = useState("");
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const savedProfile = getUserProfile();
    if (!savedProfile) {
      navigate("/");
      return;
    }
    // Initialize tasks array if it doesn't exist
    if (!savedProfile.tasks) {
      savedProfile.tasks = [];
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

  const handleAddTask = () => {
    if (!profile || !taskTitle.trim() || !taskTime.trim()) {
      toast.error("Please fill in both title and time");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle,
      time: taskTime,
      completed: false,
    };

    const updatedProfile = {
      ...profile,
      tasks: [...(profile.tasks || []), newTask],
    };

    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);
    setTaskTitle("");
    setTaskTime("");
    setShowTaskDialog(false);
    toast.success("Task added!");
  };

  const handleEditTask = () => {
    if (!profile || !editingTask || !taskTitle.trim() || !taskTime.trim()) {
      toast.error("Please fill in both title and time");
      return;
    }

    const updatedTasks = profile.tasks.map((task) =>
      task.id === editingTask.id
        ? { ...task, title: taskTitle, time: taskTime }
        : task
    );

    const updatedProfile = { ...profile, tasks: updatedTasks };
    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);
    setTaskTitle("");
    setTaskTime("");
    setEditingTask(null);
    setShowTaskDialog(false);
    toast.success("Task updated!");
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

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskTime(task.time);
    setShowTaskDialog(true);
  };

  const openAddDialog = () => {
    setEditingTask(null);
    setTaskTitle("");
    setTaskTime("");
    setShowTaskDialog(true);
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

        {/* Avatar Card with Motivational Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={cn("pixel-border p-6 border-2 bg-card/80 backdrop-blur text-center", theme.glow, "border-primary")}>
            <motion.img
              src={profile.avatar.imageUrl}
              alt={profile.avatar.name}
              className="w-32 h-32 pixel-border object-cover border-2 border-primary mx-auto mb-4"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            />
            <h3 className="text-sm font-bold pixel-text mb-2">{profile.avatar.name}</h3>
            <p className="text-xs text-muted-foreground italic">"{quote}"</p>
          </Card>
        </motion.div>

        {/* Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="pixel-border p-6 bg-card/80 backdrop-blur border-2 border-border">
            <h2 className="text-lg font-bold mb-4 pixel-text text-center text-glow-villain">
              ADD TASKS FOR YOUR DAY
            </h2>
            
            {/* Add Task Button */}
            <div className="flex justify-center mb-6">
              <motion.button
                onClick={openAddDialog}
                className="pixel-border w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center border-2 border-primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-8 h-8" />
              </motion.button>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {profile.tasks && profile.tasks.length > 0 ? (
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
                      <p className="text-xs text-muted-foreground mt-1">
                        {task.time}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => openEditDialog(task)}
                        className="pixel-border p-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={task.completed}
                      >
                        <Edit2 className="w-3 h-3" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteTask(task.id)}
                        className="pixel-border p-2 bg-destructive hover:bg-destructive/80 text-destructive-foreground border border-border"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-muted-foreground text-xs py-8">
                  No tasks yet. Click the + button to add your first task!
                </p>
              )}
            </div>
          </Card>
        </motion.div>

      </div>

      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="pixel-border bg-card border-2 border-primary max-w-md">
          <DialogHeader>
            <DialogTitle className="pixel-text text-lg text-glow-villain">
              {editingTask ? "EDIT TASK" : "ADD NEW TASK"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="task-title" className="pixel-text text-xs">
                TASK TITLE
              </Label>
              <Input
                id="task-title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title"
                className="pixel-border border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-time" className="pixel-text text-xs">
                TIME
              </Label>
              <Input
                id="task-time"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
                placeholder="e.g., 9:00 AM - 10:00 AM"
                className="pixel-border border-2"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={editingTask ? handleEditTask : handleAddTask}
                className="pixel-border flex-1 bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary"
              >
                {editingTask ? "UPDATE" : "ADD TASK"}
              </Button>
              <Button
                onClick={() => {
                  setShowTaskDialog(false);
                  setEditingTask(null);
                  setTaskTitle("");
                  setTaskTime("");
                }}
                variant="secondary"
                className="pixel-border flex-1 border-2"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
