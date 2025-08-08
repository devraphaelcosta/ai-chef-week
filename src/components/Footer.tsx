import { Mail, Phone, MapPin, Instagram, Youtube, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import weekfitLogo from "@/assets/weekfit-logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-secondary/20 to-background border-t border-border/50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={weekfitLogo} 
                alt="WeekFit Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                WeekFit
              </span>
            </div>
            <p className="text-muted-foreground">
              Revolucionando a alimentação com inteligência artificial. Para pessoas que valorizam tempo, saúde e resultados.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h3 className="font-semibold mb-4">Produto</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Como Funciona</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Planos</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cardápios</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Receitas</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Status do Sistema</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Comunidade</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>contato@weekfit.com.br</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
{/* 
<div className="text-center py-12 border-t border-border/50">
  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
    Pronto para transformar sua alimentação?
  </h3>
  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
    Comece agora e receba seu cardápio personalizado em minutos
  </p>
  <Button 
    size="lg" 
    className="bg-gradient-primary hover:shadow-glow px-8 py-3 text-lg font-semibold"
    onClick={() => window.location.href = '/questionario'}
  >
    Criar Meu Cardápio Agora
  </Button>
</div>
*/}

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 WeekFit. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
            <a href="#" className="hover:text-foreground transition-colors">Termos</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;