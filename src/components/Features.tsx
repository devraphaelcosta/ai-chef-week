import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Zap, 
  Target, 
  RefreshCw, 
  Clock, 
  DollarSign,
  CheckCircle,
  Sparkles
} from "lucide-react";

const Features = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10 mx-auto px-6">
        <div className="text-center mb-20">
          <Badge className="mb-6 glass-effect text-accent px-6 py-2 text-sm font-semibold">
            <Sparkles className="w-4 h-4 mr-2" />
            O Diferencial WeekFit
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            IA que revoluciona sua alimentação
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Tecnologia premium para resultados extraordinários. Perfeito para quem valoriza tempo, saúde e qualidade.
          </p>
        </div>

        {/* Main features grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          {/* Questionário IA */}
          <div className="glass-card p-10 rounded-3xl hover:shadow-premium hover:scale-[1.02] transition-all duration-500">
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mr-5 shadow-glow">
                <Brain className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-3xl font-bold">Questionário Inteligente</h3>
            </div>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Nossa IA analisa seus objetivos, restrições alimentares, orçamento e tempo disponível para criar o cardápio perfeito.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-base">
                <CheckCircle className="w-5 h-5 text-accent mr-4" />
                <span>Objetivos: emagrecimento, bulking, manutenção</span>
              </div>
              <div className="flex items-center text-base">
                <CheckCircle className="w-5 h-5 text-accent mr-4" />
                <span>Restrições: sem lactose, vegetariano, vegano</span>
              </div>
              <div className="flex items-center text-base">
                <CheckCircle className="w-5 h-5 text-accent mr-4" />
                <span>Preferências: barato, rápido, gourmet</span>
              </div>
            </div>
          </div>

          {/* Lista automatizada */}
          <div className="glass-card p-10 rounded-3xl hover:shadow-premium hover:scale-[1.02] transition-all duration-500">
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-r from-accent to-accent/80 rounded-2xl flex items-center justify-center mr-5 shadow-glow">
                <Zap className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-3xl font-bold">Lista de Compras Automática</h3>
            </div>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Ingredientes organizados por seção do mercado, com quantidades exatas e substituições inteligentes.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-base">
                <CheckCircle className="w-5 h-5 text-primary mr-4" />
                <span>Organizada por corredor do mercado</span>
              </div>
              <div className="flex items-center text-base">
                <CheckCircle className="w-5 h-5 text-primary mr-4" />
                <span>Quantidades precisas para a semana</span>
              </div>
              <div className="flex items-center text-base">
                <CheckCircle className="w-5 h-5 text-primary mr-4" />
                <span>Evita desperdício e economiza dinheiro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-8 glass-card rounded-3xl hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-10 h-10 text-primary" />
            </div>
            <h4 className="text-2xl font-bold mb-4">Substituições Inteligentes</h4>
            <p className="text-muted-foreground leading-relaxed">
              Não gosta de frango? A IA sugere peixe, tofu ou outras proteínas que se encaixam no seu plano.
            </p>
          </div>

          <div className="text-center p-8 glass-card rounded-3xl hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-accent" />
            </div>
            <h4 className="text-2xl font-bold mb-4">Economia de Tempo</h4>
            <p className="text-muted-foreground leading-relaxed">
              Acabe com horas perdidas planejando refeições. Tudo pronto em minutos com qualidade profissional.
            </p>
          </div>

          <div className="text-center p-8 glass-card rounded-3xl hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-primary-glow/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-10 h-10 text-primary-glow" />
            </div>
            <h4 className="text-2xl font-bold mb-4">Controle Financeiro</h4>
            <p className="text-muted-foreground leading-relaxed">
              Compre apenas o necessário, reduza desperdício e mantenha orçamento sob controle.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={() => window.location.href = '/questionario'}
            variant="premium"
            className="px-12 py-7 text-xl font-bold rounded-2xl"
          >
            <Target className="w-6 h-6 mr-2" />
            Criar Meu Cardápio Agora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;