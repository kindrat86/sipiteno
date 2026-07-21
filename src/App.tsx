import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import PostHogPageviewTracker from "@/components/PostHogPageviewTracker";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";

// Lazy load non-critical routes
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Service pages for LLM entity depth
const AIConsulting = lazy(() => import("./pages/services/AIConsulting"));
const BusinessDevelopment = lazy(() => import("./pages/services/BusinessDevelopment"));
const DigitalMarketing = lazy(() => import("./pages/services/DigitalMarketing"));
const ITConsulting = lazy(() => import("./pages/services/ITConsulting"));
const ProjectManagement = lazy(() => import("./pages/services/ProjectManagement"));
const SalesFunnel = lazy(() => import("./pages/services/SalesFunnel"));

// Case study pages
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));

// pSEO pages
const Locations = lazy(() => import("./pages/Locations"));
const LocationService = lazy(() => import("./pages/LocationService"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Methodology = lazy(() => import("@/pages/Methodology"));
const IndustriesPage = lazy(() => import("@/pages/Industries"));
const Glossary = lazy(() => import("@/pages/Glossary"));
const Alternatives = lazy(() => import("@/pages/Alternatives"));

// About / story page
const About = lazy(() => import("./pages/About"));

// Contact page
const Contact = lazy(() => import("./pages/Contact"));

// Admin pages
const BlogGenerator = lazy(() => import("./pages/admin/BlogGenerator"));
const ContactSubmissions = lazy(() => import("./pages/admin/ContactSubmissions"));
const Auth = lazy(() => import("./pages/Auth"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PostHogPageviewTracker />
        <CookieConsent />
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            {/* Locale-prefixed routes: /:locale/ + English routes below */}
            <Route path="/:locale">
              <Route index element={<Index />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="services/ai-consulting" element={<AIConsulting />} />
              <Route path="services/business-development" element={<BusinessDevelopment />} />
              <Route path="services/digital-marketing" element={<DigitalMarketing />} />
              <Route path="services/it-consulting" element={<ITConsulting />} />
              <Route path="services/project-management" element={<ProjectManagement />} />
              <Route path="services/sales-funnel" element={<SalesFunnel />} />
              <Route path="case-studies" element={<CaseStudies />} />
              <Route path="case-studies/:id" element={<CaseStudyDetail />} />
              <Route path="locations" element={<Locations />} />
              <Route path="locations/:country" element={<Locations />} />
              <Route path="locations/:country/:service" element={<LocationService />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="methodology" element={<Methodology />} />
              <Route path="industries" element={<IndustriesPage />} />
              <Route path="industries/:industry" element={<IndustriesPage />} />
              <Route path="glossary" element={<Glossary />} />
              <Route path="alternatives" element={<Alternatives />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* English (root) routes */}
            <Route path="/" element={<Index />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/services/ai-consulting" element={<AIConsulting />} />
            <Route path="/services/business-development" element={<BusinessDevelopment />} />
            <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
            <Route path="/services/it-consulting" element={<ITConsulting />} />
            <Route path="/services/project-management" element={<ProjectManagement />} />
            <Route path="/services/sales-funnel" element={<SalesFunnel />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:country" element={<Locations />} />
            <Route path="/locations/:country/:service" element={<LocationService />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/industries/:industry" element={<IndustriesPage />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/alternatives" element={<Alternatives />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/blog-generator" element={<BlogGenerator />} />
            <Route path="/admin/contact-submissions" element={<ContactSubmissions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
