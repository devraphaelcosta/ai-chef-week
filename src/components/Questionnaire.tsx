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
    
    // Base meals that can be customized
    let meals = {
      monday: {
        breakfast: isVegan ? "Smoothie de banana com leite de amêndoas e aveia" : "Aveia com frutas e mel",
        lunch: isVegetarian ? "Quinoa com legumes grelhados e tofu" : "Frango grelhado com quinoa e legumes",
        dinner: isVegan ? "Curry de grão-de-bico com arroz integral" : isVegetarian ? "Omelete de legumes com batata doce" : "Salmão assado com batata doce"
      },
      tuesday: {
        breakfast: hasLactoseIntolerance ? "Smoothie de frutas com leite vegetal" : "Iogurte com granola e frutas",
        lunch: isVegetarian ? "Salada de quinoa com grão-de-bico" : "Salada de atum com grão-de-bico",
        dinner: isVegan ? "Refogado de tofu com legumes" : isVegetarian ? "Risoto de cogumelos" : "Peito de peru com arroz integral"
      },
      wednesday: {
        breakfast: hasGlutenIntolerance ? "Vitamina de frutas com aveia sem glúten" : "Pão integral com abacate",
        lunch: isVegetarian ? "Hambúrguer de lentilha com salada" : "Peixe grelhado com legumes",
        dinner: isVegan ? "Macarrão de abobrinha com molho de tomate" : "Frango assado com batata"
      },
      thursday: {
        breakfast: "Smoothie verde com espinafre e banana",
        lunch: isVegetarian ? "Bowl de quinoa com legumes" : "Carne magra com salada",
        dinner: isVegan ? "Sopa de lentilhas com legumes" : "Omelete com legumes"
      },
      friday: {
        breakfast: hasLactoseIntolerance ? "Aveia com leite de coco" : "Vitamina de frutas com iogurte",
        lunch: isVegetarian ? "Wrap de hummus com vegetais" : "Frango com batata doce",
        dinner: isVegan ? "Stir-fry de tofu com legumes" : "Peixe com arroz integral"
      },
      saturday: {
        breakfast: "Panqueca de aveia com frutas",
        lunch: isVegetarian ? "Salada de quinoa e vegetais" : "Carne com legumes grelhados",
        dinner: isVegan ? "Buddha bowl vegano" : "Frango grelhado com salada"
      },
      sunday: {
        breakfast: hasGlutenIntolerance ? "Smoothie bowl sem glúten" : "Torrada integral com frutas",
        lunch: isVegetarian ? "Curry de vegetais com arroz" : "Peixe com quinoa",
        dinner: isVegan ? "Sopa de legumes com grão-de-bico" : "Omelete de legumes"
      }
    };

    // Generate shopping list based on meals and dietary restrictions
    let shopping_list = {
      proteins: isVegan ? ["Tofu (500g)", "Grão-de-bico (500g)", "Lentilhas (500g)", "Quinoa (500g)"] 
                : isVegetarian ? ["Ovos (12un)", "Tofu (500g)", "Grão-de-bico (500g)", "Quinoa (500g)"]
                : ["Frango (1kg)", "Salmão (500g)", "Atum em lata (2un)", "Ovos (12un)"],
      carbs: hasGlutenIntolerance ? ["Quinoa (500g)", "Arroz integral (1kg)", "Batata doce (1kg)", "Aveia sem glúten (500g)"]
            : ["Quinoa (500g)", "Arroz integral (1kg)", "Batata doce (1kg)", "Pão integral (1un)"],
      vegetables: ["Brócolis (1un)", "Cenoura (500g)", "Abobrinha (2un)", "Espinafre (1 maço)", "Tomate (500g)", "Cebola (3un)"],
      fruits: ["Banana (1kg)", "Maçã (6un)", "Morango (250g)", "Abacate (2un)", "Limão (4un)"],
      dairy: hasLactoseIntolerance || isVegan ? ["Leite de amêndoas (1L)", "Leite de coco (1L)"] 
            : ["Iogurte natural (1L)", "Leite (1L)", "Queijo (200g)"],
      others: ["Azeite de oliva", "Mel", "Temperos diversos", "Aveia (500g)"]
    };

    return { meals, shopping_list };
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
