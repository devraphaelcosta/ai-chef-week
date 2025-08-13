import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Trophy, 
  Target, 
  Calendar, 
  ShoppingCart, 
  ChefHat,
  Star,
  Zap,
  Brain,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  points: number;
  current_streak: number;
  max_streak: number;
  preferences: any;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  points_reward: number;
  completed: boolean;
  challenge_type: 'daily' | 'weekly' | 'monthly';
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [weeklyMenu, setWeeklyMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  console.log('Dashboard render - user:', user, 'loading:', loading);

  useEffect(() => {
    console.log('Dashboard useEffect - user changed:', user);
    if (user) {
      initializeUser();
    }
  }, [user]);

  const initializeUser = async () => {
    try {
      await Promise.all([
        fetchProfile(),
        fetchChallenges(),
        fetchWeeklyMenu()
      ]);
    } catch (error: any) {
      console.error('Error initializing user data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Tente recarregar a página",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) {
        // Se a tabela não existe, criar perfil padrão
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.log('Table does not exist, using default profile');
          const defaultProfile = {
            id: user?.id!,
            email: user?.email!,
            full_name: user?.user_metadata?.full_name || null,
            level: 'Bronze' as const,
            points: 0,
            current_streak: 0,
            max_streak: 0,
            preferences: {}
          };
          setProfile(defaultProfile);
          return;
        }
        
        if (error.code !== 'PGRST116') {
          console.error('Profile fetch error:', error);
          throw error;
        }
      }
      
      if (!data) {
        console.log('Creating new profile for user:', user?.id);
        const newProfile = {
          id: user?.id!,
          email: user?.email!,
          full_name: user?.user_metadata?.full_name || null,
          level: 'Bronze' as const,
          points: 0,
          current_streak: 0,
          max_streak: 0,
          preferences: {}
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);
        
        if (insertError) {
          console.error('Profile creation error:', insertError);
          // Se erro de inserção, usar perfil padrão
          setProfile(newProfile);
          return;
        }
        
        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (error: any) {
      console.error('fetchProfile error:', error);
      // Usar perfil padrão em caso de erro
      const defaultProfile = {
        id: user?.id!,
        email: user?.email!,
        full_name: user?.user_metadata?.full_name || null,
        level: 'Bronze' as const,
        points: 0,
        current_streak: 0,
        max_streak: 0,
        preferences: {}
      };
      setProfile(defaultProfile);
    }
  };

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        // Se a tabela não existe, usar desafios padrão
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.log('Challenges table does not exist, using default challenges');
          const defaultChallenges = [
            {
              id: '1',
              title: "Complete seu primeiro cardápio",
              description: "Gere seu primeiro cardápio semanal usando nossa IA",
              points_reward: 100,
              completed: false,
              challenge_type: 'weekly' as const
            },
            {
              id: '2',
              title: "Use a lista de compras",
              description: "Faça suas compras usando nossa lista inteligente",
              points_reward: 50,
              completed: false,
              challenge_type: 'weekly' as const
            },
            {
              id: '3',
              title: "Mantenha a sequência",
              description: "Use o WeekFit por 7 dias consecutivos",
              points_reward: 200,
              completed: false,
              challenge_type: 'weekly' as const
            }
          ];
          setChallenges(defaultChallenges);
          return;
        }
        console.error('Challenges fetch error:', error);
        setChallenges([]);
        return;
      }
      
      if (!data || data.length === 0) {
        console.log('Creating default challenges for user:', user?.id);
        const defaultChallenges = [
          {
            user_id: user?.id!,
            title: "Complete seu primeiro cardápio",
            description: "Gere seu primeiro cardápio semanal usando nossa IA",
            points_reward: 100,
            challenge_type: 'weekly' as const
          },
          {
            user_id: user?.id!,
            title: "Use a lista de compras",
            description: "Faça suas compras usando nossa lista inteligente",
            points_reward: 50,
            challenge_type: 'weekly' as const
          },
          {
            user_id: user?.id!,
            title: "Mantenha a sequência",
            description: "Use o WeekFit por 7 dias consecutivos",
            points_reward: 200,
            challenge_type: 'weekly' as const
          }
        ];

        const { data: newChallenges, error: insertError } = await supabase
          .from('challenges')
          .insert(defaultChallenges)
          .select();

        if (insertError) {
          console.error('Challenges creation error:', insertError);
          setChallenges([]);
          return;
        }
        setChallenges(newChallenges || []);
      } else {
        setChallenges(data);
      }
    } catch (error: any) {
      console.error('fetchChallenges error:', error);
      setChallenges([]);
    }
  };

  const fetchWeeklyMenu = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_menus')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        // Se a tabela não existe ou não há dados, verificar localStorage
        if (error.code === '42P01' || error.message.includes('does not exist') || !data) {
          console.log('Checking localStorage for menu data...');
          const localMenu = localStorage.getItem(`menu_${user?.id}`);
          
          if (localMenu) {
            console.log('Found menu in localStorage');
            const parsedMenu = JSON.parse(localMenu);
            setWeeklyMenu({
              week_start: new Date().toISOString().split('T')[0],
              meals: parsedMenu.meals,
              shopping_list: parsedMenu.shopping_list,
              ai_preferences: JSON.parse(localStorage.getItem(`preferences_${user?.id}`) || '{}')
            });
            return;
          }
          
          // Se não há dados salvos, mostrar menu de exemplo mais completo
          console.log('No saved data found, using comprehensive sample menu');
          const comprehensiveMenu = {
            week_start: new Date().toISOString().split('T')[0],
            meals: {
              monday: {
                breakfast: "Aveia com frutas vermelhas e mel",
                lunch: "Frango grelhado com quinoa e legumes refogados",
                dinner: "Salmão assado com batata doce e aspargos"
              },
              tuesday: {
                breakfast: "Smoothie de banana, aveia e leite de amêndoas",
                lunch: "Salada de atum com grão-de-bico e vegetais",
                dinner: "Peito de peru com arroz integral e brócolis"
              },
              wednesday: {
                breakfast: "Iogurte natural com granola e frutas",
                lunch: "Peixe grelhado com purê de batata doce",
                dinner: "Omelete de legumes com salada verde"
              },
              thursday: {
                breakfast: "Smoothie verde com espinafre, banana e aveia",
                lunch: "Carne magra com salada de quinoa",
                dinner: "Frango assado com batatas e cenouras"
              },
              friday: {
                breakfast: "Panqueca de aveia com frutas",
                lunch: "Wrap de frango com vegetais",
                dinner: "Peixe com arroz integral e legumes no vapor"
              },
              saturday: {
                breakfast: "Vitamina de frutas com granola",
                lunch: "Hambúrguer de frango com salada",
                dinner: "Sopa de legumes com proteína"
              },
              sunday: {
                breakfast: "Torradas integrais com abacate",
                lunch: "Salada completa com proteína",
                dinner: "Jantar leve com sopa e sanduíche natural"
              }
            },
            shopping_list: {
              proteins: ["Frango (1,5kg)", "Salmão (800g)", "Atum em lata (3un)", "Ovos (12un)", "Peito de peru (500g)"],
              carbs: ["Quinoa (500g)", "Batata doce (1,5kg)", "Arroz integral (1kg)", "Aveia (500g)", "Pão integral (1un)"],
              vegetables: ["Brócolis (2un)", "Cenoura (1kg)", "Abobrinha (3un)", "Espinafre (2 maços)", "Tomate (1kg)", "Cebola (5un)", "Aspargos (1 maço)"],
              fruits: ["Banana (1,5kg)", "Maçã (8un)", "Frutas vermelhas (500g)", "Abacate (3un)", "Limão (6un)"],
              dairy: ["Iogurte natural (1L)", "Leite de amêndoas (1L)", "Queijo (300g)"],
              others: ["Azeite de oliva", "Mel", "Granola", "Temperos diversos", "Grão-de-bico (lata)"]
            },
            ai_preferences: {}
          };
          setWeeklyMenu(comprehensiveMenu);
          return;
        }
        console.error('Weekly menu fetch error:', error);
        return;
      }

      if (data) {
        setWeeklyMenu(data);
      }
    } catch (error: any) {
      console.error('fetchWeeklyMenu error:', error);
      // Fallback menu em caso de qualquer erro
      setWeeklyMenu({
        week_start: new Date().toISOString().split('T')[0],
        meals: {
          monday: { breakfast: "Aveia com frutas", lunch: "Frango com salada", dinner: "Salmão grelhado" },
          tuesday: { breakfast: "Smoothie proteico", lunch: "Salada completa", dinner: "Omelete de legumes" }
        },
        shopping_list: {
          proteins: ["Frango (1kg)", "Salmão (500g)", "Ovos (12un)"],
          carbs: ["Aveia (500g)", "Arroz integral (1kg)"],
          vegetables: ["Brócolis (1un)", "Cenoura (500g)"],
          fruits: ["Banana (1kg)", "Maçã (6un)"]
        }
      });
    }
  };

  const completeChallenge = async (challengeId: string, pointsReward: number) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('id', challengeId);

      if (error) throw error;

      // Update user points
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          points: (profile?.points || 0) + pointsReward 
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Desafio concluído! 🎉",
        description: `Você ganhou ${pointsReward} pontos!`
      });

      fetchChallenges();
      fetchProfile();
    } catch (error: any) {
      console.error('completeChallenge error:', error);
      toast({
        title: "Erro ao completar desafio",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'text-orange-600';
      case 'Silver': return 'text-gray-500';
      case 'Gold': return 'text-yellow-500';
      case 'Platinum': return 'text-purple-500';
      case 'Diamond': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getNextLevelPoints = (level: string) => {
    switch (level) {
      case 'Bronze': return 500;
      case 'Silver': return 1500;
      case 'Gold': return 3000;
      case 'Platinum': return 5000;
      default: return 10000;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">WeekFit Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Bem-vindo,</p>
                <p className="font-semibold">{profile?.full_name || user?.email}</p>
              </div>
              <Button variant="outline" onClick={signOut}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">{profile?.full_name || 'Usuário'}</h3>
                <Badge className={`${getLevelColor(profile?.level || 'Bronze')} mt-2`}>
                  <Trophy className="w-3 h-3 mr-1" />
                  {profile?.level}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pontos</span>
                  <span className="font-semibold">{profile?.points}</span>
                </div>
                <Progress 
                  value={(profile?.points || 0) / getNextLevelPoints(profile?.level || 'Bronze') * 100} 
                  className="h-2" 
                />
                <p className="text-xs text-muted-foreground text-center">
                  {getNextLevelPoints(profile?.level || 'Bronze') - (profile?.points || 0)} pontos para próximo nível
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{profile?.current_streak}</p>
                  <p className="text-xs text-muted-foreground">Sequência Atual</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{profile?.max_streak}</p>
                  <p className="text-xs text-muted-foreground">Melhor Sequência</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="menu" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="menu">Cardápio</TabsTrigger>
                <TabsTrigger value="challenges">Desafios</TabsTrigger>
                <TabsTrigger value="shopping">Lista de Compras</TabsTrigger>
              </TabsList>

              <TabsContent value="menu" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChefHat className="w-5 h-5" />
                      Cardápio da Semana
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {weeklyMenu ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Segunda-feira</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Café:</strong> {weeklyMenu.meals.monday.breakfast}</p>
                              <p><strong>Almoço:</strong> {weeklyMenu.meals.monday.lunch}</p>
                              <p><strong>Jantar:</strong> {weeklyMenu.meals.monday.dinner}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Terça-feira</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Café:</strong> {weeklyMenu.meals.tuesday.breakfast}</p>
                              <p><strong>Almoço:</strong> {weeklyMenu.meals.tuesday.lunch}</p>
                              <p><strong>Jantar:</strong> {weeklyMenu.meals.tuesday.dinner}</p>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full">
                          <Brain className="w-4 h-4 mr-2" />
                          Gerar Novo Cardápio com IA
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Você ainda não tem um cardápio gerado</p>
                        <Button onClick={() => window.location.href = '/questionario'}>
                          <Brain className="w-4 h-4 mr-2" />
                          Criar Primeiro Cardápio
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="challenges" className="space-y-4">
                <div className="grid gap-4">
                  {challenges.map((challenge) => (
                    <Card key={challenge.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-4 h-4 text-primary" />
                              <h4 className="font-semibold">{challenge.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {challenge.challenge_type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {challenge.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-accent" />
                              <span className="text-sm font-medium">{challenge.points_reward} pontos</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            {challenge.completed ? (
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Concluído
                              </Badge>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => completeChallenge(challenge.id, challenge.points_reward)}
                              >
                                <Zap className="w-3 h-3 mr-1" />
                                Completar
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="shopping" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Lista de Compras Inteligente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {weeklyMenu?.shopping_list ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-primary">🥩 Proteínas</h4>
                          <ul className="space-y-2">
                            {weeklyMenu.shopping_list.proteins.map((item: string, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-accent">🌾 Carboidratos</h4>
                          <ul className="space-y-2">
                            {weeklyMenu.shopping_list.carbs.map((item: string, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-green-600">🥬 Vegetais</h4>
                          <ul className="space-y-2">
                            {weeklyMenu.shopping_list.vegetables.map((item: string, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-orange-500">🍎 Frutas</h4>
                          <ul className="space-y-2">
                            {weeklyMenu.shopping_list.fruits.map((item: string, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">Gere um cardápio para ter sua lista de compras</p>
                        <Button onClick={() => window.location.href = '/questionario'}>
                          <Brain className="w-4 h-4 mr-2" />
                          Gerar Cardápio
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
