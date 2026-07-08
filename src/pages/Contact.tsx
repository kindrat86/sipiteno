import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, Globe, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { organizationSchema } from "@/lib/seo/schemas";

const Contact = () => {
  const { t } = useTranslation();
  const canonicalUrl = "https://sipiteno.com/contact";

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact SipiTeno",
    "url": canonicalUrl,
    "description": "Get in touch with SipiTeno — a digital product studio building SaaS tools, web apps, and AI-powered solutions.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Sipiteno",
      "url": "https://sipiteno.com/",
      "email": "hello@sipiteno.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "hello@sipiteno.com",
        "url": canonicalUrl,
      },
    },
  };

  const channels = [
    { icon: Mail, title: "Email", body: "hello@sipiteno.com", href: "mailto:hello@sipiteno.com" },
    { icon: MessageSquare, title: "Book a call", body: "Free 30-minute strategy session", href: "https://sipiteno.com/#contact" },
    { icon: Globe, title: "Website", body: "sipiteno.com", href: "https://sipiteno.com/" },
    { icon: Clock, title: "Response time", body: "Within 1 business day", href: null },
  ];

  return (
    <>
      <SEOHead
        title="Contact SipiTeno — Digital Product Studio"
        description="Get in touch with SipiTeno. Email hello@sipiteno.com or book a free 30-minute strategy call. We build SaaS tools, web apps, and AI-powered products."
        url={canonicalUrl}
        breadcrumbs={[{ name: "Home", url: "https://sipiteno.com/" }, { name: "Contact", url: canonicalUrl }]}
        schemas={[organizationSchema, contactPageSchema]}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <section className="container mx-auto px-6 mb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t("common.backToHome")}
            </Link>
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm">Get in touch</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Let's build something <span className="text-primary">worth shipping</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Whether you have a product idea, need a development partner, or want a second opinion on your roadmap — we're here. Reach out and we'll reply within one business day.
              </p>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {channels.map((c, i) => {
                const Icon = c.icon;
                const inner = (
                  <div className="bg-card/50 border border-border rounded-xl p-6 flex items-start gap-4 h-full hover:border-primary/40 transition-colors">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{c.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{c.body}</div>
                    </div>
                  </div>
                );
                return c.href ? (
                  <a key={i} href={c.href} className="block">{inner}</a>
                ) : (
                  <div key={i}>{inner}</div>
                );
              })}
            </div>
            <div className="max-w-2xl mx-auto text-center">
              <Button asChild size="lg">
                <a href="mailto:hello@sipiteno.com">Email us at hello@sipiteno.com</a>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
