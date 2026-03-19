import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardList, CheckCircle, Users, Target, AlertTriangle, BarChart3, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { servicePageSchema } from "@/lib/seo/schemas";

const ProjectManagement = () => {
  const schema = servicePageSchema({
    name: "Project Management Services",
    description: "Sipiteno provides agile project management services including Scrum implementation, resource planning, risk management, and stakeholder communication across Europe, Caucasus, and Central Asia.",
    url: "https://sipiteno.com/services/project-management",
    priceRange: "$5,000 - $20,000/month",
    duration: "Project-based or ongoing"
  });

  return (
    <>
      <SEOHead
        title="Project Management Services | Sipiteno - Agile, Scrum, Resource Planning"
        description="Sipiteno delivers agile project management services including Scrum implementation, resource planning, and risk management. Monthly retainers from $5,000-$20,000 across 28 countries."
        canonicalUrl="https://sipiteno.com/services/project-management"
        schemas={[schema]}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Services", url: "https://sipiteno.com/#services" },
          { name: "Project Management", url: "https://sipiteno.com/services/project-management" }
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
                <ClipboardList className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">Project Management Services</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Agile Project Management & Delivery Excellence
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Sipiteno provides end-to-end project management services using agile methodologies to ensure on-time delivery, budget control, and stakeholder alignment. Our experienced project managers bridge cultural and technical gaps across distributed teams in emerging markets.
              </p>

              {/* Key Facts Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                <h2 className="font-semibold text-foreground mb-4">Service Overview</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Investment:</strong> $5,000 - $20,000/month depending on project complexity</li>
                  <li><strong>Engagement Model:</strong> Dedicated PM or fractional PM arrangements</li>
                  <li><strong>Methodologies:</strong> Agile, Scrum, Kanban, hybrid approaches</li>
                  <li><strong>Tools:</strong> Jira, Asana, Monday.com, custom dashboards</li>
                  <li><strong>Geographic Coverage:</strong> 28 countries across Europe, Caucasus, Central Asia</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Project Management Capabilities</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Agile & Scrum Implementation</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Implement agile frameworks that accelerate delivery and improve team collaboration across distributed teams.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Sprint planning and backlog management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Daily standups and retrospectives</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Velocity tracking and continuous improvement</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Resource Planning</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Optimize team composition and allocation to maximize productivity and minimize bottlenecks.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Capacity planning and workload balancing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Skill gap analysis and team augmentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Cross-timezone coordination</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Risk Management</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Proactive risk identification and mitigation to keep projects on track and within budget.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Risk register maintenance and updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Contingency planning and escalation paths</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Budget tracking and variance analysis</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Stakeholder Communication</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Keep all stakeholders informed and aligned with transparent reporting and regular updates.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Executive dashboards and status reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Stakeholder mapping and engagement plans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Multilingual communication support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Delivery & Quality Assurance</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">Ensure deliverables meet quality standards and project milestones are achieved on schedule.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Quality gates and acceptance criteria</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Release management and deployment planning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Post-launch support and handover</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-6">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Need Expert Project Management?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's discuss your project requirements and find the right management approach to ensure successful delivery.
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link to="/#contact">Discuss Your Project</Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProjectManagement;
