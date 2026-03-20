const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-6 py-12 text-center text-white">
        <h3 className="text-2xl font-bold mb-6">Contact</h3>
        <a
          href="https://www.linkedin.com/company/34765968"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg text-white/80 hover:text-white transition-colors"
        >
          LinkedIn
        </a>
        <p className="mt-8">&copy; {new Date().getFullYear()} Sipiteno. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
