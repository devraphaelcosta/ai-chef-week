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
    <section className="py-24 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
            <Sparkles className="w-4 h-4 mr-2" />
            O Diferencial WeekFit
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            IA que revoluciona sua alimentação
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tecnologia premium para resultados extraordinários. Perfeito para quem valoriza tempo, saúde e qualidade.
          </p>
        </div>

        {/* Main features grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Questionário IA */}
          <div className="bg-gradient-card p-8 rounded-3xl border border-border/50 shadow-premium backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4 shadow-glow">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Questionário Inteligente</h3>
            </div>
            <p className="text-muted-foreground mb-6 text-lg">
              Nossa IA analisa seus objetivos, restrições alimentares, orçamento e tempo disponível para criar o cardápio perfeito.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-accent mr-3" />
                <span>Objetivos: emagrecimento, bulking, manutenção</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-accent mr-3" />
                <span>Restrições: sem lactose, vegetariano, vegano</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-accent mr-3" />
                <span>Preferências: barato, rápido, gourmet</span>
              </div>
            </div>
          </div>

          {/* Lista automatizada */}
          <div className="bg-gradient-card p-8 rounded-3xl border border-border/50 shadow-premium backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent/80 rounded-xl flex items-center justify-center mr-4">
                <Zap className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Lista de Compras Automática</h3>
            </div>
            <p className="text-muted-foreground mb-6 text-lg">
              Ingredientes organizados por seção do mercado, com quantidades exatas e substituições inteligentes.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-primary mr-3" />
                <span>Organizada por corredor do mercado</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-primary mr-3" />
                <span>Quantidades precisas para a semana</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-primary mr-3" />
                <span>Evita desperdício e economiza dinheiro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-xl font-bold mb-3">Substituições Inteligentes</h4>
            <p className="text-muted-foreground">
              Não gosta de frango? A IA sugere peixe, tofu ou outras proteínas que se encaixam no seu plano.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-accent" />
            </div>
            <h4 className="text-xl font-bold mb-3">Economia de Tempo</h4>
            <p className="text-muted-foreground">
              Acabe com horas perdidas planejando refeições. Tudo pronto em minutos com qualidade profissional.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-glow/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-primary-glow" />
            </div>
            <h4 className="text-xl font-bold mb-3">Controle Financeiro</h4>
            <p className="text-muted-foreground">
              Compre apenas o necessário, reduza desperdício e mantenha orçamento sob controle.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="bg-gradient-premium hover:shadow-glow transition-all duration-300 px-10 py-6 text-lg font-semibold transform hover:scale-105">
            <Target className="w-5 h-5 mr-2" />
            Criar Meu Cardápio Agora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;