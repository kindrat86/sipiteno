import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const FAQ = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [1,2,3,4,5,6,7,8,9,10].map((i) => ({
    question: t(`faq.q${i}`),
    answer: t(`faq.a${i}`),
  }));

  const filteredFaqs = faqs.filter(
    (faq) => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
             faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-section-lg bg-gradient-to-br from-muted/30 via-background to-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20">
            <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">{t("faq.eyebrow")}</span>
          </div>
          <h2 className="text-[clamp(2rem,4vw+0.5rem,3.75rem)] md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">{t("faq.title")}</h2>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed">{t("faq.subtitle")}</p>
        </div>
        <div className="max-w-md mx-auto mb-8 md:mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="search" placeholder={t("faq.searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" aria-label={t("faq.searchLabel")} />
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t("faq.noResults")}</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card/50 backdrop-blur-sm rounded-xl md:rounded-2xl border-2 border-border px-4 md:px-6 hover:border-primary/30 transition-all">
                  <AccordionTrigger className="text-left hover:no-underline text-sm md:text-lg font-semibold py-4 md:py-5">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pb-4 md:pb-6">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
