import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Target, 
  Clock, 
  DollarSign, 
  ChefHat, 
  Heart,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";
import { supabase } from "@/lib/supabase";

interface QuestionnaireData {
  objetivo: string;
  restricoes: string[];
  orcamento: string;
  tempo: string;
  experiencia: string;
  preferencias: string[];
  refeicoes: string[];
  evento: string;
  guloseimas: string;
  aniversario: {
    dia: string;
    mes: string;
    ano: string;
  };
}

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState<QuestionnaireData>({
    objetivo: "",
    restricoes: [],
    orcamento: "",
    tempo: "",
    experiencia: "",
    preferencias: [],
    refeicoes: [],
    evento: "",
    guloseimas: "",
    aniversario: {
      dia: "",
      mes: "",
      ano: ""
    }
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const questions = [
    {
      id: "objetivo",
      title: "Qual é o seu objetivo principal?",
      subtitle: "Vamos personalizar seu cardápio baseado no seu goal",
      icon: <Target className="w-6 h-6" />,
      type: "single",
      options: [
        { value: "emagrecimento", label: "Emagrecimento", desc: "Foco em deficit calórico" },
        { value: "bulking", label: "Ganho de Massa", desc: "Foco em surplus calórico" },
        { value: "manutencao", label: "Manutenção", desc: "Manter peso atual" },
        { value: "saude", label: "Vida Saudável", desc: "Foco em nutrição balanceada" }
      ]
    },
    {
      id: "restricoes",
      title: "Possui alguma restrição alimentar?",
      subtitle: "Selecione todas que se aplicam",
      icon: <Heart className="w-6 h-6" />,
      type: "multiple",
      options: [
        { value: "vegetariano", label: "Vegetariano", desc: "" },
        { value: "vegano", label: "Vegano", desc: "" },
        { value: "lactose", label: "Sem Lactose", desc: "" },
        { value: "gluten", label: "Sem Glúten", desc: "" },
        { value: "diabetico", label: "Diabético", desc: "" },
        { value: "nenhuma", label: "Nenhuma", desc: "" }
      ]
    },
    {
      id: "orcamento",
      title: "Qual o seu orçamento semanal para alimentação?",
      subtitle: "Vamos adequar as receitas ao seu bolso",
      icon: <DollarSign className="w-6 h-6" />,
      type: "single",
      options: [
        { value: "economico", label: "Até R$ 100", desc: "Receitas econômicas" },
        { value: "moderado", label: "R$ 100 - R$ 200", desc: "Bom custo-benefício" },
        { value: "confortavel", label: "R$ 200 - R$ 300", desc: "Mais variedade" },
        { value: "premium", label: "Acima de R$ 300", desc: "Ingredientes premium" }
      ]
    },
    {
      id: "tempo",
      title: "Quanto tempo você tem para cozinhar?",
      subtitle: "Receitas adaptadas à sua rotina",
      icon: <Clock className="w-6 h-6" />,
      type: "single",
      options: [
        { value: "rapido", label: "15-30 min", desc: "Receitas rápidas" },
        { value: "moderado", label: "30-60 min", desc: "Receitas balanceadas" },
        { value: "elaborado", label: "1h+", desc: "Receitas elaboradas" },
        { value: "meal_prep", label: "Meal Prep", desc: "Cozinhar tudo no domingo" }
      ]
    },
    {
      id: "experiencia",
      title: "Qual seu nível na cozinha?",
      subtitle: "Receitas adequadas ao seu skill",
      icon: <ChefHat className="w-6 h-6" />,
      type: "single",
      options: [
        { value: "iniciante", label: "Iniciante", desc: "Receitas bem simples" },
        { value: "intermediario", label: "Intermediário", desc: "Alguma experiência" },
        { value: "avancado", label: "Avançado", desc: "Gosto de desafios" }
      ]
    },
    {
      id: "preferencias",
      title: "Que tipo de culinária você prefere?",
      subtitle: "Selecione suas favoritas",
      icon: <Sparkles className="w-6 h-6" />,
      type: "multiple",
      options: [
        { value: "brasileira", label: "Brasileira", desc: "" },
        { value: "italiana", label: "Italiana", desc: "" },
        { value: "asiatica", label: "Asiática", desc: "" },
        { value: "mediterranea", label: "Mediterrânea", desc: "" },
        { value: "mexicana", label: "Mexicana", desc: "" },
        { value: "fit", label: "Fit/Light", desc: "" }
      ]
    },
    {
      id: "refeicoes",
      title: "Quais refeições quer no cardápio?",
      subtitle: "Montaremos baseado na sua rotina",
      icon: <CheckCircle className="w-6 h-6" />,
      type: "multiple",
      options: [
        { value: "cafe", label: "Café da Manhã", desc: "" },
        { value: "almoco", label: "Almoço", desc: "" },
        { value: "lanche", label: "Lanche da Tarde", desc: "" },
        { value: "jantar", label: "Jantar", desc: "" },
        { value: "ceia", label: "Ceia", desc: "" }
      ]
    },
    {
      id: "evento",
      title: "Há algum evento específico que te motiva a perder peso agora?",
      subtitle: "Vamos focar no seu objetivo",
      icon: <Target className="w-6 h-6" />,
      type: "single",
      options: [
        { value: "ferias", label: "Férias", desc: "" },
        { value: "casamento", label: "Casamento", desc: "" },
        { value: "evento_esportivo", label: "Evento esportivo", desc: "" },
        { value: "verao", label: "Verão", desc: "" },
        { value: "reuniao_familia", label: "Reunião de família", desc: "" },
        { value: "festa_aniversario", label: "Festa de aniversário", desc: "" },
        { value: "outra_ocasiao", label: "Outra ocasião", desc: "" }
      ]
    },
    {
      id: "guloseimas",
      title: "Você mais sente desejo por guloseimas? se sim quando?",
      subtitle: "Vamos adequar o cardápio aos seus hábitos",
      icon: <Heart className="w-6 h-6" />,
      type: "single",
      options: [
        { value: "nao_sinto", label: "Não sinto", desc: "" },
        { value: "manha", label: "Sim, pela manhã", desc: "" },
        { value: "tarde", label: "Sim, pela tarde", desc: "" },
        { value: "noite", label: "Sim, pela noite", desc: "" },
        { value: "madrugada", label: "Sim, pela madrugada", desc: "" }
      ]
    },
    {
      id: "aniversario",
      title: "Quando é seu aniversário?",
      subtitle: "Precisamos da sua idade para calcular seu objetivo calórico diário com exatidão",
      icon: <Clock className="w-6 h-6" />,
      type: "date",
      options: []
    }
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleOptionSelect = (questionId: string, value: string) => {
    if (currentQuestion.type === "single") {
      setFormData(prev => ({
        ...prev,
        [questionId]: value
      }));
    } else {
      setFormData(prev => {
        const currentValues = prev[questionId as keyof QuestionnaireData] as string[];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        
        return {
          ...prev,
          [questionId]: newValues
        };
      });
    }
  };

  const handleDateSelect = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      aniversario: {
        ...prev.aniversario,
        [field]: value
      }
    }));
  };

  const canProceed = () => {
    if (currentQuestion.id === "aniversario") {
      return formData.aniversario.dia !== "" && formData.aniversario.mes !== "" && formData.aniversario.ano !== "";
    }
    
    const currentValue = formData[currentQuestion.id as keyof QuestionnaireData];
    if (currentQuestion.type === "single") {
      return currentValue !== "";
    } else if (currentQuestion.type === "multiple") {
      return Array.isArray(currentValue) && currentValue.length > 0;
    } else {
      return true;
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Verificar se usuário está logado antes de gerar cardápio
      if (!user) {
        setShowAuthModal(true);
        toast({
          title: "Faça login para continuar",
          description: "Você precisa criar uma conta para gerar seu cardápio personalizado!",
          variant: "destructive"
        });
        return;
      }
      // Questionário finalizado
      generateMenu();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateMenu = async () => {
    try {
      toast({
        title: "🎉 Questionário Concluído!",
        description: "Sua IA está criando o cardápio perfeito...",
      });
      
      // Generate personalized menu based on user preferences
      const personalizedMenu = generatePersonalizedMenu(formData);
      
      // Try to save user preferences and menu to Supabase
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            preferences: formData 
          })
          .eq('id', user?.id);

        if (profileError && !(profileError.code === '42P01' || profileError.message.includes('does not exist'))) {
          throw profileError;
        }

        // Save the generated menu
        const { error: menuError } = await supabase
          .from('weekly_menus')
          .insert({
            user_id: user?.id!,
            week_start: new Date().toISOString().split('T')[0],
            meals: personalizedMenu.meals,
            shopping_list: personalizedMenu.shopping_list,
            ai_preferences: formData
          });

        if (menuError && !(menuError.code === '42P01' || menuError.message.includes('does not exist'))) {
          throw menuError;
        }

        console.log('Menu and preferences saved successfully');
        
      } catch (error: any) {
        console.log('Database not available, saving locally:', error.message);
        // Store everything in localStorage as fallback
        localStorage.setItem(`preferences_${user?.id}`, JSON.stringify(formData));
        localStorage.setItem(`menu_${user?.id}`, JSON.stringify(personalizedMenu));
        
        // Generate and save recipes for all meals
        const generatedRecipes = generateRecipesFromMenu(personalizedMenu.meals);
        localStorage.setItem(`recipes_${user?.id}`, JSON.stringify(generatedRecipes));
      }

      toast({
        title: "Cardápio personalizado criado!",
        description: "Redirecionando para o dashboard...",
      });

      // Redirect to the dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch (error: any) {
      console.error('Error in generateMenu:', error);
      toast({
        title: "Cardápio gerado com sucesso!",
        description: "Redirecionando para o dashboard...",
      });
      
      // Even if there's an error, redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    }
  };

  // Function to generate personalized menu based on user preferences
  const generatePersonalizedMenu = (preferences: QuestionnaireData) => {
    const isVegetarian = preferences.restricoes?.includes('vegetariano');
    const isVegan = preferences.restricoes?.includes('vegano');
    const hasLactoseIntolerance = preferences.restricoes?.includes('lactose');
    const hasGlutenIntolerance = preferences.restricoes?.includes('gluten');
    const selectedMeals = preferences.refeicoes || [];
    
    console.log('Generating menu for selected meals:', selectedMeals);
    
    // Define meal options based on dietary restrictions
    const mealOptions = {
      cafe: {
        vegan: [
          "Smoothie de banana com leite de amêndoas e aveia",
          "Panqueca de aveia com frutas",
          "Vitamina verde com espinafre e manga",
          "Torrada integral com pasta de amendoim"
        ],
        vegetarian: [
          "Aveia com frutas e mel",
          "Iogurte com granola e frutas",
          "Omelete de claras com vegetais",
          "Smoothie proteico com frutas"
        ],
        regular: [
          "Aveia com frutas e mel",
          "Iogurte com granola e frutas",
          "Omelete de claras com vegetais",
          "Smoothie proteico com frutas"
        ]
      },
      almoco: {
        vegan: [
          "Quinoa com legumes grelhados e tofu",
          "Bowl de quinoa com grão-de-bico",
          "Salada de lentilhas com vegetais",
          "Hambúrguer de feijão preto com salada",
          "Risotto de cogumelos vegano",
          "Wrap de hummus com vegetais",
          "Curry de vegetais com arroz integral"
        ],
        vegetarian: [
          "Quinoa com legumes grelhados e tofu",
          "Salada de quinoa com grão-de-bico",
          "Omelete de legumes com batata doce",
          "Risotto de cogumelos",
          "Wrap de queijo com vegetais"
        ],
        regular: [
          "Frango grelhado com quinoa e legumes",
          "Salmão assado com batata doce",
          "Peito de peru com arroz integral",
          "Peixe grelhado com legumes",
          "Carne magra com salada de quinoa",
          "Frango com batata doce",
          "Peixe com quinoa"
        ]
      },
      lanche: {
        vegan: [
          "Mix de castanhas e frutas secas",
          "Smoothie de frutas com leite vegetal",
          "Torrada com pasta de amendoim",
          "Vitamina de frutas com aveia",
          "Bowl de açaí vegano",
          "Chips de banana assada",
          "Shake proteico vegano"
        ],
        vegetarian: [
          "Iogurte com granola",
          "Sanduíche natural com queijo",
          "Smoothie de frutas",
          "Mix de castanhas",
          "Torrada com queijo cottage",
          "Vitamina proteica",
          "Bowl de frutas com granola"
        ],
        regular: [
          "Iogurte com granola",
          "Sanduíche natural",
          "Smoothie proteico",
          "Mix de castanhas",
          "Shake de proteína",
          "Torrada com queijo cottage",
          "Vitamina de frutas"
        ]
      },
      jantar: {
        vegan: [
          "Curry de grão-de-bico com arroz integral",
          "Macarrão de abobrinha com molho de tomate",
          "Sopa de lentilhas com legumes",
          "Stir-fry de tofu com legumes",
          "Buddha bowl vegano",
          "Refogado de tofu com legumes",
          "Hambúrguer de lentilha com salada"
        ],
        vegetarian: [
          "Omelete de legumes com batata doce",
          "Risotto de cogumelos",
          "Omelete de legumes com batata",
          "Omelete de legumes",
          "Frango grelhado com salada",
          "Peixe com arroz integral",
          "Omelete de legumes"
        ],
        regular: [
          "Salmão assado com batata doce",
          "Peito de peru com arroz integral",
          "Frango assado com batata",
          "Omelete com legumes",
          "Peixe com arroz integral",
          "Frango grelhado com salada",
          "Sopa de legumes com proteína"
        ]
      },
      ceia: {
        vegan: [
          "Chá calmante com castanhas",
          "Vitamina de banana com leite vegetal",
          "Mix de frutas secas",
          "Shake vegano leve",
          "Iogurte vegetal com frutas",
          "Smoothie verde leve",
          "Chá com torrada integral"
        ],
        vegetarian: [
          "Iogurte natural com mel",
          "Vitamina de frutas leve",
          "Chá com biscoitos integrais",
          "Shake proteico leve",
          "Queijo cottage com frutas",
          "Smoothie de frutas",
          "Leite morno com mel"
        ],
        regular: [
          "Iogurte natural com mel",
          "Vitamina de frutas leve",
          "Chá com biscoitos integrais",
          "Shake proteico leve",
          "Queijo cottage com frutas",
          "Smoothie de frutas",
          "Leite morno com mel"
        ]
      }
    };
    
    // Generate meals for each day of the week
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let meals: any = {};
    
    days.forEach((day, index) => {
      meals[day] = {};
      
      selectedMeals.forEach(mealType => {
        const dietType = isVegan ? 'vegan' : isVegetarian ? 'vegetarian' : 'regular';
        const options = mealOptions[mealType as keyof typeof mealOptions][dietType];
        
        // Select a different option for each day to ensure variety
        const selectedOption = options[index % options.length];
        
        meals[day][mealType === 'cafe' ? 'breakfast' : 
                   mealType === 'almoco' ? 'lunch' :
                   mealType === 'lanche' ? 'snack' :
                   mealType === 'jantar' ? 'dinner' : 'late_snack'] = selectedOption;
      });
    });

    // Generate comprehensive shopping list based on all meals
    const allIngredients: string[] = [];
    
    // Extract ingredients from all generated recipes
    Object.values(meals).forEach((dayMeals: any) => {
      Object.values(dayMeals).forEach((mealName: any) => {
        const recipe = generateRecipeForMeal(mealName, "temp");
        allIngredients.push(...recipe.ingredients);
      });
    });

    // Categorize ingredients intelligently
    const categorizeIngredient = (ingredient: string) => {
      const ing = ingredient.toLowerCase();
      
      if (ing.includes('frango') || ing.includes('salmão') || ing.includes('peixe') || ing.includes('atum') || 
          ing.includes('tofu') || ing.includes('ovo') || ing.includes('carne') || ing.includes('peru')) {
        return 'proteins';
      } else if (ing.includes('quinoa') || ing.includes('arroz') || ing.includes('aveia') || ing.includes('pão') || 
                 ing.includes('batata') || ing.includes('macarrão') || ing.includes('tortilha')) {
        return 'carbs';
      } else if (ing.includes('brócolis') || ing.includes('cenoura') || ing.includes('abobrinha') || ing.includes('espinafre') || 
                 ing.includes('tomate') || ing.includes('cebola') || ing.includes('alho') || ing.includes('pimentão') || 
                 ing.includes('pepino') || ing.includes('couve') || ing.includes('folhas') || ing.includes('aipo') || 
                 ing.includes('gengibre') || ing.includes('aspargos') || ing.includes('cogumelos')) {
        return 'vegetables';
      } else if (ing.includes('banana') || ing.includes('maçã') || ing.includes('morango') || ing.includes('abacate') || 
                 ing.includes('limão') || ing.includes('manga') || ing.includes('frutas')) {
        return 'fruits';
      } else if (ing.includes('leite') || ing.includes('iogurte') || ing.includes('queijo')) {
        return 'dairy';
      } else if (ing.includes('grão-de-bico') || ing.includes('lentilha') || ing.includes('feijão')) {
        return 'legumes';
      } else if (ing.includes('castanha') || ing.includes('amêndoa') || ing.includes('noz') || ing.includes('semente') || 
                 ing.includes('granola') || ing.includes('chia') || ing.includes('tahine')) {
        return 'nuts_seeds';
      } else if (ing.includes('azeite') || ing.includes('óleo') || ing.includes('mel') || ing.includes('sal') || 
                 ing.includes('pimenta') || ing.includes('tempero') || ing.includes('vinagre') || ing.includes('shoyu') || 
                 ing.includes('curry') || ing.includes('manjericão') || ing.includes('canela')) {
        return 'condiments';
      } else {
        return 'others';
      }
    };

    // Group and count ingredients
    const shopping_list: any = {
      proteins: [],
      carbs: [],
      vegetables: [],
      fruits: [],
      dairy: [],
      legumes: [],
      nuts_seeds: [],
      condiments: [],
      others: []
    };

    // Count occurrences and organize
    const ingredientCount: { [key: string]: number } = {};
    allIngredients.forEach(ingredient => {
      const cleanIng = ingredient.split('(')[0].trim(); // Remove quantities for counting
      ingredientCount[cleanIng] = (ingredientCount[cleanIng] || 0) + 1;
    });

    // Create final categorized shopping list
    Object.keys(ingredientCount).forEach(ingredient => {
      const category = categorizeIngredient(ingredient);
      const count = ingredientCount[ingredient];
      
      // Add quantity suggestions based on usage frequency
      let quantity = '';
      if (count >= 5) quantity = ' (quantidade para semana toda)';
      else if (count >= 3) quantity = ' (uso frequente)';
      
      shopping_list[category].push(ingredient + quantity);
    });

    // Add essential items based on dietary preferences
    if (isVegan) {
      if (!shopping_list.proteins.some((p: string) => p.includes('Tofu'))) {
        shopping_list.proteins.push('Tofu (500g)');
      }
      if (!shopping_list.dairy.some((d: string) => d.includes('leite vegetal'))) {
        shopping_list.dairy.push('Leite vegetal (1L)');
      }
    }

    if (!isVegan && !isVegetarian) {
      if (!shopping_list.proteins.some((p: string) => p.includes('Frango'))) {
        shopping_list.proteins.push('Frango (1kg)');
      }
    }

    // Clean empty categories
    Object.keys(shopping_list).forEach(category => {
      if (shopping_list[category].length === 0) {
        delete shopping_list[category];
      }
    });

    return { meals, shopping_list };
  };

  // Function to generate recipes for all meals in the menu organized by day
  const generateRecipesFromMenu = (meals: any) => {
    const recipesByDay: any = {};
    let id = 1;

    Object.entries(meals).forEach(([day, dayMeals]: [string, any]) => {
      recipesByDay[day] = {};
      
      Object.entries(dayMeals).forEach(([mealType, mealName]: [string, any]) => {
        const recipe = generateRecipeForMeal(mealName, id.toString());
        recipesByDay[day][mealType] = recipe;
        id++;
      });
    });

    return recipesByDay;
  };

  // Function to generate a single recipe based on meal name
  const generateRecipeForMeal = (mealName: string, id: string) => {
    // Comprehensive recipe templates with correct ingredients and instructions
    const recipeTemplates: any = {
      // Breakfast recipes
      "aveia": {
        ingredients: ["1 xícara de aveia em flocos", "1/2 xícara de frutas vermelhas", "2 colheres de mel", "1 xícara de leite"],
        instructions: ["Cozinhe a aveia com leite em fogo baixo por 5 minutos", "Adicione as frutas vermelhas", "Finalize com mel e sirva"],
        prep_time: 5,
        cook_time: 5,
        servings: 1
      },
      "smoothie": {
        ingredients: ["1 banana", "1 xícara de leite de amêndoas", "2 colheres de aveia", "1 colher de mel"],
        instructions: ["Bata todos os ingredientes no liquidificador", "Sirva gelado"],
        prep_time: 3,
        cook_time: 0,
        servings: 1
      },
      "panqueca": {
        ingredients: ["1 xícara de aveia em flocos", "1 banana amassada", "2 ovos", "1/2 xícara de leite vegetal", "1 colher de fermento"],
        instructions: ["Misture todos os ingredientes", "Aqueça frigideira antiaderente", "Cozinhe por 2-3 min de cada lado"],
        prep_time: 10,
        cook_time: 6,
        servings: 2
      },
      "vitamina": {
        ingredients: ["1 xícara de espinafre", "1 banana", "1/2 manga", "1 xícara de água de coco", "1 colher de chia"],
        instructions: ["Bata todos os ingredientes no liquidificador", "Coe se preferir", "Sirva gelado com gelo"],
        prep_time: 5,
        cook_time: 0,
        servings: 1
      },
      "torrada": {
        ingredients: ["2 fatias de pão integral", "1/2 abacate", "Pasta de amendoim", "Banana fatiada", "Mel"],
        instructions: ["Toste o pão", "Espalhe pasta de amendoim", "Adicione abacate e banana", "Finalize com mel"],
        prep_time: 5,
        cook_time: 2,
        servings: 1
      },
      "omelete": {
        ingredients: ["3 ovos", "Vegetais picados (tomate, cebola, pimentão)", "Sal e pimenta", "1 colher de azeite"],
        instructions: ["Bata os ovos com sal e pimenta", "Refogue os vegetais", "Adicione os ovos e cozinhe até firmar"],
        prep_time: 5,
        cook_time: 8,
        servings: 1
      },
      "iogurte": {
        ingredients: ["1 pote de iogurte natural", "3 colheres de granola", "Frutas fatiadas", "1 colher de mel"],
        instructions: ["Coloque o iogurte na tigela", "Adicione frutas e granola", "Finalize com mel"],
        prep_time: 3,
        cook_time: 0,
        servings: 1
      },

      // Lunch recipes
      "quinoa com legumes": {
        ingredients: ["1 xícara de quinoa", "2 xícaras de caldo de legumes", "200g de tofu", "Brócolis", "Cenoura", "Azeite", "Temperos"],
        instructions: ["Lave e cozinhe quinoa com caldo por 15 min", "Grelhe o tofu temperado", "Refogue os legumes", "Misture tudo e tempere"],
        prep_time: 15,
        cook_time: 20,
        servings: 2
      },
      "bowl de quinoa": {
        ingredients: ["1 xícara de quinoa", "1 lata de grão-de-bico", "Folhas verdes", "Tomate cereja", "Pepino", "Azeite", "Limão"],
        instructions: ["Cozinhe quinoa", "Escorra e tempere grão-de-bico", "Monte bowl com folhas", "Adicione quinoa e grão-de-bico", "Tempere com azeite e limão"],
        prep_time: 10,
        cook_time: 15,
        servings: 2
      },
      "salada de lentilhas": {
        ingredients: ["1 xícara de lentilhas", "Tomate", "Pepino", "Cebola roxa", "Salsinha", "Azeite", "Vinagre", "Sal"],
        instructions: ["Cozinhe lentilhas até ficarem macias", "Pique todos os vegetais", "Misture lentilhas com vegetais", "Tempere com azeite e vinagre"],
        prep_time: 15,
        cook_time: 25,
        servings: 3
      },
      "hambúrguer de feijão": {
        ingredients: ["2 xícaras de feijão preto", "1 cebola", "2 dentes de alho", "Farinha de aveia", "Temperos", "Pão integral", "Salada"],
        instructions: ["Amasse feijão com cebola e alho", "Forme hambúrgueres", "Grelhe por 4 min cada lado", "Monte no pão com salada"],
        prep_time: 20,
        cook_time: 8,
        servings: 4
      },
      "frango grelhado": {
        ingredients: ["500g peito de frango", "Temperos (alho, sal, pimenta)", "1 colher de azeite", "Quinoa", "Legumes variados"],
        instructions: ["Tempere o frango", "Grelhe por 6-8 minutos de cada lado", "Cozinhe quinoa", "Refogue legumes", "Sirva junto"],
        prep_time: 15,
        cook_time: 20,
        servings: 2
      },
      "salmão": {
        ingredients: ["400g filé de salmão", "Sal e pimenta", "Azeite", "Limão", "Batata doce", "Aspargos"],
        instructions: ["Tempere o salmão", "Asse a 180°C por 15 minutos", "Asse batata doce", "Refogue aspargos", "Finalize com limão"],
        prep_time: 10,
        cook_time: 20,
        servings: 2
      },
      "wrap": {
        ingredients: ["Tortilha integral", "Hummus", "Cenoura ralada", "Pepino", "Tomate", "Folhas verdes", "Grão-de-bico"],
        instructions: ["Espalhe hummus na tortilha", "Adicione vegetais e grão-de-bico", "Enrole bem apertado", "Corte pela metade"],
        prep_time: 10,
        cook_time: 0,
        servings: 2
      },

      // Dinner recipes
      "curry de grão-de-bico": {
        ingredients: ["2 latas de grão-de-bico", "1 lata de leite de coco", "Cebola", "Alho", "Gengibre", "Curry em pó", "Tomate", "Arroz integral"],
        instructions: ["Refogue cebola, alho e gengibre", "Adicione curry e tomate", "Junte grão-de-bico e leite de coco", "Cozinhe por 15 min", "Sirva com arroz"],
        prep_time: 15,
        cook_time: 20,
        servings: 4
      },
      "macarrão de abobrinha": {
        ingredients: ["2 abobrinhas médias", "Tomate", "Alho", "Cebola", "Manjericão", "Azeite", "Sal"],
        instructions: ["Corte abobrinha em fatias finas", "Refogue alho e cebola", "Adicione tomate e temperos", "Misture com abobrinha", "Cozinhe por 5 min"],
        prep_time: 15,
        cook_time: 10,
        servings: 2
      },
      "sopa de lentilhas": {
        ingredients: ["1 xícara de lentilhas", "Cenoura", "Aipo", "Cebola", "Alho", "Caldo de legumes", "Temperos"],
        instructions: ["Refogue cebola e alho", "Adicione cenoura e aipo", "Junte lentilhas e caldo", "Cozinhe por 25 min", "Tempere a gosto"],
        prep_time: 10,
        cook_time: 30,
        servings: 4
      },
      "stir-fry": {
        ingredients: ["200g tofu", "Brócolis", "Pimentão", "Cenoura", "Molho shoyu", "Gengibre", "Alho", "Óleo de gergelim", "Arroz"],
        instructions: ["Corte tofu em cubos", "Refogue alho e gengibre", "Adicione tofu e doure", "Junte vegetais", "Tempere com shoyu", "Sirva com arroz"],
        prep_time: 15,
        cook_time: 12,
        servings: 2
      },
      "buddha bowl": {
        ingredients: ["Quinoa", "Grão-de-bico", "Abacate", "Cenoura roxa", "Couve", "Sementes", "Tahine", "Limão"],
        instructions: ["Cozinhe quinoa", "Asse grão-de-bico temperado", "Massageie couve com limão", "Monte bowl com todos ingredientes", "Finalize com tahine"],
        prep_time: 20,
        cook_time: 25,
        servings: 2
      },
      "risotto": {
        ingredients: ["1 xícara de arroz arbóreo", "Cogumelos", "Cebola", "Vinho branco", "Caldo de legumes", "Queijo parmesão", "Manteiga"],
        instructions: ["Refogue cebola", "Adicione arroz e toste", "Junte vinho", "Adicione caldo aos poucos", "Finalize com queijo"],
        prep_time: 10,
        cook_time: 25,
        servings: 4
      },

      // Snacks
      "mix de castanhas": {
        ingredients: ["Castanha do Pará", "Amêndoas", "Nozes", "Frutas secas", "Mel"],
        instructions: ["Misture todas as castanhas", "Adicione frutas secas", "Regue com mel", "Armazene em recipiente hermético"],
        prep_time: 5,
        cook_time: 0,
        servings: 4
      },
      "chips de banana": {
        ingredients: ["2 bananas", "Canela", "Açúcar de coco"],
        instructions: ["Corte bananas em fatias finas", "Polvilhe canela e açúcar", "Asse a 150°C por 2 horas", "Vire na metade do tempo"],
        prep_time: 10,
        cook_time: 120,
        servings: 2
      }
    };

    // Advanced matching system
    const mealNameLower = mealName.toLowerCase();
    let selectedTemplate = recipeTemplates["smoothie"]; // default

    // More comprehensive matching
    if (mealNameLower.includes("aveia")) {
      selectedTemplate = recipeTemplates["aveia"];
    } else if (mealNameLower.includes("smoothie") || mealNameLower.includes("vitamina")) {
      selectedTemplate = recipeTemplates["smoothie"];
    } else if (mealNameLower.includes("panqueca")) {
      selectedTemplate = recipeTemplates["panqueca"];
    } else if (mealNameLower.includes("torrada")) {
      selectedTemplate = recipeTemplates["torrada"];
    } else if (mealNameLower.includes("omelete")) {
      selectedTemplate = recipeTemplates["omelete"];
    } else if (mealNameLower.includes("iogurte")) {
      selectedTemplate = recipeTemplates["iogurte"];
    } else if (mealNameLower.includes("quinoa") && mealNameLower.includes("legumes")) {
      selectedTemplate = recipeTemplates["quinoa com legumes"];
    } else if (mealNameLower.includes("bowl") && mealNameLower.includes("quinoa")) {
      selectedTemplate = recipeTemplates["bowl de quinoa"];
    } else if (mealNameLower.includes("salada") && mealNameLower.includes("lentilhas")) {
      selectedTemplate = recipeTemplates["salada de lentilhas"];
    } else if (mealNameLower.includes("hambúrguer") && mealNameLower.includes("feijão")) {
      selectedTemplate = recipeTemplates["hambúrguer de feijão"];
    } else if (mealNameLower.includes("frango")) {
      selectedTemplate = recipeTemplates["frango grelhado"];
    } else if (mealNameLower.includes("salmão") || mealNameLower.includes("peixe")) {
      selectedTemplate = recipeTemplates["salmão"];
    } else if (mealNameLower.includes("wrap")) {
      selectedTemplate = recipeTemplates["wrap"];
    } else if (mealNameLower.includes("curry")) {
      selectedTemplate = recipeTemplates["curry de grão-de-bico"];
    } else if (mealNameLower.includes("macarrão") && mealNameLower.includes("abobrinha")) {
      selectedTemplate = recipeTemplates["macarrão de abobrinha"];
    } else if (mealNameLower.includes("sopa") && mealNameLower.includes("lentilhas")) {
      selectedTemplate = recipeTemplates["sopa de lentilhas"];
    } else if (mealNameLower.includes("stir-fry") || mealNameLower.includes("refogado")) {
      selectedTemplate = recipeTemplates["stir-fry"];
    } else if (mealNameLower.includes("buddha")) {
      selectedTemplate = recipeTemplates["buddha bowl"];
    } else if (mealNameLower.includes("risotto")) {
      selectedTemplate = recipeTemplates["risotto"];
    } else if (mealNameLower.includes("mix") && mealNameLower.includes("castanhas")) {
      selectedTemplate = recipeTemplates["mix de castanhas"];
    } else if (mealNameLower.includes("chips") && mealNameLower.includes("banana")) {
      selectedTemplate = recipeTemplates["chips de banana"];
    } else if (mealNameLower.includes("quinoa")) {
      selectedTemplate = recipeTemplates["quinoa com legumes"];
    }

    return {
      id,
      meal_name: mealName,
      ingredients: selectedTemplate.ingredients,
      instructions: selectedTemplate.instructions,
      prep_time: selectedTemplate.prep_time,
      cook_time: selectedTemplate.cook_time,
      servings: selectedTemplate.servings
    };
  };

  const isSelected = (value: string) => {
    const currentValue = formData[currentQuestion.id as keyof QuestionnaireData];
    if (currentQuestion.type === "single") {
      return currentValue === value;
    } else {
      return Array.isArray(currentValue) && currentValue.includes(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-primary border-0 text-primary-foreground px-6 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Questionário IA
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Vamos criar seu cardápio ideal
          </h1>
          <p className="text-muted-foreground text-lg">
            Passo {currentStep + 1} de {questions.length}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="bg-gradient-card p-8 border border-border/50 shadow-premium backdrop-blur-sm">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4 shadow-glow">
              {currentQuestion.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentQuestion.title}</h2>
              <p className="text-muted-foreground">{currentQuestion.subtitle}</p>
            </div>
          </div>

          {/* Options */}
          {currentQuestion.type === "date" ? (
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div>
                <label className="text-sm font-medium mb-2 block">Dia</label>
                <Select onValueChange={(value) => handleDateSelect("dia", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Mês</label>
                <Select onValueChange={(value) => handleDateSelect("mes", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                    ].map((mes, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {mes}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Ano</label>
                <Select onValueChange={(value) => handleDateSelect("ano", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 80 }, (_, i) => (
                      <SelectItem key={2024 - i} value={(2024 - i).toString()}>
                        {2024 - i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected(option.value)
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-border/50 hover:border-primary/50 bg-background/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{option.label}</h3>
                      {option.desc && (
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      )}
                    </div>
                    {isSelected(option.value) && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <div className="text-sm text-muted-foreground">
              {currentStep + 1} / {questions.length}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-primary hover:shadow-glow px-6"
            >
              {currentStep === questions.length - 1 ? "Gerar Cardápio" : "Próximo"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
      
      <AuthModal isOpen={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Questionnaire;
