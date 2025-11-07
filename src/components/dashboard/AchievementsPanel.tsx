import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirement_type: string;
  requirement_value: number;
}

interface UserAchievement {
  achievement_id: string;
  unlocked_at: string;
}

interface AchievementsPanelProps {
  userId: string;
  currentStreak: number;
  totalMealsLogged?: number;
}

export const AchievementsPanel = ({ userId, currentStreak, totalMealsLogged = 0 }: AchievementsPanelProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(() => {
    checkAndUnlockAchievements();
  }, [currentStreak, totalMealsLogged, achievements, userAchievements]);

  const fetchData = async () => {
    try {
      const [achievementsData, userAchievementsData] = await Promise.all([
        supabase.from('achievements').select('*'),
        supabase.from('user_achievements').select('*').eq('user_id', userId)
      ]);

      if (achievementsData.data) setAchievements(achievementsData.data);
      if (userAchievementsData.data) setUserAchievements(userAchievementsData.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndUnlockAchievements = async () => {
    for (const achievement of achievements) {
      const alreadyUnlocked = userAchievements.some(ua => ua.achievement_id === achievement.id);
      if (alreadyUnlocked) continue;

      let shouldUnlock = false;

      if (achievement.requirement_type === 'streak' && currentStreak >= achievement.requirement_value) {
        shouldUnlock = true;
      } else if (achievement.requirement_type === 'meals_logged' && totalMealsLogged >= achievement.requirement_value) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        await unlockAchievement(achievement);
      }
    }
  };

  const unlockAchievement = async (achievement: Achievement) => {
    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({ user_id: userId, achievement_id: achievement.id });

      if (!error) {
        setUserAchievements(prev => [...prev, { achievement_id: achievement.id, unlocked_at: new Date().toISOString() }]);
        
        toast({
          title: `🏆 Conquista Desbloqueada!`,
          description: `${achievement.icon} ${achievement.name} (+${achievement.points} pontos)`
        });

        // Atualizar pontos do perfil
        await supabase
          .from('profiles')
          .update({ points: supabase.rpc('increment', { x: achievement.points }) })
          .eq('id', userId);
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  if (loading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          Conquistas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  unlocked
                    ? 'bg-primary/10 border-primary'
                    : 'bg-muted/50 border-border opacity-60'
                }`}
              >
                <div className="text-center space-y-2">
                  <div className="text-3xl">
                    {unlocked ? achievement.icon : <Lock className="w-8 h-8 mx-auto text-muted-foreground" />}
                  </div>
                  <div className="text-sm font-medium">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground">{achievement.description}</div>
                  <Badge variant={unlocked ? "default" : "secondary"} className="text-xs">
                    {achievement.points} pts
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
