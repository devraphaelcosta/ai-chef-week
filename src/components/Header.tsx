import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import AuthModal from "./AuthModal";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
           {/* <Brain className="w-8 h-8 text-primary" />*/}
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              WeekFit
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contato
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = '/dashboard'}
                  className="text-muted-foreground hover:text-foreground p-2 rounded-full"
                  title="Meu Perfil"
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button variant="ghost" onClick={signOut} className="text-muted-foreground">
                  Sair
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => setShowAuthModal(true)}
                className="text-muted-foreground"
              >
                Entrar
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Como Funciona
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Planos
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <ThemeToggle />
                {user ? (
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => window.location.href = '/dashboard'}
                      className="w-full justify-start"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Meu Perfil
                    </Button>
                    <Button variant="ghost" onClick={signOut} className="w-full justify-start">
                      Sair
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAuthModal(true)}
                    className="w-full justify-start"
                  >
                    Entrar
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      <AuthModal isOpen={showAuthModal} onOpenChange={setShowAuthModal} />
    </header>
  );
};

export default Header;