import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { BookOpen, CheckCircle2, Download, Lock, Clock, Globe2, AlertCircle, TrendingUp, Loader2 } from "lucide-react";

const LeadMagnet = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bullets = [
    { icon: Globe2, key: "leadMagnet.bullet1" },
    { icon: Clock, key: "leadMagnet.bullet2" },
    { icon: BookOpen, key: "leadMagnet.bullet3" },
    { icon: CheckCircle2, key: "leadMagnet.bullet4" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim() !== "") return;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: t("leadMagnet.errorValidEmail"), description: t("leadMagnet.errorValidEmailDesc"), variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: { fullName: name || "Playbook Subscriber", companyName: "(lead magnet)", email, phone: "", country: "", service: "Free Expansion Playbook (Lead Magnet)", message: "LEAD MAGNET REQUEST: User requested 'The Emerging Markets Expansion Playbook (28 Countries, 2026)'. Please add to autoresponder / send download link.", leadType: "playbook" },
      });
      if (error) throw error;
      await supabase.from("soap_opera_subscribers").upsert({ email, name: name || null, source: "playbook", current_step: 0, next_email_due_at: new Date().toISOString(), completed: false }, { onConflict: "email" });
      trackEvent("lead_magnet_requested", { lead_magnet: "emerging_markets_playbook" });
      toast({ title: t("leadMagnet.successTitle"), description: t("leadMagnet.successDesc") });
      setEmail(""); setName("");
    } catch {
      toast({ title: t("leadMagnet.errorTitle"), description: t("leadMagnet.errorDesc"), variant: "destructive" });
    } finally { setIsSubmitting(false); }
  };

  return (
    <section id="free-playbook" className="py-section-lg bg-gradient-to-br from-primary via-primary to-[hsl(var(--hero-gradient-to))] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-3 md:px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <Download className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary" />
              <span className="text-secondary font-semibold text-[10px] md:text-xs tracking-wide uppercase">{t("leadMagnet.badge")}</span>
            </div>
            <h2 className="text-[clamp(1.75rem,4vw+0.5rem,3rem)] md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              {t("leadMagnet.title1")} <span className="text-secondary">{t("leadMagnet.title2")}</span> {t("leadMagnet.title3")}
            </h2>
            <p className="text-base md:text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed">{t("leadMagnet.body")}</p>
            <ul className="space-y-3 mb-6 md:mb-8">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 md:gap-3 text-sm md:text-base text-white/90">
                  <b.icon className="w-4 h-4 md:w-5 md:h-5 text-secondary mt-0.5 flex-shrink-0" /><span>{t(b.key)}</span>
                </li>
              ))}
            </ul>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
                <h3 className="text-amber-400 font-bold text-[10px] md:text-xs uppercase tracking-wider">{t("leadMagnet.inactionTitle")}</h3>
              </div>
              <div className="space-y-1.5 md:space-y-2 text-white/80 text-xs md:text-sm leading-relaxed">
                <p>{t("leadMagnet.inaction1")}</p>
                <p>{t("leadMagnet.inaction2")}</p>
                <p className="text-white font-medium">{t("leadMagnet.inaction3")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-white/60">
              <Lock className="w-3.5 h-3.5 md:w-4 md:h-4" /><span>{t("leadMagnet.noSpam")}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl">
            <div className="text-center mb-5 md:mb-6">
              <div className="inline-block px-3 md:px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3 md:mb-4">
                <span className="text-primary font-bold text-xs md:text-sm">{t("leadMagnet.formBadge")}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{t("leadMagnet.formTitle")}</h3>
              <p className="text-muted-foreground text-xs md:text-sm">{t("leadMagnet.formBody")}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <Label htmlFor="lm-name" className="text-foreground text-sm">{t("leadMagnet.firstName")} <span className="text-muted-foreground font-normal">{t("leadMagnet.optional")}</span></Label>
                <Input id="lm-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("leadMagnet.firstNamePlaceholder")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lm-email" className="text-foreground text-sm">{t("leadMagnet.emailAddress")} <span className="text-destructive">*</span></Label>
                <Input id="lm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("leadMagnet.emailPlaceholder")} className="mt-1" required autoComplete="email" />
              </div>
              <input type="text" name="honeypot" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
              <Button type="submit" size="lg" className="w-full font-bold text-base md:text-lg h-12 md:h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:hover:translate-y-0" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t("leadMagnet.sending")}</> : t("leadMagnet.submitButton")}
              </Button>
              <p className="text-center text-xs text-muted-foreground">{t("leadMagnet.joinLine")}</p>
              <div className="pt-3 md:pt-4 border-t border-muted/30">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-primary" />
                  <span>{t("leadMagnet.slotsLine")} <strong className="text-primary">{t("leadMagnet.slotsValue")}</strong></span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
