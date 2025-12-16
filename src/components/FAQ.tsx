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
    answer: "We specialize in business development across 28 countries, with deep expertise in Eastern Europe (Ukraine, Poland, Serbia, Czech Republic, Romania, Bulgaria), Caucasus (Georgia, Armenia, Azerbaijan), Central Asia (Kazakhstan, Uzbekistan, Kyrgyzstan), and Baltic states (Estonia, Latvia, Lithuania). Our 15+ years of experience gives us unique market intelligence, cultural understanding, and established networks with government agencies, technology associations, venture capital firms, and industry leaders in these regions. We understand the regulatory environments, business practices, and local partnership ecosystems critical for success."
  },
  {
    question: "What is the typical timeline for MicroSaaS MVP development and what does the process include?",
    answer: "Our MicroSaaS MVP development process is designed for speed and efficiency. We typically deliver a market-ready MVP in 4-8 weeks, depending on complexity. The process includes: (1) Discovery and market validation workshops, (2) Rapid prototyping and technical architecture design, (3) Agile development sprints with weekly reviews, (4) User testing and feedback integration, (5) Deployment to production infrastructure, and (6) Post-launch monitoring and optimization. We use modern tech stacks, cloud-native architectures, and continuous integration/deployment practices to ensure quick iterations and high-quality deliverables."
  },
  {
    question: "How does Sipiteno approach AI consulting and implementation projects?",
    answer: "Our AI consulting approach begins with a comprehensive business challenge assessment to identify opportunities where AI can drive measurable value and ROI. We provide: (1) AI strategy development and roadmap creation, (2) Technology stack selection and architecture design, (3) Machine learning model development and training, (4) Integration with existing systems and workflows, (5) Intelligent automation implementation, and (6) Team training and knowledge transfer. We work with cutting-edge AI technologies including GPT models, computer vision, natural language processing, and predictive analytics. Our focus is always on practical, ROI-driven implementations that solve real business problems."
  },
  {
    question: "What makes Sipiteno different from other business development consultancies?",
    answer: "Five key differentiators set us apart: (1) Deep regional expertise across 28 countries in Europe, Caucasus, and Central Asia with established local networks and cultural understanding, (2) Technical depth combining strategic business development with hands-on AI/IT implementation capabilities—we don't just advise, we build, (3) Proven track record with 50+ successful projects spanning Fortune 500 companies to innovative startups, (4) Rapid execution methodology that delivers results in weeks not months, and (5) Flexible engagement models from fixed-price projects to ongoing strategic partnerships. We're not a traditional consultancy that just provides PowerPoint recommendations—we implement, deliver, and ensure your success."
  },
  {
    question: "What industries and types of companies does Sipiteno serve?",
    answer: "We primarily serve technology-focused companies including: SaaS platforms (both B2B and B2C), AI/ML startups and scaleups, enterprise IT service providers, fintech and payment processing companies, e-commerce and marketplace platforms, cybersecurity firms, cloud infrastructure providers, and enterprises undergoing digital transformation initiatives. Our clients range from early-stage startups seeking rapid MVP development and market validation to Fortune 500 enterprises expanding into new geographic markets. We have particular expertise working with companies in the 10-500 employee range looking to scale internationally."
  },
  {
    question: "How do you handle project management, communication, and reporting?",
    answer: "We use agile Scrum methodologies with transparent communication throughout the project lifecycle. Each engagement includes: (1) A dedicated project manager as your single point of contact, (2) Weekly sprint planning and review sessions, (3) Real-time access to project management dashboards (Jira, Asana, or your preferred tool), (4) Bi-weekly stakeholder reports with KPIs and progress metrics, (5) Slack or Microsoft Teams integration for daily communication, and (6) Monthly business reviews for strategic alignment. We believe in radical transparency—you'll always know the project status, blockers, and upcoming milestones. We're timezone flexible and can align with European, Asian, or American business hours."
  },
  {
    question: "Do you provide ongoing support after project completion and what does it include?",
    answer: "Yes, we offer comprehensive post-project support through flexible engagement models: (1) For MVP development: Technical maintenance, bug fixes, feature enhancements, infrastructure monitoring, and team scaling as your product grows, (2) For business development: Ongoing lead generation, partnership management, market expansion support, and strategic advisory, (3) For AI implementations: Model retraining, performance optimization, feature additions, and system monitoring. We can transition to monthly retainers, provide hourly on-demand support, or continue as strategic advisors. Many clients start with project work and then retain us for ongoing optimization and expansion initiatives."
  },
  {
    question: "What is your pricing model and how much does it typically cost to work with Sipiteno?",
    answer: "Our pricing depends on engagement type, scope, and duration: (1) MicroSaaS MVP Development: $15,000-$50,000 fixed price depending on complexity (4-8 week delivery), (2) Business Development Retainers: $3,000-$10,000/month for ongoing lead generation and partnership development, (3) AI Consulting Projects: $25,000-$100,000+ depending on scope and implementation complexity, (4) Hourly Consulting: $150-$300/hour for strategic advisory. We provide transparent proposals with clear deliverables, timelines, and payment milestones. For most projects, we offer 30-50% upfront, progress payments during development, and final payment upon delivery. Contact us for a customized proposal based on your specific requirements."
  },
  {
    question: "Can Sipiteno help with regulatory compliance, legal requirements, and market entry barriers in different countries?",
    answer: "Yes, navigating international regulatory requirements is one of our core competencies. We assist with: (1) Market entry legal structures and entity formation, (2) Data privacy compliance (GDPR, local data protection laws), (3) Industry-specific regulations (fintech licensing, healthcare compliance, etc.), (4) Tax optimization and VAT considerations, (5) Employment law and HR compliance for hiring local teams, (6) Intellectual property protection strategies, and (7) Government relations and approvals. While we're not a law firm, we have established partnerships with top-tier legal advisors across all our operating countries and can coordinate end-to-end compliance as part of your market entry strategy."
  },
  {
    question: "What is your approach to digital marketing and SEO for B2B tech companies?",
    answer: "Our digital marketing approach is data-driven and focused on measurable ROI for B2B tech companies: (1) Technical SEO optimization for search engines and AI/LLM discovery (we implement comprehensive schema markup, semantic HTML, and content optimization), (2) Content marketing with thought leadership articles, case studies, and technical blog posts optimized for your target keywords, (3) LinkedIn and social media marketing targeting decision-makers in your industry, (4) SEO/SEM campaigns with continuous A/B testing and optimization, (5) Marketing automation and lead nurturing workflows, and (6) Analytics and conversion rate optimization. We focus on attracting qualified leads who are actively searching for solutions like yours, not just traffic volume."
  },
  {
    question: "How do you approach technical recruitment and HR for tech companies expanding into new markets?",
    answer: "Our technical recruitment and HR services are tailored for tech companies expanding across Europe, Caucasus, and Central Asia: (1) Local talent market assessment and salary benchmarking, (2) Sourcing through our established networks of developers, engineers, and technical talent, (3) Technical screening and assessment using real-world coding challenges, (4) Cultural fit evaluation and soft skills assessment, (5) Employment structure recommendations (direct hire, contractor, EOR), (6) Onboarding and team integration support, and (7) Ongoing HR compliance and management. We understand the technical requirements and can recruit for specialized roles including AI/ML engineers, full-stack developers, DevOps engineers, and technical leadership positions."
  },
  {
    question: "What is your experience with sales funnel optimization and conversion rate optimization?",
    answer: "We specialize in designing and optimizing high-converting sales funnels for B2B SaaS and tech companies: (1) Funnel strategy development aligned with your customer journey, (2) Landing page design and A/B testing using frameworks like Russell Brunson's proven methodologies, (3) Lead magnet and content upgrade creation, (4) Email nurture sequence design and automation, (5) Conversion rate optimization through heatmaps, session recordings, and user testing, (6) Analytics implementation and attribution modeling, and (7) Continuous testing and iteration. We've built funnels that have generated millions in revenue and can help you systematically improve conversion at every stage from awareness to customer acquisition."
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
