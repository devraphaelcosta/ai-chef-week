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
  const [substitutionInput, setSubstitutionInput] = useState<string>("");
  const [substitutingMeal, setSubstitutingMeal] = useState<{day: string, mealType: string} | null>(null);

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

  const substituteMeal = async (day: string, mealType: string, restriction: string) => {
    try {
      const mealNames = {
        breakfast: "café da manhã",
        lunch: "almoço", 
        snack: "lanche da tarde",
        dinner: "jantar",
        late_snack: "ceia"
      };

      // Gerar nova refeição com IA baseada na restrição
      const userPreferences = JSON.parse(localStorage.getItem(`preferences_${user?.id}`) || '{}');
      const newMeal = await generateMealWithAI(mealNames[mealType as keyof typeof mealNames], restriction, userPreferences);
      
      // Atualizar o cardápio
      const updatedMenu = { ...weeklyMenu };
      updatedMenu.meals[day][mealType] = newMeal;
      
      // Regenerar receita para a nova refeição
      const updatedRecipes = { ...recipes as RecipesByDay };
      if (!updatedRecipes[day]) updatedRecipes[day] = {};
      
      // Gerar nova receita baseada na nova refeição
      const newRecipe = {
        id: `${day}_${mealType}_${Date.now()}`,
        meal_name: newMeal,
        ingredients: getIngredientsForMeal(newMeal),
        instructions: getInstructionsForMeal(newMeal),
        prep_time: getPrepTimeForMeal(newMeal),
        cook_time: getCookTimeForMeal(newMeal),
        servings: 1
      };
      
      updatedRecipes[day][mealType] = newRecipe;
      
      // Regenerar lista de compras baseada em todas as receitas
      const updatedShoppingList = generateShoppingListFromRecipes(updatedRecipes);
      updatedMenu.shopping_list = updatedShoppingList;
      
      // Salvar tudo no localStorage
      localStorage.setItem(`menu_${user?.id}`, JSON.stringify(updatedMenu));
      localStorage.setItem(`recipes_${user?.id}`, JSON.stringify(updatedRecipes));
      
      setWeeklyMenu(updatedMenu);
      setRecipes(updatedRecipes);
      
      toast({
        title: "Refeição substituída! 🔄",
        description: "Nova opção gerada com receita e lista de compras atualizadas"
      });
      
      setSubstitutingMeal(null);
      setSubstitutionInput("");
    } catch (error: any) {
      console.error('substituteMeal error:', error);
      toast({
        title: "Erro ao substituir refeição",
        description: error.message,
        variant: "destructive"
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



export default Dashboard;
