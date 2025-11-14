import { Link } from "react-router-dom";
import { Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Sipiteno</h3>
            <p className="text-white/80 mb-4">
              Strategic Business Development in Eastern European Tech Markets
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-secondary transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors" aria-label="Twitter">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("services")}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("projects")}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Projects
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-white/80 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/80 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 text-center text-white/70">
          <p>&copy; 2024 Sipiteno. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
