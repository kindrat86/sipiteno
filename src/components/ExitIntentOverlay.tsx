import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { Download, X, CheckCircle2, Loader2, Lock } from "lucide-react";

const STORAGE_KEY = "sipiteno_exit_intent_dismissed";

const ExitIntentOverlay = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === "true") return;

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0) return;
      setVisible(true);
      trackEvent("exit_intent_triggered", {});
    };

    const timer = setTimeout(() => {
      setReady(true);
      document.addEventListener("mouseleave", onMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim() !== "") return;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: t("leadMagnet.errorValidEmail"), description: t("leadMagnet.errorValidEmailDesc"), variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setError(false);
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name || "Exit Intent Subscriber",
          companyName: "(exit intent)",
          email,
          phone: "",
          country: "",
          service: "Free Expansion Playbook (Exit Intent)",
          message: "EXIT INTENT: User was leaving the site and requested the playbook.",
          honeypot,
        }),
      });
      if (!resp.ok) throw new Error(`contact api ${resp.status}`);
      trackEvent("exit_intent_conversion", {});
      setSubmitted(true);
      localStorage.setItem(STORAGE_KEY, "true");
      toast({ title: t("leadMagnet.successTitle"), description: t("leadMagnet.successDesc") });
    } catch {
      trackEvent("exit_intent_failed", {});
      setError(true);
      toast({ title: t("leadMagnet.errorTitle"), description: t("leadMagnet.errorDesc"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("exitIntent.title")}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-gradient-to-br from-card to-card/95 border-2 border-primary/30 rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          aria-label={t("exitIntent.close")}
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t("exitIntent.successTitle")}</h3>
            <p className="text-muted-foreground">{t("exitIntent.successDesc")}</p>
          </div>
        ) : (
          <>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Download className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary font-semibold text-xs tracking-wide uppercase">
                {t("exitIntent.badge")}
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2 leading-tight">{t("exitIntent.title")}</h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{t("exitIntent.body")}</p>

            <form method="post" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="ei-name" className="text-sm">{t("exitIntent.nameLabel")}</Label>
                <Input
                  id="ei-name"
                name="ei-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("exitIntent.namePlaceholder")}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ei-email" className="text-sm">{t("exitIntent.emailLabel")} <span className="text-destructive">*</span></Label>
                <Input
                  id="ei-email"
                name="ei-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("exitIntent.emailPlaceholder")}
                  className="mt-1"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Honeypot */}
              <input
                type="text"
                name="honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {error && (
                <p role="alert" className="text-destructive text-sm text-center bg-destructive/10 border border-destructive/30 rounded-lg py-2 px-3">
                  {t("exitIntent.error")}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full font-bold text-base h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{t("exitIntent.sending")}</>
                ) : (
                  t("exitIntent.submit")
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>{t("exitIntent.privacy")}</span>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={dismiss}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  {t("exitIntent.noThanks")}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ExitIntentOverlay;
