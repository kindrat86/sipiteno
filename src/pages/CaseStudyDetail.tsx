import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { projects } from "@/data/projects";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { caseStudySchema } from "@/lib/seo/schemas";
import { trackEvent } from "@/lib/analytics";
import { ArrowLeft, CheckCircle, AlertTriangle, Lightbulb, BarChart3 } from "lucide-react";

const CaseStudyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === Number(id));

  useEffect(() => {
    if (project) {
      trackEvent("case_study_viewed", {
        project_name: project.name,
        industry: project.industry,
      });
    }
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 text-center py-20">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowLeft className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Case Study Not Found</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The case study you're looking for doesn't exist.
            </p>
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Case Studies
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const schema = caseStudySchema({
    name: project.name,
    description: project.description,
    industry: project.industry,
    result: project.results,
    url: `https://sipiteno.com/case-studies/${project.id}`,
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${project.name} - Case Study | Sipiteno`}
        description={project.description}
        canonicalUrl={`https://sipiteno.com/case-studies/${project.id}`}
        schemas={[schema]}
        breadcrumbs={[
          { name: "Home", url: "https://sipiteno.com/" },
          { name: "Case Studies", url: "https://sipiteno.com/case-studies" },
          { name: project.name, url: `https://sipiteno.com/case-studies/${project.id}` },
        ]}
      />
      <Navigation />

      <main className="pt-24 pb-16">
        <article className="container mx-auto px-6 max-w-4xl">
          {/* Back link */}
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all case studies
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                {project.industry}
              </span>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  project.status === "Completed"
                    ? "bg-green-500/10 text-green-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}
              >
                {project.status}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {project.name}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {project.description}
            </p>
            <div className="mt-4 text-sm text-muted-foreground/70">
              <strong>Technology:</strong> {project.technology}
            </div>
          </header>

          {/* Content sections */}
          <div className="space-y-10">
            {/* Challenge */}
            <section className="bg-card/50 border-2 border-border rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">The Challenge</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{project.challenges}</p>
            </section>

            {/* Solution */}
            <section className="bg-card/50 border-2 border-border rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Our Solution</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
            </section>

            {/* Results */}
            <section className="bg-card/50 border-2 border-border rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Results</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{project.results}</p>
            </section>
          </div>

          {/* CTA */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-10 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Want similar results for your business?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Let's build your product in 4-8 weeks. We turn ideas into shipped products with proven speed.
              </p>
              <Link
                to="/#contact"
                className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Start Your Project
              </Link>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default CaseStudyDetail;
