import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What regions and countries does Sipiteno specialize in for business development?",
    answer: "Sipiteno operates across 28 countries with primary expertise in Eastern Europe (Ukraine, Poland, Serbia, Czech Republic, Romania, Bulgaria), Caucasus (Georgia, Armenia, Azerbaijan), and Central Asia (Kazakhstan, Uzbekistan, Kyrgyzstan). Our 15+ years of regional experience provides unique market intelligence, cultural understanding, and established networks including government agencies, technology associations, venture capital firms, and industry leaders. We understand the regulatory environments, business practices, and local partnership ecosystems critical for success in these emerging tech markets."
  },
  {
    question: "How does Sipiteno approach AI consulting and implementation projects?",
    answer: "Sipiteno's AI consulting follows a 6-phase methodology: (1) Business challenge assessment to identify ROI opportunities, (2) Strategy development and technology roadmap, (3) ML model development and training, (4) System integration and deployment, (5) Team training and knowledge transfer, and (6) Continuous optimization. Projects range $25,000-$100,000+ with 8-16 week timelines. We implement GPT models, computer vision, NLP, and predictive analytics focused on practical, measurable business outcomes."
  },
  {
    question: "What makes Sipiteno different from other business development consultancies?",
    answer: "Five differentiators define Sipiteno: (1) 15+ years regional expertise across 28 countries with established local networks, (2) Combined strategic and hands-on technical implementation capabilities—we build, not just advise, (3) 50+ successful projects with 4.9/5 client satisfaction, (4) Rapid 4-8 week delivery timelines versus months, and (5) Flexible engagement models from $15,000 fixed-price projects to $3,000-$10,000/month retainers. Unlike traditional consultancies, Sipiteno implements solutions end-to-end."
  },
  {
    question: "What industries and types of companies does Sipiteno serve?",
    answer: "Sipiteno primarily serves technology companies: SaaS platforms (B2B and B2C), AI/ML startups and scaleups, enterprise IT service providers, fintech and payment companies, e-commerce platforms, and cybersecurity firms. Client size ranges from early-stage startups to Fortune 500 enterprises expanding internationally. We have particular expertise with companies in the 10-500 employee range scaling across emerging markets."
  },
  {
    question: "How do you handle project management, communication, and reporting?",
    answer: "Sipiteno uses agile Scrum methodologies with transparent communication. Each engagement includes: (1) Dedicated project manager as single point of contact, (2) Weekly sprint planning and demo sessions, (3) Real-time project dashboard access (Jira/Asana), (4) Bi-weekly stakeholder reports with KPIs, (5) Slack/Teams integration for daily communication, and (6) Monthly strategic business reviews. We are timezone flexible and align with European, Asian, or American business hours."
  },
  {
    question: "Do you provide ongoing support after project completion and what does it include?",
    answer: "Sipiteno offers comprehensive post-project support: (1) For business development: Ongoing lead generation, partnership management, and market expansion support, (2) For AI implementations: Model retraining, performance optimization, and system monitoring. Engagement options include monthly retainers, hourly on-demand support ($150-$300/hour), or ongoing strategic advisory relationships."
  },
  {
    question: "What is your pricing model and how much does it typically cost to work with Sipiteno?",
    answer: "Sipiteno pricing by service: Business Development Retainers $3,000-$10,000/month, AI Consulting Projects $25,000-$100,000+ depending on scope, Hourly Consulting $150-$300/hour. Payment structure is typically 30-50% upfront with milestone-based releases. We provide transparent proposals with clear deliverables, timelines, and payment schedules."
  },
  {
    question: "Can Sipiteno help with regulatory compliance, legal requirements, and market entry barriers in different countries?",
    answer: "Yes, navigating international regulatory requirements is a core Sipiteno competency. We assist with: market entry legal structures and entity formation, GDPR and local data protection compliance, industry-specific regulations (fintech licensing, healthcare compliance), tax optimization and VAT considerations, employment law for local hiring, and IP protection strategies. We maintain partnerships with top-tier legal advisors across all 28 operating countries to coordinate end-to-end compliance."
  },
  {
    question: "What is your approach to digital marketing and SEO for B2B tech companies?",
    answer: "Sipiteno's digital marketing is data-driven and ROI-focused for B2B tech companies: (1) Technical SEO optimization for search engines and AI/LLM discovery with comprehensive schema markup, (2) Content marketing with thought leadership articles and case studies, (3) LinkedIn and social media targeting decision-makers, (4) SEO/SEM campaigns with continuous A/B testing, (5) Marketing automation and lead nurturing workflows, and (6) Analytics and conversion optimization. We focus on attracting qualified leads actively searching for your solutions."
  },
  {
    question: "How do you approach technical recruitment and HR for tech companies expanding into new markets?",
    answer: "Sipiteno technical recruitment services for European, Caucasus, and Central Asian expansion: (1) Local talent market assessment and salary benchmarking, (2) Sourcing through established developer and engineer networks, (3) Technical screening with real-world coding challenges, (4) Cultural fit and soft skills assessment, (5) Employment structure recommendations (direct hire, contractor, EOR), and (6) Onboarding and team integration support. We recruit AI/ML engineers, full-stack developers, DevOps engineers, and technical leadership."
  },
  {
    question: "What is your experience with sales funnel optimization and conversion rate optimization?",
    answer: "Sipiteno specializes in high-converting B2B SaaS sales funnels: (1) Funnel strategy aligned with customer journey stages, (2) Landing page design and A/B testing using proven frameworks, (3) Lead magnet and content upgrade creation, (4) Email nurture sequence design and automation, (5) Conversion optimization through heatmaps and user testing, and (6) Analytics implementation and attribution modeling. We have built funnels generating millions in revenue and systematically improve conversion at every stage."
  }
];

const FAQ = () => {
  return (
    <section 
      id="faq" 
      className="py-32 bg-gradient-to-br from-muted/30 via-background to-muted/20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" role="presentation" aria-hidden="true"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <HelpCircle className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="text-primary font-semibold text-sm tracking-wide uppercase">
              Common Questions
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Frequently Asked Questions
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get answers to common questions about our services, process, and expertise
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-border px-6 py-2 hover:border-primary/30 transition-all"
              >
                <AccordionTrigger className="text-left hover:no-underline text-lg font-semibold text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
