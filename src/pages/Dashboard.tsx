import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  Clock,
  RefreshCw,
  BookOpen,
  Coffee,
  UtensilsCrossed,
  Moon,
  ArrowLeft
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

interface Recipe {
  id: string;
  meal_name: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
}

interface RecipesByDay {
  [day: string]: {
    [mealType: string]: Recipe;
  };
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recipes, setRecipes] = useState<RecipesByDay | Recipe[]>({});
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
        fetchRecipes(),
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

  const fetchRecipes = async () => {
    try {
      // Verificar se há receitas no localStorage
      const localRecipes = localStorage.getItem(`recipes_${user?.id}`);
      
      if (localRecipes) {
        console.log('Found recipes in localStorage');
        const parsedRecipes = JSON.parse(localRecipes);
        
        // Check if recipes are organized by day (new format)
        if (typeof parsedRecipes === 'object' && parsedRecipes.monday) {
          setRecipes(parsedRecipes);
        } else {
          // Old format - convert to array for compatibility
          setRecipes(Array.isArray(parsedRecipes) ? parsedRecipes : []);
        }
        return;
      }
      
      // Se não há receitas salvas, usar receitas padrão organizadas por dia
      console.log('No saved recipes found, using default recipes organized by day');
      const defaultRecipesByDay = {
        monday: {
          breakfast: {
            id: '1',
            meal_name: "Aveia com frutas vermelhas e mel",
            ingredients: ["1 xícara de aveia em flocos", "1/2 xícara de frutas vermelhas", "2 colheres de mel", "1 xícara de leite"],
            instructions: ["Cozinhe a aveia com leite em fogo baixo", "Adicione as frutas vermelhas", "Finalize com mel"],
            prep_time: 5,
            cook_time: 10,
            servings: 1
          },
          lunch: {
            id: '2',
            meal_name: "Frango grelhado com quinoa e legumes",
            ingredients: ["500g de peito de frango", "1 xícara de quinoa", "Legumes variados", "Temperos", "Azeite"],
            instructions: ["Tempere e grelhe o frango", "Cozinhe a quinoa", "Refogue os legumes", "Sirva tudo junto"],
            prep_time: 15,
            cook_time: 25,
            servings: 2
          },
          dinner: {
            id: '3',
            meal_name: "Salmão assado com batata doce",
            ingredients: ["400g de salmão", "2 batatas doces", "Aspargos", "Azeite", "Limão", "Temperos"],
            instructions: ["Tempere o salmão", "Asse com batata doce por 20 minutos", "Sirva com aspargos"],
            prep_time: 10,
            cook_time: 20,
            servings: 2
          }
        },
        tuesday: {
          breakfast: {
            id: '4',
            meal_name: "Smoothie de banana com leite de amêndoas",
            ingredients: ["1 banana", "1 xícara de leite de amêndoas", "2 colheres de aveia", "1 colher de mel"],
            instructions: ["Bata todos os ingredientes no liquidificador", "Sirva gelado"],
            prep_time: 3,
            cook_time: 0,
            servings: 1
          },
          lunch: {
            id: '5',
            meal_name: "Salada de atum com grão-de-bico",
            ingredients: ["1 lata de atum", "1 xícara de grão-de-bico", "Folhas verdes", "Tomate", "Azeite", "Limão"],
            instructions: ["Misture atum e grão-de-bico", "Adicione folhas e tomate", "Tempere com azeite e limão"],
            prep_time: 8,
            cook_time: 0,
            servings: 2
          },
          dinner: {
            id: '6',
            meal_name: "Peito de peru com arroz integral",
            ingredients: ["400g de peito de peru", "1 xícara de arroz integral", "Brócolis", "Temperos", "Azeite"],
            instructions: ["Grelhe o peru temperado", "Cozinhe o arroz", "Refogue o brócolis", "Sirva junto"],
            prep_time: 10,
            cook_time: 30,
            servings: 2
          }
        }
      };
      
      setRecipes(defaultRecipesByDay);
    } catch (error: any) {
      console.error('fetchRecipes error:', error);
      setRecipes({});
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


  // Helper functions for recipe generation
  const getIngredientsForMeal = (mealName: string): string[] => {
    const name = mealName.toLowerCase();
    if (name.includes('smoothie')) return ["1 banana", "1 xícara de leite de amêndoas", "2 colheres de aveia", "1 colher de mel"];
    if (name.includes('curry')) return ["2 latas de grão-de-bico", "1 lata de leite de coco", "Cebola", "Alho", "Curry em pó", "Arroz integral"];
    if (name.includes('quinoa')) return ["1 xícara de quinoa", "2 xícaras de caldo de legumes", "200g de tofu", "Legumes variados"];
    if (name.includes('salada')) return ["Folhas verdes", "Tomate", "Pepino", "Cenoura", "Azeite", "Vinagre"];
    return ["Ingredientes básicos", "Temperos", "Azeite"];
  };

  const getInstructionsForMeal = (mealName: string): string[] => {
    const name = mealName.toLowerCase();
    if (name.includes('smoothie')) return ["Bata todos os ingredientes no liquidificador", "Sirva gelado"];
    if (name.includes('curry')) return ["Refogue cebola e alho", "Adicione curry e grão-de-bico", "Cozinhe com leite de coco por 15 min"];
    if (name.includes('quinoa')) return ["Cozinhe quinoa com caldo", "Grelhe tofu", "Refogue legumes", "Misture tudo"];
    if (name.includes('salada')) return ["Lave e corte vegetais", "Misture em uma tigela", "Tempere com azeite e vinagre"];
    return ["Prepare os ingredientes", "Cozinhe conforme necessário", "Tempere e sirva"];
  };

  const getPrepTimeForMeal = (mealName: string): number => {
    const name = mealName.toLowerCase();
    if (name.includes('smoothie')) return 3;
    if (name.includes('curry')) return 15;
    if (name.includes('quinoa')) return 10;
    if (name.includes('salada')) return 8;
    return 10;
  };

  const getCookTimeForMeal = (mealName: string): number => {
    const name = mealName.toLowerCase();
    if (name.includes('smoothie')) return 0;
    if (name.includes('curry')) return 20;
    if (name.includes('quinoa')) return 20;
    if (name.includes('salada')) return 0;
    return 15;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Você precisa estar logado para acessar o dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Meu Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold">{profile?.full_name || user?.email?.split('@')[0]}</h3>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Nível</span>
                  <Badge variant="secondary" className="gap-1">
                    <Trophy className="w-3 h-3" />
                    {profile?.level}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Pontos</span>
                    <span>{profile?.points}</span>
                  </div>
                  <Progress value={(profile?.points || 0) % 100} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Sequência atual</span>
                  <Badge variant="outline" className="gap-1">
                    <Target className="w-3 h-3" />
                    {profile?.current_streak} dias
                  </Badge>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={signOut}
                className="w-full"
              >
                Sair
              </Button>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="menu" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="menu">Cardápio</TabsTrigger>
                <TabsTrigger value="recipes">Receitas</TabsTrigger>
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
                    {weeklyMenu?.meals ? (
                      <div className="space-y-4">
                        {Object.entries(weeklyMenu.meals).map(([day, meals]: [string, any]) => (
                          <div key={day} className="border rounded-lg p-4">
                            <h4 className="font-semibold capitalize mb-3 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {day === 'monday' ? 'Segunda' : 
                               day === 'tuesday' ? 'Terça' :
                               day === 'wednesday' ? 'Quarta' :
                               day === 'thursday' ? 'Quinta' :
                               day === 'friday' ? 'Sexta' :
                               day === 'saturday' ? 'Sábado' : 'Domingo'}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {Object.entries(meals).map(([mealType, meal]: [string, any]) => (
                                <div key={mealType} className="bg-muted/50 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-sm font-medium capitalize flex items-center gap-1">
                                      {mealType === 'breakfast' ? <Coffee className="w-3 h-3" /> :
                                       mealType === 'lunch' ? <UtensilsCrossed className="w-3 h-3" /> :
                                       <Moon className="w-3 h-3" />}
                                      {mealType === 'breakfast' ? 'Café' : 
                                       mealType === 'lunch' ? 'Almoço' : 'Jantar'}
                                    </h5>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{meal}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Carregando cardápio...
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recipes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Minhas Receitas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {typeof recipes === 'object' && !Array.isArray(recipes) ? (
                      <div className="space-y-6">
                        {Object.entries(recipes as RecipesByDay).map(([day, dayRecipes]) => (
                          <div key={day} className="space-y-3">
                            <h4 className="font-semibold capitalize text-lg border-b pb-2">
                              {day === 'monday' ? 'Segunda' : 
                               day === 'tuesday' ? 'Terça' :
                               day === 'wednesday' ? 'Quarta' :
                               day === 'thursday' ? 'Quinta' :
                               day === 'friday' ? 'Sexta' :
                               day === 'saturday' ? 'Sábado' : 'Domingo'}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {Object.entries(dayRecipes).map(([mealType, recipe]) => (
                                <Card key={mealType} className="border-2">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                      {mealType === 'breakfast' ? <Coffee className="w-4 h-4" /> :
                                       mealType === 'lunch' ? <UtensilsCrossed className="w-4 h-4" /> :
                                       <Moon className="w-4 h-4" />}
                                      {recipe.meal_name}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="flex gap-2">
                                      <Badge variant="secondary" className="text-xs">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {recipe.prep_time + recipe.cook_time} min
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {recipe.servings} porções
                                      </Badge>
                                    </div>
                                    
                                    <div>
                                      <h5 className="text-sm font-medium mb-1">Ingredientes:</h5>
                                      <ul className="text-xs text-muted-foreground space-y-1">
                                        {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                                          <li key={idx}>• {ingredient}</li>
                                        ))}
                                        {recipe.ingredients.length > 3 && (
                                          <li>• E mais {recipe.ingredients.length - 3} ingredientes...</li>
                                        )}
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h5 className="text-sm font-medium mb-1">Preparo:</h5>
                                      <p className="text-xs text-muted-foreground">
                                        {recipe.instructions[0]}
                                        {recipe.instructions.length > 1 && '...'}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhuma receita encontrada
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shopping" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Lista de Compras
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {weeklyMenu?.shopping_list ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(weeklyMenu.shopping_list).map(([category, items]: [string, any]) => (
                          <div key={category} className="space-y-3">
                            <h4 className="font-semibold capitalize text-primary">
                              {category === 'proteins' ? 'Proteínas' :
                               category === 'carbs' ? 'Carboidratos' :
                               category === 'vegetables' ? 'Vegetais' :
                               category === 'fruits' ? 'Frutas' :
                               category === 'dairy' ? 'Laticínios' : 'Outros'}
                            </h4>
                            <ul className="space-y-2">
                              {items.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Lista de compras não disponível
                      </p>
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
