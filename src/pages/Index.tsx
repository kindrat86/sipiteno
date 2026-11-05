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
import ReadingProgressBar from "@/components/ReadingProgressBar";
import BackToTop from "@/components/BackToTop";
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
        description="Your product isn't the problem — your expansion system is. Sipiteno opens doors in Eastern Europe, the Caucasus, and Central Asia: introductions, regulatory maps, and local teams that ship in 4-8 weeks. Free 14-page playbook."
        url={localizedUrl}
        ogImage="https://sipiteno.com/og-image.png"
        schemas={[organizationSchema, servicesSchema, faqSchema]}
      />
      <Navigation />
      <ReadingProgressBar />
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
        <section className="py-10 border-t border-border/40">
          <div className="container mx-auto max-w-4xl text-center px-4">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25">
              <span className="text-amber-400 font-semibold text-xs md:text-sm tracking-wide uppercase">Shopify deadlines: Nov 12 &amp; 20, 2026</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Running a Shopify store or app?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              AI shopping agents now answer from the facts your store publishes. Our agent-readiness audit checks all 12 points, from &euro;149. Apps calling the Admin API need an IP allowlist by 20 November.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/shopify-agent-ready" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                AI agent-readiness audit
              </a>
              <a href="/shopify-ip-allowlist" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground hover:bg-accent transition-colors">
                IP Allowlist Rescue for apps
              </a>
            </div>
          </div>
        </section>
        <Suspense fallback={null}><HookStoryOffer /></Suspense>
        <Suspense fallback={null}><LeadMagnet /></Suspense>
        <Suspense fallback={null}><WhyChooseUs /></Suspense>
        <Suspense fallback={null}><OrderBump /></Suspense>
        <Suspense fallback={null}><Markets /></Suspense>
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
