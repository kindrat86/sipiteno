import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArrowRight, Briefcase } from "lucide-react";

const CaseStudies = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Case Studies | Sipiteno"
        description="Published client case studies from Sipiteno's market-entry and technical delivery work across Europe, the Caucasus, and Central Asia."
        url="https://sipiteno.com/case-studies"
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Case Studies", url: "https://sipiteno.com/case-studies" }
        ]}
      />
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Briefcase className="w-4 h-4" />
              Our Work
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5">
              Case Studies
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {projects.length > 0
                ? "Real projects, real results. See how we've helped technology companies scale across emerging markets."
                : "We publish a case study only once a client has agreed to have their engagement named. None are published yet — so rather than show illustrative examples, we show nothing."}
            </p>
          </header>

          {/* Projects Grid — renders nothing while `projects` is empty; the
              honest empty state below takes its place. See src/data/projects.ts. */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {projects.map((project) => (
              <Link key={project.id} to={`/case-studies/${project.id}`}>
                <Card className="group h-full border-2 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 bg-card/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                        {project.industry}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        project.status === "Completed"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mb-4">
                      {project.technology}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View case study
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="max-w-2xl mx-auto text-center border border-border rounded-2xl p-8 md:p-10 bg-card/40">
              <h2 className="text-xl font-semibold text-foreground mb-3">
                No published case studies yet
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Client work to date has been under terms that don't allow us to name it.
                When an engagement can be published with the client's consent, it will
                appear here — with the actual scope, timeline, and outcome.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-10 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Have a project in mind?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              We ship products in 4-8 weeks. Let's discuss how we can help your business grow.
            </p>
            <Link
              to="/#contact"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Start Your Project
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CaseStudies;
