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
import { Swords, Brain, Sparkles, Moon } from "lucide-react";

const Quiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedArc, setSelectedArc] = useState<ArcType | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

  const handleComplete = () => {
    if (!name || !selectedArc || !selectedGoal || !selectedAvatar) return;

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
      title: "Inter Arc",
      description: "Journey within for personal growth",
      icon: Brain,
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
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      
      <div className="relative z-10 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <h1 className="text-6xl font-bold text-foreground mb-2 text-glow-hero">
                MyArc
              </h1>
              <p className="text-xl text-muted-foreground">Begin Your Transformation Journey</p>
              
              <Card className="p-8 bg-card/50 backdrop-blur border-border">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg">What's your name?</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="text-lg py-6"
                    />
                  </div>
                  
                  <ArcButton
                    arc="hero"
                    onClick={() => name && setStep(1)}
                    className="w-full py-6"
                  >
                    Start Your Arc
                  </ArcButton>
                </div>
              </Card>
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
                <h2 className="text-4xl font-bold text-foreground mb-2">Choose Your Arc</h2>
                <p className="text-muted-foreground">What path will you take?</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {arcOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Card
                      key={option.type}
                      onClick={() => {
                        setSelectedArc(option.type);
                        setStep(2);
                      }}
                      className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedArc === option.type ? `border-${option.type} glow-${option.type}` : ""
                      }`}
                    >
                      <div className="space-y-4">
                        <Icon className={`w-12 h-12 text-${option.type}`} />
                        <h3 className="text-2xl font-bold">{option.title}</h3>
                        <p className="text-muted-foreground">{option.description}</p>
                      </div>
                    </Card>
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
                <h2 className="text-4xl font-bold text-foreground mb-2">Your Main Goal</h2>
                <p className="text-muted-foreground">Where will you focus your energy?</p>
              </div>
              
              <div className="grid gap-4">
                {goalOptions.map((option) => (
                  <Card
                    key={option.type}
                    onClick={() => {
                      setSelectedGoal(option.type);
                      setStep(3);
                    }}
                    className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedGoal === option.type ? `border-${selectedArc} glow-${selectedArc}` : ""
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                    <p className="text-muted-foreground">{option.description}</p>
                  </Card>
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
                <h2 className="text-4xl font-bold text-foreground mb-2">Choose Your Avatar</h2>
                <p className="text-muted-foreground">Who inspires your journey?</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {avatars.map((avatar) => (
                  <Card
                    key={avatar.id}
                    onClick={() => {
                      setSelectedAvatar(avatar);
                    }}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedAvatar?.id === avatar.id ? `border-${selectedArc} glow-${selectedArc}` : ""
                    }`}
                  >
                    <img
                      src={avatar.imageUrl}
                      alt={avatar.name}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-bold">{avatar.name}</h3>
                    <p className="text-sm text-muted-foreground">{avatar.series}</p>
                  </Card>
                ))}
              </div>
              
              {selectedAvatar && (
                <div className="flex justify-center">
                  <ArcButton
                    arc={selectedArc}
                    onClick={handleComplete}
                    className="px-12 py-6"
                  >
                    Begin Your Journey
                  </ArcButton>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
