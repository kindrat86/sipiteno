import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, Globe, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import ContactForm from "@/components/Contact";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { organizationSchema } from "@/lib/seo/schemas";

const CONTACT_EMAIL = "sales@sipiteno.com";

const Contact = () => {
  const { t } = useTranslation();
  const canonicalUrl = "https://sipiteno.com/contact";

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Sipiteno",
    "url": canonicalUrl,
    "description": "Get in touch with Sipiteno for market expansion, business development, and AI consulting across 28 emerging markets.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Sipiteno",
      "url": "https://sipiteno.com/",
      "email": CONTACT_EMAIL,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "email": CONTACT_EMAIL,
        "url": canonicalUrl,
      },
    },
  };

  const channels = [
    { icon: Mail, title: "Email", body: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { icon: MessageSquare, title: "Book a call", body: "Free 30-minute strategy session", href: "#contact" },
    { icon: Globe, title: "Coverage", body: "28 countries across Europe, Caucasus & Central Asia", href: null },
    { icon: Clock, title: "Response time", body: "Within 1 business day", href: null },
  ];

  return (
    <>
      <SEOHead
        title="Contact Sipiteno — Free 30-Minute Expansion Strategy Call"
        description={`Talk to Sipiteno about expanding into 28 emerging markets. Email ${CONTACT_EMAIL} or send the form — we reply within one business day.`}
        url={canonicalUrl}
        breadcrumbs={[{ name: "Home", url: "https://sipiteno.com/" }, { name: "Contact", url: canonicalUrl }]}
        schemas={[organizationSchema, contactPageSchema]}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 md:pt-24 pb-16">
          <section className="container mx-auto px-4 sm:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 py-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t("common.backToHome")}
            </Link>
            <div className="max-w-4xl mx-auto text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">Get in touch</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
                Let's map your route into <span className="text-primary">the next market</span>
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Tell us where you want to expand and what's blocking you. We'll reply within one
                business day with concrete next steps — no generic sales pitch.
              </p>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              {channels.map((c, i) => {
                const Icon = c.icon;
                const inner = (
                  <div className="bg-card/50 border border-border rounded-xl p-5 md:p-6 flex items-start gap-4 h-full hover:border-primary/40 transition-colors">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground">{c.title}</div>
                      <div className="text-sm text-muted-foreground mt-1 break-words">{c.body}</div>
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
          </section>
          {/* Full contact form — same one that powers the homepage section */}
          <ContactForm />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
