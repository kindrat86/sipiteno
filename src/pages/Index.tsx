import { useEffect, lazy, Suspense, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { organizationSchema, servicesSchema, faqSchema } from "@/lib/seo/schemas";

const EpiphanyBridge = lazy(() => import("@/components/EpiphanyBridge"));
const NewOpportunity = lazy(() => import("@/components/NewOpportunity"));
const WhyChooseUs = lazy(() => import("@/components/WhyChooseUs"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const LeadMagnet = lazy(() => import("@/components/LeadMagnet"));
const ValueLadder = lazy(() => import("@/components/ValueLadder"));
const OrderBump = lazy(() => import("@/components/OrderBump"));
const MassMovement = lazy(() => import("@/components/MassMovement"));
const Markets = lazy(() => import("@/components/Markets"));
const ThreeSecrets = lazy(() => import("@/components/ThreeSecrets"));
const HookStoryOffer = lazy(() => import("@/components/HookStoryOffer"));
const Dream100 = lazy(() => import("@/components/Dream100"));

const Index = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const initialised = useRef(false);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  const localizedUrl = lang === "en" ? "https://sipiteno.com/" : `https://sipiteno.com/${lang}`;

  return (
    <div className="min-h-screen">
      <SEOHead
        title={`Sipiteno | Expand Your Tech Business Into 28 Emerging Markets - ${lang.toUpperCase()}`}
        description="Your product isn't the problem — your expansion system is. Sipiteno opens doors in Eastern Europe, the Caucasus, and Central Asia: introductions, regulatory maps, and local teams that ship in 4-8 weeks. Free 47-page playbook."
        url={localizedUrl}
        ogImage="https://sipiteno.com/og-image.png"
        schemas={[organizationSchema, servicesSchema, faqSchema]}
      />
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Suspense fallback={null}><MassMovement /></Suspense>
        <Suspense fallback={null}><Testimonials /></Suspense>
        <Suspense fallback={null}><EpiphanyBridge /></Suspense>
        <Suspense fallback={null}><ThreeSecrets /></Suspense>
        <Suspense fallback={null}><NewOpportunity /></Suspense>
        <Suspense fallback={null}><Dream100 /></Suspense>
        <Suspense fallback={null}><ValueLadder /></Suspense>
        <Services />
        <Suspense fallback={null}><HookStoryOffer /></Suspense>
        <Suspense fallback={null}><LeadMagnet /></Suspense>
        <Suspense fallback={null}><WhyChooseUs /></Suspense>
        <Suspense fallback={null}><OrderBump /></Suspense>
        <Suspense fallback={null}><Markets /></Suspense>
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
