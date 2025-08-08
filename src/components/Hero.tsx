import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, ShoppingCart, Brain } from "lucide-react";
import heroImage from "@/assets/weekfit-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      
      <div className="pt-[80px]"> {/* tamanho do header */}
      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <Badge className="mb-6 bg-gradient-primary border-0 text-primary-foreground px-6 py-2 text-sm font-medium shadow-glow">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by AI
          </Badge>
          
          {/* Main heading */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {/*<Brain className="w-20 h-20 md:w-32 md:h-32 text-primary" />*/}
           <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[hsl(var(--brand-heading))] via-primary-glow to-accent bg-clip-text text-transparent leading-tight">
          WeekFit
          </h1>
          </div>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            <span className="text-accent font-semibold">🍽️ Cardápio da Semana</span> + 
            <span className="text-primary-glow font-semibold">🗒️ Lista de Compras</span> + 
            <span className="text-accent font-semibold">🥣 Receitas</span>
          </p>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            IA personalizada que cria seu cardápio ideal, gera lista de compras automaticamente 
            e adapta às suas necessidades. <span className="text-accent font-medium">Economize tempo e dinheiro</span> com inteligência.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={() => window.location.href = '/questionario'}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg font-semibold transform hover:scale-105"
            >
              <Brain className="w-5 h-5 mr-2" />
              Começar Questionário
            </Button>
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-6 text-lg">
              Ver Como Funciona
            </Button>
          </div>
          
          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-9">
            <div className="bg-gradient-card p-6 rounded-2xl border border-border/50 shadow-card backdrop-blur-sm">
              <Calendar className="w-8 h-8 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Cardápio Inteligente</h3>
              <p className="text-muted-foreground text-sm">IA personaliza baseado em seus objetivos e restrições</p>
            </div>
            
            <div className="bg-gradient-card p-6 rounded-2xl border border-border/50 shadow-card backdrop-blur-sm">
              <ShoppingCart className="w-8 h-8 text-accent mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Lista Automática</h3>
              <p className="text-muted-foreground text-sm">Compras organizadas por categoria no mercado</p>
            </div>
            
            <div className="bg-gradient-card p-6 rounded-2xl border border-border/50 shadow-card backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-primary-glow mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Substituições Smart</h3>
              <p className="text-muted-foreground text-sm">Não gosta? A IA sugere alternativas perfeitas</p>
            </div>
          </div>
        </div>
      </div>

      </div>
      
    </section>
  );
};

export default Hero;