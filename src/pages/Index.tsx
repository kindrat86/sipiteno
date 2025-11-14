import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Markets from "@/components/Markets";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
const Index = () => {
  return <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Services />
        <Markets />
        <Contact />
      </main>
      <Footer />
    </div>;
};
export default Index;