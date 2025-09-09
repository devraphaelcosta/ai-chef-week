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
  const [ingredientsInput, setIngredientsInput] = useState<string>("");
  const [generatingRecipe, setGeneratingRecipe] = useState(false);
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);

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

  const generateRecipeIdeas = async () => {
    if (!ingredientsInput.trim()) {
      toast({
        title: "Digite alguns ingredientes",
        description: "Informe quais ingredientes você tem disponível",
        variant: "destructive"
      });
      return;
    }

    setGeneratingRecipe(true);
    try {
      // Simular geração de receitas com IA baseada nos ingredientes
      const userDiet = profile?.preferences?.diet || 'equilibrada';
      const ingredients = ingredientsInput.split(',').map(i => i.trim()).filter(i => i);
      
      const recipeIdeas = await generateRecipeIdeasWithAI(ingredients, userDiet);
      setSuggestedRecipes(recipeIdeas);
      
      toast({
        title: "Receitas geradas! 🍽️",
        description: `${recipeIdeas.length} ideias criadas com seus ingredientes`
      });
    } catch (error: any) {
      console.error('Error generating recipe ideas:', error);
      toast({
        title: "Erro ao gerar receitas",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setGeneratingRecipe(false);
    }
  };

  const generateRecipeIdeasWithAI = async (ingredients: string[], diet: string): Promise<Recipe[]> => {
    // Simular diferentes combinações baseadas nos ingredientes informados
    const baseRecipes = [
      {
        name: "Salada Refrescante com {ingrediente1}",
        baseIngredients: ["folhas verdes", "azeite", "limão"],
        instructions: ["Lave e corte os ingredientes", "Misture em uma tigela", "Tempere com azeite e limão"],
        prep: 10, cook: 0
      },
      {
        name: "Refogado Nutritivo de {ingrediente1} e {ingrediente2}",
        baseIngredients: ["azeite", "alho", "cebola", "temperos"],  
        instructions: ["Refogue alho e cebola", "Adicione os ingredientes principais", "Tempere e cozinhe por 10 minutos"],
        prep: 8, cook: 12
      },
      {
        name: "Sopa Cremosa com {ingrediente1}",
        baseIngredients: ["caldo de legumes", "cebola", "azeite"],
        instructions: ["Refogue a cebola", "Adicione os ingredientes e caldo", "Cozinhe até ficar cremoso"],
        prep: 15, cook: 25
      }
    ];

    return baseRecipes.slice(0, Math.min(3, Math.max(1, ingredients.length))).map((base, index) => {
      const mainIngredient = ingredients[0] || "legumes";
      const secondIngredient = ingredients[1] || "temperos";
      
      return {
        id: `idea_${Date.now()}_${index}`,
        meal_name: base.name.replace('{ingrediente1}', mainIngredient).replace('{ingrediente2}', secondIngredient),
        ingredients: [mainIngredient, secondIngredient, ...base.baseIngredients].filter((v, i, a) => a.indexOf(v) === i),
        instructions: base.instructions,
        prep_time: base.prep,
        cook_time: base.cook,
        servings: 2
      };
    });
  };

  // Componente para a seção de ideias de receitas
  const RecipeIdeasSection = ({ userProfile }: { userProfile: UserProfile | null }) => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Digite os ingredientes que você tem disponível e receba sugestões personalizadas de receitas!
          </p>
          
          <div className="max-w-md mx-auto space-y-4">
            <Input
              placeholder="Ex: frango, brócolis, batata doce..."
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
              className="w-full"
            />
            <Button 
              onClick={generateRecipeIdeas}
              disabled={generatingRecipe}
              className="w-full"
            >
              {generatingRecipe ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Gerando receitas...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Gerar Ideias com IA
                </>
              )}
            </Button>
          </div>
        </div>

        {suggestedRecipes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Receitas Sugeridas</h3>
            <div className="grid gap-4">
              {suggestedRecipes.map((recipe) => (
                <Card key={recipe.id} className="border border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      {recipe.meal_name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Preparo: {recipe.prep_time}min
                      </div>
                      <div className="flex items-center gap-1">
                        <ChefHat className="w-4 h-4" />
                        Cozimento: {recipe.cook_time}min
                      </div>
                      <Badge variant="outline">{recipe.servings} porções</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-primary">Ingredientes:</h4>
                      <ul className="space-y-1">
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-accent">Modo de Preparo:</h4>
                      <ol className="space-y-1">
                        {recipe.instructions.map((instruction, index) => (
                          <li key={index} className="text-sm flex gap-2">
                            <span className="font-medium text-muted-foreground">{index + 1}.</span>
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const generateShoppingListFromRecipes = (recipesByDay: RecipesByDay) => {
    const allIngredients: string[] = [];
    
    Object.values(recipesByDay).forEach(dayRecipes => {
      Object.values(dayRecipes).forEach(recipe => {
        allIngredients.push(...recipe.ingredients);
      });
    });

    // Categorize ingredients
    const shopping_list: any = {
      proteins: [],
      carbs: [],
      vegetables: [],
      fruits: [],
      dairy: [],
      legumes: [],
      condiments: [],
      others: []
    };

    allIngredients.forEach(ingredient => {
      const ing = ingredient.toLowerCase();
      
      if (ing.includes('frango') || ing.includes('salmão') || ing.includes('tofu') || ing.includes('ovo')) {
        shopping_list.proteins.push(ingredient);
      } else if (ing.includes('quinoa') || ing.includes('arroz') || ing.includes('aveia') || ing.includes('pão')) {
        shopping_list.carbs.push(ingredient);
      } else if (ing.includes('tomate') || ing.includes('cebola') || ing.includes('alho') || ing.includes('legumes')) {
        shopping_list.vegetables.push(ingredient);
      } else if (ing.includes('banana') || ing.includes('frutas')) {
        shopping_list.fruits.push(ingredient);
      } else if (ing.includes('leite') || ing.includes('iogurte')) {
        shopping_list.dairy.push(ingredient);
      } else if (ing.includes('grão-de-bico') || ing.includes('lentilha')) {
        shopping_list.legumes.push(ingredient);
      } else if (ing.includes('azeite') || ing.includes('mel') || ing.includes('tempero')) {
        shopping_list.condiments.push(ingredient);
      } else {
        shopping_list.others.push(ingredient);
      }
    });

    // Remove duplicates and clean empty categories
    Object.keys(shopping_list).forEach(category => {
      shopping_list[category] = [...new Set(shopping_list[category])];
      if (shopping_list[category].length === 0) {
        delete shopping_list[category];
      }
    });

    return shopping_list;
  };

  const generateMealWithAI = async (mealType: string, restriction: string, preferences: any) => {
    // Simulação de geração de IA - em produção seria uma chamada real para IA
    const veganOptions = {
      "café da manhã": [
        "Smoothie de açaí com banana e granola",
        "Panqueca de aveia com frutas",
        "Vitamina verde com espinafre e manga",
        "Torrada integral com pasta de amendoim e banana"
      ],
      "almoço": [
        "Bowl de quinoa com legumes grelhados",
        "Salada de grão-de-bico com tahine",
        "Wrap de hummus com vegetais",
        "Risotto de cogumelos vegano"
      ],
      "jantar": [
        "Curry de lentilhas com arroz integral",
        "Macarrão de abobrinha com molho de tomate",
        "Hambúrguer de feijão preto com salada",
        "Sopa de abóbora com castanhas"
      ]
    };

    const generalOptions = {
      "café da manhã": [
        "Omelete de claras com vegetais",
        "Iogurte grego com granola",
        "Smoothie proteico",
        "Tapioca com queijo branco"
      ],
      "almoço": [
        "Peito de frango grelhado com salada",
        "Peixe assado com legumes",
        "Salada Caesar com frango",
        "Wrap de peru com vegetais"
      ],
      "jantar": [
        "Salmão grelhado com aspargos",
        "Frango refogado com brócolis",
        "Omelete de legumes",
        "Peixe com batata doce"
      ]
    };

    const isVegan = preferences.diet === 'vegana' || restriction.toLowerCase().includes('carne') || restriction.toLowerCase().includes('frango');
    const options = isVegan ? veganOptions : generalOptions;
    const mealOptions = options[mealType as keyof typeof options] || options["almoço"];
    
    return mealOptions[Math.floor(Math.random() * mealOptions.length)];
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
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="mr-2 hover:bg-primary/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="menu">Cardápio</TabsTrigger>
                <TabsTrigger value="recipes">Receitas</TabsTrigger>
                <TabsTrigger value="ideas">Ideias de Receitas</TabsTrigger>
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
                      <div className="space-y-6">
                        <div className="grid gap-6">
                          {Object.entries(weeklyMenu.meals).map(([dayKey, dayMeals]: [string, any]) => {
                            const dayNames = {
                              monday: "Segunda-feira",
                              tuesday: "Terça-feira", 
                              wednesday: "Quarta-feira",
                              thursday: "Quinta-feira",
                              friday: "Sexta-feira",
                              saturday: "Sábado",
                              sunday: "Domingo"
                            };
                            
                            return (
                              <Card key={dayKey} className="border-l-4 border-l-primary">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-lg text-primary">
                                    {dayNames[dayKey as keyof typeof dayNames]}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="grid gap-3">
                                     {Object.entries(dayMeals).map(([key, mealName]) => {
                                       const mealInfo = {
                                         breakfast: { label: 'Café da Manhã', icon: Coffee },
                                         lunch: { label: 'Almoço', icon: UtensilsCrossed },
                                         dinner: { label: 'Jantar', icon: Moon },
                                         snack: { label: 'Lanche da Tarde', icon: Star },
                                         late_snack: { label: 'Ceia', icon: Moon }
                                       };
                                       
                                       const { label, icon: Icon } = mealInfo[key as keyof typeof mealInfo] || { label: key, icon: UtensilsCrossed };
                                       
                                       return (
                                      <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-3 flex-1">
                                          <Icon className="w-4 h-4 text-muted-foreground" />
                                           <div>
                                             <p className="text-sm font-medium text-muted-foreground">{label}</p>
                                             <p className="text-sm">{String(mealName)}</p>
                                           </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {substitutingMeal?.day === dayKey && substitutingMeal?.mealType === key ? (
                                            <div className="flex items-center gap-2">
                                              <Input
                                                placeholder="Ex: não gosto de frango"
                                                value={substitutionInput}
                                                onChange={(e) => setSubstitutionInput(e.target.value)}
                                                className="w-48 h-8 text-xs"
                                              />
                                              <Button 
                                                size="sm" 
                                                onClick={() => substituteMeal(dayKey, key, substitutionInput)}
                                                disabled={!substitutionInput.trim()}
                                                className="h-8 px-2"
                                              >
                                                OK
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => {
                                                  setSubstitutingMeal(null);
                                                  setSubstitutionInput("");
                                                }}
                                                className="h-8 px-2"
                                              >
                                                ✕
                                              </Button>
                                            </div>
                                          ) : (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                setSubstitutingMeal({ day: dayKey, mealType: key });
                                                setSubstitutionInput("");
                                              }}
                                              className="h-8 w-8 p-0 hover:scale-110 transition-transform"
                                              title="Substituir refeição"
                                            >
                                              <RefreshCw className="w-3 h-3" />
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                       );
                                     })}
                                   </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                         <Button 
                           className="w-full" 
                           onClick={() => window.location.href = '/questionario'}
                         >
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

              <TabsContent value="recipes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Receitas da Semana
                    </CardTitle>
                  </CardHeader>
                   <CardContent>
                     {/* Daily Recipe Organization */}
                     {recipes && typeof recipes === 'object' && !Array.isArray(recipes) && Object.keys(recipes).length > 0 ? (
                       <div className="space-y-8">
                         {Object.entries(recipes as RecipesByDay).map(([day, dayRecipes]: [string, any]) => {
                           const dayNames = {
                             monday: 'Segunda-feira',
                             tuesday: 'Terça-feira',
                             wednesday: 'Quarta-feira',
                             thursday: 'Quinta-feira',
                             friday: 'Sexta-feira',
                             saturday: 'Sábado',
                             sunday: 'Domingo'
                           };
                           
                           return (
                             <div key={day} className="space-y-4">
                               <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                                 <Calendar className="w-6 h-6 text-primary" />
                                 <h3 className="text-xl font-bold text-primary">
                                   Receitas {dayNames[day as keyof typeof dayNames]}
                                 </h3>
                               </div>
                               
                               <div className="grid gap-4">
                                 {Object.entries(dayRecipes).map(([mealType, recipe]: [string, any]) => {
                                   const mealIcons = {
                                     breakfast: <Coffee className="w-5 h-5" />,
                                     lunch: <UtensilsCrossed className="w-5 h-5" />,
                                     dinner: <Moon className="w-5 h-5" />,
                                     snack: <Star className="w-5 h-5" />,
                                     late_snack: <Moon className="w-5 h-5" />
                                   };
                                   
                                   const mealNames = {
                                     breakfast: 'Café da Manhã',
                                     lunch: 'Almoço',
                                     dinner: 'Jantar',
                                     snack: 'Lanche da Tarde',
                                     late_snack: 'Ceia'
                                   };
                                   
                                   return (
                                     <Card key={`${day}-${mealType}`} className="overflow-hidden">
                                       <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                                         <CardTitle className="flex items-center gap-2">
                                           {mealIcons[mealType as keyof typeof mealIcons]}
                                           <span className="text-sm text-muted-foreground">{mealNames[mealType as keyof typeof mealNames]} -</span>
                                           {recipe.meal_name}
                                         </CardTitle>
                                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                           <div className="flex items-center gap-1">
                                             <Clock className="w-4 h-4" />
                                             Preparo: {recipe.prep_time}min
                                           </div>
                                           <div className="flex items-center gap-1">
                                             <Clock className="w-4 h-4" />
                                             Cozimento: {recipe.cook_time}min
                                           </div>
                                           <div className="flex items-center gap-1">
                                             <UtensilsCrossed className="w-4 h-4" />
                                             {recipe.servings} porções
                                           </div>
                                         </div>
                                       </CardHeader>
                                       <CardContent className="p-6">
                                         <div className="grid md:grid-cols-2 gap-6">
                                           <div>
                                             <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">Ingredientes:</h4>
                                             <ul className="space-y-1">
                                               {recipe.ingredients.map((ingredient: string, index: number) => (
                                                 <li key={index} className="flex items-start gap-2">
                                                   <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                   <span className="text-sm">{ingredient}</span>
                                                 </li>
                                               ))}
                                             </ul>
                                           </div>
                                           <div>
                                             <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">Modo de Preparo:</h4>
                                             <ol className="space-y-2">
                                               {recipe.instructions.map((instruction: string, index: number) => (
                                                 <li key={index} className="flex items-start gap-3">
                                                   <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                                     {index + 1}
                                                   </span>
                                                   <span className="text-sm">{instruction}</span>
                                                 </li>
                                               ))}
                                             </ol>
                                           </div>
                                         </div>
                                       </CardContent>
                                     </Card>
                                   );
                                 })}
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     ) : Array.isArray(recipes) && recipes.length > 0 ? (
                       <div className="grid gap-4">
                         {(recipes as Recipe[]).map((recipe) => (
                           <Card key={recipe.id} className="border border-border/50">
                             <CardHeader className="pb-3">
                               <CardTitle className="text-lg">{recipe.meal_name}</CardTitle>
                               <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                 <div className="flex items-center gap-1">
                                   <Clock className="w-4 h-4" />
                                   Preparo: {recipe.prep_time}min
                                 </div>
                                 <div className="flex items-center gap-1">
                                   <ChefHat className="w-4 h-4" />
                                   Cozimento: {recipe.cook_time}min
                                 </div>
                                 <Badge variant="outline">{recipe.servings} porções</Badge>
                               </div>
                             </CardHeader>
                             <CardContent className="space-y-4">
                               <div>
                                 <h4 className="font-semibold mb-2 text-primary">Ingredientes:</h4>
                                 <ul className="space-y-1">
                                   {recipe.ingredients.map((ingredient, index) => (
                                     <li key={index} className="flex items-center gap-2 text-sm">
                                       <CheckCircle className="w-3 h-3 text-green-500" />
                                       {ingredient}
                                     </li>
                                   ))}
                                 </ul>
                               </div>
                               <div>
                                 <h4 className="font-semibold mb-2 text-accent">Modo de Preparo:</h4>
                                 <ol className="space-y-1">
                                   {recipe.instructions.map((instruction, index) => (
                                     <li key={index} className="text-sm flex gap-2">
                                       <span className="font-medium text-muted-foreground">{index + 1}.</span>
                                       {instruction}
                                     </li>
                                   ))}
                                 </ol>
                               </div>
                             </CardContent>
                           </Card>
                         ))}
                       </div>
                     ) : (
                       <Card className="text-center p-8">
                         <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                         <p className="text-muted-foreground">Nenhuma receita encontrada. Complete o questionário para gerar receitas personalizadas!</p>
                       </Card>
                     )}
                   </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ideas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChefHat className="w-5 h-5" />
                      Ideias de Receitas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecipeIdeasSection userProfile={profile} />
                  </CardContent>
                </Card>
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
                       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {/* Proteínas */}
                         {weeklyMenu.shopping_list.proteins && weeklyMenu.shopping_list.proteins.length > 0 && (
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
                         )}

                         {/* Carboidratos */}
                         {weeklyMenu.shopping_list.carbs && weeklyMenu.shopping_list.carbs.length > 0 && (
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
                         )}

                         {/* Vegetais */}
                         {weeklyMenu.shopping_list.vegetables && weeklyMenu.shopping_list.vegetables.length > 0 && (
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
                         )}

                         {/* Frutas */}
                         {weeklyMenu.shopping_list.fruits && weeklyMenu.shopping_list.fruits.length > 0 && (
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
                         )}

                         {/* Laticínios */}
                         {weeklyMenu.shopping_list.dairy && weeklyMenu.shopping_list.dairy.length > 0 && (
                           <div>
                             <h4 className="font-semibold mb-3 text-blue-500">🥛 Laticínios</h4>
                             <ul className="space-y-2">
                               {weeklyMenu.shopping_list.dairy.map((item: string, index: number) => (
                                 <li key={index} className="flex items-center gap-2">
                                   <CheckCircle className="w-4 h-4 text-green-500" />
                                   <span className="text-sm">{item}</span>
                                 </li>
                               ))}
                             </ul>
                           </div>
                         )}

                         {/* Leguminosas */}
                         {weeklyMenu.shopping_list.legumes && weeklyMenu.shopping_list.legumes.length > 0 && (
                           <div>
                             <h4 className="font-semibold mb-3 text-yellow-600">🌱 Leguminosas</h4>
                             <ul className="space-y-2">
                               {weeklyMenu.shopping_list.legumes.map((item: string, index: number) => (
                                 <li key={index} className="flex items-center gap-2">
                                   <CheckCircle className="w-4 h-4 text-green-500" />
                                   <span className="text-sm">{item}</span>
                                 </li>
                               ))}
                             </ul>
                           </div>
                         )}

                         {/* Castanhas e Sementes */}
                         {weeklyMenu.shopping_list.nuts_seeds && weeklyMenu.shopping_list.nuts_seeds.length > 0 && (
                           <div>
                             <h4 className="font-semibold mb-3 text-amber-600">🥜 Castanhas & Sementes</h4>
                             <ul className="space-y-2">
                               {weeklyMenu.shopping_list.nuts_seeds.map((item: string, index: number) => (
                                 <li key={index} className="flex items-center gap-2">
                                   <CheckCircle className="w-4 h-4 text-green-500" />
                                   <span className="text-sm">{item}</span>
                                 </li>
                               ))}
                             </ul>
                           </div>
                         )}

                         {/* Temperos e Condimentos */}
                         {weeklyMenu.shopping_list.condiments && weeklyMenu.shopping_list.condiments.length > 0 && (
                           <div>
                             <h4 className="font-semibold mb-3 text-purple-500">🧂 Temperos & Condimentos</h4>
                             <ul className="space-y-2">
                               {weeklyMenu.shopping_list.condiments.map((item: string, index: number) => (
                                 <li key={index} className="flex items-center gap-2">
                                   <CheckCircle className="w-4 h-4 text-green-500" />
                                   <span className="text-sm">{item}</span>
                                 </li>
                               ))}
                             </ul>
                           </div>
                         )}

                         {/* Outros */}
                         {weeklyMenu.shopping_list.others && weeklyMenu.shopping_list.others.length > 0 && (
                           <div>
                             <h4 className="font-semibold mb-3 text-gray-500">📦 Outros</h4>
                             <ul className="space-y-2">
                               {weeklyMenu.shopping_list.others.map((item: string, index: number) => (
                                 <li key={index} className="flex items-center gap-2">
                                   <CheckCircle className="w-4 h-4 text-green-500" />
                                   <span className="text-sm">{item}</span>
                                 </li>
                               ))}
                             </ul>
                           </div>
                         )}
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
