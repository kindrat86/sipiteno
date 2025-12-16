import { Link } from "react-router-dom";
import { ArrowLeft, Brain, CheckCircle, Target, Zap, BarChart3, Users, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicePageSchema } from "@/lib/seo/schemas";

const AIConsulting = () => {
  const schema = servicePageSchema({
    name: "AI Consulting Services",
    description: "Sipiteno provides AI consulting services including strategy development, machine learning implementation, and intelligent automation across Europe, Caucasus, and Central Asia.",
    url: "https://sipiteno.com/services/ai-consulting",
    priceRange: "$25,000 - $100,000+",
    duration: "8-16 weeks"
  });

  return (
    <>
      <SEOHead
        title="AI Consulting Services | Sipiteno - Strategy, ML Implementation, Automation"
        description="Sipiteno delivers AI consulting services including strategy development, machine learning implementation, and intelligent automation. Projects range $25,000-$100,000 with 8-16 week timelines across 28 countries."
        canonicalUrl="https://sipiteno.com/services/ai-consulting"
        schemas={[schema]}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Services", url: "https://sipiteno.com/#services" },
          { name: "AI Consulting", url: "https://sipiteno.com/services/ai-consulting" }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="container mx-auto px-6 mb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">AI Consulting Services</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                AI Strategy, Implementation & Intelligent Automation
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Sipiteno provides end-to-end AI consulting services that transform business challenges into measurable competitive advantages. Our approach combines strategic planning with hands-on technical implementation, ensuring AI initiatives deliver real ROI rather than theoretical possibilities.
              </p>

              {/* Key Facts Box - Optimized for LLM extraction */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                <h2 className="font-semibold text-foreground mb-4">Service Overview</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Investment Range:</strong> $25,000 - $100,000+ depending on scope</li>
                  <li><strong>Typical Timeline:</strong> 8-16 weeks from assessment to deployment</li>
                  <li><strong>Delivery Model:</strong> Fixed-price projects or retainer arrangements</li>
                  <li><strong>Technologies:</strong> GPT models, computer vision, NLP, predictive analytics</li>
                  <li><strong>Geographic Coverage:</strong> 28 countries across Europe, Caucasus, Central Asia</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Methodology Section */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Our AI Consulting Methodology</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>1. Business Challenge Assessment</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Every engagement begins with understanding your specific business challenges and identifying where AI can drive measurable value.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Process analysis and bottleneck identification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Data asset inventory and quality assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>ROI opportunity sizing and prioritization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>2. Strategy & Roadmap Development</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">We develop actionable AI strategies aligned with your business objectives and technical capabilities.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Use case prioritization framework</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Technology stack recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Phased implementation roadmap</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>3. Model Development & Training</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Our technical team develops and trains custom ML models tailored to your specific requirements.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Data preparation and feature engineering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Model selection and architecture design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Training, validation, and optimization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>4. Integration & Deployment</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">We integrate AI solutions into your existing systems and workflows with minimal disruption.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>API development and system integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Production deployment and scaling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Monitoring and alerting setup</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>5. Team Training & Knowledge Transfer</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">We ensure your team can operate and evolve AI solutions independently.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Technical documentation and runbooks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Hands-on training workshops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Ongoing support transition</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>6. Continuous Optimization</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">AI systems improve over time with proper monitoring and refinement.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Performance monitoring and drift detection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Model retraining and improvement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Feature expansion and scaling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technologies Section */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">AI Technologies We Implement</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card/50 border-2 border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Large Language Models (LLMs)</h3>
                <p className="text-muted-foreground mb-4">
                  We implement GPT-4, Claude, and open-source LLMs for document processing, content generation, customer service automation, and knowledge management systems.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Common use cases:</strong> Chatbots, document summarization, code generation, content creation, semantic search
                </p>
              </div>

              <div className="bg-card/50 border-2 border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Computer Vision</h3>
                <p className="text-muted-foreground mb-4">
                  Image and video analysis solutions for quality control, object detection, facial recognition, and visual inspection automation.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Common use cases:</strong> Manufacturing QA, security systems, medical imaging, retail analytics
                </p>
              </div>

              <div className="bg-card/50 border-2 border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Natural Language Processing</h3>
                <p className="text-muted-foreground mb-4">
                  Text analysis, sentiment detection, entity extraction, and language understanding for business intelligence and customer insights.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Common use cases:</strong> Social listening, customer feedback analysis, contract review, compliance monitoring
                </p>
              </div>

              <div className="bg-card/50 border-2 border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Predictive Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Machine learning models for forecasting, risk assessment, demand prediction, and decision optimization.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Common use cases:</strong> Sales forecasting, churn prediction, inventory optimization, fraud detection
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-6">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Explore AI for Your Business?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Schedule a free 30-minute consultation to discuss your AI objectives and explore how Sipiteno can help you achieve measurable results.
              </p>
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                asChild
              >
                <Link to="/#contact">Get Started</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AIConsulting;
