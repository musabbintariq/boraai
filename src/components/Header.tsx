import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (elementId: string) => {
    document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Clean and minimal */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-transparent rounded-xl flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5" style={{ color: 'hsl(45 93% 58%)' }} />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-wide font-serif">Bora AI</span>
          </div>

          {/* Navigation - Clean spacing */}
          <nav className="hidden md:flex items-center gap-10">
            <a 
              href="#features" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-normal"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('features');
              }}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-normal"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('how-it-works');
              }}
            >
              How It Works
            </a>
            <a 
              href="#pricing" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-normal"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('pricing');
              }}
            >
              Pricing
            </a>
          </nav>

          {/* CTA Buttons - Lovable style */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="font-medium" onClick={() => navigate('/auth')}>Sign In</Button>
            <Button variant="default" className="font-semibold shadow-soft rounded-xl" onClick={() => navigate('/auth')}>Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" style={{ color: 'hsl(45 93% 58%)' }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: 'hsl(45 93% 58%)' }} />
            )}
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/30 shadow-lg z-50">
            <div className="px-6 py-4 space-y-4">
              <a 
                href="#features" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-normal py-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('features');
                }}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-normal py-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('how-it-works');
                }}
              >
                How It Works
              </a>
              <a 
                href="#pricing" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-normal py-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('pricing');
                }}
              >
                Pricing
              </a>
              <div className="pt-4 space-y-3 border-t border-border/30">
                <Button variant="ghost" className="w-full font-medium" onClick={() => navigate('/auth')}>Sign In</Button>
                <Button variant="default" className="w-full font-semibold shadow-soft rounded-xl" onClick={() => navigate('/auth')}>Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;