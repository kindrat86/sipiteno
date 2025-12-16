import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

// Lazy load non-critical routes
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Service pages for LLM entity depth
const AIConsulting = lazy(() => import("./pages/services/AIConsulting"));
const MicroSaaSMVP = lazy(() => import("./pages/services/MicroSaaSMVP"));
const BusinessDevelopment = lazy(() => import("./pages/services/BusinessDevelopment"));

// Admin pages
const BlogGenerator = lazy(() => import("./pages/admin/BlogGenerator"));
const ContactSubmissions = lazy(() => import("./pages/admin/ContactSubmissions"));
const Auth = lazy(() => import("./pages/Auth"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* Service pages for LLM optimization */}
            <Route path="/services/ai-consulting" element={<AIConsulting />} />
            <Route path="/services/microsaas-mvp" element={<MicroSaaSMVP />} />
            <Route path="/services/business-development" element={<BusinessDevelopment />} />
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
);

export default App;
