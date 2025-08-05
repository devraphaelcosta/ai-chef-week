import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Zap, Sparkles } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "29",
      period: "/mês",
      description: "Perfeito para começar sua jornada",
      badge: null,
      features: [
        "Questionário IA personalizado",
        "Cardápio de 7 dias",
        "Lista de compras automática",
        "5 substituições por semana",
        "Receitas detalhadas",
        "Suporte por email"
      ],
      buttonText: "Começar Agora",
      buttonVariant: "outline" as const
    },
    {
      name: "Premium",
      price: "59",
      period: "/mês",
      description: "Máxima personalização e flexibilidade",
      badge: "Mais Popular",
      features: [
        "Tudo do Starter",
        "Substituições ilimitadas",
        "Cardápios para 30 dias",
        "Análise nutricional completa",
        "Integração com apps fitness",
        "Chat IA 24/7",
        "Receitas exclusivas",
        "Planejamento de refeições"
      ],
      buttonText: "Upgrade Premium",
      buttonVariant: "premium" as const
    },
    {
      name: "Executive",
      price: "149",
      period: "/mês",
      description: "Solução completa para alta performance",
      badge: "VIP",
      features: [
        "Tudo do Premium",
        "Nutricionista pessoal IA",
        "Cardápios para toda família",
        "Entrega de ingredientes*",
        "Consultoria nutricional",
        "Relatórios executivos",
        "API para integração",
        "Suporte prioritário 24/7"
      ],
      buttonText: "Solicitar Demo",
      buttonVariant: "default" as const
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-secondary/10 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
            <Crown className="w-4 h-4 mr-2" />
            Planos Premium
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Invista no seu bem-estar
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Soluções premium para pessoas que valorizam tempo, saúde e resultados excepcionais.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`relative bg-gradient-card p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                plan.badge === "Mais Popular" 
                  ? "border-primary/50 shadow-premium" 
                  : "border-border/50 shadow-card"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className={`px-4 py-1 ${
                    plan.badge === "Mais Popular" 
                      ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                      : "bg-accent text-accent-foreground"
                  }`}>
                    {plan.badge === "VIP" && <Crown className="w-3 h-3 mr-1" />}
                    {plan.badge === "Mais Popular" && <Sparkles className="w-3 h-3 mr-1" />}
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold">R$ {plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.buttonVariant}
                className="w-full py-6 text-lg font-semibold"
              >
                {plan.buttonVariant === "premium" && <Zap className="w-5 h-5 mr-2" />}
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            *Entrega disponível apenas em São Paulo e Rio de Janeiro
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Todos os planos incluem garantia de satisfação de 30 dias
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;