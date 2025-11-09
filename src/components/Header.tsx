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
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              WeekFit
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
              Como Funciona
            </a>
            <a href="#pricing" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
              Planos
            </a>
            <a href="#contact" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
              Contato
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = '/dashboard'}
                  className="rounded-full"
                  title="Meu Perfil"
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button variant="outline" onClick={signOut} className="rounded-full">
                  Sair
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setShowAuthModal(true)}
                className="rounded-full"
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
          <div className="md:hidden py-6 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
                Como Funciona
              </a>
              <a href="#pricing" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
                Planos
              </a>
              <a href="#contact" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
                Contato
              </a>
              <div className="flex flex-col space-y-3 pt-4">
                <ThemeToggle />
                {user ? (
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => window.location.href = '/dashboard'}
                      className="w-full justify-start rounded-xl"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Meu Perfil
                    </Button>
                    <Button variant="outline" onClick={signOut} className="w-full justify-start rounded-xl">
                      Sair
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAuthModal(true)}
                    className="w-full justify-start rounded-xl"
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