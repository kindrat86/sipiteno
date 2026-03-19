import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">Sipiteno</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Strategic business development and technology consulting across 28 countries in Europe, Caucasus, and Central Asia. Founded in 2009.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/services/ai-consulting" className="hover:text-white transition-colors">
                  AI Consulting
                </Link>
              </li>
              <li>
                <Link to="/services/business-development" className="hover:text-white transition-colors">
                  Business Development B2B
                </Link>
              </li>
              <li>
                <Link to="/#services" className="hover:text-white transition-colors">
                  IT Consulting
                </Link>
              </li>
              <li>
                <Link to="/#services" className="hover:text-white transition-colors">
                  MicroSaaS MVP Development
                </Link>
              </li>
              <li>
                <Link to="/#services" className="hover:text-white transition-colors">
                  Digital Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/#why-choose-us" className="hover:text-white transition-colors">
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link to="/#markets" className="hover:text-white transition-colors">
                  Markets
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="mailto:sales@sipiteno.com" className="hover:text-white transition-colors">
                  sales@sipiteno.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/sipiteno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
            <h4 className="font-semibold mt-6 mb-2">Legal</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Sipiteno. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
