import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  challenge_type: string;
  description: string;
  points: number;
  completed: boolean;
  completed_at: string | null;
}

interface DailyChallengesProps {
  userId: string;
  onPointsEarned: () => void;
}

export const DailyChallenges = ({ userId, onPointsEarned }: DailyChallengesProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysChallenges();
  }, [userId]);

  const fetchTodaysChallenges = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('user_id', userId)
        .eq('challenge_date', today);

      if (error) throw error;

      if (!data || data.length === 0) {
        await generateDailyChallenges();
      } else {
        setChallenges(data);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDailyChallenges = async () => {
    const today = new Date().toISOString().split('T')[0];
    const challengeTemplates = [
      { type: 'log_breakfast', description: 'Registre seu café da manhã', points: 10 },
      { type: 'log_lunch', description: 'Registre seu almoço', points: 10 },
      { type: 'log_dinner', description: 'Registre seu jantar', points: 10 },
      { type: 'drink_water', description: 'Beba 8 copos de água', points: 15 },
      { type: 'try_new_recipe', description: 'Experimente uma receita nova', points: 20 }
    ];

    // Selecionar 3 desafios aleatórios
    const selectedChallenges = challengeTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    try {
      const { data, error } = await supabase
        .from('daily_challenges')
        .insert(
          selectedChallenges.map(challenge => ({
            user_id: userId,
            challenge_date: today,
            challenge_type: challenge.type,
            description: challenge.description,
            points: challenge.points,
            completed: false
          }))
        )
        .select();

      if (error) throw error;
      if (data) setChallenges(data);
    } catch (error) {
      console.error('Error generating challenges:', error);
    }
  };

  const completeChallenge = async (challengeId: string, points: number) => {
    try {
      const { error } = await supabase
        .from('daily_challenges')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('id', challengeId);

      if (error) throw error;

      // Atualizar pontos do perfil
      const { error: profileError } = await supabase.rpc('increment_points', {
        user_id: userId,
        points_to_add: points
      }).single();

      if (profileError) {
        // Fallback: atualizar manualmente
        const { data: profile } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', userId)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ points: profile.points + points })
            .eq('id', userId);
        }
      }

      setChallenges(prev =>
        prev.map(c => c.id === challengeId ? { ...c, completed: true, completed_at: new Date().toISOString() } : c)
      );

      toast({
        title: "Desafio Completo! 🎉",
        description: `Você ganhou ${points} pontos!`
      });

      onPointsEarned();
    } catch (error) {
      console.error('Error completing challenge:', error);
      toast({
        title: "Erro",
        description: "Não foi possível completar o desafio",
        variant: "destructive"
      });
    }
  };

  if (loading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          Desafios Diários
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {challenges.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum desafio disponível hoje
          </p>
        ) : (
          challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
            >
              <div className="flex items-center gap-3 flex-1">
                {challenge.completed ? (
                  <CheckCircle className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${challenge.completed ? 'text-muted-foreground line-through' : ''}`}>
                    {challenge.description}
                  </p>
                  <p className="text-xs text-muted-foreground">+{challenge.points} pontos</p>
                </div>
              </div>
              {!challenge.completed && (
                <Button
                  size="sm"
                  onClick={() => completeChallenge(challenge.id, challenge.points)}
                >
                  Completar
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
