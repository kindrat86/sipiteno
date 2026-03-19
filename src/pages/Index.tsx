import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Markets from "@/components/Markets";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { organizationSchema, servicesSchema, faqSchema } from "@/lib/seo/schemas";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Sipiteno - Strategic Business Development & AI Consulting | Europe, Caucasus, Central Asia"
        description="Sipiteno provides expert business development, AI consulting, IT solutions, and MicroSaaS MVP development across 28 countries. 15+ years experience, 50+ successful projects."
        canonicalUrl="https://sipiteno.com/"
        schemas={[organizationSchema, servicesSchema, faqSchema]}
      />
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Services />
        <WhyChooseUs />
        <Markets />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;