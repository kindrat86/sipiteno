import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

const countries = [
  "Albania","Armenia","Azerbaijan","Bosnia","Bulgaria","Croatia","Cyprus","Czech Republic","Estonia","Ethiopia",
  "Georgia","Greece","Hungary","India","Kazakhstan","Kyrgyzstan","Latvia","Lithuania","Moldova","Montenegro",
  "North Macedonia","Poland","Romania","Serbia","Slovakia","Slovenia","Ukraine","Uzbekistan","Other",
];

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ fullName: "", companyName: "", email: "", phone: "", country: "", service: "", message: "", honeypot: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = () => {
    if (formData.honeypot.trim() !== "") return false;
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = t("contact.errorFullName");
    if (!formData.email.trim()) newErrors.email = t("contact.errorEmail");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t("contact.errorEmailFormat");
    if (!formData.message.trim()) newErrors.message = t("contact.errorMessage");
    else if (formData.message.trim().length < 10) newErrors.message = t("contact.errorMessageShort");
    else if (formData.message.trim().length > 2000) newErrors.message = t("contact.errorMessageLong");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: t("contact.errorValidation"), description: t("contact.errorValidationDesc"), variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", { body: formData });
      if (error) throw error;
      trackEvent("contact_form_submitted", { service: formData.service || "not_specified", country: formData.country || "not_specified" });
      setSubmitted(true);
      toast({ title: t("contact.successToast"), description: t("contact.successToastDesc") });
    } catch {
      toast({ title: t("contact.errorTitle"), description: t("contact.errorDesc"), variant: "destructive" });
    } finally { setIsSubmitting(false); }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const charCount = formData.message.length;
  const isCharWarning = charCount > 1900;
  const isCharError = charCount > 2000;

  if (submitted) {
    return (
      <section id="contact" className="py-section-lg bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-xl mx-auto text-center animate-scale-in">
            <div className="bg-card rounded-3xl border-2 border-primary/20 shadow-2xl p-10 md:p-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("contact.successTitle")}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">{t("contact.successBody")}</p>
              <Button variant="outline" size="lg" onClick={() => { setSubmitted(false); setFormData({ fullName: "", companyName: "", email: "", phone: "", country: "", service: "", message: "", honeypot: "" }); setErrors({}); }}>{t("contact.successButton")}</Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-section-lg bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
          <div className="inline-block mb-4 md:mb-6 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary font-semibold text-xs md:text-sm tracking-wide uppercase">{t("contact.eyebrow")}</span>
          </div>
          <h2 className="text-[clamp(2rem,4vw+0.5rem,3.75rem)] md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">{t("contact.title")}</h2>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed">{t("contact.subtitle")}</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm p-6 md:p-10 rounded-2xl md:rounded-3xl border-2 border-border shadow-xl md:shadow-2xl">
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5 md:space-y-6">
              <div>
                <Label htmlFor="fullName">{t("contact.fullName")} <span className="text-destructive">*</span></Label>
                <Input id="fullName" value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} className={errors.fullName ? "border-destructive" : ""} placeholder={t("contact.fullNamePlaceholder")} />
                {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <Label htmlFor="companyName">{t("contact.companyName")}</Label>
                <Input id="companyName" value={formData.companyName} onChange={(e) => handleChange("companyName", e.target.value)} placeholder={t("contact.companyNamePlaceholder")} />
              </div>
              <div>
                <Label htmlFor="email">{t("contact.email")} <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className={errors.email ? "border-destructive" : ""} placeholder={t("contact.emailPlaceholder")} autoComplete="email" />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">{t("contact.phone")}</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder={t("contact.phonePlaceholder")} autoComplete="tel" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <Label htmlFor="country">{t("contact.country")}</Label>
                  <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                    <SelectTrigger id="country"><SelectValue placeholder={t("contact.countryPlaceholder")} /></SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="service">{t("contact.service")}</Label>
                  <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                    <SelectTrigger id="service"><SelectValue placeholder={t("contact.servicePlaceholder")} /></SelectTrigger>
                    <SelectContent>
                      {["AI Consulting","Business Development B2B","Digital Marketing","IT Consulting","Marketing Sales Funnel Setup","Project Management"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="message">{t("contact.message")} <span className="text-destructive">*</span></Label>
                <Textarea id="message" rows={5} value={formData.message} onChange={(e) => handleChange("message", e.target.value)}
                  className={errors.message ? "border-destructive" : isCharError ? "border-destructive" : isCharWarning ? "border-amber-400" : ""}
                  placeholder={t("contact.messagePlaceholder")} />
                <div className="flex items-center justify-between mt-1">
                  {errors.message ? <p className="text-destructive text-sm">{errors.message}</p> : <span />}
                  <p className={`text-sm ml-auto ${isCharError ? "text-destructive" : isCharWarning ? "text-amber-500" : "text-muted-foreground"}`}>
                    {charCount} {t("contact.charCount")}{charCount < 10 && ` ${t("contact.charMin")}`}{isCharError && t("contact.charTooLong")}
                  </p>
                </div>
              </div>
              <input type="text" name="honeypot" value={formData.honeypot} onChange={(e) => handleChange("honeypot", e.target.value)} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
              <Button type="submit" size="lg" variant="secondary" className="w-full font-semibold text-base md:text-lg h-12 md:h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:hover:translate-y-0" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t("contact.sending")}</> : <><Mail className="w-5 h-5 mr-2" />{t("contact.submit")}</>}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
