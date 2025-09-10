import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ChefHat, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import fitnessGirlAvatar from "@/assets/fitness-girl-avatar.png";

interface Recipe {
  id: string;
  meal_name: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
}

const RecipeAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRecipeIdeas = async () => {
    if (!ingredientsInput.trim()) {
      toast({
        title: "Digite alguns ingredientes!",
        description: "Preciso saber quais ingredientes você tem disponível",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simular geração de receitas baseadas nos ingredientes
      const ingredients = ingredientsInput.split(',').map(i => i.trim().toLowerCase());
      const recipes = generateRecipesFromIngredients(ingredients);
      setSuggestedRecipes(recipes);
      
      toast({
        title: "Receitas geradas! 👩‍🍳✨",
        description: `Encontrei ${recipes.length} receitas deliciosas para você!`
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar receitas",
        description: "Tente novamente com outros ingredientes",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRecipesFromIngredients = (ingredients: string[]): Recipe[] => {
    const recipeDatabase = [
      {
        keywords: ['frango', 'chicken', 'peito'],
        recipes: [
          {
            id: 'frango-1',
            meal_name: "Frango Grelhado com Temperos",
            ingredients: ["500g de peito de frango", "Alho", "Cebola", "Temperos", "Azeite"],
            instructions: ["Tempere o frango", "Grelhe por 15 minutos", "Sirva quente"],
            prep_time: 10,
            cook_time: 15,
            servings: 2
          }
        ]
      },
      {
        keywords: ['ovo', 'ovos', 'egg'],
        recipes: [
          {
            id: 'ovo-1',
            meal_name: "Omelete de Legumes",
            ingredients: ["3 ovos", "Cebola", "Tomate", "Temperos", "Azeite"],
            instructions: ["Bata os ovos", "Refogue os legumes", "Faça a omelete"],
            prep_time: 5,
            cook_time: 8,
            servings: 1
          }
        ]
      },
      {
        keywords: ['banana', 'aveia', 'oats'],
        recipes: [
          {
            id: 'smoothie-1',
            meal_name: "Smoothie Energético",
            ingredients: ["1 banana", "2 colheres de aveia", "1 xícara de leite", "Mel"],
            instructions: ["Bata tudo no liquidificador", "Sirva gelado"],
            prep_time: 3,
            cook_time: 0,
            servings: 1
          }
        ]
      },
      {
        keywords: ['arroz', 'rice'],
        recipes: [
          {
            id: 'arroz-1',
            meal_name: "Arroz Integral com Legumes",
            ingredients: ["1 xícara de arroz integral", "Cenoura", "Brócolis", "Caldo de legumes"],
            instructions: ["Refogue os legumes", "Adicione arroz e caldo", "Cozinhe por 25 min"],
            prep_time: 10,
            cook_time: 25,
            servings: 2
          }
        ]
      }
    ];

    const matchingRecipes: Recipe[] = [];
    
    recipeDatabase.forEach(category => {
      const hasMatch = category.keywords.some(keyword => 
        ingredients.some(ingredient => ingredient.includes(keyword))
      );
      
      if (hasMatch) {
        matchingRecipes.push(...category.recipes);
      }
    });

    // Se não encontrou receitas específicas, retorna receitas genéricas
    if (matchingRecipes.length === 0) {
      return [
        {
          id: 'generic-1',
          meal_name: "Salada Completa",
          ingredients: ingredients.map(i => i.charAt(0).toUpperCase() + i.slice(1)),
          instructions: ["Lave e corte os ingredientes", "Misture tudo", "Tempere a gosto"],
          prep_time: 10,
          cook_time: 0,
          servings: 1
        },
        {
          id: 'generic-2',
          meal_name: "Refogado Nutritivo",
          ingredients: ingredients.map(i => i.charAt(0).toUpperCase() + i.slice(1)),
          instructions: ["Corte todos os ingredientes", "Refogue em fogo médio", "Tempere e sirva"],
          prep_time: 8,
          cook_time: 12,
          servings: 2
        }
      ];
    }

    return matchingRecipes.slice(0, 3); // Máximo 3 receitas
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Balão de fala */}
          <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs border border-border">
            <div className="text-sm text-foreground font-medium mb-1">
              Oi! 👋
            </div>
            <div className="text-xs text-muted-foreground">
              Não sabe o que cozinhar? Me fale os ingredientes que você tem que te dou uma sugestão!
            </div>
            {/* Seta do balão */}
            <div className="absolute top-full right-4 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
          </div>
          
          {/* Avatar da menina fitness */}
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-primary"
          >
            <img 
              src={fitnessGirlAvatar} 
              alt="Assistente de receitas"
              className="w-full h-full object-cover"
            />
          </button>
          
          {/* Indicador de novidade */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-2 border-primary/20">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={fitnessGirlAvatar} 
                alt="Assistente de receitas"
                className="w-10 h-10 rounded-full border-2 border-primary"
              />
              <div>
                <h3 className="font-semibold text-foreground">Assistente de Receitas</h3>
                <p className="text-xs text-muted-foreground">Sua coach culinária</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Input de ingredientes */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Quais ingredientes você tem?
              </label>
              <Input
                value={ingredientsInput}
                onChange={(e) => setIngredientsInput(e.target.value)}
                placeholder="Ex: frango, arroz, brócolis, ovos..."
                className="w-full"
                onKeyDown={(e) => e.key === 'Enter' && generateRecipeIdeas()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separe os ingredientes por vírgula
              </p>
            </div>

            <Button
              onClick={generateRecipeIdeas}
              disabled={isGenerating || !ingredientsInput.trim()}
              className="w-full"
            >
              {isGenerating ? (
                "Gerando receitas..."
              ) : (
                <>
                  <ChefHat className="w-4 h-4 mr-2" />
                  Sugerir Receitas
                </>
              )}
            </Button>
          </div>

          {/* Receitas sugeridas */}
          {suggestedRecipes.length > 0 && (
            <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
              <h4 className="font-medium text-foreground">Receitas para você:</h4>
              {suggestedRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm text-foreground">{recipe.meal_name}</h5>
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {recipe.prep_time + recipe.cook_time} min
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {recipe.servings} porções
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <strong>Ingredientes:</strong> {recipe.ingredients.slice(0, 3).join(', ')}
                    {recipe.ingredients.length > 3 && '...'}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <strong>Como fazer:</strong> {recipe.instructions[0]}
                    {recipe.instructions.length > 1 && '...'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeAssistant;