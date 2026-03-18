import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };
  
  const navItems = [
    {
      label: "Home",
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      description: "Return to homepage"
    },
    {
      label: "Services",
      action: () => scrollToSection("services"),
      description: "View our business development and consulting services"
    },
    {
      label: "Why Us",
      action: () => scrollToSection("why-choose-us"),
      description: "Learn why companies choose Sipiteno"
    },
    {
      label: "Markets",
      action: () => scrollToSection("markets"),
      description: "See the 28 countries we serve"
    },
    {
      label: "Blog",
      action: () => { setIsMenuOpen(false); navigate("/blog"); },
      description: "Insights and guides"
    },
    {
      label: "FAQ",
      action: () => scrollToSection("faq"),
      description: "Frequently asked questions"
    },
    {
      label: "Contact",
      action: () => scrollToSection("contact"),
      description: "Get in touch with our team"
    }
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary" aria-label="Sipiteno - Home">
            SIPITENO
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8" role="menubar">
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
                role="menuitem"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border" role="menu">
            <div className="flex flex-col gap-4">
              {navItems.map(item => (
                <button 
                  key={item.label} 
                  onClick={item.action} 
                  className="text-foreground hover:text-primary transition-colors font-medium text-left cursor-pointer"
                  role="menuitem"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;