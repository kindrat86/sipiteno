import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What regions does Sipiteno specialize in?",
    answer: "We specialize in business development across 28 countries, with deep expertise in Eastern Europe (Ukraine, Poland, Serbia), Caucasus (Georgia, Armenia, Azerbaijan), Central Asia (Kazakhstan, Uzbekistan, Kyrgyzstan), and emerging tech markets across the broader European region. Our 15+ years of experience gives us unique market intelligence and established networks in these regions."
  },
  {
    question: "What is the typical timeline for MicroSaaS MVP development?",
    answer: "Our MicroSaaS MVP development process is designed for speed and efficiency. We typically deliver a market-ready MVP in 4-8 weeks, depending on complexity. This includes rapid prototyping, market validation, technical architecture, and deployment. We use agile methodologies to ensure quick iterations and continuous stakeholder feedback."
  },
  {
    question: "How does Sipiteno approach AI consulting projects?",
    answer: "Our AI consulting approach begins with understanding your business challenges and identifying opportunities where AI can drive real value. We provide AI strategy development, implementation planning, machine learning solutions, and intelligent automation. We work with cutting-edge AI technologies and focus on practical, ROI-driven implementations rather than technology for technology's sake."
  },
  {
    question: "What makes Sipiteno different from other business development consultancies?",
    answer: "Three key differentiators: (1) Deep regional expertise across 28 countries in Europe, Caucasus, and Central Asia with established local networks, (2) Technical depth combining business development with AI/IT implementation capabilities, and (3) Proven track record with 50+ successful projects spanning from Fortune 500 companies to innovative startups. We don't just advise—we implement and deliver results."
  },
  {
    question: "What industries do you serve?",
    answer: "We primarily serve technology companies, SaaS businesses, AI/ML startups, IT service providers, and enterprises undergoing digital transformation. Our expertise spans B2B tech, fintech, e-commerce platforms, and companies looking to expand into emerging European and Central Asian markets. We work with both established enterprises and high-growth startups."
  },
  {
    question: "How do you handle project management and communication?",
    answer: "We use agile and Scrum methodologies with transparent communication throughout the project lifecycle. You'll have a dedicated project manager, regular sprint reviews, and real-time access to project dashboards. We believe in stakeholder alignment and ensure you're involved in key decisions while we handle the execution details."
  },
  {
    question: "Do you provide ongoing support after project completion?",
    answer: "Yes, we offer flexible engagement models including project-based work, ongoing retainers, and advisory services. For MVP development, we provide technical support and can scale the team as your product grows. For business development initiatives, we can continue as strategic partners helping you expand and optimize your market presence."
  },
  {
    question: "What is your pricing model?",
    answer: "Our pricing depends on the scope, complexity, and duration of the engagement. We offer project-based fixed pricing for defined deliverables like MVPs, monthly retainers for ongoing services like business development or digital marketing, and hourly consulting for advisory services. Contact us for a customized proposal based on your specific needs."
  }
];

const FAQ = () => {
  return (
    <section 
      id="faq" 
      className="py-32 bg-gradient-to-br from-muted/30 via-background to-muted/20 relative overflow-hidden"
      itemScope 
      itemType="https://schema.org/FAQPage"
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
                itemScope 
                itemProp="mainEntity" 
                itemType="https://schema.org/Question"
              >
                <AccordionTrigger className="text-left hover:no-underline text-lg font-semibold text-foreground">
                  <span itemProp="name">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent 
                  className="text-muted-foreground leading-relaxed text-base"
                  itemScope 
                  itemProp="acceptedAnswer" 
                  itemType="https://schema.org/Answer"
                >
                  <div itemProp="text">{faq.answer}</div>
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
