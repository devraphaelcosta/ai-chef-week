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
    <section id="pricing" className="py-32 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10 mx-auto px-6">
        <div className="text-center mb-20">
          <Badge className="mb-6 glass-effect text-accent px-6 py-2 text-sm font-semibold">
            <Crown className="w-4 h-4 mr-2" />
            Planos Premium
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            Invista no seu bem-estar
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Soluções premium para pessoas que valorizam tempo, saúde e resultados excepcionais.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`relative glass-card p-10 rounded-3xl transition-all duration-500 hover:scale-105 ${
                plan.badge === "Mais Popular" 
                  ? "shadow-premium ring-2 ring-primary/20" 
                  : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className={`px-6 py-2 text-xs font-bold ${
                    plan.badge === "Mais Popular" 
                      ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                      : "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-glow"
                  }`}>
                    {plan.badge === "VIP" && <Crown className="w-3 h-3 mr-1" />}
                    {plan.badge === "Mais Popular" && <Sparkles className="w-3 h-3 mr-1" />}
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold mb-3">{plan.name}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">R$ {plan.price}</span>
                  <span className="text-muted-foreground ml-2 text-lg">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-5 mb-10">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-accent mr-4 mt-1 flex-shrink-0" />
                    <span className="text-base leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.buttonVariant}
                className="w-full py-7 text-lg font-bold rounded-2xl"
              >
                {plan.buttonVariant === "premium" && <Zap className="w-5 h-5 mr-2" />}
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground text-lg mb-3">
            *Entrega disponível apenas em São Paulo e Rio de Janeiro
          </p>
          <p className="text-muted-foreground">
            Todos os planos incluem garantia de satisfação de 30 dias
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;