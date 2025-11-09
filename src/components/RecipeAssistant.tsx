import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ChefHat, Sparkles, Calendar, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import fitnessGirlAvatar from "@/assets/fitness-girl-avatar.png";

interface Recipe {
  name: string;
  description: string;
  prepTime: string;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  tags: string[];
}

const RecipeAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState("");
  const [mealType, setMealType] = useState("café da manhã");
  const [suggestedRecipe, setSuggestedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [weeklyMenu, setWeeklyMenu] = useState<any>(null);

  const generateRecipe = async () => {
    if (!preferences.trim()) {
      toast({
        title: "Digite suas preferências!",
        description: "Me conte o que você gosta ou tem restrições",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: { 
          preferences: preferences.trim(),
          mealType,
          dietGoal: 'manutenção'
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setSuggestedRecipe(data.recipe);
      
      toast({
        title: "Receita gerada! 🎉",
        description: `${data.recipe.name} está pronta para você!`
      });
    } catch (error: any) {
      console.error('Erro ao gerar receita:', error);
      toast({
        title: "Erro ao gerar receita",
        description: error.message || "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWeeklyMenu = async () => {
    if (!preferences.trim()) {
      toast({
        title: "Digite suas preferências!",
        description: "Me conte seus objetivos e restrições",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-weekly-menu', {
        body: { 
          preferences: preferences.trim(),
          dietGoal: 'manutenção',
          budget: 'moderado',
          timeAvailable: 'médio'
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setWeeklyMenu(data);
      
      toast({
        title: "Menu semanal gerado! 📅",
        description: "Seu cardápio personalizado está pronto!"
      });
    } catch (error: any) {
      console.error('Erro ao gerar menu:', error);
      toast({
        title: "Erro ao gerar menu",
        description: error.message || "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <div className="absolute bottom-full right-0 mb-2 glass-card rounded-2xl shadow-lg p-4 max-w-sm border border-border/40">
            <div className="text-sm text-foreground font-semibold mb-1">
              Oi! 👋 Sou sua assistente IA
            </div>
            <div className="text-xs text-muted-foreground">
              Crio receitas personalizadas e menus semanais adaptados para você!
            </div>
            <div className="absolute top-full right-4 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-900"></div>
          </div>
          
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full overflow-hidden shadow-premium hover:shadow-glow transition-all duration-300 hover:scale-110 border-2 border-accent"
          >
            <img 
              src={fitnessGirlAvatar} 
              alt="Assistente IA"
              className="w-full h-full object-cover"
            />
          </button>
          
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center animate-pulse shadow-glow">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[440px] max-w-[calc(100vw-2rem)]">
      <Card className="glass-card shadow-premium border-2 border-accent/20">
        <CardHeader className="border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={fitnessGirlAvatar} 
                alt="Assistente IA"
                className="w-12 h-12 rounded-full border-2 border-accent shadow-lg"
              />
              <div>
                <CardTitle className="text-lg">Assistente IA</CardTitle>
                <p className="text-xs text-muted-foreground">Receitas e Menus Personalizados</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 p-0 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="recipe" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="recipe" className="gap-2">
                <ChefHat className="w-4 h-4" />
                Receita
              </TabsTrigger>
              <TabsTrigger value="menu" className="gap-2">
                <Calendar className="w-4 h-4" />
                Menu Semanal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recipe" className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Tipo de refeição
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full p-2 rounded-lg border border-input bg-background text-foreground text-sm"
                >
                  <option>café da manhã</option>
                  <option>almoço</option>
                  <option>jantar</option>
                  <option>lanche</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Suas preferências e restrições
                </label>
                <Input
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="Ex: sem lactose, rico em proteínas, vegano..."
                  className="w-full"
                  onKeyDown={(e) => e.key === 'Enter' && generateRecipe()}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Quanto mais detalhes, melhor!
                </p>
              </div>

              <Button
                onClick={generateRecipe}
                disabled={isGenerating || !preferences.trim()}
                className="w-full bg-gradient-premium hover:shadow-glow"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando com IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Receita Personalizada
                  </>
                )}
              </Button>

              {suggestedRecipe && (
                <div className="mt-6 space-y-4 max-h-96 overflow-y-auto glass-card p-4 rounded-2xl">
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{suggestedRecipe.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{suggestedRecipe.description}</p>
                    
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{suggestedRecipe.prepTime}</Badge>
                      <Badge variant="secondary" className="text-xs">{suggestedRecipe.servings} porções</Badge>
                      <Badge variant="outline" className="text-xs">{suggestedRecipe.difficulty}</Badge>
                      {suggestedRecipe.tags.map(tag => (
                        <Badge key={tag} className="text-xs bg-accent/20 text-accent">{tag}</Badge>
                      ))}
                    </div>

                    <div className="glass-card p-3 rounded-xl mb-3">
                      <h4 className="font-semibold text-sm mb-2 text-accent">Nutrição (por porção)</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><strong>Calorias:</strong> {suggestedRecipe.nutrition.calories}</div>
                        <div><strong>Proteínas:</strong> {suggestedRecipe.nutrition.protein}</div>
                        <div><strong>Carboidratos:</strong> {suggestedRecipe.nutrition.carbs}</div>
                        <div><strong>Gorduras:</strong> {suggestedRecipe.nutrition.fat}</div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-semibold text-sm mb-2">Ingredientes:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {suggestedRecipe.ingredients.map((ing, i) => (
                          <li key={i}>• {ing}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Modo de preparo:</h4>
                      <ol className="text-xs text-muted-foreground space-y-2">
                        {suggestedRecipe.instructions.map((inst, i) => (
                          <li key={i}>{i + 1}. {inst}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="menu" className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Objetivos e restrições
                </label>
                <Input
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="Ex: emagrecer, vegetariano, orçamento baixo..."
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Descreva seu objetivo e preferências
                </p>
              </div>

              <Button
                onClick={generateWeeklyMenu}
                disabled={isGenerating || !preferences.trim()}
                className="w-full bg-gradient-premium hover:shadow-glow"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando menu completo...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Gerar Menu Semanal com IA
                  </>
                )}
              </Button>

              {weeklyMenu && (
                <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
                  {weeklyMenu.weeklyMenu?.map((day: any, idx: number) => (
                    <div key={idx} className="glass-card p-4 rounded-2xl">
                      <h4 className="font-bold text-sm mb-3 text-accent">{day.day}</h4>
                      <div className="space-y-2 text-xs">
                        {Object.entries(day.meals).map(([mealKey, meal]: [string, any]) => (
                          <div key={mealKey} className="flex justify-between items-start">
                            <div className="flex-1">
                              <span className="font-semibold capitalize">{mealKey.replace('_', ' ')}:</span>
                              <p className="text-muted-foreground">{meal.name}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs ml-2">{meal.calories} cal</Badge>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/40 flex justify-between text-xs">
                        <span className="font-semibold">Total: {day.total_calories} cal</span>
                        <span className="text-muted-foreground">
                          P: {day.macros.protein} | C: {day.macros.carbs} | G: {day.macros.fat}
                        </span>
                      </div>
                    </div>
                  ))}

                  {weeklyMenu.shopping_list && (
                    <div className="glass-card p-4 rounded-2xl">
                      <h4 className="font-bold text-sm mb-3 text-accent">📝 Lista de Compras</h4>
                      <div className="space-y-2 text-xs">
                        {Object.entries(weeklyMenu.shopping_list).map(([category, items]: [string, any]) => (
                          <div key={category}>
                            <span className="font-semibold capitalize">{category}:</span>
                            <p className="text-muted-foreground">{items.join(', ')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {weeklyMenu.tips && weeklyMenu.tips.length > 0 && (
                    <div className="glass-card p-4 rounded-2xl">
                      <h4 className="font-bold text-sm mb-2 text-accent">💡 Dicas</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {weeklyMenu.tips.map((tip: string, i: number) => (
                          <li key={i}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeAssistant;