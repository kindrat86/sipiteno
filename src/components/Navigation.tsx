import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/sipiteno-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };
  const navItems = [{
    label: "Home",
    action: () => window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }, {
    label: "Services",
    action: () => scrollToSection("services")
  }, {
    label: "Markets",
    action: () => scrollToSection("markets")
  }, {
    label: "Contact",
    action: () => scrollToSection("contact")
  }];
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Sipiteno" className="h-8" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navItems.map(item => <button key={item.label} onClick={item.action} className="text-foreground hover:text-primary transition-colors font-medium text-left">
                  {item.label}
                </button>)}
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navigation;