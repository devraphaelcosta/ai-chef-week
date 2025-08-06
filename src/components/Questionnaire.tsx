import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Clock, 
  DollarSign, 
  ChefHat, 
  Heart,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuestionnaireData {
  objetivo: string;
  restricoes: string[];
  orcamento: string;
  tempo: string;
  experiencia: string;
  preferencias: string[];
  refeicoes: string[];
}

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuestionnaireData>({
    objetivo: "",
    restricoes: [],
    orcamento: "",
    tempo: "",
    experiencia: "",
    preferencias: [],
    refeicoes: []
  });
  const { toast } = useToast();

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

  const canProceed = () => {
    const currentValue = formData[currentQuestion.id as keyof QuestionnaireData];
    if (currentQuestion.type === "single") {
      return currentValue !== "";
    } else {
      return Array.isArray(currentValue) && currentValue.length > 0;
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Questionário finalizado
      generateMenu();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateMenu = () => {
    toast({
      title: "🎉 Questionário Concluído!",
      description: "Sua IA está criando o cardápio perfeito... Em breve você receberá por email!",
    });
    
    // Aqui conectaria com a API para gerar o cardápio
    console.log("Dados do questionário:", formData);
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
    </div>
  );
};

export default Questionnaire;