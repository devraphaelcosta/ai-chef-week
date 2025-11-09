import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, ShoppingCart, Brain } from "lucide-react";
import heroImage from "@/assets/weekfit-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="pt-[80px]">
      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge with glass effect */}
          <Badge className="mb-8 glass-effect text-primary px-6 py-2 text-sm font-semibold">
            <Sparkles className="w-4 h-4 mr-2" />
            Inteligência Artificial Personalizada
          </Badge>
          
          {/* Main heading */}
          <div className="flex items-center justify-center gap-6 mb-8">
           <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent leading-tight tracking-tight">
          WeekFit
          </h1>
          </div>
          
          {/* Subtitle with icons */}
          <p className="text-2xl md:text-3xl text-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            <span className="text-accent font-semibold">🍽️ Cardápio da Semana</span> + 
            <span className="text-primary-glow font-semibold"> 🗒️ Lista de Compras</span> + 
            <span className="text-accent font-semibold"> 🥣 Receitas</span>
          </p>
          
          {/* Description */}
          <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed">
            IA personalizada que cria seu cardápio ideal, gera lista de compras automaticamente 
            e adapta às suas necessidades. <span className="text-accent font-semibold">Economize tempo e dinheiro</span> com inteligência.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button 
              onClick={() => window.location.href = '/questionario'}
              variant="premium"
              className="px-10 py-7 text-lg font-semibold rounded-2xl"
            >
              <Brain className="w-5 h-5 mr-2" />
              Começar Questionário
            </Button>
            <Button variant="outline" className="px-10 py-7 text-lg rounded-2xl font-semibold">
              Ver Como Funciona
            </Button>
          </div>
          
          {/* Features grid with glass cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <Calendar className="w-10 h-10 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-bold mb-3">Cardápio Inteligente</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">IA personaliza baseado em seus objetivos e restrições</p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <ShoppingCart className="w-10 h-10 text-accent mb-4 mx-auto" />
              <h3 className="text-lg font-bold mb-3">Lista Automática</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Compras organizadas por categoria no mercado</p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <Sparkles className="w-10 h-10 text-primary-glow mb-4 mx-auto" />
              <h3 className="text-lg font-bold mb-3">Substituições Smart</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Não gosta? A IA sugere alternativas perfeitas</p>
            </div>
          </div>
        </div>
      </div>

      </div>
      
    </section>
  );
};

export default Hero;