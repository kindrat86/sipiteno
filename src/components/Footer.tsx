const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-6 py-8 text-center text-white">
        <p>&copy; {new Date().getFullYear()} Sipiteno. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
