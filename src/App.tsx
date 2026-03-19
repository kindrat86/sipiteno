import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import PostHogPageviewTracker from "@/components/PostHogPageviewTracker";
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
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* Service pages for LLM optimization */}
            <Route path="/services/ai-consulting" element={<AIConsulting />} />
            <Route path="/services/business-development" element={<BusinessDevelopment />} />
            <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
            <Route path="/services/it-consulting" element={<ITConsulting />} />
            <Route path="/services/project-management" element={<ProjectManagement />} />
            <Route path="/services/sales-funnel" element={<SalesFunnel />} />
            {/* Case study pages */}
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
            {/* Admin pages */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/blog-generator" element={<BlogGenerator />} />
            <Route path="/admin/contact-submissions" element={<ContactSubmissions />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
