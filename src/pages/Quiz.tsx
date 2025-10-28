import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArcButton } from "@/components/ArcButton";
import { ArcType, GoalType, Avatar, UserProfile, Mission } from "@/types";
import { avatars } from "@/lib/avatars";
import { saveUserProfile } from "@/lib/storage";
import { Swords, Snowflake, Sparkles, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const Quiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedArc, setSelectedArc] = useState<ArcType | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("");
  const [timeAvailable, setTimeAvailable] = useState("");

  const toggleFocusArea = (area: string) => {
    setFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleComplete = () => {
    if (!name || !selectedArc || !selectedGoal || !selectedAvatar) return;
    if (focusAreas.length === 0 || !difficulty || !timeAvailable) {
      return;
    }

    const initialMissions: Mission[] = [
      {
        id: "1",
        title: "Morning Meditation",
        description: "Start your day with 10 minutes of meditation",
        xpReward: 50,
        completed: false,
        category: "mental",
      },
      {
        id: "2",
        title: "Daily Exercise",
        description: "Complete 30 minutes of physical activity",
        xpReward: 50,
        completed: false,
        category: "physical",
      },
      {
        id: "3",
        title: "Learn Something New",
        description: "Spend 20 minutes learning a new skill",
        xpReward: 50,
        completed: false,
        category: "overall",
      },
    ];

    const profile: UserProfile = {
      name,
      arc: selectedArc,
      goal: selectedGoal,
      avatar: selectedAvatar,
      level: 1,
      xp: 0,
      xpToNextLevel: 1000,
      mentalProgress: 0,
      physicalProgress: 0,
      overallProgress: 0,
      streak: 0,
      missions: initialMissions,
      tasks: [],
      taskPreferences: {
        focusAreas,
        difficulty,
        timeAvailable,
      },
    };

    saveUserProfile(profile);
    navigate("/dashboard");
  };

  const arcOptions: { type: ArcType; title: string; description: string; icon: any }[] = [
    {
      type: "hero",
      title: "Hero Arc",
      description: "Rise to become the greatest version of yourself",
      icon: Swords,
    },
    {
      type: "villain",
      title: "Villain Arc",
      description: "Embrace power and dominance",
      icon: Sparkles,
    },
    {
      type: "redemption",
      title: "Redemption Arc",
      description: "Transform and overcome your past",
      icon: Moon,
    },
    {
      type: "inter",
      title: "Winter Arc",
      description: "Embrace the cold, build discipline in isolation",
      icon: Snowflake,
    },
  ];

  const goalOptions: { type: GoalType; title: string; description: string }[] = [
    {
      type: "mental",
      title: "Mental Development",
      description: "Focus on mind, learning, and wisdom",
    },
    {
      type: "physical",
      title: "Physical Development",
      description: "Build strength, endurance, and health",
    },
    {
      type: "overall",
      title: "Overall Development",
      description: "Balance mind, body, and spirit",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className={`absolute inset-0 ${step === 0 ? 'gradient-bg-hero' : 'gradient-bg-dark'}`} />
      
      <div className="relative z-10 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-center min-h-screen"
            >
              <div className="w-full max-w-md space-y-8 text-center px-4">
                {/* Pixelated Logo */}
                <motion.h1 
                  className="pixel-text text-7xl text-white mb-4 tracking-wider"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  MYARC
                </motion.h1>
                
                {/* Tagline */}
                <motion.p 
                  className="text-white/90 text-sm mb-12"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Your personal transformation app
                </motion.p>
                
                {/* Username Input */}
                <motion.div
                  className="space-y-6 mt-16"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ENTER YOUR NAME"
                    className="pixel-button bg-white/10 border-2 border-white/30 text-white placeholder:text-white/50 text-center py-6 text-sm backdrop-blur-sm hover:bg-white/20 transition-all focus:bg-white/20 focus:border-white/50"
                  />
                  
                  {/* Pixelated Start Button */}
                  <motion.button
                    onClick={() => name && setStep(1)}
                    disabled={!name}
                    className="pixel-button w-full py-4 bg-purple-400 hover:bg-purple-300 disabled:bg-purple-400/50 text-purple-900 font-bold text-sm transition-all disabled:cursor-not-allowed"
                    whileHover={name ? { scale: 1.05 } : {}}
                    whileTap={name ? { scale: 0.95 } : {}}
                  >
                    START
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="arc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="pixel-text text-3xl text-foreground mb-4 text-glow-villain">SELECT ARC</h2>
                <p className="text-muted-foreground text-xs">CHOOSE YOUR PATH</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {arcOptions.map((option) => {
                  const Icon = option.icon;
                  const arcIconColors = {
                    hero: "group-hover:text-blue-400",
                    villain: "group-hover:text-purple-400",
                    redemption: "group-hover:text-green-400",
                    inter: "group-hover:text-sky-300",
                  };
                  const arcTextColors = {
                    hero: "group-hover:text-blue-300",
                    villain: "group-hover:text-purple-300",
                    redemption: "group-hover:text-green-300",
                    inter: "group-hover:text-sky-200",
                  };
                  const arcBorderColors = {
                    hero: "border-blue-400",
                    villain: "border-purple-400",
                    redemption: "border-green-400",
                    inter: "border-sky-300",
                  };
                  return (
                    <motion.div
                      key={option.type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <Card
                        onClick={() => {
                          setSelectedArc(option.type);
                          setStep(2);
                        }}
                        className={`pixel-border p-6 cursor-pointer transition-all duration-300 bg-card/50 backdrop-blur border-2 hover:border-current relative overflow-hidden group h-[280px] ${
                          selectedArc === option.type ? `${arcBorderColors[option.type as keyof typeof arcBorderColors]} glow-villain` : "border-border"
                        }`}
                      >
                        <div className="space-y-4 relative z-10">
                          <Icon className={`w-12 h-12 text-primary transition-colors animate-bounce-slow ${arcIconColors[option.type as keyof typeof arcIconColors]}`} />
                          <h3 className={`text-lg font-bold pixel-text transition-colors ${arcTextColors[option.type as keyof typeof arcTextColors]}`}>{option.title}</h3>
                          <p className={`text-muted-foreground text-xs transition-colors ${arcTextColors[option.type as keyof typeof arcTextColors]}`}>{option.description}</p>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && selectedArc && (
            <motion.div
              key="goal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="pixel-text text-3xl text-foreground mb-4 text-glow-villain">MAIN GOAL</h2>
                <p className="text-muted-foreground text-xs">FOCUS YOUR POWER</p>
              </div>
              
              <div className="grid gap-4">
                {goalOptions.map((option) => (
                  <motion.div
                    key={option.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      onClick={() => {
                        setSelectedGoal(option.type);
                        setStep(3);
                      }}
                      className={`pixel-border p-6 cursor-pointer transition-all duration-300 bg-card/50 backdrop-blur border-2 hover:border-foreground ${
                        selectedGoal === option.type ? "border-foreground glow-villain" : "border-border"
                      }`}
                    >
                      <h3 className="text-base font-bold mb-2 pixel-text">{option.title}</h3>
                      <p className="text-muted-foreground text-xs">{option.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && selectedArc && (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="pixel-text text-3xl text-foreground mb-4 text-glow-villain">CHOOSE YOUR AVATAR</h2>
                <p className="text-muted-foreground text-xs">TO HELP YOU WITH YOUR JOURNEY</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {avatars.filter(avatar => avatar.arc === selectedArc).map((avatar, index) => (
                  <motion.div
                    key={avatar.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      onClick={() => {
                        setSelectedAvatar(avatar);
                      }}
                      className={`pixel-border p-4 cursor-pointer transition-all duration-300 bg-card/50 backdrop-blur border-2 hover:border-foreground hover:shadow-lg hover:shadow-primary/20 ${
                        selectedAvatar?.id === avatar.id ? "border-foreground glow-villain" : "border-border"
                      }`}
                    >
                      <motion.img
                        src={avatar.imageUrl}
                        alt={avatar.name}
                        className="w-full h-40 object-cover pixel-border mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                      <h3 className="text-xs font-bold pixel-text">{avatar.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{avatar.series}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {selectedAvatar && (
                <motion.div 
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.button
                    onClick={() => setStep(4)}
                    className="pixel-button px-12 py-4 bg-primary hover:bg-primary/80 text-primary-foreground font-bold text-sm transition-all animate-pulse-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    CONTINUE
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="pixel-text text-2xl md:text-3xl text-foreground mb-4 text-glow-villain">CUSTOMIZE YOUR DAILY TASKS</h2>
                <p className="text-muted-foreground text-xs">AI WILL GENERATE PERSONALIZED TASKS</p>
              </div>

              <div className="space-y-6">
                {/* Focus Areas */}
                <Card className="pixel-border p-6 bg-card/80 backdrop-blur border-2 border-border">
                  <h3 className="text-sm font-bold pixel-text mb-4">FOCUS AREAS (SELECT MULTIPLE)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Fitness", "Study", "Work", "Mindfulness", "Skills", "Creativity"].map((area) => (
                      <motion.div
                        key={area}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card
                          onClick={() => toggleFocusArea(area)}
                          className={`pixel-border p-4 cursor-pointer transition-all border-2 hover:shadow-lg ${
                            focusAreas.includes(area)
                              ? "border-foreground bg-foreground/10"
                              : "border-border hover:border-foreground"
                          }`}
                        >
                          <p className="text-xs font-bold pixel-text text-center">
                            {area.toUpperCase()}
                          </p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Difficulty Level */}
                <Card className="pixel-border p-6 bg-card/80 backdrop-blur border-2 border-border">
                  <h3 className="text-sm font-bold pixel-text mb-4">DIFFICULTY LEVEL</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {["Easy", "Medium", "Hard"].map((level) => (
                      <motion.div
                        key={level}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card
                          onClick={() => setDifficulty(level)}
                          className={`pixel-border p-4 cursor-pointer transition-all border-2 hover:shadow-lg ${
                            difficulty === level
                              ? "border-foreground bg-foreground/10"
                              : "border-border hover:border-foreground"
                          }`}
                        >
                          <p className="text-xs font-bold pixel-text text-center">
                            {level.toUpperCase()}
                          </p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Time Available */}
                <Card className="pixel-border p-6 bg-card/80 backdrop-blur border-2 border-border">
                  <h3 className="text-sm font-bold pixel-text mb-4">DAILY TIME AVAILABLE</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {["30 mins", "1 hour", "2+ hours"].map((time) => (
                      <motion.div
                        key={time}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card
                          onClick={() => setTimeAvailable(time)}
                          className={`pixel-border p-4 cursor-pointer transition-all border-2 hover:shadow-lg ${
                            timeAvailable === time
                              ? "border-foreground bg-foreground/10"
                              : "border-border hover:border-foreground"
                          }`}
                        >
                          <p className="text-xs font-bold pixel-text text-center">
                            {time.toUpperCase()}
                          </p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>

              {focusAreas.length > 0 && difficulty && timeAvailable && (
                <motion.div 
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.button
                    onClick={() => setStep(5)}
                    className="pixel-button px-12 py-4 bg-primary hover:bg-primary/80 text-primary-foreground font-bold text-sm transition-all animate-pulse-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    CONTINUE
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="name-final"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="pixel-text text-2xl md:text-3xl text-foreground mb-4 text-glow-villain">ONE LAST THING</h2>
                <p className="text-muted-foreground text-xs">CONFIRM YOUR NAME</p>
              </div>

              <Card className="pixel-border p-8 bg-card/80 backdrop-blur border-2 border-border">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name-confirm" className="pixel-text text-xs">YOUR NAME</Label>
                    <Input
                      id="name-confirm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ENTER YOUR NAME"
                      className="pixel-border border-2 text-center"
                    />
                  </div>

                  <motion.button
                    onClick={handleComplete}
                    disabled={!name}
                    className="pixel-button w-full py-4 bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-primary-foreground font-bold text-sm transition-all disabled:cursor-not-allowed animate-pulse-glow"
                    whileHover={name ? { scale: 1.05 } : {}}
                    whileTap={name ? { scale: 0.95 } : {}}
                  >
                    BEGIN JOURNEY
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
