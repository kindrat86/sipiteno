import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Markets from "@/components/Markets";
import MvpShowcase from "@/components/MvpShowcase";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Services />
        <WhyChooseUs />
        <MvpShowcase />
        <Markets />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;